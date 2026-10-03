import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import '../globals.css';
import { Analytics } from '@/components/shared/Analytics';
import { locales } from './dictionaries';
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site';
import { SITE_CONFIG } from '@/lib/constants';
import { JsonLd } from '@/components/site/json-ld';

// Be Vietnam Pro is designed specifically for Vietnamese diacritics.
const beVietnam = Be_Vietnam_Pro({
  variable: '--font-be-vietnam',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getSiteUrl();
  const title = 'Công Ty TNHH Dịch Vụ Vận Tải Phương Vy';
  const description = 'Vận tải Phương Vy — vận chuyển hàng hóa Bắc Nam, chành xe đi 63 tỉnh thành và cho thuê xe tải tại TP.HCM, Hà Nội, Đà Nẵng. Hotline 0933 871 139.';
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
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a2540',
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <a href="#main-content" className="skip-nav">Bỏ qua đến nội dung chính</a>
        <JsonLd data={[generateWebSiteJsonLd(), generateOrganizationJsonLd()]} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
