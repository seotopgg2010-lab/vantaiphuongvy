import { legacyItems, normalizeLegacyPath, RETIRED_PATHS } from './legacy-content';

const legacyPaths = new Set(legacyItems.map((item) => item.path).filter((path) => !RETIRED_PATHS.has(path)));

export const PUBLIC_STATIC_PATHS = new Set(['/', '/blog', '/tim-kiem', '/robots.txt', '/sitemap.xml']);

export function isPublicRoute(path: string) {
  const normalized = normalizeLegacyPath(path);
  return PUBLIC_STATIC_PATHS.has(normalized) || legacyPaths.has(normalized);
}

export function getLegacyRouteCount() {
  return legacyPaths.size;
}
