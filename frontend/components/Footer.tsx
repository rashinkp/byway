import React from "react";
import {  Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const BywayFooter = () => {
  return (
    <footer className="bg-black text-white py-12 px-4 z-50 relative mt-auto ">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center max-w-6xl">
        {/* Logo and Tagline */}
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">Byway</h2>
          <p className="text-gray-300 text-sm">Learn Anytime, Anywhere</p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-center mb-6 md:mb-0">
          <a href="#" className="hover:text-gray-300 transition-colors">
            Courses
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            About
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Contact
          </a>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-300 transition-colors">
            <Facebook size={24} />
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            <Twitter size={24} />
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            <Instagram size={24} />
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            <Linkedin size={24} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-8 pt-4 border-t border-gray-800">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Byway. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default BywayFooter;
