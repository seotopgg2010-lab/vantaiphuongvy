import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import Link from 'next/link';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cta' | 'secondary' | 'ghost' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      href,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'ui-button inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const variantStyles = {
      primary:
        'bg-[#E21D25] text-white hover:bg-[#C6161D] focus:ring-[#E21D25]',
      cta:
        'bg-gradient-to-r from-[#CB120F] to-[#a30e0c] text-white hover:brightness-110 shadow-sm focus:ring-[#CB120F]',
      secondary:
        'border-2 border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white focus:ring-stone-800',
      ghost:
        'bg-transparent text-[#E21D25] hover:bg-[#E21D25]/10 focus:ring-[#E21D25]',
      outline:
        'border-2 border-[#E21D25] text-[#E21D25] hover:bg-[#E21D25] hover:text-white focus:ring-[#E21D25]',
      gradient:
        'bg-gradient-to-r from-[#E21D25] to-[#C6161D] text-white hover:brightness-110 shadow-sm focus:ring-[#E21D25]',
    };

    const disabledStyles = disabled
      ? 'opacity-50 pointer-events-none cursor-not-allowed'
      : 'hover:-translate-y-0.5 active:translate-y-0';

    const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${className}`;

    const content = (
      <>
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </>
    );

    if (href) {
      return (
        <Link href={href} className={classes} aria-disabled={disabled}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} disabled={disabled} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
