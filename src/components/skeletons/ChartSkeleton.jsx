import React from 'react';

export default function ChartSkeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-800/50 border border-gray-700 rounded-lg p-4 ${className}`}>
      {/* Placeholder for chart area */}
      <div className="h-64 bg-gray-700 rounded w-full"></div> 
    </div>
  );
} 