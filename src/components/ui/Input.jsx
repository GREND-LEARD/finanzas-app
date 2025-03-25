import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-gray-200 mb-1"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={id || name}
        name={name}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          ${error ? 'border-red-500' : 'border-gray-600'}
          bg-gray-700 text-white placeholder-gray-400
          focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500
          ${className}
        `}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 