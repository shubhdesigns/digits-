import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaClock, FaUserGraduate, FaBook, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSupabase } from '../lib/supabaseClient';
import type { Course } from '../components/CourseCard';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';
import Certificate from '../components/Certificate';

interface Progress {
  id: string;
  user_id: string;
  course_id: string;
  module_id: string;
  completed: boolean;
  quiz_score?: number;
  created_at: string;
  updated_at: string;
}

const CourseViewer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const supabase = useSupabase();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const [userName, setUserName] = useState<string>('');

  // Sound effects
  const playSound = (type: 'hover' | 'click') => {
    const audio = new Audio(`/${type}.mp3`);
    audio.volume = type === 'hover' ? 0.2 : 0.3;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: course, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (courseError) throw courseError;
        if (!course) throw new Error('Course not found');

        setCourse(course);

        // Fetch user's progress
        const { data: progress, error: progressError } = await supabase
          .from('progress')
          .select('*')
          .eq('course_id', courseId)
          .order('created_at', { ascending: true });

        if (progressError) throw progressError;
        setProgress(progress || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to load course content');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, supabase]);

  useEffect(() => {
    const getUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.full_name) {
          setUserName(profile.full_name);
        } else {
          setUserName(user.email);
        }
      }
    };

    getUserName();
  }, [supabase]);

  const handleModuleComplete = async () => {
    if (!course?.content?.modules[currentModuleIndex]) return;

    try {
      const moduleId = course.content.modules[currentModuleIndex].id;
      
      const { data, error } = await supabase
        .from('progress')
        .insert([{
          course_id: courseId,
          module_id: moduleId,
          completed: true,
          quiz_score: showQuiz ? calculateQuizScore() : null
        }])
        .select()
        .single();

      if (error) throw error;

      setProgress([...progress, data]);
      toast.success('Module completed!');

      // Check if all modules are completed
      const updatedProgress = [...progress, data];
      const allModulesCompleted = course.content.modules.every(module =>
        updatedProgress.some(p => p.module_id === module.id)
      );

      if (allModulesCompleted) {
        setShowCertificate(true);
      } else if (currentModuleIndex < (course.content?.modules.length || 0) - 1) {
        setCurrentModuleIndex(prev => prev + 1);
        setShowQuiz(false);
        setQuizAnswers([]);
      }
    } catch (err) {
      toast.error('Failed to save progress');
    }
  };

  const calculateQuizScore = () => {
    if (!course?.content?.modules[currentModuleIndex].quiz) return 0;
    
    const quiz = course.content.modules[currentModuleIndex].quiz;
    const correctAnswers = quiz.reduce((acc, q, idx) => {
      return acc + (quizAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);

    return Math.round((correctAnswers / quiz.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--space-bg)]">
        <div className="loading"></div>
        <div className="ml-4 terminal-text">LOADING COURSE DATA...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--space-bg)]">
        <div className="text-center p-8 rounded-lg glitch" title="ERROR">
          <h2 className="text-2xl font-bold text-red-500 mb-4 terminal-text">COURSE NOT FOUND</h2>
          <p className="text-[var(--terminal-green)]">{error}</p>
          <motion.button
            className="pixel-btn mt-4"
            onClick={() => navigate('/courses')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RETURN TO COURSES
          </motion.button>
        </div>
      </div>
    );
  }

  const currentModule = course.content?.modules[currentModuleIndex];
  const isModuleCompleted = progress.some(p => p.module_id === currentModule?.id);

  return (
    <div className="min-h-screen bg-[var(--space-bg)] text-white">
      <div className="stars" />
      <div className="scanline" />

      {/* Course Header */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={course.image_url}
          alt={course.title}
          className="w-full h-full object-cover"
          style={{ imageRendering: 'pixelated' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 className="text-4xl font-bold mb-4 terminal-text glitch" title={course.title}>
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[var(--terminal-green)]">
              <div className="flex items-center gap-2">
                <FaClock className="text-[var(--primary)]" />
                {course.duration}
              </div>
              <div className="flex items-center gap-2">
                <FaUserGraduate className="text-[var(--primary)]" />
                {course.level}
              </div>
              <div className="flex items-center gap-2">
                <FaBook className="text-[var(--primary)]" />
                {course.content?.modules.length || 0} Modules
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Module Navigation */}
          <div className="md:col-span-1">
            <div className="retro-card p-4 sticky top-4">
              <h3 className="text-lg font-bold mb-4 terminal-text">MODULES</h3>
              <div className="space-y-2">
                {course.content?.modules.map((module, index) => {
                  const isCompleted = progress.some(p => p.module_id === module.id);
                  const isCurrent = index === currentModuleIndex;

                  return (
                    <motion.button
                      key={module.id}
                      className={`w-full text-left p-2 pixel-border ${
                        isCurrent ? 'bg-[var(--terminal-green)] text-black' :
                        isCompleted ? 'text-[var(--terminal-green)]' : 'text-white'
                      }`}
                      onClick={() => {
                        playSound('click');
                        setCurrentModuleIndex(index);
                        setShowQuiz(false);
                        setQuizAnswers([]);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <FaStar className={isCurrent ? 'text-black' : 'text-[var(--primary)]'} />
                        <span className="text-sm truncate">{module.title}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Module Content */}
          <div className="md:col-span-3">
            <motion.div
              key={currentModuleIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="retro-card p-8"
            >
              {!showQuiz ? (
                <>
                  <ReactMarkdown
                    className="prose prose-invert max-w-none"
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {currentModule?.content || ''}
                  </ReactMarkdown>

                  {currentModule?.quiz && !isModuleCompleted && (
                    <motion.button
                      className="pixel-btn mt-8"
                      onClick={() => {
                        playSound('click');
                        setShowQuiz(true);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Take Quiz
                    </motion.button>
                  )}
                </>
              ) : (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold terminal-text mb-6">Module Quiz</h3>
                  {currentModule?.quiz.map((question, index) => (
                    <div key={index} className="space-y-4">
                      <p className="text-lg text-[var(--terminal-green)]">{question.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question.options.map((option, optionIndex) => (
                          <motion.button
                            key={optionIndex}
                            className={`p-4 pixel-border text-left ${
                              quizAnswers[index] === optionIndex
                                ? 'bg-[var(--terminal-green)] text-black'
                                : ''
                            }`}
                            onClick={() => {
                              playSound('click');
                              const newAnswers = [...quizAnswers];
                              newAnswers[index] = optionIndex;
                              setQuizAnswers(newAnswers);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <motion.button
                  className="pixel-btn"
                  onClick={() => {
                    playSound('click');
                    if (currentModuleIndex > 0) {
                      setCurrentModuleIndex(prev => prev - 1);
                      setShowQuiz(false);
                      setQuizAnswers([]);
                    }
                  }}
                  disabled={currentModuleIndex === 0}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaChevronLeft className="mr-2" />
                  Previous
                </motion.button>

                {!isModuleCompleted && (
                  <motion.button
                    className="pixel-btn"
                    onClick={() => {
                      playSound('click');
                      if (currentModule?.quiz && !showQuiz) {
                        setShowQuiz(true);
                      } else {
                        handleModuleComplete();
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showQuiz ? (
                      <>
                        Submit Quiz
                        <FaRocket className="ml-2" />
                      </>
                    ) : (
                      <>
                        Complete Module
                        <FaChevronRight className="ml-2" />
                      </>
                    )}
                  </motion.button>
                )}

                {currentModuleIndex < (course.content?.modules.length || 0) - 1 && (
                  <motion.button
                    className="pixel-btn"
                    onClick={() => {
                      playSound('click');
                      setCurrentModuleIndex(prev => prev + 1);
                      setShowQuiz(false);
                      setQuizAnswers([]);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                    <FaChevronRight className="ml-2" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {showCertificate && (
        <Certificate
          userName={userName}
          courseName={course?.title || ''}
          completionDate={new Date()}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};

export default CourseViewer; 