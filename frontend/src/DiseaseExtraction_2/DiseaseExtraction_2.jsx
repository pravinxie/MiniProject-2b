import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function DiseaseExtraction_2() {
  const [file, setFile] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [originalText, setOriginalText] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Process the original text and add highlights whenever diseases or originalText changes
  useEffect(() => {
    if (diseases.length > 0 && originalText) {
      let processedText = originalText;
      
      // Sort diseases by length (descending) to handle cases where one disease name contains another
      const sortedDiseases = [...diseases].sort((a, b) => b.length - a.length);
      
      sortedDiseases.forEach(disease => {
        // Escape special regex characters in the disease name
        const escapedDisease = disease.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Create regex with word boundaries and case insensitivity
        const regex = new RegExp(`(\\b${escapedDisease}\\b)`, 'gi');
        // Replace all occurrences with the highlighted version
        processedText = processedText.replace(
          regex, 
          '<span class="bg-yellow-100 px-1 rounded">$1</span>'
        );
      });
      
      setHighlightedText(processedText);
    }
  }, [diseases, originalText]);

  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setDiseases([]);
    setOriginalText('');
    setHighlightedText('');
    setError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setDiseases([]);
      setOriginalText('');
      setHighlightedText('');
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create form data to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Send the file to the Flask backend
      const response = await fetch('http://localhost:5002/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      // Parse the response as JSON
      const data = await response.json();
      
      // Update state with the results
      setDiseases(data.diseases || []);
      // Store the original text coming from the API (or use fallback text)
      setOriginalText(data.highlighted_text || '');
      // If the API does not return highlighted_text, the effect above will generate it
      
    } catch (err) {
      setError('Error processing PDF: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <motion.div 
        className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-3xl font-bold mb-6 text-gray-800 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Disease Entity Extraction
        </motion.h2>
        
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
            <div 
              className={`w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 
                  ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                onChange={onFileChange} 
                accept=".pdf"
                className="hidden" 
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="flex flex-col items-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                
                <span className="text-lg font-medium text-gray-700">
                  {file ? file.name : 'Drop your PDF here or click to browse'}
                </span>
                
                <p className="text-sm text-gray-500 mt-2">
                  Only PDF files are supported
                </p>
              </label>
            </div>

            <motion.button 
              type="submit" 
              className={`px-6 py-3 rounded-lg font-medium cursor-pointer text-white shadow-md transition-all ${file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={!file}
              whileHover={file ? { scale: 1.05 } : {}}
              whileTap={file ? { scale: 0.95 } : {}}
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Process PDF
              </div>
            </motion.button>
          </form>
        </motion.div>
        
        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </motion.div>
        )}
        
        {isLoading && (
          <motion.div 
            className="flex flex-col items-center justify-center my-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Processing PDF...</p>
          </motion.div>
        )}
        
        {diseases.length > 0 && !isLoading && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-8"
          >
            {/* Text with Highlighted Diseases section FIRST */}
            <motion.div variants={item} className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Text with Highlighted Diseases
              </h3>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-700 max-h-64 overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: highlightedText }}></div>
              </div>
            </motion.div>

            {/* Detected Diseases section SECOND */}
            <motion.div variants={item} className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Detected Diseases
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {diseases.map((disease, index) => (
                  <motion.span 
                    key={index}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.2 }}
                  >
                    {disease}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div 
              variants={item}
              className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100"
            >
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-800">
                  Medical conditions are <span className="bg-yellow-100 px-1 rounded">highlighted in yellow</span> in the document text above for easy identification.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="mt-6 pt-4 border-t border-gray-200 text-gray-600 text-sm italic"
              variants={item}
            >
              This analysis is for informational purposes only. Always consult with a healthcare professional.
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default DiseaseExtraction_2;
