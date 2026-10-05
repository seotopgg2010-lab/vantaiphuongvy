/**
 * Static routing for the single-locale public site, used by next.config.ts.
 * These rules run on the CDN with no proxy invocation: public URLs stay
 * unprefixed and are served from the [lang] = "vi" segment, markdown twins
 * map to the /md route, and the internal /vi prefix 308s to the public URL.
 * src/proxy.ts only runs for the few requests listed in its matcher.
 */

export const DEFAULT_LOCALE = 'vi';

/** "/vi" and "/vi/x/" are never public URLs; the rest of the path (with its trailing slash) is kept. */
export const LOCALE_REDIRECTS = [
  { source: `/${DEFAULT_LOCALE}`, destination: '/', permanent: true },
  { source: `/${DEFAULT_LOCALE}/:path(.*)`, destination: '/:path', permanent: true },
];

export const PUBLIC_REWRITES = {
  // Markdown twins: "/x/y.md" (home "/index.md") are rendered by the internal /md route.
  // beforeFiles rules apply in order and chain: a direct request for /md is sent to a path
  // that 404s first, then the twin rules map public ".md" URLs onto /md.
  beforeFiles: [
    { source: '/md/:path*', destination: `/${DEFAULT_LOCALE}/md/:path*` },
    { source: '/index.md', destination: '/md' },
    { source: '/:path((?:[^/.]+/)*[^/.]+)\\.md', destination: '/md/:path' },
  ],
  // Every other public path is served from the default-locale segment ("/x/" -> "/vi/x/").
  // Internal and prerendered dynamic routes (/md, /og) keep their own path.
  afterFiles: [
    { source: '/', destination: `/${DEFAULT_LOCALE}` },
    { source: '/:path((?!(?:vi|md|og|_next|api)(?:/|$)).+)', destination: `/${DEFAULT_LOCALE}/:path` },
  ],
};
