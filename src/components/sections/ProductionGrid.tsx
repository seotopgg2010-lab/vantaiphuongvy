import Link from 'next/link';
import { Armchair, LayoutPanelTop, Printer, Frame, Wrench, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/shared/SectionHeading';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { localizedPath } from '@/lib/site';

const categories = [
  {
    title: 'Nội thất theo Concept',
    icon: Armchair,
    slug: 'noi-that-theo-concept',
    desc: 'Bàn ghế tiệm nail, quầy lễ tân reception, kệ trưng bày sơn và mỹ phẩm theo bản vẽ.',
    badge: 'Concept Salon'
  },
  {
    title: 'Bảng hiệu & Nhận diện',
    icon: LayoutPanelTop,
    slug: 'bang-hieu-nhan-dien',
    desc: 'Signage mặt tiền, logo 3D nổi gắn đèn LED, hộp đèn tròn, decal dán kính chống chói.',
    badge: 'Chống chịu thời tiết'
  },
  {
    title: 'Ấn phẩm & Bao bì',
    icon: Printer,
    slug: 'an-pham-bao-bi',
    desc: 'Menu bảng giá, gift card ép kim, loyalty card, túi giấy kraft in logo, sticker cuộn.',
    badge: 'Chuẩn quy cách Mỹ'
  },
  {
    title: 'Decor & Trưng bày',
    icon: Frame,
    slug: 'decor-trung-bay',
    desc: 'Tranh canvas nghệ thuật, vách lam gỗ trang trí, backdrop check-in tạo điểm nhấn.',
    badge: 'Thẩm mỹ cao'
  },
  {
    title: 'Thiết bị & Vật dụng',
    icon: Wrench,
    slug: 'thiet-bi-vat-dung',
    desc: 'Cung ứng máy móc, dụng cụ chuyên ngành nail & spa đạt chứng chỉ an toàn.',
    badge: 'Sourcing trọn gói'
  }
];

export function ProductionGrid({ lang, dict }: { lang: string; dict: Dictionary }) {
  return (
    <section className="py-20 bg-[#FAF8F1]">
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionHeading 
          title={dict.production.sectionTitle}
          subtitle={dict.production.sectionLabel}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                href={localizedPath(lang, `/san-xuat-cung-ung/${cat.slug}`)}
                className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-[#DDBB56] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#E21D25]/10 text-[#E21D25] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#E21D25] group-hover:text-white transition-all duration-300 shadow-inner">
                      <Icon size={28} />
                    </div>
                    <span className="text-[11px] font-bold text-[#AF8526] bg-[#DDBB56]/15 px-3 py-1 rounded-full uppercase tracking-wider">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#1F2522] mb-3 group-hover:text-[#E21D25] transition-colors">
                    {cat.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {cat.desc}
                  </p>
                </div>

                <div className="text-[#E21D25] text-xs font-bold uppercase tracking-wider flex items-center pt-4 border-t border-gray-100 group-hover:text-[#AF8526] transition-colors">
                  <span>{dict.common.viewDetails}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
