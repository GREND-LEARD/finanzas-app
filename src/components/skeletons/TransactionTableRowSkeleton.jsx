import React from 'react';

export default function TransactionTableRowSkeleton({ columns = 5 }) {
  // columns: Number of columns to match the actual table
  return (
    <tr className="border-b border-gray-700 animate-pulse">
      {[...Array(columns)].map((_, index) => (
        <td key={index} className="py-3 px-4 text-sm text-gray-400">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </td>
      ))}
      {/* Placeholder for actions column */}
      <td className="py-3 px-4 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 bg-gray-700 rounded"></div>
          <div className="h-5 w-5 bg-gray-700 rounded"></div>
        </div>
      </td>
    </tr>
  );
} 