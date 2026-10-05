<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Vận tải Phương Vy — project rules

- Read `docs/DESIGN.md` before any UI work; run the `docs/REVIEW.md` checklist before merging UI, content or route changes, with screenshots at 1440×900, 768×1024 and 375×812.
- `src/legacy-content/pages.json` and `posts.json` are the immutable SEO source: never change a slug, canonical, Rank Math title/description or `/wp-content/uploads/**` URL. Regenerate derived files (`legacy-clean.json`, `id-map.json`, `legacy-markdown.json`, and the article-image variants in git-ignored `public/_img/`) with `npm run content:build`; `npm run build` runs it as `prebuild`.
- Discovery surfaces all derive from that corpus and must stay in sync when routes or content change: `src/app/sitemap.ts`, markdown twins `/<path>.md` (`src/lib/markdown-twins.ts`, static rewrite in `src/lib/public-routing.ts`), `/llms.txt`, `/llms-full.txt`, social cards `/og/<path>.png` (`src/lib/social-card.ts`), `Accept: text/markdown` negotiation (`src/proxy.ts`), image entries in the sitemap, and the related-link helpers in `src/lib/legacy-content.ts` (a new blog post needs a `POST_TOPICS` entry, a `HERO_LEADS` lead in `src/lib/marketing.ts`, and phrases in `src/content/contextual-links.ts` if other articles should link to it). Verify with `npm test` and `node scripts/crawl-check.mjs <base-url>`.
- Public routing is static: `src/lib/public-routing.ts` (locale rewrite, twins, `/vi` redirect) feeds `next.config.ts`, and `src/proxy.ts` runs only for its matcher allowlist (admin, WordPress 410 endpoints, `/?p=`, `/?page_id=`, `/?s=`, `Accept: text/markdown`). Never add a catch-all page matcher: on Vercel every proxy run is a billed function invocation and adds 50–80 ms to the response. `tests/public-routing.test.ts` guards this.
- Images from `/wp-content/uploads/**` rendered with `next/image` go through `UploadImage` (`src/components/site/upload-image.tsx`) so `src` stays the upload URL; keep `images.qualities`, `deviceSizes` and `imageSizes` to what layouts request (Vercel Hobby allows 5,000 image transformations a month). Vercel functions run in `sin1` (`vercel.json`).
- AI-crawler policy in `src/app/robots.ts` is an owner decision; do not change it without approval.
