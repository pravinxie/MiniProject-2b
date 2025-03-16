import React from 'react';
import { motion } from 'framer-motion';

function MapComponent({ mapUrl }) {
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Hospital Locations
        </h2>
      </div>
      <div className="p-4">
        <div className="rounded-lg overflow-hidden border border-gray-200 shadow-inner">
          <iframe 
            src={mapUrl} 
            width="100%" 
            height="550px" 
            className="rounded-lg" 
            title="Hospital Locations Map"
          ></iframe>
        </div>
      </div>
    </motion.div>
  );
}

export default MapComponent;