# Code review: SEO parity before DNS cutover

Date: 2026-10-06 (Asia/Saigon) · Branch `feat/ux-seo-ax-optimization` · Plan `plans/261006-0047-seo-parity-before-cutover/plan.md`

## Scope

- Tracked diff (28 files, +291/−50) plus the untracked `scripts/scrape-wp-extras.ts`, `src/components/site/{rating-summary,legacy-comments,warehouse-list}.tsx`, `tests/wordpress-parity.test.ts` and the four snapshots in `src/legacy-content/`. The 214 new upload binaries were checked by magic bytes only.
- The working tree changed during the review: `warehouse-list.tsx` and `site-footer.tsx` were edited at 01:27, and the corpus was regenerated at 01:28. The findings below are against the tree as of 01:40; tests, `tsc` and `eslint` were run after those edits.
- Evidence sources:
  - local prerender `.next-build` (01:28);
  - corpus diff against `HEAD`;
  - read-only GETs to live WordPress: home, `/lien-he/`, the comment post, a JSON-LD crawl of the 95 export URLs, and two `?attachment_id=` redirects;
  - read-only GETs to current Vercel production.

## Overall assessment

The parity work is mostly accurate:
- Ratings, comment order and text, warehouse list, attachment redirects and tracking IDs all match live WordPress.
- The immutable SEO fields are untouched.
- The proxy allowlist stays narrow.

There are three problems to fix before pushing:
- **Readers' phone numbers would go into a public repo.**
- **Comment dates render one day late on Vercel.**
- **Google Ads loads under analytics-only consent.**

## Critical (block the push)

### 1. Readers' names and phone numbers would be published in a public GitHub repo
- **Where:**
  - `scripts/scrape-wp-extras.ts:98-101` writes `src/legacy-content/comments.json` (untracked; author names and comment HTML).
  - `scripts/build-legacy.ts:479-490,530` copies the same text into the tracked `src/legacy-content/legacy-clean.json`.
- **Evidence:**
  - `gh repo view seotopgg2010-lab/vantaiphuongvy` returns `"visibility":"PUBLIC"`.
  - About 59 of the 312 comments contain phone numbers, e.g. comment 32 ("Số điện thoại: 09…") and comment 48 ("đt 09…"); numbers redacted in this report.
  - The working-copy `legacy-clean.json` already contains such a number. `HEAD` does not, so nothing has leaked yet.
- **Failure scenario:** plan step 8 (push to `main`) puts a bulk, machine-readable list of reader names and phone numbers into public git history.
  - This is strictly more exposure than `llms-full.txt`, which this change deliberately excludes comments from for exactly this reason.
  - Once pushed, a reader's deletion request (Decree 13/2023) can be honored on the web page but not in git history, forks or code archives.
- **Fix (owner decision):** pick one before committing.
  - (a) Make the repository private. The owner is a personal account (`gh api users/...` returns `User`); confirm the Vercel Git integration keeps access.
  - (b) Keep comments out of git and supply them at build time from a private source. Do not just git-ignore the file: `build-legacy.ts:466` silently falls back to `[]` when `comments.json` is missing, so production would quietly lose the comments. Make a missing snapshot fail the build.
  - (c) Mask the phone digits in the snapshot. This is a trade-off between parity and privacy.

## High

### 2. Google Ads tag loads under consent the banner describes as analytics only
- **Where:**
  - `src/components/shared/Analytics.tsx:79` adds `gtag('config', 'AW-830959523')`.
  - The banner copy (`:55`) says "chỉ dùng cookie phân tích khi bạn đồng ý" and the button (`:61`) reads "Đồng ý phân tích".
- **Evidence:** `/chinh-sach-bao-mat` mentions no cookies, Google or remarketing (corpus text search).
- **Failure scenario:** a visitor who agrees to analytics also gets Google Ads tracking (`_gcl_au` conversion linker, remarketing hits to `googleads.g.doubleclick.net`). The UI misstates the purpose of the consent, and consent is not specific to that purpose.
- **Fix:**
  - Either say what loads ("phân tích và quảng cáo") and update the privacy policy,
  - or keep analytics-only consent and add Consent Mode v2 defaults (`ad_storage`, `ad_user_data`, `ad_personalization`: `denied`), granting ads only on an explicit choice.

### 3. Comment dates render one day late on the Vercel build (77 of 312)
- **Where:**
  - `src/components/site/legacy-comments.tsx:20` calls `formatDateVi(comment.date)`.
  - `src/components/site/post-card.tsx:20` (`new Date(date)`) parses `comment.date`, which `scripts/build-legacy.ts:486` stores without an offset (`2019-06-15T23:55:57`).
- **Evidence:**
  - WordPress dates are site-local +07:00: the Rank Math sitemap `lastmod` for a post modified at `17:34` is `10:34+00:00`.
  - ECMAScript parses an offset-less date-time in the host timezone.
  - Under `TZ=UTC`, 77 of 312 comments shift +1 day. Example: comment 48 shows "16/06/2019" while live WordPress shows "15/06/2019 at 11:55 Chiều".
  - The Vercel build host is UTC: current production already renders the post update date as "Cập nhật 29/10/2025" where WordPress has 28/10/2025.
  - Local builds (Asia/Saigon) look correct, so screenshots will not catch this.
- **Why it matters:** this breaks the `docs/REVIEW.md` item "ngày bài viết hiển thị đúng" and the "giữ nguyên nội dung" claim.
- **Fix:**
  - Store dates with an explicit offset in `build-legacy.ts` (`${date}+07:00`), or scrape `date_gmt` and store `…Z`.
  - Apply the same fix to post `date`/`modified` (see Informational).
  - Add a test that every comment and post date has an explicit offset.

## Medium

### 4. Cookie banner is in the static HTML of every page and flashes for returning visitors
- **Where:** `src/components/shared/Analytics.tsx:35-36,51`.
- **Cause:** `measurementId` now always falls back to `TRACKING.ga4`, and the server snapshot is `() => null`, so the banner is prerendered.
- **Evidence:**
  - The banner text is present in all 97 `.next-build/server/app/**.html` files.
  - Current production renders no banner because the env var is unset, so this is new in production.
- **Failure scenario:** every page view by a visitor who already accepted or declined shows the banner until hydration (about 0.3–3 s on mid-range or low-end phones). On mobile it covers roughly 150 px above the call bar.
- **Fix:** have the server snapshot return a sentinel (e.g. `'unknown'`) and render nothing until the client snapshot is known.

### 5. `scrape-wp-extras` can write a silently partial snapshot, and the final run cannot be redone
- **Where:** `scripts/scrape-wp-extras.ts:77,84-85,101-110`.
- **Problem (a) — `--origin` is only partly honored:** the live-page crawl fetches `item.link`, which always points at `https://vantaiphuongvy.com/…`.
  - Phase 07 keeps WordPress on its old origin for at least 7 days after cutover.
  - A run with `--origin <old WP>` would take comments and media from WordPress but crawl the new Next.js site for `live-images.json` and `live-ratings.json`.
  - WordPress-only image URLs would then silently drop out, and the mirror would never fetch them.
- **Problem (b) — failures go unnoticed:** there is no `response.ok` check and no retry.
  - A 429, a 5xx or a security-plugin challenge page is parsed as a normal page, and its images and rating silently go missing.
  - A network error crashes the run after `comments.json` and `attachments.json` have already been overwritten.
- **Fix:**
  - Build crawl URLs from `ORIGIN` (`new URL(new URL(link).pathname, ORIGIN)`).
  - Reuse the retrying fetch and throw on non-2xx responses.
  - Write the four files only after every fetch has succeeded.
  - Fail if any page that had a rating in the previous snapshot lost it.

## Low

6. **Preview deployments feed the production GA4 property and Ads remarketing** (`Analytics.tsx:35,40`). `NODE_ENV === 'production'` on every Vercel deployment, including previews and `vantaiphuongvy.vercel.app` before cutover. Gate on `NEXT_PUBLIC_VERCEL_ENV === 'production'` or the host. `!measurementId` is now dead code.
7. **The lowercase-retry script is an open-redirect primitive if the edge stops normalizing `//`** (`src/app/[lang]/not-found.tsx:19`).
   - For a request to `//EVIL.com/`, `location.replace('//evil.com/')` would leave the site.
   - It is not exploitable today: Vercel and Next 308-normalize `//` before rendering (probed 2026-10-05).
   - It becomes exploitable if a non-normalizing CDN is put in front after the DNS move.
   - Fix: use `location.replace(location.origin + encodeURI(l) + …)`, or bail when `l` starts with `//`.
8. **Doc drift:** `AGENTS.md:17` still lists the proxy allowlist without `/?attachment_id=`.
9. **Ratings are missing from the markdown twins** (`src/lib/markdown-twins.ts:121-135`). The visible "4,9/5 (26 bình chọn)" under the H1 has no twin counterpart. Add one header line so the twins keep the "derived from the same content" rule.
10. **The comment post now weighs about 3× more** (`legacy-comments.tsx`).
    - Elements: 942 → 3,376. Lighthouse flags an excessive DOM above 1,400.
    - HTML: 251 → 766 KB (gzip 37 → 87 KB).
    - RSC payload: 133 → 411 KB. All of it is hydrated.
    - It is still lighter than the WordPress page (966 KB).
    - Mitigate by hoisting the repeated per-comment classes into a parent CSS rule.
11. **The 20 warehouses ship in client JS on every page.** The client component `site-header.tsx` imports `SITE_CONFIG`; the data appears in 2 `.next-build/static/chunks`. Export a separate top-level `WAREHOUSES` const.
12. **Test gaps** (`tests/wordpress-parity.test.ts`):
    - `:23-29` compares JSON-LD with `item.rating`, which is the same source, so it is tautological. Only 2 pages are checked against live, although `live-ratings.json` has all 69: assert equality for all of them, with entity decoding.
    - The twin exclusion check covers a single paragraph. Assert that no comment paragraph appears in `renderLlmsFull()`.
    - Nothing guards date offsets.
13. **Checklist conflict:** `docs/REVIEW.md:15` says "không script bên thứ ba mới", but this change enables GA4 + Ads (an accepted plan item). Record the owner's decision there.

## Informational (outside the diff, relevant to the parity goal)

- **Same root cause as finding 3, already in production:**
  - 6 post dates render +1 day on the Vercel build.
  - The sitemap `lastmod` is 7 h ahead (`new Date(item.modified)` in `src/app/sitemap.ts:34-38`).
  - JSON-LD `datePublished`/`dateModified` have no offset.
- **FAQ question coverage:** every one of the 42 WordPress FAQPage pages also gets FAQPage here, but question counts differ on 11 pages. This comes from the earlier extractor; only `an-giang` and `dau-nhot` changed in this diff.
  - Example: `/van-chuyen-hang-hoa/quang-binh` has 15 live questions, 14 of them visible in the rebuilt body, but only 2 are emitted.
- **Schema not carried over:** live `Product` (7 route pages, with `price: "0"` offers and `aggregateRating`) and `LocalBusiness` (24 pages) JSON-LD is not reproduced. Leaving out Product is defensible on policy grounds, but record it as deliberate.
- **Upload size vs Vercel limits:** the mirror is now 125 MB, over Hobby's 100 MB cap for CLI source uploads. Git deploys are unaffected; avoid `vercel deploy` from a laptop as a rollback path.

## Verified OK

- **Immutable SEO source:**
  - Corpus diff against `HEAD` shows only `rating`, `comments`, `commentCount` and `faq` changed.
  - `html`, `seo`, paths and slugs are identical for all 95 entries, and `legacy-markdown.json` is unchanged.
- **Ratings:**
  - 69 pages: 68 from export payloads plus 1 live-only (`/blog/kich-thuoc-thung-xe-tai…`).
  - All 69 equal the live CreativeWorkSeries values, apart from entity and whitespace differences (`&amp;` on `phu-yen`, a trailing space on `thai-binh`).
  - The prerendered `da-nang` page shows "4,9/5 (26 bình chọn)", matching its JSON-LD.
  - Every template that can carry a rating renders `RatingSummary`; `/` and `/home-3` have none.
- **Comments:**
  - Plain text via cheerio `.text()`, rendered as React text nodes.
  - Live and rebuilt pages have 311/311 anchors in identical DOM order, and the body text matches.
  - Comments do not appear in `legacy-markdown.json`, twins, llms files, client bundles or the search page.
  - No duplicate element IDs on the post.
- **Routing:**
  - The proxy matcher only adds `/` with an `attachment_id` query, and the guard test is updated.
  - `?attachment_id=3000` redirects to the parent post and orphan `1202` to `/`, the same as live WordPress 301s.
  - `/index.php` is a static redirect.
- **Head tags:**
  - `google-site-verification` and `p:domain_verify` render on the home page.
  - The verification, GA4 and AW IDs equal the live WordPress `<head>`.
  - WordPress fires no Ads conversion labels, so base-config parity is enough.
- **CSP:** the new hosts match Google's current tag CSP guide (GA4 with Ads features, plus Google Ads).
- **Banner position:** the Tailwind value compiles to `calc(4.25rem + env(safe-area-inset-bottom) + .75rem)`, consistent with the action bar's `h-[4.25rem]` + safe area and `lg:hidden`.
- **Lowercase retry:** executable only in `_not-found.html` (elsewhere it is serialized RSC data), and it terminates after at most one redirect.
- **Warehouses:** identical to the live WordPress footer (20 entries, same order). Mapped paths are indexable, and twins carry the route band and the contact list.
- **Uploads:** all 214 new files are real JPEG/PNG matching their extension, with no SVGs (46.2 MB).
- **FAQ parser:** the `Hỏi:` pattern is anchored, so "câu hỏi:" in mid-sentence is not matched.
- **Robots:** `pageMetadata` robots only affects `/blog`; `/tim-kiem` keeps `noindex`.

## Metrics

- Typecheck: `tsc --noEmit` clean.
- Lint: `eslint` on all changed or new files reports 0 issues.
- Tests: `npm test` 49/49 pass. Coverage was not measured.

## Unresolved questions

1. **Are the ratings genuine?** Every kk widget payload has `readonly: "1"`; 53 of 69 pages score exactly 4.9; 48 of 53 route pages have 15–30 votes. If the votes were seeded rather than cast by visitors, republishing AggregateRating breaks Google's review-snippet guidelines, and the manual-action risk moves to the new site. Owner to confirm.
2. **Finding 1 remedy:** private repo, keeping comments out of git, or masking? Owner decision.
3. **Finding 2 remedy:** change the consent copy or use Consent Mode? Owner or legal decision.
4. **Fragment links into closed `<details>`:** do browsers open them on fragment navigation? 299 of 311 comment anchors sit inside `<details>`. Verify `#comment-<id>` deep links on Safari and Firefox.
