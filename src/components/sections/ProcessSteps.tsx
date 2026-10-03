'use client';

import { Headphones, PenTool, PackageCheck, Plane, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Dictionary } from '@/app/[lang]/dictionaries';

const processSteps = [
  {
    step: 1,
    title: 'Tư vấn',
    desc: 'Lắng nghe nhu cầu và tư vấn giải pháp tối ưu chi phí',
    icon: Headphones,
    color: '#E21D25'
  },
  {
    step: 2,
    title: 'Thiết kế & sản xuất',
    desc: 'Thiết kế sáng tạo, sản xuất trực tiếp tại xưởng chất lượng cao',
    icon: PenTool,
    color: '#AF8526'
  },
  {
    step: 3,
    title: 'Đóng gói',
    desc: 'Đóng thùng gỗ cẩn thận, chèn xốp chống sốc đúng tiêu chuẩn xuất khẩu',
    icon: PackageCheck,
    color: '#E21D25'
  },
  {
    step: 4,
    title: 'Vận chuyển',
    desc: 'Vận chuyển quốc tế đường bay/đường biển an toàn, đúng hẹn',
    icon: Plane,
    color: '#CB120F'
  },
  {
    step: 5,
    title: 'Nhận hàng',
    desc: 'Giao hàng tận nơi door-to-door, kiểm tra và hỗ trợ chu đáo',
    icon: CheckCircle2,
    color: '#E21D25'
  }
];

export function ProcessSteps({}: { dict: Dictionary }) {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#E21D25]/10 text-[#E21D25] font-semibold text-xs uppercase tracking-wider mb-3">
            Quy trình làm việc
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1F2522] mb-3">
            5 Bước Triển Khai Chuyên Nghiệp & Minh Bạch
          </h2>
          <div className="h-1 w-20 bg-[#DDBB56] mx-auto mb-4 rounded-full" />
          <p className="text-gray-600 max-w-2xl mx-auto text-base">
            Quy trình đồng bộ khép kín giúp tiết kiệm tối đa chi phí và thời gian của anh/chị tại nước ngoài.
          </p>
        </div>

        {/* 5 Steps horizontal row with arrows matching image7.png */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {processSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative group">
                <div className="p-6 bg-[#FAF8F1] rounded-2xl border border-gray-200/80 hover:border-[#DDBB56] hover:bg-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center text-center">
                  {/* Step Number Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#DDBB56] text-[#E21D25] flex items-center justify-center mb-4 shadow-md group-hover:bg-[#E21D25] group-hover:border-[#E21D25] group-hover:text-white group-hover:scale-110 transition-all duration-300 relative">
                    <Icon className="w-7 h-7" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#CB120F] text-white text-xs font-extrabold flex items-center justify-center shadow">
                      {item.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#1F2522] mb-2 group-hover:text-[#E21D25] transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Arrow Connector on Desktop */}
                {idx < processSteps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-gray-200 items-center justify-center text-[#E21D25] shadow-sm">
                    <ArrowRight className="w-4 h-4" />
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
