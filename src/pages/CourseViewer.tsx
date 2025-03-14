import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, Book, Award } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSupabase } from '../lib/supabaseClient';
import { useAuthStore } from '../store/authStore';

interface Module {
  id: string;
  title: string;
  order_index: number;
  content: string;
  quiz: {
    questions: {
      id: number;
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  total_modules: number;
}

const CourseViewer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [userProgress, setUserProgress] = useState<{
    completed_modules: string[];
    quiz_scores: Record<string, number>;
    completion_percentage: number;
  }>({
    completed_modules: [],
    quiz_scores: {},
    completion_percentage: 0,
  });
  const [quizMode, setQuizMode] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useSupabase();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (courseError) throw new Error('Failed to fetch course');

        // Fetch modules
        const { data: modulesData, error: modulesError } = await supabase
          .from('modules')
          .select('*')
          .eq('course_id', courseId)
          .order('order_index');

        if (modulesError) throw new Error('Failed to fetch modules');

        // Fetch user progress if logged in
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .single();

          if (!progressError && progressData) {
            setUserProgress({
              completed_modules: progressData.completed_modules || [],
              quiz_scores: progressData.quiz_scores || {},
              completion_percentage: progressData.completion_percentage || 0,
            });
          }
        }

        setCourse(courseData);
        setModules(modulesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, supabase, user]);

  const updateProgress = async (moduleId: string, quizScore?: number) => {
    if (!user) return;

    try {
      const newCompletedModules = [...userProgress.completed_modules];
      if (!newCompletedModules.includes(moduleId)) {
        newCompletedModules.push(moduleId);
      }

      const newQuizScores = {
        ...userProgress.quiz_scores,
        ...(quizScore !== undefined && { [moduleId]: quizScore }),
      };

      const completion_percentage = Math.round(
        (newCompletedModules.length / modules.length) * 100
      );

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          completed_modules: newCompletedModules,
          quiz_scores: newQuizScores,
          completion_percentage,
          last_accessed: new Date().toISOString(),
        });

      if (error) throw error;

      setUserProgress({
        completed_modules: newCompletedModules,
        quiz_scores: newQuizScores,
        completion_percentage,
      });

      // Update user stats if course is completed
      if (completion_percentage === 100) {
        const { error: statsError } = await supabase
          .from('user_stats')
          .upsert({
            user_id: user.id,
            completed_courses: 1,
            total_hours: 1,
            current_streak: 1,
            last_activity_date: new Date().toISOString().split('T')[0],
          });

        if (statsError) throw statsError;
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleQuizSubmit = () => {
    if (!modules[currentModuleIndex]?.quiz) return;

    const questions = modules[currentModuleIndex].quiz.questions;
    const correctAnswers = questions.reduce((count, q, index) => {
      return count + (selectedAnswers[index] === q.correctAnswer ? 1 : 0);
    }, 0);

    const score = Math.round((correctAnswers / questions.length) * 100);
    updateProgress(modules[currentModuleIndex].id, score);
    setQuizSubmitted(true);
  };

  const nextModule = () => {
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setQuizMode(false);
      setSelectedAnswers([]);
      setQuizSubmitted(false);
    }
  };

  const prevModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setQuizMode(false);
      setSelectedAnswers([]);
      setQuizSubmitted(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course || !modules.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Course</h2>
          <p className="text-gray-400">{error || 'Course not found'}</p>
        </div>
      </div>
    );
  }

  const currentModule = modules[currentModuleIndex];

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <div className="flex items-center text-gray-400 gap-4">
            <span className="flex items-center">
              <Book className="w-4 h-4 mr-1" />
              {course.level}
            </span>
            <span>•</span>
            <span>{course.duration}</span>
            <span>•</span>
            <span className="flex items-center">
              <Award className="w-4 h-4 mr-1" />
              {userProgress.completion_percentage}% Complete
            </span>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={prevModule}
              disabled={currentModuleIndex === 0}
              className={`flex items-center ${
                currentModuleIndex === 0
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-blue-500 hover:text-blue-400'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Previous
            </button>
            <span className="text-gray-400">
              Module {currentModuleIndex + 1} of {modules.length}
            </span>
            <button
              onClick={nextModule}
              disabled={currentModuleIndex === modules.length - 1}
              className={`flex items-center ${
                currentModuleIndex === modules.length - 1
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-blue-500 hover:text-blue-400'
              }`}
            >
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>

        {/* Module Content */}
        <motion.div
          key={currentModule.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">{currentModule.title}</h2>
          {!quizMode ? (
            <>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{currentModule.content}</ReactMarkdown>
              </div>
              {currentModule.quiz && (
                <button
                  onClick={() => setQuizMode(true)}
                  className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                >
                  Take Quiz
                </button>
              )}
            </>
          ) : (
            <div className="space-y-8">
              {currentModule.quiz.questions.map((question, qIndex) => (
                <div key={question.id} className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    {qIndex + 1}. {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        onClick={() => {
                          if (!quizSubmitted) {
                            const newAnswers = [...selectedAnswers];
                            newAnswers[qIndex] = oIndex;
                            setSelectedAnswers(newAnswers);
                          }
                        }}
                        className={`w-full p-4 rounded-lg text-left transition-colors ${
                          selectedAnswers[qIndex] === oIndex
                            ? quizSubmitted
                              ? oIndex === question.correctAnswer
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                              : 'bg-blue-500/20 text-blue-400'
                            : 'bg-slate-700/50 hover:bg-slate-700'
                        }`}
                        disabled={quizSubmitted}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={selectedAnswers.length !== currentModule.quiz.questions.length}
                  className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={nextModule}
                  className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors flex items-center"
                >
                  Continue to Next Module
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Module Progress */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Course Progress</span>
            <span className="text-sm text-blue-500">
              {userProgress.completion_percentage}%
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${userProgress.completion_percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer; 