import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { resolveLocaleRoute } from '@/lib/locale-routing';
import { resolveLegacyRequest } from '@/lib/legacy-redirects';

const isAdminPath = (pathname: string) => /^\/(?:vi\/)?admin(?:\/|$)/.test(pathname);

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Retired WordPress endpoints & short links (must run before the static-file skip: wp-login.php has a dot).
  const legacy = resolveLegacyRequest(pathname, searchParams);
  if (legacy?.kind === 'gone') {
    return new NextResponse('410 Gone', { status: 410, headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' } });
  }
  if (legacy?.kind === 'redirect') {
    return NextResponse.redirect(new URL(legacy.location, request.url), 301);
  }

  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // 2. Supabase auth only matters for the internal admin; public pages skip the network round-trip.
  const sessionResponse = isAdminPath(pathname) ? await updateSession(request) : null;
  if (sessionResponse?.headers.has('Location')) return sessionResponse;

  // 3. Single-locale URL contract: "/x" is served from "/vi/x"; "/vi/x" 308s to "/x"; "/en*" is 404.
  let response: NextResponse = sessionResponse ?? NextResponse.next();
  const localeRoute = resolveLocaleRoute(pathname, request.headers.get('x-default-locale-rewrite') === '1');

  if (localeRoute.kind === 'not-found') {
    return NextResponse.rewrite(new URL('/404', request.url), { status: 404 });
  }

  if (localeRoute.kind === 'redirect') {
    const url = request.nextUrl.clone();
    url.pathname = localeRoute.pathname;
    response = NextResponse.redirect(url, 308);
  } else if (localeRoute.pathname !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = localeRoute.pathname;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-default-locale-rewrite', '1');
    response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  // Carry refreshed auth cookies over to the rewrite/redirect response.
  if (sessionResponse && response !== sessionResponse) {
    for (const cookie of sessionResponse.headers.getSetCookie()) response.headers.append('Set-Cookie', cookie);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|wp-content/uploads/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff2?)$).*)',
  ],
};
