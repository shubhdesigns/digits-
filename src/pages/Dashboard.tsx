import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Trophy, Clock, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSupabase } from '../lib/supabaseClient';
import { useAuthStore } from '../store/authStore';

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
}

interface UserProgress {
  completedCourses: number;
  totalHoursLearned: number;
  currentStreak: number;
}

const Dashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedCourses: 0,
    totalHoursLearned: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = useSupabase();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*');

        if (coursesError) throw new Error('Failed to fetch courses');

        // Fetch user progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user?.id)
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          throw new Error('Failed to fetch user progress');
        }

        // Transform and set the data
        const transformedCourses = coursesData.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          progress: progressData?.progress?.[course.id] || 0,
        }));

        setCourses(transformedCourses);
        setUserProgress({
          completedCourses: progressData?.completed_courses || 0,
          totalHoursLearned: progressData?.total_hours || 0,
          currentStreak: progressData?.current_streak || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, supabase]);

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
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-400">
            Track your progress and continue your cybersecurity journey.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: <Trophy className="w-6 h-6 text-yellow-500" />,
              label: "Completed Courses",
              value: userProgress.completedCourses,
            },
            {
              icon: <Clock className="w-6 h-6 text-blue-500" />,
              label: "Hours Learned",
              value: userProgress.totalHoursLearned,
            },
            {
              icon: <Activity className="w-6 h-6 text-green-500" />,
              label: "Day Streak",
              value: userProgress.currentStreak,
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6"
            >
              <div className="flex items-center mb-2">
                {stat.icon}
                <span className="ml-2 text-gray-400">{stat.label}</span>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          ))}
        </motion.div>

        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Courses</h2>
            <Link
              to="/courses"
              className="text-blue-500 hover:text-blue-400 transition-colors flex items-center"
            >
              View All
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-slate-700/50 rounded-lg p-4"
              >
                <div className="flex items-center mb-4">
                  <Book className="w-5 h-5 text-blue-500" />
                  <h3 className="ml-2 font-semibold">{course.title}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-500">
                        {course.progress}% Complete
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-600">
                    <div
                      style={{ width: `${course.progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
                <Link
                  to={`/courses/${course.id}`}
                  className="mt-4 text-sm text-blue-500 hover:text-blue-400 transition-colors flex items-center"
                >
                  Continue Learning
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;