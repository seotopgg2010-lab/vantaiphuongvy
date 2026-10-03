import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardTitle, CardDescription } from '../ui';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { localizedPath } from '@/lib/site';

export interface ProductProps {
  slug: string;
  name: string;
  short_description?: string | null;
  images?: string[] | null;
  category_name?: string | null;
  category_slug?: string | null;
}

export const ProductCard = ({
  product,
  categorySlug: categorySlugOverride,
  lang,
  dict,
}: {
  product: ProductProps;
  categorySlug?: string;
  lang?: string;
  dict?: Dictionary;
}) => {
  const categorySlug = categorySlugOverride || product.category_slug || 'an-pham-bao-bi';
  const imageUrl = (product.images && product.images[0]) ? product.images[0] : '/images/placeholders/product.jpg';
  const isEnglish = lang?.toLowerCase().startsWith('en') && dict;
  const itemIndexBySlug: Record<string, number> = {
    'business-card': 0,
    'gift-card': 0,
    voucher: 0,
    'loyalty-card': 0,
    'appointment-card': 0,
    flyer: 1,
    poster: 1,
    brochure: 2,
    menu: 3,
    'sticker-label': 4,
    'bo-an-pham-thuong-hieu': 5,
    packaging: 6,
    'thiep-cuoi-an-pham-su-kien': 7,
  };
  const englishNameBySlug: Record<string, string> = {
    'business-card': 'Business Card',
    'gift-card': 'Gift Card',
    voucher: 'Voucher',
    'loyalty-card': 'Loyalty Card',
    'appointment-card': 'Appointment Card',
    flyer: 'Flyers & Posters',
    poster: 'Posters',
    brochure: 'Introduction Brochures',
    menu: 'Printed Menus',
    'sticker-label': 'Stickers, Labels & Decals',
    'bo-an-pham-thuong-hieu': 'Brand Identity Packages',
    packaging: 'Packaging & Bags',
    'thiep-cuoi-an-pham-su-kien': 'Cards & Event Publications',
  };
  const itemIndex = itemIndexBySlug[product.slug] ?? -1;
  const displayName = isEnglish
    ? (englishNameBySlug[product.slug] || product.name)
    : product.name;
  const displayDescription = isEnglish
    ? (itemIndex >= 0 ? dict.products.items[itemIndex].desc : 'Explore this Hamburg Connect product and request a tailored consultation.')
    : product.short_description;
  const displayCategory = isEnglish ? dict.products.sectionLabel : (product.category_name || 'Sản phẩm Hamburg Connect');

  return (
    <Card href={localizedPath(lang || 'vi', `/san-xuat-cung-ung/${categorySlug}/${product.slug}`)} hoverEffect>
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardContent>
        <div className="text-xs font-semibold text-[#E21D25] mb-2 uppercase tracking-wider">
          {displayCategory}
        </div>
        <CardTitle>{displayName}</CardTitle>
        <CardDescription>{displayDescription}</CardDescription>
      </CardContent>
    </Card>
  );
};
