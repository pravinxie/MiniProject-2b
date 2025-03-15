import React from "react";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?fit=crop&w=1200&h=800&q=80')",
        }}
      >
        {/* Optional overlay for better contrast */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between p-4 md:p-6 bg-white bg-opacity-95 shadow-md transition-all duration-300">
        <div className="flex items-center">
          <svg
            className="w-8 h-8 mr-2 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
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

      {/* Login Form */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Login
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Enter your credentials
          </p>

          <form>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center text-sm mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
