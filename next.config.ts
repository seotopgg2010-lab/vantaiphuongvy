import type { NextConfig } from "next";

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
  trailingSlash: true,
  distDir: process.env.HAMBURG_BUILD_DIR || '.next',
  async redirects() {
    return [];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      ...(supabaseHost ? [{ protocol: 'https' as const, hostname: supabaseHost, pathname: '/storage/v1/object/public/**', search: '' }] : []),
      { protocol: 'https', hostname: 'vantaiphuongvy.com', pathname: '/wp-content/uploads/**', search: '' },
      { protocol: 'https', hostname: 'www.vantaiphuongvy.com', pathname: '/wp-content/uploads/**', search: '' },
    ],
  },
  async headers() {
    return [
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
              `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              `media-src 'self' blob:${supabaseMediaSource ? ` ${supabaseMediaSource}` : ''}`,
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

