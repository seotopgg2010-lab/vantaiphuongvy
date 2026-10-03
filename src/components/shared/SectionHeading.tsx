import React from 'react';

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionHeading = ({
  title,
  subtitle,
  centered = false,
}: SectionHeadingProps) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-[#1F2522] mb-4">
        {title}
      </h2>
      <div
        className={`h-1 w-20 bg-gradient-to-r from-[#AF8526] to-[#F1D478] rounded-full mb-4 ${
          centered ? 'mx-auto' : ''
        }`}
      />
      {subtitle && (
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};
