import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="card animate-pulse">
      <div className="relative">
        <div className="h-48 bg-secondary/50 rounded-t-lg" />
        <div className="absolute top-4 right-4">
          <div className="w-16 h-6 bg-secondary/70 rounded-full" />
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-secondary/70 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-secondary/50 rounded w-full" />
          <div className="h-4 bg-secondary/50 rounded w-5/6" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 bg-secondary/70 rounded w-1/4" />
          <div className="h-8 bg-secondary/70 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard; 