import type { Metadata } from 'next';
import { SITE_CONFIG } from './constants';
import { getSiteUrl } from './site';
import type { LegacyEntry } from './legacy-types';
import { markdownPathFor } from './markdown-paths';
import { PRESS, SERVICES } from './marketing';
import { SOCIAL_CARD_SIZE, socialCardFor, socialCardPath } from './social-card';
import { WAREHOUSES } from './warehouses';

export const ORGANIZATION_ID = `${getSiteUrl()}/#organization`;
export const WEBSITE_ID = `${getSiteUrl()}/#website`;
const LOGO_ID = `${getSiteUrl()}/#logo`;
export const DEFAULT_SOCIAL_IMAGE = SITE_CONFIG.defaultImage;

/**
 * The founder as the "Về tác giả" box on every guide presents him: "Mai Văn Trung là CEO & FOUNDER …
 * đào tạo về Logistics tại trường đại học giao thông vận tải TP.HCM". The author bio test keeps
 * these facts tied to that text.
 */
export const FOUNDER = {
  name: 'Mai Văn Trung',
  jobTitle: 'CEO & Founder',
  alumniOf: 'Trường Đại học Giao thông vận tải TP.HCM',
} as const;

/** Stable node id for a named person, e.g. `https://vantaiphuongvy.com/#person-mai-van-trung`. */
export function personId(name: string) {
  const slug = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${getSiteUrl()}/#person-${slug}`;
}

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

/** The robots directives the WordPress (Rank Math) pages sent, for every indexable page. */
const INDEXABLE_ROBOTS: Metadata['robots'] = { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 };

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
    robots: INDEXABLE_ROBOTS,
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
    robots: INDEXABLE_ROBOTS,
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
    legalName: SITE_CONFIG.companyName,
    alternateName: SITE_CONFIG.name,
    slogan: SITE_CONFIG.slogan,
    url: canonicalUrl(),
    logo: { '@type': 'ImageObject', '@id': LOGO_ID, url: absoluteUrl(SITE_CONFIG.logo), contentUrl: absoluteUrl(SITE_CONFIG.logo), width: 1705, height: 498, caption: SITE_CONFIG.name },
    image: absoluteUrl(SITE_CONFIG.defaultImage),
    description: SITE_CONFIG.description,
    telephone: telE164(SITE_CONFIG.hotline),
    email: SITE_CONFIG.email,
    taxID: SITE_CONFIG.taxId,
    identifier: { '@type': 'PropertyValue', propertyID: 'Mã số thuế', value: SITE_CONFIG.taxId },
    founder: { '@type': 'Person', '@id': personId(FOUNDER.name), name: FOUNDER.name, jobTitle: FOUNDER.jobTitle },
    knowsAbout: [...SERVICES.map((service) => service.title), 'Chành xe liên tỉnh', 'Vận chuyển hàng siêu trường siêu trọng', 'Vận chuyển máy móc thiết bị', 'Gửi xe máy Bắc Nam'],
    // The office and the "Danh sách kho hàng" every footer lists.
    location: [
      { '@type': 'Place', name: 'Văn phòng', address: { '@type': 'PostalAddress', streetAddress: SITE_CONFIG.address, addressCountry: 'VN' } },
      ...WAREHOUSES.map((warehouse) => ({ '@type': 'Place', name: `Kho ${warehouse.label}`, address: { '@type': 'PostalAddress', streetAddress: warehouse.address, addressCountry: 'VN' } })),
    ],
    // "Báo chí nói về Vận tải Phương Vy" on the home page.
    subjectOf: PRESS.map((item) => ({ '@type': 'NewsArticle', url: item.href, publisher: { '@type': 'Organization', name: item.outlet } })),
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
    url: canonicalUrl(), name: SITE_CONFIG.name, alternateName: SITE_CONFIG.companyName, inLanguage: 'vi-VN', publisher: { '@id': ORGANIZATION_ID },
    potentialAction: { '@type': 'SearchAction', target: `${canonicalUrl('/tim-kiem')}?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
  };
}

/** `id` lets the page's WebPage node point at the trail (`breadcrumb: { '@id': … }`). */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>, id?: string) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', ...(id ? { '@id': id } : {}),
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })),
  };
}

export function generateFaqJsonLd(faq: Array<{ question: string; answer: string }>, pageUrl?: string) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    ...(pageUrl ? { '@id': `${pageUrl}#faq`, isPartOf: { '@id': `${pageUrl}#webpage` } } : {}),
    mainEntity: faq.map((entry) => ({ '@type': 'Question', name: entry.question, acceptedAnswer: { '@type': 'Answer', text: entry.answer } })),
  };
}

/** A post author as the guide's author box shows them; the founder carries his role and training. */
function personJsonLd(author: NonNullable<LegacyEntry['author']>) {
  const founder = author.name === FOUNDER.name;
  return {
    '@type': 'Person', '@id': personId(author.name), name: author.name,
    ...(founder ? { jobTitle: FOUNDER.jobTitle, alumniOf: { '@type': 'CollegeOrUniversity', name: FOUNDER.alumniOf } } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    worksFor: { '@id': ORGANIZATION_ID },
  };
}

const SERVICE_TEMPLATES = new Set(['route', 'route-hub', 'cargo', 'truck', 'truck-hub']);

function serviceType(item: LegacyEntry) {
  if (item.template.startsWith('truck')) return 'Cho thuê xe tải chở hàng';
  if (item.path === '/van-chuyen-hang-hoa/duong-bien') return 'Vận chuyển hàng hóa đường biển';
  if (item.path === '/van-chuyen-hang-hoa/duong-hang-khong') return 'Vận chuyển hàng hóa đường hàng không';
  return 'Vận chuyển hàng hóa đường bộ';
}

/** The province or city a route or city truck page serves ("Thuê xe tải Đà Nẵng" → "Đà Nẵng"). */
function serviceArea(item: LegacyEntry) {
  if (item.template === 'route') return item.label;
  if (item.template === 'truck') return item.label.replace(/^Thuê xe tải\s+/i, '');
  return undefined;
}

function webPageType(item: LegacyEntry) {
  if (item.path === '/lien-he') return 'ContactPage';
  if (item.path === '/gioi-thieu') return 'AboutPage';
  return 'WebPage';
}

/**
 * Page-level nodes linked into one graph by `@id`: WebPage (isPartOf the WebSite, with its
 * breadcrumb and main entity), then the BlogPosting or Service it is about, FAQ and rating.
 * The WebSite and Organization nodes come from the layout on every page.
 */
export function generateLegacyJsonLd(item: LegacyEntry, breadcrumbs: Array<{ name: string; url: string }>) {
  const url = canonicalUrl(item.path);
  const pageId = `${url}#webpage`;
  const breadcrumbId = `${url}#breadcrumb`;
  const image = item.image ? absoluteUrl(item.image) : absoluteUrl(DEFAULT_SOCIAL_IMAGE);
  const isService = SERVICE_TEMPLATES.has(item.template);
  const mainEntityId = item.kind === 'post' ? `${url}#article` : isService ? `${url}#service` : undefined;
  // The home page has no visible trail, so it gets no BreadcrumbList.
  const hasTrail = breadcrumbs.length >= 2;
  const blocks: object[] = [];
  if (hasTrail) blocks.push(generateBreadcrumbJsonLd(breadcrumbs, breadcrumbId));
  blocks.push({
    '@context': 'https://schema.org', '@type': webPageType(item), '@id': pageId,
    url, name: item.seo.title || item.title, description: item.seo.description || item.summary, inLanguage: 'vi-VN',
    isPartOf: { '@id': WEBSITE_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: image, ...(item.imageAlt ? { caption: item.imageAlt } : {}) },
    ...(hasTrail ? { breadcrumb: { '@id': breadcrumbId } } : {}),
    ...(item.date ? { datePublished: item.date } : {}),
    ...(item.modified ? { dateModified: item.modified } : {}),
    ...(mainEntityId ? { mainEntity: { '@id': mainEntityId } } : { about: { '@id': ORGANIZATION_ID } }),
  });
  if (item.kind === 'post') {
    blocks.push({
      '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${url}#article`,
      headline: item.title, description: item.seo.description || item.summary, image,
      datePublished: item.date, dateModified: item.modified || item.date,
      mainEntityOfPage: { '@id': pageId }, isPartOf: { '@id': pageId }, inLanguage: 'vi-VN',
      author: item.author ? personJsonLd(item.author) : { '@id': ORGANIZATION_ID },
      publisher: { '@id': ORGANIZATION_ID },
    });
  }
  if (isService) {
    blocks.push({
      '@context': 'https://schema.org', '@type': 'Service', '@id': `${url}#service`,
      name: item.title, description: item.seo.description || item.summary,
      serviceType: serviceType(item),
      provider: { '@id': ORGANIZATION_ID }, url, image, mainEntityOfPage: { '@id': pageId },
      areaServed: serviceArea(item) ? [{ '@type': 'Country', name: 'Việt Nam' }, { '@type': 'AdministrativeArea', name: serviceArea(item) }] : { '@type': 'Country', name: 'Việt Nam' },
      availableChannel: {
        '@type': 'ServiceChannel', serviceUrl: canonicalUrl('/lien-he'),
        servicePhone: { '@type': 'ContactPoint', telephone: telE164(SITE_CONFIG.hotline), contactType: 'customer service', availableLanguage: ['vi'] },
      },
      termsOfService: canonicalUrl('/chinh-sach-van-chuyen-va-giao-hang'),
    });
  }
  if (item.faq.length >= 2) blocks.push(generateFaqJsonLd(item.faq, url));
  // The visitor rating the WordPress page published (kk Star Ratings): same type, name and numbers, shown in the hero.
  if (item.rating) {
    blocks.push({
      '@context': 'https://schema.org', '@type': 'CreativeWorkSeries', name: item.rating.name,
      aggregateRating: { '@type': 'AggregateRating', ratingValue: item.rating.score, bestRating: item.rating.best, ratingCount: item.rating.count },
    });
  }
  return blocks;
}
