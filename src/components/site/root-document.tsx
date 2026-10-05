import type { Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import { Analytics } from '@/components/shared/Analytics';

// Be Vietnam Pro is designed specifically for Vietnamese diacritics.
const beVietnam = Be_Vietnam_Pro({
  variable: '--font-be-vietnam',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const siteViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a3d6b',
};

/**
 * The <html>/<body> shell shared by the [lang] root layout and app/global-not-found.tsx,
 * which bypasses that layout. Each caller imports globals.css itself.
 */
export function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <a href="#main-content" className="skip-nav">Bỏ qua đến nội dung chính</a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
