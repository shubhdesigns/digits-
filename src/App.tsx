import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseViewer from './pages/CourseViewer';

function App() {
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#0a0a1f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute>
                <CourseViewer />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'bg-gray-800 text-white',
            style: {
              background: '#1F2937',
              color: '#fff',
              border: '1px solid #374151',
            },
          }}
        />
      </Layout>
    </Router>
  );
}

export default App;