import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: number;
  progress?: number;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  level,
  duration,
  modules,
  progress,
  className = '',
}) => {
  const isCompleted = progress === 100;
  const isStarted = progress !== undefined && progress > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden transition-all duration-300 ${className}`}
    >
      <Link to={`/course/${id}`} className="block p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-400" />
          </div>
          <span className={`text-sm px-3 py-1 rounded-full ${
            isCompleted 
              ? 'bg-green-500/20 text-green-400'
              : 'bg-blue-500/20 text-blue-400'
          }`}>
            {level}
          </span>
        </div>

        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-400 mb-4 text-sm line-clamp-2">{description}</p>

        {progress !== undefined && (
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-400">
                {isCompleted ? 'Completed' : `${progress}% complete`}
              </span>
              {isCompleted && (
                <span className="text-green-400 flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  Certificate
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-gray-400">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {duration}
          </span>
          <span className="flex items-center">
            {modules} modules
            <ChevronRight className="w-4 h-4 ml-1" />
          </span>
        </div>

        {!isStarted && (
          <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center">
            Start Learning
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </Link>
    </motion.div>
  );
};

export default CourseCard; 