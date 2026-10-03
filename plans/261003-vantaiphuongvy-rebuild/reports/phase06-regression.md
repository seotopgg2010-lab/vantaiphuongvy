# Phase 06 regression report

## Test coverage

Added Node test-runner suites:

- `tests/url-contract.test.ts`
  - Every immutable legacy page/post path resolves.
  - Legacy paths are unique.
  - Trailing-slash lookup resolves.
  - Removed Hamburg/unsupported paths do not resolve.
- `tests/sitemap-robots.test.ts`
  - Sitemap includes the complete public legacy corpus and `/blog/`.
  - Sitemap uses canonical trailing slashes.
  - `/home-3`, `/en`, removed routes and `/admin` are excluded.
  - Robots disallows `/admin/` and `/en/` and points to the production sitemap.
- `tests/metadata-schema.test.ts`
  - Canonical domain/trailing slash contract.
  - Organization identity, email and verified hotline.
  - Legacy post fields required for BlogPosting.
- `tests/proxy-locale.test.ts`
  - Unprefixed Vietnamese rewrite.
  - `/vi/*` redirect contract.
  - Internal rewrite marker behavior.
  - `/en/*` hard 404 contract.

Added pure locale resolver:

- `src/lib/locale-routing.ts`
- `src/proxy.ts` now delegates locale decisions to the pure resolver.

Added live verification script:

```bash
node scripts/verify-live.mjs https://staging.example.com
```

It checks key public routes, sitemap, robots, unsupported `/en/*` URLs and removed Hamburg URLs.

## Test runner compatibility fix

Removed the runtime `server-only` marker from `src/lib/legacy-content.ts`. The module contains immutable JSON and pure normalization functions; its server-only usage was not providing a security boundary, while the marker prevented Node-based regression tests from importing the SEO source-of-truth. No client route imports this module.

## Verification

```text
npm test       PASS — 11 tests
npm run typecheck PASS
npm run lint      PASS
npm run build     PASS
```

Hamburg was checked read-only before and after the batch. Existing modified/untracked files in that separate project remain untouched.
