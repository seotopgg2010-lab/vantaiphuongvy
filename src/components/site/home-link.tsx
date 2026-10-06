import type { AnchorHTMLAttributes } from 'react';

/**
 * Link to the home page as a plain anchor. "/" is served by a static rewrite to the [lang]
 * segment, and Vercel answers its React Server Component requests (prefetch and client
 * navigation) with 404 or HTML. next/link would fire those failing prefetches on every page and
 * still fall back to a full page load; a plain anchor loads the CDN-cached home page directly.
 */
export function HomeLink(props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  // A full page load is intended here (see above), so next/link is deliberately not used.
  // eslint-disable-next-line @next/next/no-html-link-for-pages
  return <a href="/" {...props} />;
}
