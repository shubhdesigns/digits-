import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiBook, FiAward, FiUsers } from 'react-icons/fi';
import ProgressBar from './ProgressBar';

interface Module {
  id: string;
  title: string;
  content: string;
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface Course {
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
  price: number;
  image_url: string;
  category: string;
  workshop_date?: string;
  workshop_location?: string;
  content?: {
    modules: Module[];
  };
  enrolled: number;
  progress?: number;
  totalModules?: number;
}

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  return (
    <motion.div
      className="card interactive group"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img
          src={course.image_url || '/course-placeholder.jpg'}
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-4 right-4">
          <span className="badge-primary">{course.level}</span>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        <p className="text-white/70 text-sm line-clamp-2">
          {course.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <FiClock className="text-primary" />
            {course.duration}
          </div>
          <div className="flex items-center gap-2">
            <FiBook className="text-primary" />
            {course.totalModules} modules
          </div>
          <div className="flex items-center gap-2">
            <FiAward className="text-primary" />
            {course.level}
          </div>
          <div className="flex items-center gap-2">
            <FiUsers className="text-primary" />
            {course.enrolled} enrolled
          </div>
        </div>
        
        {course.progress !== undefined && (
          <ProgressBar
            progress={course.progress}
            total={100}
            label="Progress"
          />
        )}
      </div>
    </motion.div>
  );
};

export default CourseCard; 