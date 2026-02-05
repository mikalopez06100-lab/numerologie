import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2 text-[#FAF7F2]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-[#FAF7F2] text-[#0D1B2A]
            border-2 border-transparent
            focus:outline-none focus:border-[#4F3AA2]
            transition-colors duration-200
            placeholder:text-gray-400
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          style={className.includes('glass-input') ? {} : undefined}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
