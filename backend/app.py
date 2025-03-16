from flask import Flask, render_template, request, jsonify
import requests
import folium
import os
from flask_cors import CORS  # Import CORS support
from difflib import SequenceMatcher
import PyPDF2
import re
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
GOMAPS_API_KEY = "AlzaSy-9evlt4H1QMwiZx_6-wvl0QXAvaeUwW8N"

# Mapping of medical specialties to common symptoms
SPECIALTIES = {
    "Cardiologist": ["Chest pain", "High blood pressure", "Shortness of breath", "Irregular heartbeat", "Swelling in legs"],
    "Dermatologist": ["Skin rash", "Acne", "Eczema", "Psoriasis", "Skin infections"],
    "Neurologist": ["Headache", "Seizures", "Memory loss", "Numbness", "Dizziness"],
    "Orthopedic": ["Joint pain", "Fracture", "Back pain", "Arthritis", "Muscle stiffness"],
    "Pediatrician": ["Fever in children", "Cough in kids", "Growth issues", "Vaccination needs", "Frequent infections"],
    "ENT Specialist": ["Ear pain", "Sore throat", "Hearing loss", "Nasal congestion", "Tinnitus"],
    "General Physician": ["Fever", "Cough", "Body pain", "Fatigue", "General weakness"],
    "Endocrinologist": ["Diabetes", "Thyroid issues", "Hormonal imbalance", "Weight gain", "Excessive sweating"],
    "Gastroenterologist": ["Abdominal pain", "Indigestion", "Constipation", "Diarrhea", "Bloody stools"],
    "Pulmonologist": ["Chronic cough", "Asthma", "Shortness of breath", "Lung infections", "Wheezing"],
    "Nephrologist": ["Kidney stones", "Frequent urination", "Swelling in legs", "Blood in urine", "High creatinine levels"],
    "Hematologist": ["Anemia", "Easy bruising", "Excessive bleeding", "Leukemia symptoms", "Blood clotting issues"],
    "Oncologist": ["Unexplained weight loss", "Lumps in body", "Chronic fatigue", "Abnormal bleeding", "Night sweats"],
    "Urologist": ["Painful urination", "Urinary tract infections", "Erectile dysfunction", "Kidney stones", "Frequent urination"],
    "Rheumatologist": ["Joint pain", "Autoimmune disorders", "Chronic fatigue", "Muscle stiffness", "Swollen joints"],
    "Ophthalmologist": ["Blurry vision", "Eye redness", "Cataracts", "Dry eyes", "Glaucoma"],
    "Psychiatrist": ["Depression", "Anxiety", "Mood swings", "Hallucinations", "Sleep disorders"],
    "Allergist/Immunologist": ["Skin allergies", "Food allergies", "Asthma", "Hay fever", "Frequent infections"],
    "Infectious Disease Specialist": ["Persistent fever", "HIV/AIDS", "Tuberculosis", "Malaria", "Chronic infections"],
    "Geriatrician": ["Memory loss", "Weakness in elderly", "Falls", "Chronic pain", "Osteoporosis"],
    "Andrologist": ["Male infertility", "Low testosterone", "Erectile dysfunction", "Prostate issues", "Testicular pain"],
    "Obstetrician/Gynecologist (OB-GYN)": ["Menstrual irregularities", "Pelvic pain", "Pregnancy-related issues", "PCOS", "Menopause symptoms"],
    "Plastic Surgeon": ["Cosmetic concerns", "Burn scars", "Reconstructive surgery", "Cleft lip", "Skin grafting"],
    "Thoracic Surgeon": ["Lung cancer", "Collapsed lung", "Chest trauma", "Esophageal disorders", "Heart surgery"],
    "Vascular Surgeon": ["Varicose veins", "Poor circulation", "Leg ulcers", "Aneurysms", "Blood clots"],
    "Colorectal Surgeon": ["Hemorrhoids", "Anal pain", "Rectal bleeding", "Colon cancer", "Fecal incontinence"],
    "Neurosurgeon": ["Brain tumors", "Spinal cord injuries", "Severe migraines", "Stroke complications", "Nerve pain"],
    "Pain Specialist": ["Chronic pain", "Back pain", "Post-surgical pain", "Fibromyalgia", "Neuralgia"],
    "Hepatologist": ["Liver disease", "Hepatitis", "Jaundice", "Liver cirrhosis", "Fatty liver"],
    "Proctologist": ["Hemorrhoids", "Rectal pain", "Anal fistulas", "Constipation", "Colon disorders"],
    "Toxicologist": ["Poisoning", "Chemical exposure", "Drug overdose", "Toxic reactions", "Industrial exposure"],
    "Sleep Specialist": ["Insomnia", "Sleep apnea", "Narcolepsy", "Restless leg syndrome", "Snoring"],
    "Sports Medicine Specialist": ["Sports injuries", "Tendonitis", "Fractures", "Muscle sprains", "Concussions"],
    "Podiatrist": ["Foot pain", "Plantar fasciitis", "Ingrown toenails", "Heel spurs", "Diabetic foot ulcers"],
    "Osteopath": ["Body pain", "Joint stiffness", "Muscle spasms", "Chronic fatigue", "Spinal misalignment"],
    "Rehabilitation Medicine Specialist": ["Stroke recovery", "Spinal cord injury", "Muscle weakness", "Post-surgery rehab", "Mobility issues"],
    "Geneticist": ["Inherited disorders", "Genetic testing", "Rare syndromes", "Chromosomal abnormalities", "Metabolic disorders"],
    "Medical Examiner": ["Unexplained deaths", "Autopsies", "Forensic pathology", "Toxicology analysis", "Crime scene evaluations"],
    "Nuclear Medicine Specialist": ["Cancer imaging", "Thyroid scans", "Bone scans", "PET scans", "Radioactive therapy"],
    "Clinical Pharmacologist": ["Drug reactions", "Medication management", "Pharmacokinetics", "Adverse effects", "Dosage recommendations"],
    "Dietitian/Nutritionist": ["Obesity", "Nutritional deficiencies", "Meal planning", "Metabolic disorders", "Diet-related illnesses"],
    "Hyperbaric Medicine Specialist": ["Decompression sickness", "Carbon monoxide poisoning", "Wound healing", "Oxygen therapy", "Burn treatment"],
    "Medical Geneticist": ["Rare genetic disorders", "Hereditary conditions", "Prenatal genetic screening", "Gene therapy", "Metabolic diseases"],
    "Gastrointestinal Surgeon": ["Gallbladder disease", "Hernia", "Stomach cancer", "Appendicitis", "Bowel obstruction"],
    "Breast Surgeon": ["Breast cancer", "Lumps in breast", "Mastectomy", "Breast reduction", "Breast reconstruction"],
    "Emergency Medicine Specialist": ["Severe trauma", "Heart attacks", "Stroke", "Respiratory distress", "Acute poisoning"],
    "Radiation Oncologist": ["Cancer radiation therapy", "Tumor treatment", "Side effects of radiation", "Radioactive implants", "Targeted radiation therapy"],
    "Clinical Microbiologist": ["Bacterial infections", "Viral infections", "Fungal infections", "Antibiotic resistance", "Lab testing"],
    "Tropical Medicine Specialist": ["Malaria", "Dengue fever", "Cholera", "Zika virus", "Yellow fever"],
    "Public Health Specialist": ["Epidemiology", "Infectious disease outbreaks", "Vaccination programs", "Community health issues", "Health policy planning"],
    "Occupational Medicine Specialist": ["Workplace injuries", "Ergonomics", "Industrial disease", "Toxic exposure at work", "Hearing loss prevention"],
    "Holistic Medicine Practitioner": ["Alternative therapies", "Mind-body medicine", "Herbal treatments", "Acupuncture", "Ayurveda"],
    "Ayurvedic Doctor": ["Digestive issues", "Stress-related disorders", "Chronic fatigue", "Skin diseases", "Detoxification"],
    "Homeopathic Doctor": ["Chronic diseases", "Allergies", "Migraines", "Respiratory issues", "Hormonal imbalances"],
}

def is_similar(a, b, threshold=0.8):
    """Return True if strings a and b are similar above the given threshold."""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio() >= threshold

def get_matched_specialties(user_symptoms):
    """
    Compare each user symptom against the symptoms for each specialty using fuzzy matching.
    If a user symptom is similar enough to any of the specialty's symptoms,
    add that specialty to the matched set.
    """
    matched = set()
    for specialty, symptom_list in SPECIALTIES.items():
        for user_symptom in user_symptoms:
            for specialty_symptom in symptom_list:
                if is_similar(user_symptom, specialty_symptom):
                    matched.add(specialty)
                    break
    return matched

@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to the Doctor Finder API",
        "endpoints": {
            "/map": "POST - Find nearby hospitals based on location and symptoms",
            "/city_hospitals": "POST - Find hospitals in a specified city based on symptoms"
        }
    })

@app.route('/map', methods=['POST'])
def generate_map():
    data = request.json
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    symptoms = data.get("symptoms", [])

    if not latitude or not longitude:
        return jsonify({"error": "Invalid location data"}), 400

    # Use fuzzy matching on the user provided symptoms (as given, without TextBlob correction)
    matched_specialties = get_matched_specialties(symptoms)
    
    if not matched_specialties:
        return jsonify({"error": "No matching specialists found"}), 400

    hospital_data = fetch_hospitals(latitude, longitude, matched_specialties)
    save_map(latitude, longitude, hospital_data)

    return jsonify({"message": "Map generated successfully", "places": hospital_data})

@app.route('/city_hospitals', methods=['POST'])
def city_hospitals():
    data = request.json
    city = data.get("city")
    symptoms = data.get("symptoms", [])
    
    if not city:
        return jsonify({"error": "City name is required"}), 400

    # Get fuzzy-matched specialties based on user symptoms
    matched_specialties = get_matched_specialties(symptoms)
    hospital_data = fetch_hospitals_by_city(city, matched_specialties)
    
    return jsonify({"places": hospital_data})

def fetch_hospitals(latitude, longitude, specialties):
    hospitals = []
    for specialty in specialties:
        url = "https://maps.gomaps.pro/maps/api/place/nearbysearch/json"
        params = {
            "location": f"{latitude},{longitude}",
            "radius": 5000,
            "keyword": specialty,
            "key": GOMAPS_API_KEY
        }
        response = requests.get(url, params=params)
        data = response.json()

        if "results" in data:
            for place in data["results"]:
                hospitals.append({
                    "name": place.get("name", "Unknown"),
                    "lat": place["geometry"]["location"]["lat"],
                    "lng": place["geometry"]["location"]["lng"],
                    "rating": place.get("rating", "N/A"),
                    "specialization": specialty,
                    "address": place.get("vicinity", "Unknown")
                })
    return sorted(hospitals, key=lambda x: x.get("rating", 0), reverse=True)[:10]

def fetch_hospitals_by_city(city, specialties):
    hospitals = []
    for specialty in specialties:
        url = "https://maps.gomaps.pro/maps/api/place/textsearch/json"
        params = {
            "query": f"{specialty} hospitals in {city}",
            "key": GOMAPS_API_KEY
        }
        response = requests.get(url, params=params)
        data = response.json()

        if "results" in data:
            for place in data["results"]:
                hospitals.append({
                    "name": place.get("name", "Unknown"),
                    "rating": place.get("rating", "N/A"),
                    "specialization": specialty,
                    "address": place.get("formatted_address", "Unknown")
                })
    return sorted(hospitals, key=lambda x: x.get("rating", 0), reverse=True)[:10]

def save_map(latitude, longitude, hospital_data):
    if not os.path.exists("static"):
        os.makedirs("static")
    map_obj = folium.Map(location=[latitude, longitude], zoom_start=14)
    folium.Marker([latitude, longitude], popup="You are here!", icon=folium.Icon(color="blue")).add_to(map_obj)
    
    for place in hospital_data:
        folium.Marker(
            [place["lat"], place["lng"]],
            popup=f"<b>{place['name']}</b><br>Specialization: {place['specialization']}<br>Rating: {place['rating']}"
        ).add_to(map_obj)
    map_obj.save("static/map.html")


# Load the BioBERT NER pipeline
nlp = pipeline(
    "ner",
    model="Ishan0612/biobert_medical_ner",
    tokenizer="Ishan0612/biobert_medical_ner",
    aggregation_strategy="simple"
)

def extract_text_from_pdf(pdf_file):
    """
    Extracts text from an uploaded PDF file using PyPDF2.
    Then returns the raw text (without heavy formatting).
    We'll handle the major cleanup in highlight_diseases.
    """
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def merge_subwords(ner_results):
    """
    Merges subword tokens from the NER output.
    """
    merged_entities = []
    i = 0
    while i < len(ner_results):
        if ner_results[i]['entity_group'] == 'LABEL_1':
            disease = ner_results[i]['word']
            i += 1
            while i < len(ner_results) and ner_results[i]['entity_group'] == 'LABEL_2':
                token = ner_results[i]['word']
                if token.startswith("##"):
                    token = token[2:]
                    disease += token
                else:
                    disease += " " + token
                i += 1
            merged_entities.append(disease)
        else:
            i += 1
    return merged_entities

def remove_duplicates_preserve_order(diseases):
    """
    Removes duplicate disease names (case-insensitive) while preserving order.
    """
    unique_diseases = []
    seen = set()
    for d in diseases:
        d_lower = d.lower()
        if d_lower not in seen:
            unique_diseases.append(d)
            seen.add(d_lower)
    return unique_diseases

def highlight_diseases(raw_text, diseases):
    """
    1. Clean up the raw PDF text: remove newlines, collapse multiple spaces, etc.
    2. For each disease, convert internal spaces to \s+ so that multi-word diseases match even
       if there's more than one space in the text.
    3. Use a negative lookbehind/lookahead on [A-Za-z0-9_] so punctuation or parentheses
       do not block matches.
    """
    # --- Step 1: Clean up the text thoroughly ---
    # Replace ALL newlines with spaces
    text = raw_text.replace('\n', ' ')
    # Collapse multiple spaces into a single space
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()

    # --- Step 2: Deduplicate diseases first ---
    diseases_deduped = remove_duplicates_preserve_order(diseases)

    # --- Step 3: Sort diseases by length (longest first) to avoid partial matches overshadowing longer ones ---
    diseases_sorted = sorted(diseases_deduped, key=len, reverse=True)

    # --- Step 4: For each disease, build a flexible pattern and highlight ---
    for disease in diseases_sorted:
        # Escape special regex chars
        escaped = re.escape(disease)
        # Replace the escaped space ('\ ') with '\s+' to allow multi-spaces
        # e.g. "chest pain" -> "chest\s+pain"
        escaped = re.sub(r'\\ ', r'\\s+', escaped)

        # Negative lookbehind/lookahead on [A-Za-z0-9_] so punctuation won't block a match
        pattern = re.compile(
            rf'(?<![A-Za-z0-9_]){escaped}(?![A-Za-z0-9_])',
            re.IGNORECASE
        )

        # Highlight with a <span>
        text = pattern.sub(lambda m: f'<span class="highlight">{m.group(0)}</span>', text)

    return text

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        pdf_file = request.files['file']

        # 1. Extract raw text from PDF
        raw_text = extract_text_from_pdf(pdf_file)

        # 2. Run NER
        ner_results = nlp(raw_text)

        # 3. Merge subwords -> disease phrases
        diseases_merged = merge_subwords(ner_results)

        # 4. Remove duplicates for final display
        diseases = remove_duplicates_preserve_order(diseases_merged)

        # 5. Highlight diseases in the text
        highlighted_text = highlight_diseases(raw_text, diseases)

        # Return JSON response for React frontend
        return jsonify({
            "diseases": diseases,
            "highlighted_text": highlighted_text
        })
    
    # For GET requests, just return a simple message
    return jsonify({"message": "Please upload a PDF file via POST request"})

if __name__ == '__main__':
    app.run(debug=True)
