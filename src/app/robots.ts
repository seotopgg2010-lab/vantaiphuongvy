import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /en/ is not disallowed: those retired URLs answer 404, which crawlers must see to drop them.
        disallow: ['/admin/'],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
