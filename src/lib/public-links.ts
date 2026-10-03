import pages from '@/legacy-content/pages.json';
import posts from '@/legacy-content/posts.json';

const normalize = (path: string) => path.split('?')[0].replace(/\/+$/, '') || '/';
const legacyPaths = new Set(
  [...pages, ...posts]
    .map((item) => normalize(new URL(item.link).pathname))
    .filter((path) => path !== '/home-3'),
);

export const PUBLIC_STATIC_PATHS = new Set(['/', '/blog', '/tim-kiem', '/robots.txt', '/sitemap.xml']);

export function isPublicRoute(path: string) {
  const normalized = normalize(path);
  return PUBLIC_STATIC_PATHS.has(normalized) || legacyPaths.has(normalized);
}

export function getLegacyRouteCount() {
  return legacyPaths.size;
}
