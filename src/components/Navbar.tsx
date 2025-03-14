import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';
import { useAuthStore } from '../store/authStore';
import AuthForm from './AuthForm';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const { user, signOut } = useAuthStore();

  return (
    <>
      <nav className="bg-black fixed w-full z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Logo />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
                <Link to="/courses" className="text-gray-300 hover:text-white transition-colors">Courses</Link>
                {user ? (
                  <>
                    <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                    <button
                      onClick={() => signOut()}
                      className="px-4 py-2 rounded-md border-2 border-white text-white hover:bg-white hover:text-black transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAuthForm(true)}
                    className="px-4 py-2 rounded-md border-2 border-white text-white hover:bg-white hover:text-black transition-colors"
                  >
                    Login / Register
                  </button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-black border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-white">Home</Link>
              <Link to="/courses" className="block px-3 py-2 text-gray-300 hover:text-white">Courses</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-3 py-2 text-gray-300 hover:text-white">Dashboard</Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthForm(true)}
                  className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {showAuthForm && <AuthForm onClose={() => setShowAuthForm(false)} />}
    </>
  );
};

export default Navbar;