<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Vận tải Phương Vy — project rules

- Read `docs/DESIGN.md` before any UI work; run the `docs/REVIEW.md` checklist before merging UI, content or route changes, with screenshots at 1440×900, 768×1024 and 375×812.
- `src/legacy-content/pages.json` and `posts.json` are the immutable SEO source: never change a slug, canonical, Rank Math title/description or `/wp-content/uploads/**` URL. Regenerate derived files (`legacy-clean.json`, `id-map.json`, `legacy-markdown.json`) with `npm run content:build`.
- Discovery surfaces all derive from that corpus and must stay in sync when routes or content change: `src/app/sitemap.ts`, markdown twins `/<path>.md` (`src/lib/markdown-twins.ts`, rewritten in `src/proxy.ts`), `/llms.txt`, `/llms-full.txt`, social cards `/og/<path>.png` (`src/lib/social-card.ts`). Verify with `npm test` and `node scripts/crawl-check.mjs <base-url>`.
- AI-crawler policy in `src/app/robots.ts` is an owner decision; do not change it without approval.
