import type { NextConfig } from "next";
import { LOCALE_REDIRECTS, PUBLIC_REWRITES } from './src/lib/public-routing';

function getSupabaseHost() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    return url.hostname;
  } catch {
    return null;
  }
}

const supabaseHost = getSupabaseHost();
const supabaseMediaSource = supabaseHost ? `https://${supabaseHost}` : null;

const nextConfig: NextConfig = {
  // WordPress permalink contract: every page URL ends with "/".
  trailingSlash: true,
  distDir: process.env.NEXT_DIST_DIR || '.next',
  experimental: {
    // The root layout sits under the dynamic [lang] segment, so unmatched URLs need
    // app/global-not-found.tsx to get the branded 404 instead of Next's built-in page.
    globalNotFound: true,
  },
  async redirects() {
    return [
      // Rank Math sitemaps -> the single Next.js sitemap
      ...['/sitemap_index.xml', '/post-sitemap.xml', '/page-sitemap.xml', '/local-sitemap.xml', '/wp-sitemap.xml'].map((source) => ({ source, destination: '/sitemap.xml', permanent: true })),
      // Retired duplicate of the home page (its canonical already pointed to "/")
      { source: '/home-3', destination: '/', permanent: true },
      // WordPress front controller, which 301'd to the home page
      { source: '/index.php', destination: '/', permanent: true },
      // WordPress feeds & archives that have no equivalent page
      { source: '/feed', destination: '/blog/', permanent: true },
      { source: '/comments/feed', destination: '/blog/', permanent: true },
      { source: '/blog/:slug/feed', destination: '/blog/:slug/', permanent: true },
      { source: '/category/:path*', destination: '/blog/', permanent: true },
      { source: '/tag/:path*', destination: '/blog/', permanent: true },
      { source: '/author/:path*', destination: '/blog/', permanent: true },
      { source: '/page/:n(\\d+)', destination: '/', permanent: true },
      { source: '/blog/page/:n(\\d+)', destination: '/blog/', permanent: true },
      ...LOCALE_REDIRECTS,
    ];
  },
  // Public pages are routed by static rules (no proxy invocation per request).
  async rewrites() {
    return PUBLIC_REWRITES;
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Only the widths and quality the layouts request: every extra variant is another
    // transformation against the hosting plan's monthly image-optimization quota.
    qualities: [75],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [256, 384],
    // Mirrored WordPress uploads keep their original paths (image SEO parity).
    localPatterns: [{ pathname: '/wp-content/uploads/**', search: '' }],
    remotePatterns: [
      ...(supabaseHost ? [{ protocol: 'https' as const, hostname: supabaseHost, pathname: '/storage/v1/object/public/**', search: '' }] : []),
    ],
  },
  async headers() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // Build-time responsive variants of article images (content-hashed file names).
        source: '/_img/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "object-src 'none'",
              // GA4 + Google Ads (gtag.js, on the public domain only): hosts from Google's tag CSP guide.
              `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://www.google.com`,
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "img-src 'self' data: blob: https:",
              "frame-src https://www.google.com https://maps.google.com https://www.googletagmanager.com",
              `media-src 'self' blob:${supabaseMediaSource ? ` ${supabaseMediaSource}` : ''}`,
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://www.googleadservices.com https://*.g.doubleclick.net https://ad.doubleclick.net https://pagead2.googlesyndication.com https://*.google.com https://*.google.com.vn",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
