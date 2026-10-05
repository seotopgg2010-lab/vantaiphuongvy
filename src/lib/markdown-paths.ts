/**
 * URL contract for markdown twins: every indexable page `/x/y/` also serves
 * `/x/y.md` (home: `/index.md`). Kept free of content imports so the proxy
 * bundle stays small.
 */

/** Internal route that renders the twins (reachable only through the proxy rewrite). */
export const MARKDOWN_ROUTE = '/md';

/** Public markdown URL path for a page path ("/", "/blog", "/x/y/"). */
export function markdownPathFor(pagePath: string): string {
  const path = pagePath.replace(/\/+$/, '');
  return path ? `${path}.md` : '/index.md';
}

/** Rewrite target for a public "*.md" request, or null when the path is not a twin URL. */
export function markdownRewriteTarget(pathname: string): string | null {
  if (pathname === '/index.md') return MARKDOWN_ROUTE;
  const match = pathname.match(/^((?:\/[^/.]+)+)\.md$/);
  return match ? `${MARKDOWN_ROUTE}${match[1]}` : null;
}
