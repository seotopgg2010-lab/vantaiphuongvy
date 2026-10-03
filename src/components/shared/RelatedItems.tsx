import React, { ReactNode } from 'react';

export interface RelatedItemsProps {
  title: string;
  children: ReactNode;
}

export const RelatedItems = ({ title, children }: RelatedItemsProps) => {
  return (
    <section className="py-8 w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 bg-[#E21D25] rounded-full" />
        <h2 className="text-2xl font-bold text-[#1F2522]">{title}</h2>
      </div>
      
      {/* Mobile: horizontal scroll, Desktop: grid */}
      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
        {React.Children.map(children, (child) => (
          <div className="w-[85vw] flex-none md:w-auto md:flex-initial">
            {child}
          </div>
        ))}
      </div>
    </section>
  );
};
