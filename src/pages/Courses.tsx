import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Clock, Award, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { useSupabase } from '../lib/supabaseClient';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: number;
  thumbnail_url?: string;
  is_workshop: boolean;
  next_session_date?: string;
  location?: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'courses' | 'workshops'>('all');
  const navigate = useNavigate();
  const supabase = useSupabase();

  // Create animated stars
  useEffect(() => {
    const createStars = () => {
      const starsContainer = document.querySelector('.stars');
      if (!starsContainer) return;

      // Clear existing stars
      starsContainer.innerHTML = '';

      // Create new stars
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.setProperty('--duration', `${3 + Math.random() * 7}s`);
        starsContainer.appendChild(star);
      }
    };

    createStars();
    window.addEventListener('resize', createStars);
    return () => window.removeEventListener('resize', createStars);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw new Error('Failed to fetch courses');
        
        setCourses(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [supabase]);

  const filteredCourses = courses.filter(course => {
    if (filter === 'courses') return !course.is_workshop;
    if (filter === 'workshops') return course.is_workshop;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Courses</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="stars" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 neon-text">DIGITS Learning Platform</h1>
          <p className="text-xl text-gray-400 mb-8 digital-text">
            Empowering seniors with digital literacy skills through our comprehensive courses and workshops
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/50'
                  : 'glass text-gray-400 hover:bg-primary-900/30'
              }`}
            >
              All
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('courses')}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                filter === 'courses'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/50'
                  : 'glass text-gray-400 hover:bg-primary-900/30'
              }`}
            >
              Self-Paced Courses
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('workshops')}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                filter === 'workshops'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/50'
                  : 'glass text-gray-400 hover:bg-primary-900/30'
              }`}
            >
              Live Workshops
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="card-3d cursor-pointer"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className={`w-full h-48 bg-gradient-to-br ${
                  course.is_workshop 
                    ? 'from-purple-600/80 to-pink-600/80' 
                    : 'from-primary-600/80 to-primary-800/80'
                } flex items-center justify-center backdrop-blur`}>
                  <Book className="w-16 h-16 text-white/90" />
                </div>
              )}
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold digital-text">{course.title}</h3>
                  {course.is_workshop && (
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full digital-text">
                      Workshop
                    </span>
                  )}
                </div>
                <p className="text-gray-400 line-clamp-2">{course.description}</p>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-400">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      {course.level}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {course.duration}
                    </div>
                  </div>
                  
                  {course.is_workshop && course.next_session_date && (
                    <div className="flex items-center text-purple-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {course.next_session_date}
                    </div>
                  )}
                  
                  {course.is_workshop && course.location && (
                    <div className="flex items-center text-purple-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {course.location}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="text-primary-500 flex items-center"
                  >
                    Start Learning <ChevronRight className="w-4 h-4 ml-1" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 glass rounded-lg"
          >
            <p className="text-gray-400">No {filter === 'workshops' ? 'workshops' : 'courses'} available at the moment.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses;