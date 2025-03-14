import React from 'react';
import { Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900/50 backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold">DIGITS Inc</span>
            </div>
            <p className="mt-2 text-sm text-gray-300">
              Empowering seniors with digital security knowledge and confidence.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/courses" className="text-gray-300 hover:text-blue-500">Courses</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-blue-500">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-blue-500">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-300">Email: support@digitsinc.org</p>
            <p className="text-gray-300">Phone: (800) 123-4567</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300 flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by DIGITS Inc - A Nonprofit Organization
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;