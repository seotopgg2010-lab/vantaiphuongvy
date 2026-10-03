'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { localizedPath } from '@/lib/site';

const solutions = [
  {
    title: 'Nail Salon',
    desc: 'Bảng hiệu storefront chữ nổi LED, logo reception, quầy bàn ghế, menu bảng giá, gift card, loyalty card & nội thất đồng bộ chuẩn thị trường Mỹ.',
    image: '/images/solutions/sol_nail_spa.jpg',
    href: '/giai-phap-tron-goi/nail-salon',
    badge: 'Chuyên biệt tại Mỹ',
    tagline: 'Concept tổng thể → Sản xuất thi công → Vận chuyển tận nơi'
  },
  {
    title: 'Spa & Beauty',
    desc: 'Setup nhận diện không gian Spa & Thẩm mỹ viện sang trọng: Logo wall vách lễ tân, menu dịch vụ chống nước, appointment card, đồng phục và túi quà tặng.',
    image: '/images/products/prod_bo_an_pham.jpg',
    href: '/giai-phap-tron-goi/spa-beauty',
    badge: 'Thư Giãn & Cao Cấp',
    tagline: 'Thiết kế nhận diện → Cung ứng trọn gói → Đóng kiện an toàn'
  },
  {
    title: 'Restaurant & F&B',
    desc: 'Menu da cao cấp, takeout menu gấp, tem dán ly trà sữa chống nước, túi giấy kraft mang về, bảng hiệu LED & hộp đèn vẫy hai mặt.',
    image: '/images/solutions/sol_restaurant_fnb.jpg',
    href: '/giai-phap-tron-goi/restaurant-fnb',
    badge: 'F&B Trọn Gói',
    tagline: 'Bao bì thương hiệu & Bộ nhận diện ẩm thực'
  },
  {
    title: 'Shop & Retail',
    desc: 'Quầy kệ trưng bày, túi giấy quai xoắn in logo, tem barcode dán giá, bảng hiệu cửa hàng, decal mờ dán kính và ấn phẩm bán hàng.',
    image: '/images/solutions/sol_retail.jpg',
    href: '/giai-phap-tron-goi/shop-retail',
    badge: 'Bán Lẻ & Shop',
    tagline: 'Setup không gian trưng bày & Bao bì xuất khẩu'
  }
];

export function SolutionsGrid({ dict, lang }: { dict: Dictionary; lang: string }) {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section matching image7.png */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 pb-4 border-b border-gray-100">
          <div>
            <div className="eyebrow flex items-center gap-2 text-[#E21D25] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#DDBB56]" />
              <span>{dict.solutions.sectionLabel}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1F2522]">
              {dict.solutions.sectionTitle}
            </h2>
            <div className="h-1 w-16 bg-[#DDBB56] mt-2 rounded-full" />
          </div>
          <p className="text-gray-600 text-sm max-w-lg text-left md:text-right">
            {dict.solutions.sectionDesc}
          </p>
        </div>

        {/* 4 Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((item, idx) => (
            <Link
              key={idx}
              href={localizedPath(lang, item.href)}
              className="group relative block rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 border border-gray-100 hover:border-[#E21D25]"
            >
              {/* Image Container with Zoom */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-900">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-108 transition-all duration-700 ease-out"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4 bg-[#E21D25] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg border border-white/20 backdrop-blur-sm">
                  {item.badge}
                </div>

                {/* Content at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="text-xs font-semibold text-[#F1D478] uppercase tracking-wider block mb-1">
                    {item.tagline}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#F1D478] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-200 line-clamp-2 leading-relaxed mb-4 max-w-xl">
                    {item.desc}
                  </p>

                  <div className="inline-flex items-center gap-2 text-sm font-bold text-[#F1D478] group-hover:translate-x-2 transition-transform duration-300">
                    <span>{dict.common.viewDetails}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
