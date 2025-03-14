import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Shield } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
  };

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-2"
        >
          <Code2
            size={sizes[size].icon}
            className="text-white"
          />
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute -top-1 -right-1"
          >
            <Shield
              size={sizes[size].icon * 0.5}
              className="text-emerald-400 fill-emerald-400/20"
            />
          </motion.div>
        </motion.div>
      </div>
      
      {showText && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col"
        >
          <span className={`font-bold ${sizes[size].text} bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text`}>
            DIGITS
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-gray-400 -mt-1">
              Securing Digital Futures
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Logo;