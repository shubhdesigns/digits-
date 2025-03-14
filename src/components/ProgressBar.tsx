import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  total: number;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, total, label }) => {
  const percentage = Math.round((progress / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-white/70">
        {label && <span>{label}</span>}
        <span>{percentage}%</span>
      </div>
      <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar; 