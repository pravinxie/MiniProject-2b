import React, { useState } from 'react';
import { motion } from 'framer-motion';

function SearchForm({ onNearbySearch, onCitySearch }) {
  const [symptoms, setSymptoms] = useState('');
  const [city, setCity] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleNearbySearch = () => {
    if (symptoms.trim() === '') {
      alert('Please enter at least one symptom');
      return;
    }
    
    setIsSearching(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        onNearbySearch(position.coords.latitude, position.coords.longitude, symptoms.split(',').map(s => s.trim()));
        setIsSearching(false);
      }, error => {
        alert('Error getting location: ' + error.message);
        setIsSearching(false);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsSearching(false);
    }
  };

  const handleCitySearch = () => {
    if (symptoms.trim() === '' || city.trim() === '') {
      alert('Please enter both symptoms and city');
      return;
    }
    onCitySearch(city, symptoms.split(',').map(s => s.trim()));
  };

  return (
    <motion.div 
      className="my-8 bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Medical Services
        </h2>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="symptoms">
            Enter Symptoms (comma-separated):
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <input 
              id="symptoms"
              type="text" 
              value={symptoms} 
              onChange={e => setSymptoms(e.target.value)} 
              placeholder="e.g. headache, fever, cough"
              className="pl-10 w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" 
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">List your symptoms to find appropriate specialists</p>
        </div>
        
        <button 
          onClick={handleNearbySearch} 
          disabled={isSearching}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition duration-200 flex items-center justify-center"
        >
          {isSearching ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Locating Nearby Doctors...
            </>
          ) : (
            <>
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Find Nearby Doctors
            </>
          )}
        </button>

        {/* City search is commented out in the original code, so keeping it commented but styled */}
        
        <div className="relative my-8 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
            Enter a City:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <input 
              id="city"
              type="text" 
              value={city} 
              onChange={e => setCity(e.target.value)} 
              placeholder="e.g. Mumbai, Pune, Delhi"
              className="pl-10 w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" 
            />
          </div>
        </div>
        
        <button 
          onClick={handleCitySearch} 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition duration-200 flex items-center justify-center"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Find Hospitals in City
        </button>
       
      </div>
    </motion.div>
  );
}

export default SearchForm;