import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/en/'],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
