import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              Handyman Services
            </Link>
          </div>

          <div className="flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-gray-900 px-3 py-2"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-gray-900 px-3 py-2"
            >
              Contact
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-gray-900 px-3 py-2"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
