import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { resolveLegacyRequest } from '@/lib/legacy-redirects';
import { markdownPathFor, markdownRewriteTarget, prefersMarkdown } from '@/lib/markdown-paths';

/**
 * Runs only for the requests in `config.matcher`: the internal admin, retired
 * WordPress endpoints and short links, and agents asking for markdown. Public
 * pages, markdown twins and the locale prefix are static rules in next.config.ts
 * (src/lib/public-routing.ts), so ordinary page views never invoke this proxy.
 */
const isAdminPath = (pathname: string) => /^\/admin(?:\/|$)/.test(pathname);
/** Page URLs that have a markdown twin: no file extension; not internal, admin, locale-prefixed or the search page. */
const isPagePath = (pathname: string) => !pathname.includes('.') && !/^\/(?:api|_next|md|og|vi|en|tim-kiem)(?:\/|$)/.test(pathname) && !isAdminPath(pathname);

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Retired WordPress endpoints & short links.
  const legacy = resolveLegacyRequest(pathname, searchParams);
  if (legacy?.kind === 'gone') {
    return new NextResponse('410 Gone', { status: 410, headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' } });
  }
  if (legacy?.kind === 'redirect') {
    return NextResponse.redirect(new URL(legacy.location, request.url), 301);
  }

  // Content negotiation: a page URL requested with "Accept: text/markdown" answers with its twin.
  // The proxy returns the body itself instead of rewriting, because a rewrite takes the
  // destination's Vary header and loses "Vary: Accept" on the CDN. The twin is fetched from its
  // public, CDN-cached "/x.md" URL; the negotiated copy stays out of shared caches (private).
  if ((request.method === 'GET' || request.method === 'HEAD') && isPagePath(pathname) && prefersMarkdown(request.headers.get('accept'))) {
    const twinPath = markdownPathFor(pathname);
    let twin: Response | null = null;
    if (markdownRewriteTarget(twinPath)) {
      // Any failure (network, timeout) falls back to the HTML page below instead of an error.
      try { twin = await fetch(new URL(twinPath, request.url), { signal: AbortSignal.timeout(3000) }); } catch { twin = null; }
    }
    if (twin?.ok) {
      if (request.method === 'HEAD') await twin.body?.cancel();
      return new NextResponse(request.method === 'HEAD' ? null : twin.body, {
        headers: {
          'content-type': 'text/markdown; charset=utf-8',
          'x-robots-tag': 'noindex',
          vary: 'Accept',
          'cache-control': 'private, max-age=0, must-revalidate',
        },
      });
    }
    await twin?.body?.cancel();
  }

  // Supabase auth only matters for the internal admin.
  if (isAdminPath(pathname)) return updateSession(request);
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Internal admin: refreshes the Supabase session and guards staff-only routes.
    '/admin/:path*',
    // WordPress-only endpoints answer 410 Gone (src/lib/legacy-redirects.ts).
    '/wp-login\\.php',
    '/xmlrpc\\.php',
    '/wp-admin/:path*',
    '/wp-includes/:path*',
    '/wp-json/:path*',
    '/wp-content/plugins/:path*',
    '/wp-content/themes/:path*',
    '/wp-content/cache/:path*',
    '/sitemap:n(\\d+)\\.xml',
    '/locations\\.kml',
    // Old WordPress short links and search: /?p=123, /?page_id=45, /?attachment_id=67, /?s=term.
    { source: '/', has: [{ type: 'query', key: 'p' }] },
    { source: '/', has: [{ type: 'query', key: 'page_id' }] },
    { source: '/', has: [{ type: 'query', key: 'attachment_id' }] },
    { source: '/', has: [{ type: 'query', key: 's' }] },
    // Agents asking for markdown (q-values are checked in the proxy).
    { source: '/:path*', has: [{ type: 'header', key: 'accept', value: '.*text/markdown.*' }] },
  ],
};
