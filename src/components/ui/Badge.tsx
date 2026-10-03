import React, { ReactNode } from 'react';

export interface BadgeProps {
  variant?: 'default' | 'green' | 'gold' | 'red';
  children: ReactNode;
  className?: string;
}

export const Badge = ({
  variant = 'default',
  children,
  className = '',
}: BadgeProps) => {
  const baseStyles = 'ui-badge inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
  
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    green: 'bg-[#E21D25]/10 text-[#E21D25]',
    gold: 'bg-[#AF8526]/10 text-[#AF8526]',
    red: 'bg-[#CB120F]/10 text-[#CB120F]',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
