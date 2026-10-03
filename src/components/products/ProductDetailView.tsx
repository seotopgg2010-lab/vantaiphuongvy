'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { generateProductJsonLd } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/rich-text';
import { ProjectCard } from '@/components/shared/ProjectCard';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { localizedPath, toTelHref } from '@/lib/site';
import { SITE_CONFIG } from '@/lib/constants';
import { ContactBrandIcon } from '@/components/ui/contact-brand-icon';
import {
  ArrowRight,
  ChevronRight,
  PhoneCall,
  Sparkles,
  Truck,
} from 'lucide-react';

type IndustryKey = 'nail_spa' | 'restaurant_fnb' | 'retail_shop' | 'wedding_event';
type IndustryLinks = Partial<Record<IndustryKey, boolean>>;

const DEFAULT_SHIPPING_DESCRIPTION =
  'Thiết kế, in ấn và sản xuất tại Việt Nam, đóng gói an toàn và vận chuyển tận nơi đến Mỹ, Canada, Úc và Châu Âu.';

// The four cards are shared by every product. Whether a card is clickable is
// controlled by the product's industry_links configuration.
const INDUSTRY_CARDS: Array<{
  key: IndustryKey;
  label: string;
  slug: string;
  image: string;
}> = [
  {
    key: 'nail_spa',
    label: 'NAIL, SALON & SPA',
    slug: 'nail-salon',
    image: '/images/solutions/sol_nail_spa.jpg',
  },
  {
    key: 'restaurant_fnb',
    label: 'RESTAURANT & F&B',
    slug: 'restaurant-fnb',
    image: '/images/solutions/sol_restaurant_fnb.jpg',
  },
  {
    key: 'retail_shop',
    label: 'RETAIL & SHOP BÁN LẺ',
    slug: 'shop-retail',
    image: '/images/solutions/sol_retail.jpg',
  },
  {
    key: 'wedding_event',
    label: 'WEDDING & EVENT',
    slug: 'wedding-event',
    image: '/images/solutions/sol_wedding_event.jpg',
  },
];

interface ProductDetailViewProps {
  lang: string;
  dict: Dictionary;
  product: {
    id?: string;
    slug: string;
    name: string;
    category_slug?: string | null;
    short_description?: string | null;
    shipping_description?: string | null;
    description?: string | null;
    images?: string[] | null;
    industry_links?: IndustryLinks | null;
    specs?: Record<string, unknown> | null;
  };
  category: {
    id: string;
    slug: string;
    name: string;
  };
  relatedProjects?: Array<{
    id: string;
    slug: string;
    name: string;
    location?: string | null;
    business_type?: string | null;
    images?: string[] | null;
  }> | null;
  descriptionHtml: string;
}

function formatSpecValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ');
  if (value && typeof value === 'object') return JSON.stringify(value);
  return value == null ? '' : String(value);
}

const ENGLISH_PRODUCT_NAMES: Record<string, string> = {
  'business-card': 'Business Card',
  'gift-card': 'Gift Card & Voucher',
  voucher: 'Voucher',
  'loyalty-card': 'Loyalty Card',
  'appointment-card': 'Appointment Card',
  flyer: 'Flyers & Posters',
  poster: 'Posters',
  brochure: 'Introduction Brochures',
  menu: 'Printed Menus',
  'menu-mang-di': 'Takeaway Menus',
  'menu-de-ban': 'Table Menus & Table Tents',
  'sticker-label': 'Stickers, Labels & Decals',
  'bo-an-pham-thuong-hieu': 'Brand Identity Packages',
  packaging: 'Packaging & Bags',
  'thiep-cuoi-an-pham-su-kien': 'Cards & Event Publications',
};

const ENGLISH_PRODUCT_ITEM_INDEX: Record<string, number> = {
  'business-card': 0,
  'gift-card': 0,
  voucher: 0,
  'loyalty-card': 0,
  'appointment-card': 0,
  flyer: 1,
  poster: 1,
  brochure: 2,
  menu: 3,
  'menu-mang-di': 3,
  'menu-de-ban': 3,
  'sticker-label': 4,
  'bo-an-pham-thuong-hieu': 5,
  packaging: 6,
  'thiep-cuoi-an-pham-su-kien': 7,
};

export default function ProductDetailView({ lang, dict, product: sourceProduct, category, relatedProjects, descriptionHtml }: ProductDetailViewProps) {
  const isEnglish = lang.toLowerCase().startsWith('en');
  const englishItem = isEnglish
    ? dict.products.items[ENGLISH_PRODUCT_ITEM_INDEX[sourceProduct.slug] ?? 0]
    : undefined;
  const product = isEnglish && englishItem
    ? {
        ...sourceProduct,
        name: ENGLISH_PRODUCT_NAMES[sourceProduct.slug] || sourceProduct.name,
        short_description: englishItem.desc,
        description: `${englishItem.title}\n\n${englishItem.desc}`,
      }
    : sourceProduct;
  const displayCategoryName = isEnglish ? dict.products.sectionLabel : category?.name;
  const productImages = product.images?.filter(Boolean).slice(0, 10) ?? [];
  const galleryImages = productImages.length > 0
    ? productImages
    : ['/images/placeholders/product.jpg'];
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Products must opt in to each industry so an unrelated card never becomes
  // a misleading link by default.
  const industryLinks: IndustryLinks = product.industry_links ?? {
    nail_spa: false,
    restaurant_fnb: false,
    retail_shop: false,
    wedding_event: false,
  };

  return (
    <div className="w-full space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateProductJsonLd(product)) }}
      />

      <section
        aria-label={`${isEnglish ? 'Product details' : 'Chi tiết sản phẩm'} ${product.name}`}
        className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm sm:p-6 lg:p-10"
      >
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-10">
          <div className="order-1 lg:order-none lg:col-start-7 lg:col-span-6 lg:row-start-1">
            <ProductEyebrow categoryName={displayCategoryName} />
            <h1
              id="product-title"
              className="mb-3 text-2xl font-extrabold leading-tight tracking-tight text-[#1F2522] sm:text-3xl lg:text-[34px]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {product.name.toUpperCase()}
            </h1>
          </div>

          <div className="order-2 flex flex-col lg:order-none lg:col-start-1 lg:col-span-6 lg:row-start-1 lg:row-span-2">
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-stone-200/70 bg-stone-50 shadow-inner">
              <Image
                src={galleryImages[activeImageIdx] ?? galleryImages[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>

            <div
              className="mt-3 grid grid-cols-4 gap-2.5 sm:gap-3"
              role="group"
              aria-label={dict.productDetail.productImage}
            >
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIdx(index)}
                  aria-label={`${dict.productDetail.viewImage} ${index + 1} ${product.name}`}
                  aria-pressed={activeImageIdx === index}
                  className={`relative aspect-[4/3] min-h-12 overflow-hidden rounded-xl border-2 transition-all focus-visible:outline-offset-4 ${
                    activeImageIdx === index
                      ? 'border-[#DDBB56] shadow-md ring-2 ring-[#DDBB56]/30'
                      : 'border-stone-200 opacity-80 hover:border-stone-400 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="order-3 flex flex-col justify-center space-y-5 lg:order-none lg:col-start-7 lg:col-span-6 lg:row-start-2">
            <div>
              <p className="mb-1 text-sm font-bold uppercase tracking-wide text-[#1F2522]">{dict.productDetail.descriptionLabel}</p>
              <p className="text-[15px] leading-relaxed text-stone-600">
                {product.short_description || dict.productDetail.shippingFallback}
              </p>
            </div>

            <div className="rounded-xl border border-[#DDBB56]/45 bg-[#FAF8F1] p-4 sm:p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E21D25]/10 text-[#E21D25]">
                  <Truck className="h-4 w-4" aria-hidden="true" />
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wide text-[#1F2522]">
                  {dict.productDetail.shippingTitle}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-stone-600">
                {product.shipping_description || dict.productDetail.shippingFallback || DEFAULT_SHIPPING_DESCRIPTION}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Link
                href={localizedPath(lang, '/lien-he')}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#E21D25] px-4 py-3 text-center text-xs font-bold tracking-wide text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#C6161D] hover:shadow-lg sm:text-sm"
              >
                <PhoneCall className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{dict.productDetail.consultationCta}</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
              <a
                href="https://zalo.me/0862613313"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={dict.floating.chatZalo}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-stone-800 bg-white px-4 py-3 text-center text-xs font-bold text-stone-800 transition-all hover:border-[#E21D25] hover:text-[#E21D25] sm:text-sm"
              >
                <ContactBrandIcon brand="zalo" className="h-8 w-8" />
              </a>
              <a
                href={`https://wa.me/${toTelHref(SITE_CONFIG.hotlineGermany).replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Hamburg"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-stone-800 bg-white px-4 py-3 text-center text-xs font-bold text-stone-800 transition-all hover:border-[#E21D25] hover:text-[#E21D25] sm:text-sm"
              >
                <ContactBrandIcon brand="whatsapp" className="h-5 w-5" />
                <span>WhatsApp</span>
              </a>
            </div>

            <p className="text-xs text-stone-500">
              {dict.productDetail.hotlineLabel} <strong className="text-[#CB120F]">(+84) 086 261 3313</strong>
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="industry-title">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AF8526]">Hamburg Connect</p>
            <h2
              id="industry-title"
              className="mt-1 text-xl font-extrabold text-[#1F2522] sm:text-2xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {dict.productDetail.applicationsTitle}
            </h2>
          </div>
          <Sparkles className="hidden h-6 w-6 shrink-0 text-[#DDBB56] sm:block" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
          {INDUSTRY_CARDS.map((card) => {
            const isLinked = industryLinks[card.key] === true;
            const industryIndex = INDUSTRY_CARDS.findIndex((item) => item.key === card.key);
            const localizedCardLabel = dict.solutions.items[industryIndex]?.title || card.label;
            const cardContent = (
              <div
                className={`group relative overflow-hidden rounded-2xl border bg-white transition-all ${
                  isLinked
                    ? 'cursor-pointer border-stone-200/80 shadow-sm hover:-translate-y-1 hover:border-[#E21D25]/50 hover:shadow-lg'
                    : 'cursor-default border-stone-200/70 shadow-sm'
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  <Image
                    src={card.image}
                    alt={card.label}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={`object-cover transition-transform duration-500 ${isLinked ? 'group-hover:scale-105' : ''}`}
                  />
                </div>
                <div className="flex min-h-16 items-center justify-between gap-2 px-3 py-3 sm:px-4">
                  <span
                    className="text-[11px] font-extrabold leading-tight tracking-wide text-[#1F2522] sm:text-sm"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {localizedCardLabel.toUpperCase()}
                  </span>
                  {isLinked && (
                    <ChevronRight
                      className="h-5 w-5 shrink-0 text-[#E21D25] transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
            );

            if (!isLinked) {
              return <div key={card.key}>{cardContent}</div>;
            }

            return (
              <Link
                key={card.key}
                href={localizedPath(lang, `/giai-phap-tron-goi/${card.slug}`)}
                aria-label={`${dict.productDetail.solutionLabel} ${localizedCardLabel}`}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </section>

      {product.description && product.description.trim() && (
        <section
          aria-labelledby="product-description-title"
          className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8 md:p-12"
        >
          <h2
            id="product-description-title"
            className="mb-6 border-b border-stone-200 pb-3 text-2xl font-bold text-[#1F2522]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {dict.productDetail.detailedDescription}
          </h2>
          {isEnglish && englishItem ? (
            <div className="rich-content max-w-none text-stone-700"><h2>{product.name}</h2><p>{englishItem.desc}</p></div>
          ) : (
            <div className="rich-content max-w-none text-stone-700" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          )}
        </section>
      )}

      {product.specs && Object.keys(product.specs).length > 0 && (
        <section aria-labelledby="product-specs-title" className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8 md:p-12">
          <h2 id="product-specs-title" className="mb-6 border-b border-stone-200 pb-3 text-2xl font-bold text-[#1F2522]" style={{ fontFamily: 'var(--font-heading)' }}>{dict.productDetail.specsTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-sm font-medium text-stone-600">{key}</span>
                <span className="text-right text-sm text-stone-800">{formatSpecValue(value)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {relatedProjects && relatedProjects.length > 0 && (
        <section aria-labelledby="related-projects-title">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#AF8526]">Hamburg Connect</p>
            <h2
              id="related-projects-title"
              className="mt-1 text-xl font-extrabold text-[#1F2522] sm:text-2xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {dict.productDetail.relatedProjectsTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProjects.map((project) => (
              <ProjectCard key={project.id || project.slug} project={project} lang={lang} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProductEyebrow({ categoryName }: { categoryName?: string }) {
  return (
    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#FAF3DC] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#AF8526]">
      <Sparkles className="h-3.5 w-3.5 text-[#DDBB56]" aria-hidden="true" />
      <span>{categoryName || 'HAMBURG CONNECT'}</span>
    </div>
  );
}
