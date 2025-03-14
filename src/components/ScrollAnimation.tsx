import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Lock, Brain } from 'lucide-react';

const ScrollAnimation = () => {
  const { scrollYProgress } = useScroll();
  
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  
  const iconRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const iconScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5]);

  return (
    <motion.div 
      className="fixed top-1/2 right-10 -translate-y-1/2 z-10"
      style={{ scale, opacity, y }}
    >
      <div className="flex flex-col items-center gap-8">
        <motion.div style={{ rotate: iconRotate, scale: iconScale }}>
          <Shield className="w-12 h-12 text-white" />
        </motion.div>
        <motion.div style={{ rotate: iconRotate, scale: iconScale }}>
          <Lock className="w-12 h-12 text-gray-300" />
        </motion.div>
        <motion.div style={{ rotate: iconRotate, scale: iconScale }}>
          <Brain className="w-12 h-12 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScrollAnimation;