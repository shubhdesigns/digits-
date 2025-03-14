import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, ChevronRight, ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useCourseStore } from '../store/courseStore';
import { useAuthStore } from '../store/authStore';

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Module {
  id: string;
  title: string;
  content: string;
  quiz: Quiz[];
}

const Course = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { courses, userProgress, loading, error, fetchCourses, updateProgress, enrollInCourse } = useCourseStore();

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (!courses.length) {
      fetchCourses();
    }
  }, [courses.length, fetchCourses]);

  const course = courses.find(c => c.id === id);
  const modules = course?.content?.modules || [];
  const currentModule = modules[currentModuleIndex];
  const progress = userProgress[id!] || 0;
  const isEnrolled = progress > 0;

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await enrollInCourse(id!);
    setCurrentModuleIndex(0);
  };

  const handleModuleComplete = async () => {
    const newProgress = Math.round(((currentModuleIndex + 1) / modules.length) * 100);
    await updateProgress(id!, newProgress);
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1);
    }
    setShowQuiz(false);
    setSelectedAnswers([]);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    const score = currentModule.quiz.reduce((acc, q, idx) => {
      return acc + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
    setQuizScore((score / currentModule.quiz.length) * 100);
    setQuizSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-red-500">Error loading course: {error || 'Course not found'}</div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/courses')}
              className="text-gray-400 hover:text-white flex items-center"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Courses
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-400">{course.description}</p>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {course.duration}
              </span>
              <span className="text-gray-400 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                {modules.length} Modules
              </span>
              {progress === 100 && (
                <span className="text-green-400 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Completed
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Module Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
                <h3 className="text-lg font-semibold mb-4">Course Modules</h3>
                <div className="space-y-2">
                  {modules.map((module, index) => {
                    const moduleProgress = (index / modules.length) * 100;
                    const isComplete = progress >= moduleProgress;
                    const isCurrent = index === currentModuleIndex;

                    return (
                      <button
                        key={module.id}
                        onClick={() => isEnrolled && setCurrentModuleIndex(index)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isCurrent
                            ? 'bg-blue-500/20 text-blue-400'
                            : isComplete
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-700/50 text-gray-400'
                        } ${!isEnrolled && 'opacity-50 cursor-not-allowed'}`}
                        disabled={!isEnrolled}
                      >
                        <div className="flex items-center justify-between">
                          <span className="line-clamp-1">{module.title}</span>
                          {isComplete && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {!isEnrolled && (
                  <button
                    onClick={handleEnroll}
                    className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center"
                  >
                    Start Course
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            </div>

            {/* Module Content */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                {!isEnrolled ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">Enroll to Start Learning</h3>
                    <p className="text-gray-400 mb-6">
                      Join this course to access all modules and track your progress
                    </p>
                    <button
                      onClick={handleEnroll}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                    >
                      Start Learning
                    </button>
                  </div>
                ) : showQuiz ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Module Quiz</h2>
                    <div className="space-y-6">
                      {currentModule.quiz.map((q, qIndex) => (
                        <div key={qIndex} className="bg-slate-700/50 rounded-lg p-4">
                          <p className="font-semibold mb-4">{q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((option, oIndex) => (
                              <button
                                key={oIndex}
                                onClick={() => {
                                  if (!quizSubmitted) {
                                    const newAnswers = [...selectedAnswers];
                                    newAnswers[qIndex] = oIndex;
                                    setSelectedAnswers(newAnswers);
                                  }
                                }}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${
                                  quizSubmitted
                                    ? oIndex === q.correctAnswer
                                      ? 'bg-green-500/20 text-green-400'
                                      : selectedAnswers[qIndex] === oIndex
                                      ? 'bg-red-500/20 text-red-400'
                                      : 'bg-slate-600/50 text-gray-400'
                                    : selectedAnswers[qIndex] === oIndex
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-slate-600/50 text-gray-400 hover:bg-slate-500/50'
                                }`}
                                disabled={quizSubmitted}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{option}</span>
                                  {quizSubmitted && (
                                    oIndex === q.correctAnswer ? (
                                      <CheckCircle className="w-4 h-4 text-green-400" />
                                    ) : selectedAnswers[qIndex] === oIndex ? (
                                      <XCircle className="w-4 h-4 text-red-400" />
                                    ) : null
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {!quizSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={selectedAnswers.length !== currentModule.quiz.length}
                        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      <div className="mt-6">
                        <div className={`text-lg font-semibold mb-4 ${
                          quizScore >= 70 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          Quiz Score: {quizScore}%
                        </div>
                        {quizScore >= 70 ? (
                          <button
                            onClick={handleModuleComplete}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
                          >
                            Continue to Next Module
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setQuizSubmitted(false);
                              setSelectedAnswers([]);
                            }}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
                          >
                            Retry Quiz
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">{currentModule.title}</h2>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{currentModule.content}</ReactMarkdown>
                    </div>
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                    >
                      Take Module Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Course; 