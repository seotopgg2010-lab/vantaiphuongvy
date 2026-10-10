/**
 * URL contract for markdown twins: every indexable page `/x/y/` also serves
 * `/x/y.md` (home: `/index.md`). Kept free of content imports so the proxy
 * bundle stays small.
 */

/** Internal route that renders the twins (reachable only through the static rewrite in src/lib/public-routing.ts). */
export const MARKDOWN_ROUTE = '/md';

/** Public markdown URL path for a page path ("/", "/blog", "/x/y/"). */
export function markdownPathFor(pagePath: string): string {
  const path = pagePath.replace(/\/+$/, '');
  return path ? `${path}.md` : '/index.md';
}

/**
 * True when an Accept header ranks text/markdown at least as high as text/html
 * (q-values honoured). Browsers never list text/markdown, so they always get HTML;
 * agents sending "Accept: text/markdown" get the page's markdown twin.
 */
export function prefersMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false;
  let markdown = 0;
  let html = 0;
  for (const range of accept.split(',')) {
    const [type, ...params] = range.split(';').map((part) => part.trim().toLowerCase());
    const qParam = params.find((param) => param.startsWith('q='));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    if (!Number.isFinite(q)) continue;
    if (type === 'text/markdown') markdown = Math.max(markdown, q);
    else if (type === 'text/html') html = Math.max(html, q);
  }
  return markdown > 0 && markdown >= html;
}

/** Rewrite target for a public "*.md" request, or null when the path is not a twin URL. */
export function markdownRewriteTarget(pathname: string): string | null {
  if (pathname === '/index.md' || pathname === '/index.html.md') return MARKDOWN_ROUTE;
  const match = pathname.match(/^((?:\/[^/.]+)+)\.md$/);
  return match ? `${MARKDOWN_ROUTE}${match[1]}` : null;
}
