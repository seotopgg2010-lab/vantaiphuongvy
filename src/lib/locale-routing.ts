export type LocaleRoute =
  | { kind: 'not-found' }
  | { kind: 'redirect'; pathname: string }
  | { kind: 'rewrite'; pathname: string };

const DEFAULT_LOCALE = 'vi';

/** Resolve the single-language public URL contract without Next.js request state. */
export function resolveLocaleRoute(pathname: string, internalRewrite = false): LocaleRoute {
  if (pathname === '/en' || pathname.startsWith('/en/')) return { kind: 'not-found' };

  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    if (internalRewrite) return { kind: 'rewrite', pathname };
    return {
      kind: 'redirect',
      pathname: pathname.replace(new RegExp(`^/${DEFAULT_LOCALE}(/|$)`), '/') || '/',
    };
  }

  return { kind: 'rewrite', pathname: `/${DEFAULT_LOCALE}${pathname}` };
}
