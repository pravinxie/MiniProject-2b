import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SearchForm from './SearchForm/SearchForm.jsx';
import HospitalTable from './HospitalTable/HospitalTable.jsx';
import MapComponent from './MapComponent/MapComponent.jsx';
import axios from 'axios';

// Set base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:5002';

function FindDoctorsNearMe() {
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [cityHospitals, setCityHospitals] = useState([]);
  const [mapUrl, setMapUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNearbySearch = async (latitude, longitude, symptoms) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/map', { latitude, longitude, symptoms });
      setNearbyHospitals(response.data.places || []);
      setMapUrl('http://localhost:5002/static/map.html');
    } catch (error) {
      console.error('Error fetching nearby hospitals:', error);
      setError('Failed to fetch nearby hospitals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = async (city, symptoms) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/city_hospitals', { city, symptoms });
      setCityHospitals(response.data.places || []);
      setMapUrl('http://localhost:5002/static/map.html');
    } catch (error) {
      console.error('Error fetching city hospitals:', error);
      setError('Failed to fetch hospitals in this city. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <motion.h1 
            className="text-4xl font-bold mb-2 flex items-center"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Doctor Finder
          </motion.h1>
          <motion.p 
            className="text-lg text-blue-100 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Find the right medical specialists near you based on your symptoms. Quality healthcare is just a search away.
          </motion.p>
        </div>
      </div>
      
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <SearchForm onNearbySearch={handleNearbySearch} onCitySearch={handleCitySearch} />
        
        {loading && (
          <div className="flex justify-center my-12">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-lg text-blue-600 font-medium">Searching for the best medical facilities...</p>
            </div>
          </div>
        )}
        
        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 p-4 my-8 rounded-md shadow-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}
        
        {nearbyHospitals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HospitalTable title="Nearby Hospitals" hospitals={nearbyHospitals} />
          </motion.div>
        )}
        
        {cityHospitals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HospitalTable title="Hospitals in Selected City" hospitals={cityHospitals} />
          </motion.div>
        )}
        
        {mapUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MapComponent mapUrl={mapUrl} />
          </motion.div>
        )}
        
        {!loading && !error && nearbyHospitals.length === 0 && cityHospitals.length === 0 && !mapUrl && (
          <motion.div 
            className="bg-blue-50 border border-blue-200 rounded-xl p-8 my-8 text-center shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <svg className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Ready to Find a Doctor?</h3>
              <p className="text-blue-600 max-w-lg">Enter your symptoms and use the search button above to find medical facilities that specialize in treating your condition.</p>
            </div>
          </motion.div>
        )}
        
        <motion.div
          className="mt-12 mb-6 bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-3">About Doctor Finder</h2>
          <p className="text-gray-600">
            Doctor Finder helps you locate the right healthcare providers based on your specific needs. 
            Our application identifies medical specialists who can address your symptoms and shows their locations on an interactive map.
            Simply enter your symptoms, allow location access, and we'll find the nearest appropriate healthcare facilities for you.
          </p>
        </motion.div>
      </div>
      
      <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-2">Doctor Finder</h3>
              <p className="text-sm text-gray-400">© 2025 Health Connect Services. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

export default FindDoctorsNearMe;