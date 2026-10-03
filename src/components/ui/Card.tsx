import React, { ReactNode } from 'react';
import Link from 'next/link';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string;
  hoverEffect?: boolean;
}

export const Card = ({
  className = '',
  children,
  href,
  hoverEffect = false,
  ...props
}: CardProps) => {
  const baseClasses = `bg-white rounded-xl shadow-sm overflow-hidden ${className}`;
  const hoverClasses =
    href || hoverEffect
      ? 'transition-all duration-300 hover:shadow-md hover:-translate-y-0.5'
      : '';

  const classes = `${baseClasses} ${hoverClasses}`;

  if (href) {
    return (
      <Link href={href} className={`block ${classes}`}>
        {children}
      </Link>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export const CardImage = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`relative w-full aspect-[4/3] overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardContent = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => <div className={`p-5 ${className}`}>{children}</div>;

export const CardTitle = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => <h3 className={`text-lg font-bold text-[#1F2522] mb-2 ${className}`}>{children}</h3>;

export const CardDescription = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => <p className={`text-sm text-gray-600 line-clamp-2 ${className}`}>{children}</p>;
