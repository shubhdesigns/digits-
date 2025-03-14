import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Stars from './Stars';
import { useAuthStore } from '../store/authStore';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white">
      <Stars />
      
      {/* Navigation */}
      <nav className="glass fixed top-0 w-full z-50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center neon-border"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="digital-text text-lg font-bold">D</span>
              </motion.div>
              <span className="text-xl font-bold neon-text">DIGITS</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="nav-link px-3 py-2 rounded-md text-sm hover:text-indigo-400 transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/courses" 
                className="nav-link px-3 py-2 rounded-md text-sm hover:text-indigo-400 transition-colors"
              >
                Courses
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="nav-link px-3 py-2 rounded-md text-sm hover:text-indigo-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 rounded-md text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-md text-sm bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md text-sm bg-purple-500 hover:bg-purple-600 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass mt-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 digital-text">About DIGITS</h3>
              <p className="text-gray-400">
                Empowering seniors with digital literacy skills through innovative education and support.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 digital-text">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">
                    Browse Courses
                  </Link>
                </li>
                <li>
                  <Link to="/workshops" className="text-gray-400 hover:text-white transition-colors">
                    Upcoming Workshops
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-gray-400 hover:text-white transition-colors">
                    Get Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 digital-text">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: contact@digits.org</li>
                <li>Phone: (555) 123-4567</li>
                <li>Location: Digital Learning Center</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} DIGITS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 