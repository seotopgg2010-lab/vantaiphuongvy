'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <div 
            key={index} 
            className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
            >
              <h3 className="text-lg font-bold text-[#1F2522]">{item.question}</h3>
              <div className={`p-2 rounded-full ${isActive ? 'bg-[#FAF8F1] text-[#E21D25]' : 'bg-transparent text-gray-400'}`}>
                {isActive ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
