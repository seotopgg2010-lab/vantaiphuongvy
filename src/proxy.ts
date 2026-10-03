import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { resolveLocaleRoute } from '@/lib/locale-routing';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip api, _next, and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return await updateSession(request);
  }

  // Get supabase response (handles auth cookies)
  const supabaseResponse = await updateSession(request);

  // If updateSession returned a redirect (e.g., auth check), honor it
  if (supabaseResponse.headers.has('Location')) {
    return supabaseResponse;
  }

  let localeResponse = supabaseResponse;
  const localeRoute = resolveLocaleRoute(
    pathname,
    request.headers.get('x-default-locale-rewrite') === '1',
  );

  if (localeRoute.kind === 'not-found') {
    return NextResponse.rewrite(new URL('/404', request.url), { status: 404 });
  }

  if (localeRoute.kind === 'redirect') {
    const url = request.nextUrl.clone();
    url.pathname = localeRoute.pathname;
    localeResponse = NextResponse.redirect(url, 308);
  } else if (localeRoute.pathname !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = localeRoute.pathname;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-default-locale-rewrite', '1');
    localeResponse = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
  }

  // Copy cookies from supabaseResponse to our new response (if we created a new one)
  if (localeResponse !== supabaseResponse) {
    const setCookieHeader = supabaseResponse.headers.getSetCookie();
    if (setCookieHeader && setCookieHeader.length > 0) {
      for (const cookie of setCookieHeader) {
        localeResponse.headers.append('Set-Cookie', cookie);
      }
    }
  }

  return localeResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
