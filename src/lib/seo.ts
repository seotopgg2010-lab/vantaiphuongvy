import { BlogPost, Product } from '@/types/database';
import { SITE_CONFIG } from './constants';
import { getSiteUrl } from './site';

export const DEFAULT_SOCIAL_IMAGE = 'https://vantaiphuongvy.com/wp-content/uploads/2018/08/cong-ty-van-tai-phuong-vy.jpg';
export const ORGANIZATION_ID = `${getSiteUrl()}/#organization`;
export const WEBSITE_ID = `${getSiteUrl()}/#website`;

export function canonicalUrl(path = '/') {
  const baseUrl = getSiteUrl();
  const normalized = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`;
  return `${baseUrl}${normalized}`;
}

export function generatePageMetadata(params: {
  title: string;
  description: string;
  slug?: string;
  image?: string;
  type?: 'website' | 'article';
}) {
  const url = canonicalUrl(params.slug || '/');
  const image = params.image || DEFAULT_SOCIAL_IMAGE;
  return {
    title: params.title,
    description: params.description,
    openGraph: { title: params.title, description: params.description, url, type: params.type || 'website', images: [{ url: image }], locale: 'vi_VN', siteName: SITE_CONFIG.name },
    twitter: { card: 'summary_large_image', title: params.title, description: params.description, images: [image] },
    alternates: { canonical: url },
  };
}

/** The single verified business entity referenced from every page-level schema. */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': ORGANIZATION_ID,
    name: SITE_CONFIG.companyName,
    url: canonicalUrl(),
    logo: 'https://vantaiphuongvy.com/wp-content/uploads/2018/07/logo-van-tai-phuong-vy-2.png',
    image: DEFAULT_SOCIAL_IMAGE,
    description: SITE_CONFIG.description,
    telephone: '+84-933-871-139',
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '38H4, Đường DN9, Khu phố 4, Phường Tân Hưng Thuận, Quận 12',
      addressLocality: 'Thành phố Hồ Chí Minh',
      addressCountry: 'VN',
    },
    openingHours: 'Mo-Su 08:00-21:00',
    areaServed: { '@type': 'Country', name: 'Việt Nam' },
    contactPoint: SITE_CONFIG.hotlines.map((telephone) => ({
      '@type': 'ContactPoint', telephone: `+84-${telephone.replace(/\D/g, '').replace(/^0/, '')}`,
      contactType: 'customer service', availableLanguage: ['vi'],
    })),
    sameAs: ['https://www.facebook.com/vanchuyenphuongvy/'],
  };
}

export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org', '@type': 'WebSite', '@id': WEBSITE_ID,
    url: canonicalUrl(), name: SITE_CONFIG.name, inLanguage: 'vi-VN', publisher: { '@id': ORGANIZATION_ID },
  };
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })) };
}

export function generateProductJsonLd(product: Pick<Product, 'name'> & Partial<Pick<Product, 'description' | 'images'>>) {
  return { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.description, image: product.images?.[0] || '' };
}

export function generateArticleJsonLd(post: Pick<BlogPost, 'title' | 'cover_image_url' | 'published_at' | 'excerpt'>) {
  return { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, image: post.cover_image_url ? [post.cover_image_url] : [], datePublished: post.published_at, description: post.excerpt };
}
