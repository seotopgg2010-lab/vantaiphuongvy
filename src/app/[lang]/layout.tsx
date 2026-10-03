import type { Metadata, Viewport } from "next";
import { Dancing_Script, Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Analytics } from "@/components/shared/Analytics";
import { getDictionary, locales } from "./dictionaries";
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { serializeJsonLd } from "@/lib/rich-text";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600"],
  display: 'swap',
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600"],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getSiteUrl();
  const canonical = baseUrl;
  const title = 'Vận tải Phương Vy | Vận chuyển hàng hóa Bắc Nam';
  const description = 'Vận chuyển hàng hóa Bắc Nam, chành xe liên tỉnh và cho thuê xe tải tại Việt Nam.';
  const defaultImage = 'https://vantaiphuongvy.com/wp-content/uploads/2018/08/cong-ty-van-tai-phuong-vy.jpg';

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: 'vận tải Phương Vy, vận chuyển hàng hóa Bắc Nam, chành xe, thuê xe tải',
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'vi_VN',
      url: canonical,
      siteName: 'Vận tải Phương Vy',
      images: [{ url: defaultImage, width: 1200, height: 630, alt: 'Vận tải Phương Vy' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [defaultImage] },
    alternates: { canonical },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <html lang="vi" className={`${inter.variable} ${playfairDisplay.variable} ${dancingScript.variable} h-full antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-text">
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateWebSiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateOrganizationJsonLd()) }}
        />
        <TopBar lang={lang} />
        <Header lang={lang} dict={dict} />
        <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
          {children}
        </main>
        <Footer lang={lang} dict={dict} />
        <FloatingActions dict={dict} />
        <Analytics />
      </body>
    </html>
  );
}
