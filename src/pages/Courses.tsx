import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Clock, Award, Calendar, MapPin } from 'lucide-react';
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Courses</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">DIGITS Learning Platform</h1>
          <p className="text-xl text-gray-400 mb-8">
            Empowering seniors with digital literacy skills through our comprehensive courses and workshops
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('courses')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                filter === 'courses'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              Self-Paced Courses
            </button>
            <button
              onClick={() => setFilter('workshops')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                filter === 'workshops'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              Live Workshops
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg cursor-pointer"
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
                    ? 'from-purple-600 to-pink-600' 
                    : 'from-blue-600 to-purple-600'
                } flex items-center justify-center`}>
                  <Book className="w-16 h-16 text-white/80" />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  {course.is_workshop && (
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full">
                      Workshop
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      {course.level}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                  
                  {course.is_workshop && course.next_session_date && (
                    <div className="flex items-center text-purple-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {course.next_session_date}
                    </div>
                  )}
                  
                  {course.is_workshop && course.location && (
                    <div className="flex items-center text-purple-400">
                      <MapPin className="w-4 h-4 mr-1" />
                      {course.location}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No {filter === 'workshops' ? 'workshops' : 'courses'} available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;