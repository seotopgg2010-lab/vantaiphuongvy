const DEFAULT_SITE_URL = 'https://vantaiphuongvy.com';

/**
 * Return the single public origin used by metadata, sitemap and JSON-LD.
 * The production host redirects the non-www origin, so canonical URLs should
 * point directly at the final host. Individual page URL builders append the
 * trailing slash required by the legacy WordPress URL contract.
 */
export function getSiteUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;

  try {
    const url = new URL(rawUrl);
    if (url.hostname.toLowerCase() === 'vantaiphuongvy.com') {
      url.hostname = 'vantaiphuongvy.com';
    }
    url.pathname = url.pathname.replace(/\/+$/, '');
    return url.toString().replace(/\/$/, '');
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/** Build a locale-aware internal URL while keeping the default locale unprefixed. */
export function localizedPath(locale: string, path: string): string {
  if (!path || path.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedPath.replace(/^\/vi(?=\/|$)/, '') || '/';
}

/** Normalize display phone strings for standards-compliant tel: links. */
export function toTelHref(phone: string): string {
  const compact = phone.replace(/[^\d+]/g, '');
  const international = compact.replace(/^(\+\d{1,3})0(?=\d)/, '$1');
  return `tel:${international}`;
}
