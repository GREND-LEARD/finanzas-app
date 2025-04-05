import React from 'react';

export default function StatsCardSkeleton() {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 shadow-lg animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 bg-gray-700 rounded w-1/4"></div> {/* Placeholder for title */}
        <div className="h-6 w-6 bg-gray-700 rounded-full"></div> {/* Placeholder for icon */}
      </div>
      <div className="h-8 bg-gray-700 rounded w-1/2 mb-3"></div> {/* Placeholder for value */}
      <div className="h-3 bg-gray-700 rounded w-1/3"></div> {/* Placeholder for percent change */}
    </div>
  );
} 