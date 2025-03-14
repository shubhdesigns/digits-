import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaUserGraduate, FaRocket, FaMapMarkerAlt, FaBook, FaStar } from 'react-icons/fa';
import type { Course } from './CourseCard';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
}

const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onEnroll }) => {
  if (!course) return null;

  const playSound = (type: 'hover' | 'click') => {
    const audio = new Audio(`/${type}.mp3`);
    audio.volume = type === 'hover' ? 0.2 : 0.3;
    audio.play().catch(() => {});
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal"
        onClick={() => {
          playSound('click');
          onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="modal-content"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative">
            <motion.img
              src={course.image_url || '/default-course.jpg'}
              alt={course.title}
              className="w-full h-64 object-cover rounded-t-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                playSound('click');
                onClose();
              }}
              onMouseEnter={() => playSound('hover')}
              className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center text-white/80 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
            <div className="absolute bottom-4 left-4 right-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-2">
                  {course.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className="badge">
                    {course.level}
                  </span>
                  {course.category && (
                    <span className="badge badge-primary">
                      {course.category}
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <motion.p 
              className="text-white/80 text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {course.description}
            </motion.p>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="card p-4">
                <div className="flex items-center gap-2 text-white/60 mb-2">
                  <FaClock className="text-primary" />
                  Duration
                </div>
                <div className="text-xl font-semibold">{course.duration}</div>
              </div>
              <div className="card p-4">
                <div className="flex items-center gap-2 text-white/60 mb-2">
                  <FaUserGraduate className="text-primary" />
                  Level
                </div>
                <div className="text-xl font-semibold">{course.level}</div>
              </div>
            </motion.div>

            {course.content?.modules && (
              <motion.div
                className="card p-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaBook className="text-primary" />
                  Course Modules
                </h3>
                <div className="space-y-4">
                  {course.content.modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      className="bg-secondary/50 rounded-lg p-4"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FaStar className="text-primary" />
                        <h4 className="text-lg font-semibold">
                          {module.title}
                        </h4>
                      </div>
                      {module.quiz && (
                        <div className="text-sm text-white/60">
                          {module.quiz.length} Quiz Questions
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {course.is_workshop && (
              <motion.div
                className="card p-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaRocket className="text-primary" />
                  Workshop Details
                </h3>
                {course.workshop_date && (
                  <div className="flex items-center gap-2 text-white/60 mb-2">
                    <FaClock className="text-primary" />
                    Date: {new Date(course.workshop_date).toLocaleDateString()}
                  </div>
                )}
                {course.workshop_location && (
                  <div className="flex items-center gap-2 text-white/60">
                    <FaMapMarkerAlt className="text-primary" />
                    Location: {course.workshop_location}
                  </div>
                )}
              </motion.div>
            )}

            <motion.div
              className="mt-8 flex justify-between items-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="text-3xl font-bold">
                ${course.price}
              </span>
              <motion.button
                className="btn btn-primary"
                onClick={() => {
                  playSound('click');
                  onEnroll(course.id);
                }}
                onMouseEnter={() => playSound('hover')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaRocket className="text-sm" />
                Enroll Now
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CourseModal; 