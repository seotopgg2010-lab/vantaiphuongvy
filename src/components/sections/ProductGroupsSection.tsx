'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { localizedPath } from '@/lib/site';

const products = [
  {
    title: 'Thẻ & Phiếu quà tặng',
    subtitle: 'Business Card, Gift Card, Loyalty Card',
    description: 'Thiết kế chuẩn kích thước Mỹ 3.5×2 in, ép kim, dập nổi, cán màng sang trọng.',
    image: '/images/products/prod_the_phieu.jpg',
    href: '/san-xuat-cung-ung/an-pham-bao-bi/business-card',
    tag: 'Bán chạy',
  },
  {
    title: 'Flyer & Poster',
    subtitle: 'Tờ rơi, Poster sự kiện, Banner khai trương',
    description: 'Quảng bá khai trương, menu tóm tắt, chương trình khuyến mãi thu hút.',
    image: '/images/products/prod_flyer_poster.jpg',
    href: '/san-xuat-cung-ung/an-pham-bao-bi/flyer',
    tag: 'Marketing',
  },
  {
    title: 'Brochure giới thiệu',
    subtitle: 'Gấp đôi, gấp ba, gấp Z, dạng cuốn',
    description: 'Giới thiệu dịch vụ và bảng giá toàn diện cho tiệm Nail, Spa & Nhà hàng.',
    image: '/images/products/prod_brochure.png',
    href: '/san-xuat-cung-ung/an-pham-bao-bi/brochure',
    tag: 'Chuyên nghiệp',
  },
  {
    title: 'Menu in ấn',
    subtitle: 'Menu cuốn da, menu gấp, để bàn, mang đi',
    description: 'Chất liệu giấy mỹ thuật, chống thấm nước, bồi cứng ép nhiệt độ bền cao.',
    image: '/images/products/prod_menu.jpg',
    href: '/san-xuat-cung-ung/an-pham-bao-bi/menu',
    tag: 'F&B / Spa',
  },
  {
    title: 'Sticker, Tem nhãn & Decal',
    subtitle: 'Tem logo dán ly boba, tem cuộn, decal kính',
    description: 'Bế hình theo yêu cầu, chất liệu vinyl chống nước, bám dính cực tốt.',
    image: '/images/products/prod_sticker_decal.jpg',
    href: '/san-xuat-cung-ung/an-pham-bao-bi/sticker-label',
    tag: 'Đa dụng',
  },
  {
    title: 'Bộ ấn phẩm thương hiệu',
    subtitle: 'Combo đồng bộ nhận diện thương hiệu',
    description: 'Gói trọn bộ từ danh thiếp, thẻ quà, menu, túi giấy đến bảng hiệu tiệm.',
    image: '/images/products/prod_bo_an_pham.jpg',
    href: '/san-xuat-cung-ung/an-pham-bao-bi/bo-an-pham-thuong-hieu',
    tag: 'Trọn gói',
  },
  {
    title: 'Bao bì & Túi hộp',
    subtitle: 'Túi giấy Kraft, hộp quà, thùng carton in logo',
    description: 'Nâng tầm giá trị sản phẩm với bao bì chỉn chu xuất khẩu đi Mỹ.',
    image: '/images/products/prod_bao_bi.jpg',
    href: '/san-xuat-cung-ung/an-pham-bao-bi/packaging',
    tag: 'Cao cấp',
  },
  {
    title: 'Thiệp & Ấn phẩm sự kiện',
    subtitle: 'Thiệp cưới song ngữ, thẻ tên, thư mời VIP',
    description: 'Gia công tinh xảo, chất liệu cao cấp cho ngày trọng đại và sự kiện.',
    image: '/images/products/prod_thiep_su_kien.jpg',
    href: '/san-xuat-cung-ung/an-pham-bao-bi/thiep-cuoi-an-pham-su-kien',
    tag: 'Sự kiện',
  }
];

export function ProductGroupsSection({ dict, lang }: { dict: Dictionary; lang: string }) {
  return (
    <section className="py-20 bg-[#FAF8F1] w-full border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section matching image7.png */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 pb-4 border-b border-gray-200/80">
          <div>
            <div className="eyebrow flex items-center gap-2 text-[#E21D25] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#DDBB56]" />
              <span>{dict.products.sectionLabel}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1F2522]">
              {dict.products.sectionTitle}
            </h2>
            <div className="h-1 w-16 bg-[#DDBB56] mt-2 rounded-full" />
          </div>
          <p className="text-gray-600 text-sm max-w-lg text-left md:text-right">
            {dict.products.sectionDesc}
          </p>
        </div>

        {/* 8 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Link 
              href={localizedPath(lang, product.href)}
              key={index} 
              className="group block h-full focus:outline-none"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 border border-gray-100 hover:border-[#DDBB56] hover:ring-2 hover:ring-[#DDBB56]/15 h-full flex flex-col">
                {/* Image Container with Hover Zoom */}
                <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={dict.products.items[index].title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  {/* Tag badge */}
                  <div className="absolute top-3 left-3 bg-[#1F2522]/85 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md shadow-sm">
                    {dict.products.items[index].badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#1F2522] mb-1 group-hover:text-[#E21D25] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#AF8526] mb-2">
                      {dict.products.items[index].subtitle}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-4">
                      {dict.products.items[index].desc}
                    </p>
                  </div>
                  
                  <div className="text-[#E21D25] text-xs font-bold uppercase tracking-wider flex items-center justify-between pt-3 border-t border-gray-100 group-hover:text-[#AF8526] transition-colors mt-auto">
                    <span>{dict.products.viewSpecDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
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
