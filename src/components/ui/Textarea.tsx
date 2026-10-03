import React, { forwardRef, TextareaHTMLAttributes } from 'react';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, helperText, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[#1F2522]"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`
            w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#1F2522] transition-colors resize-y
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brief-red focus:ring-2 focus:ring-offset-1
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-[#E21D25] focus:ring-[#E21D25]/20'
            }
            ${className}
          `}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && textareaId ? `${textareaId}-error` : undefined}
          {...props}
        />
        {(error || helperText) && (
          <p
            id={error && textareaId ? `${textareaId}-error` : undefined}
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

Textarea.displayName = 'Textarea';
export { Textarea };
