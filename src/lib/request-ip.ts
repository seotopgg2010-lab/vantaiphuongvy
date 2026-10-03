import { isIP } from 'node:net';

type TrustedProxyMode = 'none' | 'vercel' | 'cloudflare' | 'reverse-proxy';

function getTrustedProxyMode(): TrustedProxyMode {
  const configuredMode = process.env.TRUSTED_PROXY?.trim().toLowerCase();
  if (
    configuredMode === 'vercel' ||
    configuredMode === 'cloudflare' ||
    configuredMode === 'reverse-proxy'
  ) {
    return configuredMode;
  }

  return 'none';
}

function normalizeIp(value: string | null): string | null {
  const candidate = value?.trim() || '';
  return isIP(candidate) === 0 ? null : candidate;
}

function getSingleHeaderIp(headers: Headers, headerName: string): string | null {
  const value = headers.get(headerName);
  if (!value || value.includes(',')) return null;
  return normalizeIp(value);
}

/**
 * Resolve the client address only from a header owned by the configured edge.
 * Never select the first X-Forwarded-For item: a direct client can spoof it.
 * A missing trusted address is represented by null so callers can skip only
 * the IP-based limit instead of placing every user in one shared bucket.
 */
export function getTrustedClientIp(headers: Headers): string | null {
  switch (getTrustedProxyMode()) {
    case 'vercel':
      return getSingleHeaderIp(headers, 'x-vercel-forwarded-for');
    case 'cloudflare':
      return getSingleHeaderIp(headers, 'cf-connecting-ip');
    case 'reverse-proxy':
      return getSingleHeaderIp(headers, 'x-real-ip');
    default:
      return null;
  }
}
