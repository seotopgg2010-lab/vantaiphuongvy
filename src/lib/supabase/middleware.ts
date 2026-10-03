import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const locale = request.nextUrl.pathname.match(/^\/(vi|en)(?:\/|$)/)?.[1] || 'vi';
  const adminBase = locale === 'vi' ? '/admin' : `/${locale}/admin`;
  const cleanPath = request.nextUrl.pathname.replace(/^\/(vi|en)(?=\/|$)/, '');

  // Skip Supabase auth if credentials are not configured
  if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('http')) {
    // Still protect admin routes by redirecting to login
    if ((cleanPath === '/admin' || cleanPath.startsWith('/admin/')) && cleanPath !== '/admin/login') {
      return NextResponse.redirect(new URL(`${adminBase}/login`, request.url));
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  // Refresh auth token
  const { data: { user } } = await supabase.auth.getUser();
  const isStaff = ['admin', 'editor', 'support'].includes(user?.app_metadata?.role);
  const redirectWithCookies = (path: string) => {
    const response = NextResponse.redirect(new URL(path, request.url));
    supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
    return response;
  };

  // Protect admin routes
  if (cleanPath === '/admin' || cleanPath.startsWith('/admin/')) {
    if (cleanPath === '/admin/login') {
      if (isStaff) {
        return redirectWithCookies(adminBase);
      }
      return supabaseResponse;
    }
    if (!isStaff) {
      return redirectWithCookies(`${adminBase}/login`);
    }
  }
  return supabaseResponse;
}
