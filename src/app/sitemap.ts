import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';
import { SITE_CONFIG } from '@/lib/constants';
import { latestPostDate, legacyItems, legacyPosts } from '@/lib/legacy-content';
import type { LegacyEntry } from '@/lib/legacy-types';
import { HERO_IMAGE, SERVICES } from '@/lib/marketing';

type ChangeFrequency = 'weekly' | 'monthly' | 'always' | 'hourly' | 'daily' | 'yearly' | 'never';

/** Google reads at most 1,000 images per URL. */
const MAX_IMAGES = 1000;

/**
 * Image-sitemap entries for a page: the photos it actually shows, as absolute
 * URLs of the preserved WordPress uploads (Rank Math listed images too, so this
 * keeps image-search parity after the migration).
 */
function imagesFor(item: LegacyEntry, baseUrl: string): string[] {
  const paths = item.path === '/'
    ? [HERO_IMAGE.src, ...SERVICES.map((service) => service.image), SITE_CONFIG.defaultImage]
    : [item.image, ...[...item.html.matchAll(/<img [^>]*src="(\/wp-content\/uploads\/[^"]+)"/g)].map((match) => match[1])];
  return [...new Set(paths.filter((path): path is string => Boolean(path)))].slice(0, MAX_IMAGES).map((path) => `${baseUrl}${path}`);
}

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
      images: imagesFor(item, baseUrl),
    }));

  // The blog index changes only when a post does; a build-time date would reset lastmod on every deploy.
  const staticRoutes: MetadataRoute.Sitemap = ['/blog'].map((route) => ({
    url: `${baseUrl}${route}/`,
    lastModified: latestPostDate ? new Date(latestPostDate) : undefined,
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.7,
    images: [...new Set(legacyPosts.map((post) => post.image).filter((image): image is string => Boolean(image)))].map((image) => `${baseUrl}${image}`),
  }));

  return [...legacyRoutes, ...staticRoutes];
}
