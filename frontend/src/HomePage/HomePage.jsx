import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function HomePage() {
  // Array of background images
  const bgImages = [
    'https://cdn.pixabay.com/photo/2021/09/17/21/55/hospital-bed-6633778_1280.png',
    'https://cdn.pixabay.com/photo/2021/10/11/17/37/doctor-6701410_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/05/29/20/46/hospital-2354845_1280.jpg',
  ];

  // Track current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fade-in for text animations
  const [isVisible, setIsVisible] = useState(false);

  // Cycle the background images every 5 seconds
  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bgImages.length]);

  return (
    // Removed overflow-x-hidden to avoid interfering with sticky behavior
    <div className="w-full min-h-screen relative">
      {/* Background Slideshow using AnimatePresence */}
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0 min-w-7xl bg-center"
          style={{
            backgroundImage: `url(${bgImages[currentIndex]})`,
          }}
        />
      </AnimatePresence>

      {/* Fixed Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between p-4 md:p-6 bg-white bg-opacity-95 shadow-md transition-all duration-300">
        <div className="flex items-center">
          <svg className="w-8 h-8 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MediCare Assistant
          </h1>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/about"
            className="px-3 py-2 text-blue-600 hover:text-blue-800 transition duration-300 hover:underline font-bold text-2xl hidden md:block"
          >
            About
          </Link>
          <Link
            to="/features"
            className="px-3 py-2 text-blue-600 hover:text-blue-800 transition duration-300 hover:underline font-bold text-2xl hidden md:block"
          >
            Features
          </Link>
          <Link
            to="/contact"
            className="px-3 py-2 text-blue-600 hover:text-blue-800 transition duration-300 hover:underline font-bold text-2xl hidden md:block"
          >
            Contact
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 text-white font-bold text-xl bg-blue-600 rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="bg-white bg-opacity-95 p-8 md:p-10 rounded-xl shadow-2xl text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
            Healthcare Simplified with <span className="text-blue-600">Personalized Support</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Your trusted healthcare companion, providing instant guidance, appointment scheduling,
            and personalized care recommendations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Get Started
            </Link>
            <Link
              to="/demo"
              className="w-full sm:w-auto px-6 py-3 text-blue-600 bg-white border-2 border-blue-600 rounded-md hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Watch Demo
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Comprehensive Healthcare Solutions
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Link to="/DiseaseExtraction_2" className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Automated Disease Extraction</h3>
                <p className="text-gray-600 text-center">
                  BioBERT, fine-tuned with NCBI data, achieves 98% accuracy, automating disease recognition to enhance efficiency and reduce oversight in healthcare.                </p>
              </motion.div>
            </Link>

            {/* Feature 2 */}
            <Link to="/FindDoctorsNearMe" className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Find A Near-By Health Expert</h3>
                <p className="text-gray-600 text-center">
                  Easily connect with experienced doctors, specialists, and healthcare professionals near you. Our intelligent system helps you find the right expert based on your needs and location.
                </p>
              </motion.div>
            </Link>

            {/* Feature 3 */}
            <Link to="/random2" className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Medication Management</h3>
                <p className="text-gray-600 text-center">
                  Track your medications, receive timely reminders, and get alerts about potential drug interactions to ensure your treatment plan is effective and safe.
                </p>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready to experience better healthcare?</h2>
          <p className="text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their healthcare experience with MediCare Assistant.
          </p>
          <Link
            to="/signup"
            className="px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 font-medium text-lg inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MediCare Assistant</h3>
            <p className="text-gray-400">Your trusted healthcare companion, available 24/7.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-400 hover:text-white transition duration-300">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition duration-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/compliance" className="text-gray-400 hover:text-white transition duration-300">
                  HIPAA Compliance
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              {/* Social icons omitted for brevity */}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MediCare Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
