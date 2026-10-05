import idMap from '@/legacy-content/id-map.json';

export type LegacyRequestDecision =
  | { kind: 'gone' }
  | { kind: 'redirect'; location: string }
  | null;

/**
 * WordPress-only endpoints that will never exist again. Returning 410 (instead
 * of 404) tells crawlers to drop them quickly — including the suspicious
 * numbered sitemaps (sitemap980.xml …) found in the live robots.txt.
 */
const GONE_PATTERNS = [
  /^\/wp-login\.php$/i,
  /^\/xmlrpc\.php$/i,
  /^\/wp-admin(\/|$)/i,
  /^\/wp-includes(\/|$)/i,
  /^\/wp-json(\/|$)/i,
  /^\/wp-content\/(plugins|themes|cache)(\/|$)/i,
  /^\/sitemap\d+\.xml$/i,
  /^\/locations\.kml$/i,
];

const IDS = idMap as Record<string, string>;
const withSlash = (path: string) => (path === '/' ? '/' : `${path}/`);

/** Pure decision function for legacy WordPress requests (unit-tested, used by src/proxy.ts). */
export function resolveLegacyRequest(pathname: string, searchParams: URLSearchParams): LegacyRequestDecision {
  if (GONE_PATTERNS.some((pattern) => pattern.test(pathname))) return { kind: 'gone' };

  // Old WordPress short links: /?p=123, /?page_id=45 → canonical permalink; /?attachment_id=67 → the page it belongs to.
  if (pathname === '/') {
    const id = searchParams.get('p') || searchParams.get('page_id') || searchParams.get('attachment_id');
    if (id && /^\d+$/.test(id)) {
      const target = IDS[id];
      return { kind: 'redirect', location: target ? withSlash(target) : '/' };
    }
    if (searchParams.has('s')) return { kind: 'redirect', location: `/tim-kiem/?q=${encodeURIComponent(searchParams.get('s') || '')}` };
  }
  return null;
}
