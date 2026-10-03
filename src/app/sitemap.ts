import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';
import { legacyItems } from '@/lib/legacy-content';

type ChangeFrequency = 'weekly' | 'monthly' | 'always' | 'hourly' | 'daily' | 'yearly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  // All public URLs come from the immutable WordPress legacy content —
  // the sole source of truth for indexable routes.
  const legacyRoutes: MetadataRoute.Sitemap = legacyItems
    .filter((item) => item.path !== '/home-3')
    .map((item) => ({
      url: `${baseUrl}${item.path === '/' ? '/' : `${item.path}/`}`,
      lastModified: item.modified
        ? new Date(item.modified)
        : item.date
          ? new Date(item.date)
          : new Date(),
      changeFrequency: (item.kind === 'post' ? 'monthly' : 'weekly') as ChangeFrequency,
      priority: item.path === '/' ? 1 : item.kind === 'post' ? 0.6 : 0.8,
    }));

  const staticRoutes: MetadataRoute.Sitemap = ['/blog'].map((route) => ({
    url: `${baseUrl}${route}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.7,
  }));

  return [...legacyRoutes, ...staticRoutes];
}
