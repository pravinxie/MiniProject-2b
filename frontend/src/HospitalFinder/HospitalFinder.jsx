import { useState } from 'react';

export default function HospitalFinder() {
  const [city, setCity] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [cityHospitals, setCityHospitals] = useState([]);
  const [symptomHospitals, setSymptomHospitals] = useState([]);
  const [mapUrl, setMapUrl] = useState('');

  const searchByCity = () => {
    if (!city.trim()) {
      alert("Please enter a city name!");
      return;
    }

    setLoading(true);

    fetch("http://127.0.0.1:5002/city_hospitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: city.trim() })
    })
    .then(response => response.json())
    .then(data => {
      setLoading(false);
      if (data.places && data.places.length > 0) {
        setCityHospitals(data.places);
      } else {
        setCityHospitals([]);
      }
    })
    .catch(error => {
      setLoading(false);
      alert("Error fetching hospitals. Please try again.");
      console.error("Error:", error);
    });
  };

  const searchBySymptoms = () => {
    if (!symptoms.trim()) {
      alert("Please enter at least one symptom!");
      return;
    }

    const symptomList = symptoms.split(",").map(s => s.trim());

    if (navigator.geolocation) {
      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          fetch("http://127.0.0.1:5002/map", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude, symptoms: symptomList })
          })
          .then(response => response.json())
          .then(data => {
            setLoading(false);
            if (data.places && data.places.length > 0) {
              setSymptomHospitals(data.places);
              if (data.map_url) {
                setMapUrl(data.map_url);
              }
            } else {
              setSymptomHospitals([]);
            }
          })
          .catch(error => {
            setLoading(false);
            alert("Error fetching hospitals. Please try again.");
            console.error("Error:", error);
          });
        },
        () => {
          setLoading(false);
          alert("Location access denied. Unable to fetch nearby hospitals.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const renderHospitalTable = (hospitals, title) => (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="overflow-x-auto bg-white bg-opacity-80 rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Name</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Specialization</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Rating</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Address</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.length > 0 ? (
              hospitals.map((hospital, index) => {
                const specialistName = hospital.specialization ? hospital.specialization.split(" - ")[0] : "Unknown";
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`;
                const rating = (typeof hospital.rating === "number") ? hospital.rating.toFixed(1) : "N/A";

                return (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-3 px-4 text-gray-800">{hospital.name}</td>
                    <td className="py-3 px-4 text-gray-800">{specialistName}</td>
                    <td className="py-3 px-4 text-gray-800">{rating}</td>
                    <td className="py-3 px-4 text-gray-800">
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {hospital.address}
                      </a>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center text-gray-500">No hospitals found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Hospital Finder</h1>
            <p className="text-gray-600">Find the right hospital based on your symptoms or location</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Enter symptoms (comma separated)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <button
                onClick={searchBySymptoms}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition shadow-md"
              >
                Search by Symptoms
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <button
                onClick={searchByCity}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition shadow-md"
              >
                Search by City
              </button>
            </div>
          </div>

          {loading && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-blue-600 font-medium">Loading... Please wait</p>
            </div>
          )}

          {renderHospitalTable(cityHospitals, "Hospitals in Your City")}
          {renderHospitalTable(symptomHospitals, "Hospitals Near Your Location")}

          {mapUrl && (
            <div className="mt-8">
              <iframe
                src={mapUrl}
                className="w-full h-96 rounded-lg shadow-md"
                title="Hospital Map"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}