import React from 'react';

export default function Card({
  children,
  title,
  className = '',
  footer,
  ...props
}) {
  return (
    <div
      className={`
        bg-gray-900 
        border border-gray-800 
        rounded-lg shadow-xl 
        overflow-hidden
        text-white
        ${className}
      `}
      {...props}
    >
      {title && (
        <div className="px-5 py-4 border-b border-gray-800 font-medium flex items-center">
          <div className="w-1 h-5 bg-[#00E676] rounded-full mr-3"></div>
          <span className="text-white">{title}</span>
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-4 bg-gray-800 border-t border-gray-800">
          {footer}
        </div>
      )}
    </div>
  );
} 