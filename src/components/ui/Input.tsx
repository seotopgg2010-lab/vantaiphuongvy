import React, { forwardRef, InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#1F2522]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          aria-invalid={error ? true : undefined}
          className={`
            w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#1F2522] transition-colors
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brief-red focus:ring-2 focus:ring-offset-1
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-[#E21D25] focus:ring-[#E21D25]/20'
            }
            ${className}
          `}
          {...props}
        />
        {(error || helperText) && (
          <p
            id={error && inputId ? `${inputId}-error` : undefined}
            role={error ? 'alert' : undefined}
            className={`text-sm ${
              error ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
