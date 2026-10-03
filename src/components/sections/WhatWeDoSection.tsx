import { Lightbulb, Palette, Factory, Plane, ArrowRight, ArrowDown } from 'lucide-react';

const steps = [
  {
    icon: Lightbulb,
    title: 'CONCEPT',
    desc: 'Tư vấn & Lên ý tưởng',
  },
  {
    icon: Palette,
    title: 'DESIGN',
    desc: 'Thiết kế chuyên nghiệp',
  },
  {
    icon: Factory,
    title: 'PRODUCTION & SUPPLY',
    desc: 'Sản xuất & Cung ứng',
  },
  {
    icon: Plane,
    title: 'INTERNATIONAL SHIPPING',
    desc: 'Vận chuyển quốc tế',
  },
];

export function WhatWeDoSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#1F2522]">
          Hamburg Connect làm gì?
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-8 md:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <div className="flex flex-col items-center text-center max-w-[200px]">
                  <div className="w-20 h-20 rounded-full bg-[#FAF8F1] border-2 border-[#DDBB56] flex items-center justify-center mb-4 text-[#E21D25] shadow-sm">
                    <Icon size={36} />
                  </div>
                  <h3 className="font-bold text-lg text-[#1F2522] mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="text-[#AF8526] flex-shrink-0 mt-4 md:mt-[-40px]">
                    <ArrowRight className="hidden md:block w-8 h-8" />
                    <ArrowDown className="block md:hidden w-8 h-8" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
