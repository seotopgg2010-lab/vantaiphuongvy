import type { Metadata } from 'next';
import '../globals.css';
import { locales } from './dictionaries';
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site';
import { SITE_CONFIG, TRACKING } from '@/lib/constants';
import { JsonLd } from '@/components/site/json-ld';
import { RootDocument, siteViewport } from '@/components/site/root-document';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getSiteUrl();
  const title = 'Công Ty TNHH Dịch Vụ Vận Tải Phương Vy';
  const description = 'Vận tải Phương Vy — vận chuyển hàng hóa Bắc Nam, chành xe đi 63 tỉnh thành và cho thuê xe tải tại TP.HCM, Hà Nội, Đà Nẵng. Hotline 0902 939 318.';
  return {
    metadataBase: new URL(baseUrl),
    title: { default: title, template: '%s' },
    description,
    applicationName: SITE_CONFIG.name,
    openGraph: {
      title, description, type: 'website', locale: 'vi_VN', url: `${baseUrl}/`, siteName: SITE_CONFIG.name,
      images: [{ url: SITE_CONFIG.defaultImage, alt: SITE_CONFIG.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [SITE_CONFIG.defaultImage] },
    alternates: { canonical: `${baseUrl}/` },
    formatDetection: { telephone: true },
    // Same ownership tags as the WordPress site, so Search Console and Pinterest stay verified after the move.
    verification: { google: TRACKING.googleSiteVerification, other: { 'p:domain_verify': TRACKING.pinterestVerification } },
  };
}

export const viewport = siteViewport;

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Only known locales render. Paths the static locale rewrite leaves alone
 * (src/lib/public-routing.ts: /og, /api, …) land here as `lang`; without this
 * they would render the home page with 200 (soft 404 + duplicate of "/").
 */
export const dynamicParams = false;

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootDocument>
      <JsonLd data={[generateWebSiteJsonLd(), generateOrganizationJsonLd()]} />
      {children}
    </RootDocument>
  );
}
