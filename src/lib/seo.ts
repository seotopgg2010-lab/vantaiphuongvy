import type { Metadata } from 'next';
import { SITE_CONFIG } from './constants';
import { getSiteUrl } from './site';
import type { LegacyEntry } from './legacy-types';
import { markdownPathFor } from './markdown-paths';
import { SOCIAL_CARD_SIZE, socialCardFor, socialCardPath } from './social-card';

export const ORGANIZATION_ID = `${getSiteUrl()}/#organization`;
export const WEBSITE_ID = `${getSiteUrl()}/#website`;
export const DEFAULT_SOCIAL_IMAGE = SITE_CONFIG.defaultImage;

/** Canonical URL with the WordPress trailing-slash contract. */
export function canonicalUrl(path = '/') {
  const normalized = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`;
  return `${getSiteUrl()}${normalized}`;
}

export function absoluteUrl(pathOrUrl: string) {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${getSiteUrl()}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export function telE164(phone: string) {
  const national = phone.replace(/\D/g, '').replace(/^(84|0)/, '');
  return `+84-${national.length === 9 ? national.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3') : national}`;
}

/**
 * Share images for a page: the branded 1200×630 card first (what Facebook,
 * Zalo and X pick), then the page's own photo.
 */
function socialImages(path: string, photo: string, photoAlt?: string) {
  const card = socialCardFor(path);
  const cardAlt = card ? `${card.title} — ${SITE_CONFIG.name}` : SITE_CONFIG.name;
  return [
    ...(card ? [{ url: socialCardPath(path), ...SOCIAL_CARD_SIZE, alt: cardAlt, type: 'image/png' }] : []),
    { url: photo, alt: photoAlt || cardAlt },
  ];
}

/** Canonical plus the markdown twin advertised as rel="alternate" type="text/markdown". */
function pageAlternates(path: string): Metadata['alternates'] {
  return { canonical: canonicalUrl(path), types: { 'text/markdown': markdownPathFor(path) } };
}

/** Metadata for a legacy entry: preserves the live Rank Math title/description. */
export function legacyMetadata(item: LegacyEntry): Metadata {
  const canonical = canonicalUrl(item.path);
  const title = item.seo.title || `${item.title} | Vận Tải Phương Vy`;
  const description = item.seo.description || item.summary;
  // The home entry's WordPress alt is just "TRANG CHỦ"; fall back to the card text there.
  const photoAlt = item.imageAlt && item.imageAlt !== item.label ? item.imageAlt : undefined;
  const images = socialImages(item.path, item.image || DEFAULT_SOCIAL_IMAGE, photoAlt);
  return {
    title: { absolute: title },
    description,
    alternates: pageAlternates(item.path),
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    openGraph: {
      type: item.kind === 'post' ? 'article' : 'website',
      locale: 'vi_VN',
      siteName: SITE_CONFIG.name,
      title, description, url: canonical,
      images,
      ...(item.kind === 'post' ? { publishedTime: item.date, modifiedTime: item.modified } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, images: [images[0]] },
  };
}

export function pageMetadata({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  const canonical = canonicalUrl(path);
  const images = socialImages(path, image || DEFAULT_SOCIAL_IMAGE);
  return {
    title: { absolute: title },
    description,
    alternates: pageAlternates(path),
    openGraph: { type: 'website', locale: 'vi_VN', siteName: SITE_CONFIG.name, title, description, url: canonical, images },
    twitter: { card: 'summary_large_image', title, description, images: [images[0]] },
  };
}

/** The single verified business entity referenced from every page-level schema. */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': ORGANIZATION_ID,
    name: SITE_CONFIG.companyName,
    alternateName: SITE_CONFIG.name,
    slogan: SITE_CONFIG.slogan,
    url: canonicalUrl(),
    logo: absoluteUrl(SITE_CONFIG.logo),
    image: absoluteUrl(SITE_CONFIG.defaultImage),
    description: SITE_CONFIG.description,
    telephone: telE164(SITE_CONFIG.hotline),
    email: SITE_CONFIG.email,
    taxID: SITE_CONFIG.taxId,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '38H4, Đường DN9, Khu phố 4, Phường Tân Hưng Thuận, Quận 12',
      addressLocality: 'Thành phố Hồ Chí Minh',
      addressCountry: 'VN',
    },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00', closes: '21:00',
    }],
    areaServed: { '@type': 'Country', name: 'Việt Nam' },
    contactPoint: SITE_CONFIG.hotlines.map((telephone) => ({
      '@type': 'ContactPoint', telephone: telE164(telephone), contactType: 'customer service', availableLanguage: ['vi'],
    })),
    sameAs: [SITE_CONFIG.facebook],
  };
}

export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org', '@type': 'WebSite', '@id': WEBSITE_ID,
    url: canonicalUrl(), name: SITE_CONFIG.name, inLanguage: 'vi-VN', publisher: { '@id': ORGANIZATION_ID },
    potentialAction: { '@type': 'SearchAction', target: `${canonicalUrl('/tim-kiem')}?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
  };
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })),
  };
}

export function generateFaqJsonLd(faq: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faq.map((entry) => ({ '@type': 'Question', name: entry.question, acceptedAnswer: { '@type': 'Answer', text: entry.answer } })),
  };
}

export function generateLegacyJsonLd(item: LegacyEntry, breadcrumbs: Array<{ name: string; url: string }>) {
  const url = canonicalUrl(item.path);
  const image = item.image ? absoluteUrl(item.image) : absoluteUrl(DEFAULT_SOCIAL_IMAGE);
  const blocks: object[] = [generateBreadcrumbJsonLd(breadcrumbs)];
  if (item.kind === 'post') {
    blocks.push({
      '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${url}#article`,
      headline: item.title, description: item.seo.description || item.summary, image,
      datePublished: item.date, dateModified: item.modified || item.date,
      mainEntityOfPage: url, inLanguage: 'vi-VN',
      author: { '@id': ORGANIZATION_ID }, publisher: { '@id': ORGANIZATION_ID },
    });
  } else {
    blocks.push({
      '@context': 'https://schema.org', '@type': item.path === '/lien-he' ? 'ContactPage' : item.path === '/gioi-thieu' ? 'AboutPage' : 'WebPage',
      '@id': `${url}#webpage`, name: item.seo.title || item.title, description: item.seo.description || item.summary,
      url, image, inLanguage: 'vi-VN', isPartOf: { '@id': WEBSITE_ID }, about: { '@id': ORGANIZATION_ID },
      ...(item.modified ? { dateModified: item.modified } : {}),
    });
  }
  if (['route', 'route-hub', 'cargo', 'truck', 'truck-hub'].includes(item.template)) {
    const isTruck = item.template.startsWith('truck');
    blocks.push({
      '@context': 'https://schema.org', '@type': 'Service', '@id': `${url}#service`,
      name: item.title, description: item.seo.description || item.summary,
      serviceType: isTruck ? 'Cho thuê xe tải chở hàng' : 'Vận chuyển hàng hóa đường bộ',
      provider: { '@id': ORGANIZATION_ID }, url, image,
      areaServed: item.template === 'route' ? [{ '@type': 'Country', name: 'Việt Nam' }, { '@type': 'AdministrativeArea', name: item.label }] : { '@type': 'Country', name: 'Việt Nam' },
    });
  }
  if (item.faq.length >= 2) blocks.push(generateFaqJsonLd(item.faq));
  return blocks;
}
