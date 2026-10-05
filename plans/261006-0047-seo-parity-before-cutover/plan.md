# SEO parity before DNS cutover

**Status:** done locally — push to `main` waits for an account with write access · **Branch:** `feat/ux-seo-ax-optimization` · **Source:** comparison of the live WordPress site with the local production build (2026-10-06)

## Outcome

Nothing that the live WordPress site shows to Google today is lost when `vantaiphuongvy.com` moves to the Next.js build, and the current Vercel production runs the latest code.

## Gaps and fixes

| # | Gap on the rebuild | Fix | Source of truth |
|---|---|---|---|
| 1 | Star ratings (69 pages, `CreativeWorkSeries` + `AggregateRating`) dropped | Extract the kk Star Ratings payload in `scripts/build-legacy.ts` (live markup where the export has none), show it under the hero, emit the same JSON-LD | `pages.json` / `posts.json` (read-only widget), `live-ratings.json` |
| 2 | 311 comments on `/blog/can-tim-doi-tac-van-chuyen-hang-hoa/` (+1 elsewhere) dropped | Snapshot approved comments with readers' phone numbers and e-mails masked (public repo), render read-only threads; keep them out of markdown twins and llms files | WP REST `wp/v2/comments` → `src/legacy-content/comments.json` |
| 3 | ~220 upload files still served by WordPress (image sitemap, live `<img src>`) not mirrored | Mirror script also reads the WP image sitemaps and a snapshot of live image URLs | `page-sitemap.xml`, `post-sitemap.xml`, `live-images.json` |
| 4 | Warehouse list (20 addresses in the WP footer) dropped | `src/lib/warehouses.ts` (not in client-imported `SITE_CONFIG`); footer list, contact page, matching route pages | WP footer template |
| 5 | Home copy rewritten (6% of original phrases kept) | Restore the original company intro and full "why choose" paragraphs | WP home page |
| 6 | No Search Console / Pinterest verification, GA4, Google Ads | Verification metas; GA4 + Ads for every visitor on the public domain, like WordPress (owner decision); CSP for Ads | WP `<head>` (GTM container is empty, UA is retired) |
| 7 | `/index.php`, `?attachment_id=`, `/blog/` robots meta, uppercase URLs | Static redirect; proxy redirect to the parent post; robots metadata; client-side fallback on the 404 page | WP REST `wp/v2/media` → `attachments.json` |
| 8 | Vercel production runs round 2 | Push the verified branch to `main` | — |

`/locations.kml` stays 410: the WordPress file has no address or coordinates.

## Acceptance

- Re-running the WordPress-vs-build comparison shows ratings on the same 69 pages, FAQ markup on every page WordPress marked up, comments on both posts, all WordPress-served upload paths present locally, warehouses on every page.
- `npm test`, `npm run lint`, `npm run typecheck`, production build and `scripts/crawl-check.mjs` pass; no new proxy matcher that matches ordinary page views.
- Screenshots at 1440×900, 768×1024, 375×812 for home, a route page, the comment post and the contact page; no horizontal overflow at 320 px.
- Vercel production serves the pushed SHA.

## Out of scope

DNS cutover; Search Console baseline export and post-cutover monitoring (owner's Google account).
