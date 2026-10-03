'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, Factory, Plane, PackageCheck } from 'lucide-react';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { localizedPath } from '@/lib/site';

const SERVICES = [
  {
    id: 'shipping',
    image: '/images/reference/card1-vanchuyen.jpg',
    icon: Plane,
    href: '/van-chuyen-quoc-te',
    title: { vi: 'Vận chuyển quốc tế', en: 'International shipping' },
    bullets: {
      vi: [
        'Bao trọn thuế phí (DDP)',
        'Đường hàng không',
        'Đường biển hàng lẻ (LCL)',
        'Đường biển nguyên container',
      ],
      en: [
        'DDP (tax inclusive)',
        'Air freight',
        'LCL sea freight',
        'FCL container',
      ],
    },
    description: {
      vi: 'Tư vấn tuyến, đóng gói, thủ tục và giao tận nơi đến Đức, EU, Mỹ, Canada và Úc.',
      en: 'Route, packing, process and final-delivery support for Germany, the EU, US, Canada and Australia.',
    },
  },
  {
    id: 'signage',
    image: '/images/reference/storefront-morning_tam.webp',
    icon: Building2,
    href: '/bang-hieu',
    title: { vi: 'Bảng hiệu & Hộp đèn', en: 'Signage & Lightboxes' },
    bullets: {
      vi: [
        'Bảng hiệu mặt tiền',
        'Hộp đèn LED siêu mỏng',
        'Biển vẫy quảng cáo',
        'Chữ nổi mica & inox',
      ],
      en: [
        'Storefront signage',
        'Ultra-thin LED lightboxes',
        'Projecting blade signs',
        'Mica & inox raised lettering',
      ],
    },
    description: {
      vi: 'Thiết kế, sản xuất và thi công bảng hiệu quảng cáo chuẩn quy định tại Đức.',
      en: 'Brand-led production, appropriate crating and preparation for international shipping.',
    },
  },
  {
    id: 'print',
    image: '/images/reference/print-packaging_tam.webp',
    icon: PackageCheck,
    href: '/san-xuat-cung-ung',
    title: { vi: 'In ấn & Bao bì', en: 'Printing & Packaging' },
    bullets: {
      vi: [
        'Menu nhà hàng quán ăn',
        'Ly giấy & hộp giấy take-away',
        'Danh thiếp & ấn phẩm văn phòng',
        'Tem nhãn decal chống nước',
      ],
      en: [
        'Restaurant menus',
        'Takeaway paper cups & boxes',
        'Business cards & stationery',
        'Waterproof decals & labels',
      ],
    },
    description: {
      vi: 'Ấn phẩm và bao bì đồng bộ theo nhận diện của cửa tiệm hoặc doanh nghiệp.',
      en: 'Coordinated printed materials and packaging for shops and businesses.',
    },
  },
  {
    id: 'setup',
    image: '/images/reference/card4-cungung.jpg',
    icon: Factory,
    href: '/cung-ung-setup',
    title: { vi: 'Cung ứng & Setup', en: 'Supply & Setup' },
    bullets: {
      vi: [
        'Bàn ghế & nội thất trọn gói',
        'Thiết bị quầy bar & pha chế',
        'Vật tư tiêu hao ngành Nail',
        'Đồ trang trí & decor không gian',
      ],
      en: [
        'Turnkey furniture & seating',
        'Bar & beverage equipment',
        'Nail consumable supplies',
        'Interior decor items',
      ],
    },
    description: {
      vi: 'Cung ứng trọn gói nội thất, trang thiết bị và vật tư tiêu hao từ Việt Nam sang Đức.',
      en: 'Choose individual items or coordinate multiple supply groups in one shipment.',
    },
  },
] as const;

export function ServiceGroupsSection({ dict, lang }: { dict: Dictionary; lang: string }) {
  const locale = lang.toLowerCase().startsWith('en') ? 'en' : 'vi';

  return (
    <section id="dich-vu" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="brief-eyebrow text-brief-gold font-medium normal-case tracking-normal text-sm">
              {locale === 'en' ? 'Our services' : 'Dịch vụ của chúng tôi'}
            </p>
            <h2 className="brief-display-heading mt-1 text-3xl font-bold leading-tight text-brief-ink sm:text-4xl">
              {locale === 'en' ? 'Core business sectors' : 'Lĩnh vực chính'}
            </h2>
            <p className="mt-3 text-sm text-brief-soft-ink">
              {locale === 'en'
                ? 'Flexible solutions for business owners, businesses and families abroad.'
                : 'Giải pháp linh hoạt cho chủ tiệm, doanh nghiệp và gia đình ở nước ngoài.'}
            </p>
          </div>
          <Link
            href={localizedPath(lang, '/van-chuyen-quoc-te')}
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brief-red transition hover:text-brief-red-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brief-red"
          >
            <span>{locale === 'en' ? 'View all services' : 'Xem tất cả dịch vụ'}</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => {
            return (
              <Link
                key={service.id}
                href={localizedPath(lang, service.href)}
                className="group flex flex-col overflow-hidden rounded-xl border border-brief-neutral/80 bg-white shadow-xs transition duration-200 hover:-translate-y-1 hover:border-brief-gold hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brief-red active:scale-[0.99]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-brief-champagne">
                  <Image
                    src={service.image}
                    alt={service.title[locale]}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="brief-display-heading text-lg font-bold text-brief-ink transition group-hover:text-brief-red">
                    {service.title[locale]}
                  </h3>
                  <ul className="mt-3.5 flex-1 space-y-2 text-sm text-brief-soft-ink">
                    {service.bullets[locale].map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brief-gold" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brief-red transition group-hover:text-brief-red-hover">
                    <span>{dict.common?.viewDetails || (locale === 'en' ? 'View details' : 'Xem chi tiết')}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
