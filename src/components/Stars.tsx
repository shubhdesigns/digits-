import React, { useEffect, useRef } from 'react';

const Stars: React.FC = () => {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createStar = () => {
      if (!starsRef.current) return;

      const star = document.createElement('div');
      star.className = 'star';
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      
      // Random duration between 3-7 seconds
      const duration = 3 + Math.random() * 4;
      star.style.setProperty('--duration', `${duration}s`);
      
      starsRef.current.appendChild(star);

      // Remove star after animation
      setTimeout(() => {
        if (star.parentNode === starsRef.current) {
          starsRef.current.removeChild(star);
        }
      }, duration * 1000);
    };

    // Create initial stars
    for (let i = 0; i < 50; i++) {
      setTimeout(createStar, Math.random() * 3000);
    }

    // Continue creating stars
    const interval = setInterval(createStar, 300);

    return () => {
      clearInterval(interval);
      if (starsRef.current) {
        starsRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={starsRef} className="stars" />;
};

export default Stars; 