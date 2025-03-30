import React from 'react';

const variants = {
  primary: 'bg-[#00E676] text-gray-900 hover:bg-[#69F0AE] font-medium',
  secondary: 'bg-gray-700 text-white hover:bg-gray-600',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  danger: 'bg-red-600 text-white hover:bg-red-500',
  warning: 'bg-yellow-600 text-white hover:bg-yellow-500',
  outline: 'bg-transparent border border-[#00E676] text-[#00E676] hover:bg-gray-800',
  dark: 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700',
  text: 'bg-transparent text-gray-300 hover:text-white',
};

const sizes = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-4 text-base',
  lg: 'py-3 px-6 text-lg',
};

export default function Button({
  children,
  type = 'button',
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  leftIcon = null,
  onClick,
  ...props
}) {
  const buttonProps = { ...props };

  return (
    <button
      type={type}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-md font-medium transition-all
        focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:ring-opacity-50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...buttonProps}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Cargando...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
        </div>
      )}
    </button>
  );
} 