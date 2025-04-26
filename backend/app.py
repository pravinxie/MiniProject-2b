from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import folium
import os
from textblob import TextBlob
import PyPDF2
import re
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# API Keys and LLM endpoint
GOMAPS_API_KEY = "AlzaSynxEpONL1eflXG5stb4aJ7emJtXktYwg4C"
OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL_NAME = "llama3.2:latest"

# Store last searched symptoms globally
last_searched_symptoms = []

# Initialize BioBERT NER pipeline for PDF processing
nlp = pipeline(
    "ner",
    model="Ishan0612/biobert_medical_ner",
    tokenizer="Ishan0612/biobert_medical_ner",
    aggregation_strategy="simple"
)

# Utility functions for PDF text extraction and highlighting

def extract_text_from_pdf(pdf_file):
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text() or ""
        text += page_text + "\n"
    return text


def merge_subwords(ner_results):
    merged = []
    i = 0
    while i < len(ner_results):
        ent = ner_results[i]
        if ent['entity_group'] == 'LABEL_1':
            disease = ent['word']
            i += 1
            # merge subsequent subwords
            while i < len(ner_results) and ner_results[i]['entity_group'] == 'LABEL_2':
                token = ner_results[i]['word']
                if token.startswith('##'):
                    disease += token[2:]
                else:
                    disease += ' ' + token
                i += 1
            merged.append(disease)
        else:
            i += 1
    return merged


def remove_duplicates_preserve_order(items):
    seen = set()
    unique = []
    for it in items:
        low = it.lower()
        if low not in seen:
            unique.append(it)
            seen.add(low)
    return unique


def highlight_diseases(raw_text, diseases):
    text = raw_text.replace('\n', ' ')
    text = re.sub(r'\s+', ' ', text).strip()
    diseases = remove_duplicates_preserve_order(diseases)
    # sort by length to replace longer first
    diseases.sort(key=len, reverse=True)
    for disease in diseases:
        esc = re.escape(disease)
        esc = re.sub(r'\\ ', r'\\s+', esc)
        pattern = re.compile(rf'(?<![A-Za-z0-9_]){esc}(?![A-Za-z0-9_])', re.IGNORECASE)
        text = pattern.sub(lambda m: f'<span class="highlight">{m.group(0)}</span>', text)
    return text

# TextBlob-based spelling correction

def correct_spelling(symptoms):
    return [str(TextBlob(s).correct()) for s in symptoms]

# Query Llama to classify symptoms to specialties

def get_specialist_from_llm(symptoms):
    prompt = f"""
You are a highly knowledgeable **medical AI assistant** specializing in **accurate symptom classification**. Your goal is to analyze given symptoms, **correct any spelling mistakes**, and classify them into the most **relevant medical specialties**.

### Instructions:
1. Correct spelling mistakes in the given symptoms before classification.
2. Identify the correct medical specialty based on the corrected symptoms.
3. If multiple symptoms suggest different specialties, list all relevant ones.
4. If symptoms indicate general conditions (e.g., fever, headache), return General Practice.
5. If symptoms indicate serious diseases (e.g., HIV/AIDS, cancer), return the appropriate specialist.
6. Return only the specialties in a comma-separated format.
7. Do not provide explanations, only the list of specialties.

Symptoms: {', '.join(symptoms)}
"""
    payload = {
        "model": OLLAMA_MODEL_NAME,
        "prompt": prompt,
        "stream": False
    }
    resp = requests.post(OLLAMA_API_URL, json=payload)
    if resp.status_code == 200:
        out = resp.json().get('response', '')
        return [s.strip() for s in out.split(',') if s.strip()]
    return []

# Fetch nearby hospitals using GoMaps API

def fetch_hospitals(latitude, longitude, specialties):
    results = []
    for spec in specialties:
        params = {
            'location': f"{latitude},{longitude}",
            'radius': 5000,
            'keyword': spec,
            'key': GOMAPS_API_KEY
        }
        data = requests.get(
            'https://maps.gomaps.pro/maps/api/place/nearbysearch/json',
            params=params
        ).json()
        for place in data.get('results', []):
            rating = place.get('rating', 0.0)
            try:
                rating = float(rating)
            except:
                rating = 0.0
            results.append({
                'name': place.get('name'),
                'lat': place['geometry']['location']['lat'],
                'lng': place['geometry']['location']['lng'],
                'rating': rating,
                'specialization': spec,
                'address': place.get('vicinity')
            })
    # top 10 by rating
    return sorted(results, key=lambda x: x['rating'], reverse=True)[:10]

# Fetch hospitals by city text search

def fetch_hospitals_by_city(city, specialties):
    results = []
    for spec in specialties:
        params = {
            'query': f"{spec} hospitals in {city}",
            'key': GOMAPS_API_KEY
        }
        data = requests.get(
            'https://maps.gomaps.pro/maps/api/place/textsearch/json',
            params=params
        ).json()
        for place in data.get('results', []):
            results.append({
                'name': place.get('name'),
                'rating': place.get('rating', 'N/A'),
                'specialization': spec,
                'address': place.get('formatted_address')
            })
    return sorted(results, key=lambda x: x.get('rating', 0), reverse=True)[:10]

# Save map to static folder

def save_map(latitude, longitude, hospital_data):
    if not os.path.exists('static'):
        os.makedirs('static')
    m = folium.Map(location=[latitude, longitude], zoom_start=14)
    folium.Marker([latitude, longitude], popup='YOU ARE HERE', icon=folium.Icon(color='red')).add_to(m)
    for h in hospital_data:
        folium.Marker(
            [h['lat'], h['lng']],
            popup=f"<b>{h['name']}</b><br>Specialty: {h['specialization']}<br>Rating: {h['rating']}",
            icon=folium.Icon(color='green')
        ).add_to(m)
    m.save('static/map.html')

# Routes

@app.route('/', methods=['GET', 'POST'])
def index():
    # PDF upload & NER
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        pdf = request.files['file']
        raw = extract_text_from_pdf(pdf)
        ner_res = nlp(raw)
        diseases = remove_duplicates_preserve_order(merge_subwords(ner_res))
        highlighted = highlight_diseases(raw, diseases)
        return jsonify({'diseases': diseases, 'highlighted_text': highlighted})
    return jsonify({'message': 'Please upload a PDF file via POST request'})

@app.route('/api/generate-summary', methods=['POST'])
def generate_summary():
    data = request.json
    # build patient form text
    form = f"""
Name: {data.get('name')}
DOB: {data.get('dob')}
Gender: {data.get('gender')}
Phone: {data.get('phone')}
Email: {data.get('email')}
Emergency Contact: {data.get('emergencyContactName')}, {data.get('emergencyContactPhone')}

Medical History:
Chronic Diseases: {'Yes - ' + data.get('chronicDiseasesDetails') if data.get('chronicDiseases') == 'Yes' else 'None'}
Surgeries: {'Yes - ' + data.get('surgeriesDetails') if data.get('surgeries') == 'Yes' else 'None'}
Allergies: {'Yes - ' + data.get('allergiesDetails') if data.get('allergies') == 'Yes' else 'None'}
Medications: {'Yes - ' + data.get('medicationsDetails') if data.get('medications') == 'Yes' else 'None'}
Skin Conditions: {'Yes - ' + data.get('skinConditionsDetails') if data.get('skinConditions') == 'Yes' else 'None'}

Current Routine:
Daily Skincare: {data.get('dailySkincareProducts')}
Exfoliation: {data.get('exfoliationFrequency')}
Prescription: {'Yes - ' + data.get('prescriptionTreatmentsDetails') if data.get('prescriptionTreatments') == 'Yes' else 'None'}
Sunscreen Use: {data.get('wearSunscreen')}

Family History:
Skin Conditions: {'Yes - ' + data.get('familySkinConditionsDetails') if data.get('familySkinConditions') == 'Yes' else 'None'}
Cancer History: {'Yes - ' + data.get('familyCancerHistoryDetails') if data.get('familyCancerHistory') == 'Yes' else 'None'}

Current Skin Issues:
Primary Issue: {data.get('primarySkinIssue')}
Duration: {data.get('issueDuration')}
Progress: {data.get('issueProgress')}
Treatment Tried: {'Yes - ' + data.get('treatedBeforeDetails') if data.get('treatedBefore') == 'Yes' else 'None'}
Pain/Irritation: {data.get('painIrritation')}

Additional Info:
Other Conditions: {data.get('otherConditions')}
Notes: {data.get('additionalNotes')}
"""
    prompt = f"""
You are a medical assistant. Generate only a concise patient summary and list key points to note. Do not give age.

{form}

Please output:
Patient Summary:
"<summary>"

Points to be Noted:
- <point 1>
- <point 2>
"""
    try:
        resp = requests.post(OLLAMA_API_URL, json={'model': OLLAMA_MODEL_NAME, 'prompt': prompt, 'stream': False})
        if resp.status_code == 200:
            text = resp.json().get('response', '')
            return jsonify({'text': text})
        return jsonify({'text': 'AI service error'}), 500
    except Exception as e:
        return jsonify({'text': 'Failed to generate summary.'}), 500

@app.route('/map', methods=['POST'])
def generate_map():
    global last_searched_symptoms
    data = request.json
    lat = data.get('latitude')
    lng = data.get('longitude')
    symptoms = data.get('symptoms', [])
    if not lat or not lng:
        return jsonify({'error': 'Invalid location data'}), 400
    if not symptoms:
        return jsonify({'error': 'Please enter symptoms'}), 400
    symptoms = correct_spelling(symptoms)
    last_searched_symptoms = symptoms
    specs = get_specialist_from_llm(symptoms)
    if not specs:
        return jsonify({'error': 'No matching specialists found'}), 400
    hospitals = fetch_hospitals(lat, lng, specs)
    save_map(lat, lng, hospitals)
    url = f"{request.host_url.rstrip('/')}/static/map.html"
    return jsonify({'message': 'Map generated', 'places': hospitals, 'map_url': url})

@app.route('/city_hospitals', methods=['POST'])
def city_hospitals():
    global last_searched_symptoms
    data = request.json
    city = data.get('city')
    if not city:
        return jsonify({'error': 'City name is required'}), 400
    if not last_searched_symptoms:
        return jsonify({'error': 'Search symptoms first'}), 400
    specs = get_specialist_from_llm(last_searched_symptoms)
    hospitals = fetch_hospitals_by_city(city, specs)
    return jsonify({'places': hospitals})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
