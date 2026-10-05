# Code review: round 3 static routing, content pipeline, article images (uncommitted, `feat/ux-seo-ax-optimization`)

Date: 2026-10-05 (Asia/Saigon). Read-only review. I did not build, start servers or open browsers.

## Scope

- Routing: `next.config.ts`, `src/lib/public-routing.ts` (new), `src/proxy.ts`, `vercel.json` (new), `tests/public-routing.test.ts` (new), and the deleted `src/lib/locale-routing.ts` and `tests/proxy-locale.test.ts`.
- Pipeline: `scripts/build-legacy.ts`, `scripts/legacy-images.ts` (new), `scripts/legacy-markdown.ts`, `src/content/contextual-links.ts` (new), and the regenerated `legacy-clean.json` and `legacy-markdown.json`.
- UI and SEO: `src/components/site/upload-image.tsx` (new), the templates, `seo.ts`, `markdown-twins.ts`, `marketing.ts`, `crawl-check.mjs`, and the docs.

### Evidence used

- **Tests:** I ran `npx tsx --test tests/public-routing.test.ts tests/internal-links.test.ts tests/legacy-clean.test.ts` once. 21/21 passed.
- **Compiled build output from round 3:** `.next-r3/routes-manifest.json` (redirect and rewrite regexes) and `.next-r3/server/functions-config-manifest.json` (proxy matchers). I evaluated those regexes against sample paths myself rather than relying on the unit-test emulation.
- **Corpus diff:** I compared the HEAD corpus with the working-tree corpus. This covered SEO fields, `<img src>` sets, element ids, TOC, FAQ, links, headings, lists and image sizes.
- **Image pipeline on bad files:** I ran `buildArticleImages` in the scratchpad against a truncated JPEG and a fake JPEG.
- **Live probes:** a few GET requests to `https://vantaiphuongvy.vercel.app` to check how Vercel handles `//`, `\` and percent-encoded redirect parameters.

## Overall assessment

The local behaviour is correct, and the immutable SEO contract holds:

- No slug, SEO field or `<img src>` changed on any of the 95 pages.
- All 1,822 existing element ids are still present.

I found **no Critical issue**.

The biggest remaining risk has not been tested: how Vercel compiles the new static rewrites for RSC navigation and server actions. Only `next start` exercised them (see "Must verify before production").

The confirmed defects are Medium or Low. They are:

- missing error handling around the proxy's self-fetch
- one bad upload can now fail every build
- the committed corpus points at git-ignored files
- a few content-quality slips in contextual linking

## Must verify before production (unverified, High if it fails)

**V1. How Vercel compiles static rewrites for RSC requests, segment prefetch and server-action POSTs.**

- **Files:** `src/lib/public-routing.ts:28-31` and `next.config.ts:43-45`.
- **Why it matters:** before this change, the `/` → `/vi` mapping ran as a proxy rewrite. Now it is an `afterFiles` config rewrite, and Vercel's builder turns that into its own routes. That conversion is where RSC suffixes (`/index.rsc`, `*.segments/*.segment.rsc`) and `.action` outputs get mapped, and nothing local tests it.
- **Suspected failure:** the compiled root rule is `^/(?:/)?$`. If Vercel's RSC step rewrites `/` to `/index.rsc` first, the catch-all would send it to `/vi/index.rsc`, which does not exist.
- **Effect if so:** the header logo/home link (prefetched on every page) would 404 its RSC fetch, and client navigation to Home would become a full reload. Prefetch requests would also be wasted.
- **Check on a preview** (with Deployment Protection bypassed):

```sh
B=https://<preview>.vercel.app
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' -H 'RSC: 1' "$B/"
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' -H 'RSC: 1' -H 'Next-Router-Prefetch: 1' -H 'Next-Router-Segment-Prefetch: /_tree' "$B/"
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' -H 'RSC: 1' "$B/van-chuyen-hang-hoa/ha-noi/"
curl -sI "$B/faq/" | grep -iE 'x-vercel-(id|cache)'   # expect HIT and no function region (hkg1::xxxx, not ::sin1::)
curl -sD - -o /dev/null -H 'Accept: text/markdown' "$B/faq/"   # 200 text/markdown, Vary: Accept
```

- **Expected:** 200 with `text/x-component` for the three RSC requests.
- **Also do:** submit the quote form once on the preview (a server action on a rewritten page).
- **If `/` fails:** map the root explicitly, or keep a one-path proxy rewrite only for `/`.

## Critical

None found.

## High

None confirmed (see V1).

## Medium

### M1. The proxy's self-fetch has no error handling and no timeout, and it leaks unread bodies

- **Location:** `src/proxy.ts:33-45`.
- **Failure scenarios:**
  - `await fetch(new URL(twinPath, request.url))` can throw on DNS failure, connection reset, or the platform refusing an internal request. The exception escapes `proxy()`, so an agent sending `Accept: text/markdown` gets a 500 (on Vercel, `MIDDLEWARE_INVOCATION_FAILED`) instead of the HTML page.
  - There is no timeout, so a hung upstream holds the middleware until the function limit.
  - For HEAD requests, and whenever `!twin.ok` (every 404 twin), the response body is never read or cancelled. On reused Fluid instances, these unread undici bodies hold connections until garbage collection.
- **Fix:**

```ts
let twin: Response | null = null;
if (markdownRewriteTarget(twinPath)) {
  try { twin = await fetch(new URL(twinPath, request.url), { signal: AbortSignal.timeout(3000) }); }
  catch { twin = null; }           // fall back to the HTML page
}
if (twin?.ok) {
  if (request.method === 'HEAD') await twin.body?.cancel();
  return new NextResponse(request.method === 'HEAD' ? null : twin.body, { headers: { /* unchanged */ } });
}
await twin?.body?.cancel();
```

### M2. One corrupt or unsupported upload now fails the whole build, and the error does not name the file

- **Location:** `scripts/legacy-images.ts:40-71` (worker with no try/catch; `Promise.all` at line 71), and `scripts/build-legacy.ts:490-492` (`process.exit(1)`).
- **Verified in the scratchpad:**
  - A truncated JPEG passes `metadata()`, then throws `VipsJpeg: premature end of JPEG image`.
  - An HTML file saved as `.jpg` throws `Input buffer contains unsupported image format`.
  - Neither message includes the path.
- **Why it matters:** `prebuild` runs this script on Vercel, so a single bad file from `content:mirror` blocks every deploy. Before this change, such a file was just copied.
- **Fix:** wrap the per-image body in try/catch, log `legacy-images: <path> skipped (<message>)`, and keep the plain `<img>`. The existing test, which requires width/height/srcset on every image, still flags the problem in CI without blocking production deploys.

### M3. The committed corpus references git-ignored `/_img/` files

- **Location:** `.gitignore:58` (`/public/_img/`), `package.json` (no `predev` script), and `tests/legacy-clean.test.ts:48,62`.
- **Failure scenario:**
  - `legacy-clean.json` in git contains `srcset="/_img/…"`.
  - After a fresh clone or pull, `npm run dev` serves article images whose srcset candidates all 404.
  - Browsers do not fall back to `src` when the chosen srcset candidate fails, so article images show as broken.
  - Screenshots taken in dev for the `docs/REVIEW.md` checklist would show this.
  - Any build that calls `next build` directly, without the npm `prebuild` hook, ships the same broken images.
  - The test skips its existence check when `public/_img` is missing, so `npm test` stays green.
- **Production on Vercel is fine** today, because `npm run build` runs `prebuild`.
- **Fix:**
  - Add `"predev": "tsx scripts/build-legacy.ts"`. With cached variants it took about 1 second in the round-3 logs.
  - Make the test fail with a clear message, such as "run npm run content:build", when `public/_img` is missing instead of skipping.

## Low

### L1. Contextual links landed in the opening text on 3 pages, against the documented rule

- **Location:** `scripts/build-legacy.ts:155,174-179`.
- **Cause:** `opening = $.root().children('p').first()` only considers `<p>`. These pages start with bare root-level text, which is not skipped:
  - `/blog/giay-to-van-chuyen-hang-hoa`: "vận tải hàng hóa Bắc Nam" → `/van-chuyen-hang-hoa/`
  - `/blog/van-chuyen-hang-hoa-nguy-hiem`: "hàng hóa nguy hiểm" → the regulations guide
  - `/van-chuyen-hang-hoa/vinh-nghe-an`: "vận chuyển hàng hóa đi Bình Định" → `/van-chuyen-hang-hoa/binh-dinh/`
- **Contradicts:** `docs/DESIGN.md`, which says no links in the opening paragraph, and P18, which says only inside `<p>`/`<li>`.
- **Impact:** functionally harmless. `splitLead` only lifts a leading `<p>`, so no link is lost.
- **Fix:** also skip the root-level text and inline nodes that come before the first block element.

### L2. Generic single-noun phrases produce off-topic anchors

- **Location:** `src/content/contextual-links.ts:14,16,20`.
- **Examples:**
  - `/van-chuyen-hang-hoa/kontum`: "kiểm tra … thắng, phanh, **dầu nhớt**" (the truck's engine oil) links to the oil-transport service.
  - `/van-chuyen-hang-hoa/mong-cai`: "đường sắt và **đường hàng không** tại Móng Cái chưa phát triển" links to air freight.
  - `/van-chuyen-hang-hoa/dak-lak` and `/kontum`: a driver-licence sentence with "**loại xe tải**" links to the truck-size guide.
- **Fix:** require a service context for these phrases, for example "vận chuyển/chở dầu nhớt", "hàng dầu nhớt", "bằng đường hàng không". Alternatively, keep a small per-path deny list.

### L3. Variant file names do not change when the encoder settings change

- **Location:** `scripts/legacy-images.ts:52,57,59` and `next.config.ts:66-69`.
- **Cause:** the name hashes only the source bytes, and the files are served `immutable` for a year.
- **Failure scenarios:**
  - Changing `quality`, the widths logic, or rotation keeps the same URLs, so browsers hold stale variants for up to a year.
  - Locally, `existsSync` skips regeneration, so a `next start` check validates the old files.
- **Fix:** include a settings tag in the hash, e.g. `.update(input).update('webp-q72-r1')`.

### L4. The image pipeline silently degrades when sharp is missing, and sharp is not declared

- **Location:** `scripts/legacy-images.ts:21-31` and `package.json`.
- **Cause:** sharp is only an optional transitive dependency of `next` (`^0.35.4`).
- **Failure scenario:** if it is absent, the build passes with no width/height/srcset on 340 images (a CLS regression), and only a `console.warn` is printed.
- **Fix:** declare `sharp` in `devDependencies`, and fail the build when `process.env.VERCEL || process.env.CI` and sharp cannot load.

### L5. When WordPress gave only `width`, it is replaced by the file's size

- **Location:** `scripts/legacy-images.ts:82-85`.
- **Current corpus:** none of the 73 affected images change, because every WordPress width was ≥ 736 px (I checked).
- **Latent risk:** a future image intentionally sized smaller than the column would be enlarged.
- **Fix:** keep the WordPress width and derive `height = round(width × h / w)`.

### L6. Matcher parity changes in two small ways

- **Location:** `src/proxy.ts:57-72` versus `src/lib/legacy-redirects.ts:13-22` (`/i`).
- **Change 1:** compiled matchers are case-sensitive (confirmed from the manifest). Mixed-case WordPress probes such as `/WP-LOGIN.PHP` and `/Wp-Admin/` now return 404 instead of 410.
- **Change 2:** `Accept: Text/Markdown` written in upper case no longer reaches the proxy. The `has` regex is case-sensitive, even though media types are not.
- **Suggestion:** accept and document.

### L7. Stale comments still describe proxy rewrites

- **Locations:**
  - `src/app/md/[[...slug]]/route.ts:4-5`
  - `src/lib/markdown-paths.ts:7`
  - `src/app/[lang]/layout.tsx:50-52`: dotted paths now go through the static rewrite, and `dynamicParams = false` now also guards `/og/`, `/api/` and similar paths.
- **Fix:** point them at `src/lib/public-routing.ts`.

## Areas checked: no issue found

- **Open redirect via `/vi/:path(.*)` → `/:path`:**
  - Next's `resolve-routes` 308s requests containing `//` or `\` and runs `normalizeRepeatedSlashes` on redirect destinations.
  - On Vercel, the edge normalizes `//` and raw `\` (`/vi//blog/` → `/vi/blog/`, `/vi/\evil.com/` → `/vi/evil.com/`) and keeps `%2F`, `%5C` and `%0d%0a` encoded in `Location` (probed on live production).
  - Header injection: none.
- **SSRF in the self-fetch:** `markdownRewriteTarget` rejects `//` and dots before the fetch. The origin is `request.url`, whose host is controlled by Vercel (self-hosted Next uses the configured hostname). No loop: the subrequest's `Accept: */*` does not match the markdown `has` condition.
- **Redirect loops and chains:** no loops. `/vi/x` takes 2 hops (trailing slash, then locale), the same as before. Query strings are preserved.
- **404 vs 200 parity:** confirmed for these paths:
  - `/en/`, `/khong-ton-tai/`, `/favicon.ico`, `/ads.txt`
  - `/md`, `/md/*` (beforeFiles → `/vi/md/*` → 404)
  - `/og/` and `/api/` (`[lang]` has `dynamicParams = false`)
  - `/vi.md`, which now 308s to the twin instead of returning 404 (an improvement)
  - twins `/x.md` and `/index.md`, unknown twins (404), and `/og/*.png` excluded from the catch-all
- **Proxy allowlist:** checked against the compiled matcher regexes.
  - The proxy does not run for `/`, `/van-chuyen-hang-hoa/da-nang/`, `/blog/`, `*.md`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/og/*.png`, `/_next/*`, `/_img/*`, `/wp-content/uploads/*`, `*.rsc`, or `/index.rsc`.
  - It does run for `/admin/**` (including `.rsc` and `.segments`), the WordPress endpoints, and `/?p=`, `/?page_id=`, `/?s=`.
- **Admin auth:**
  - `updateSession` still runs for `/admin/**`.
  - `/vi/admin/**` 308s to `/admin/**` before the proxy.
  - The dashboard layout re-checks the staff role on the server.
  - Server actions on admin pages go through the matcher.
  - The known `/admin/login/` loop is unchanged; it is pre-existing and being fixed on another branch.
- **Immutable SEO contract:** HEAD vs working corpus shows:
  - 0 changes to path, slug, SEO title, description or robots, summary, facts, image or label
  - identical `<img src>` sets on all 95 pages
  - all 1,822 ids and all TOC anchors kept
  - no srcset in the markdown corpus and no raw HTML
- **Heading promotion:** 97 new headings, with no skipped levels and no duplicate ids or collisions with template ids. FAQ entries went from 396 to 468.
- **Dash lists and `<ol start>`:** 2 pages converted, both correct. When a `<br>` sits inside inline markup, cheerio/parse5 still produces well-formed HTML. `start` is kept in both the HTML and the twin.
- **Contextual links:**
  - 166 links, within the caps (≤3 per page, ≤5 per post)
  - one link per target, no self-links
  - none in headings, tables, callouts or figures
  - every target is a real page
  - DOM insertion is correct: `replaceWith` links the new text nodes, and recursion runs on the remainder
- **Image pipeline:**
  - EXIF orientation is handled (dimensions swapped for orientations 5–8, `.rotate()` applied to variants).
  - PNG transparency is kept in the WebP output; animated and vector images are skipped; nothing is upscaled.
  - All 340 images have intrinsic width and height; all URLs are ASCII-safe.
  - No path traversal: sources pass through `localUpload`.
- **`UploadImage` / `overrideSrc`:**
  - Every caller passes a local upload URL.
  - The preload uses `imagesrcset`.
  - No component sets a `quality` prop, so trimming `images.qualities` to `[75]` breaks nothing.
- **Author data:** extracted for all 9 posts. About 469 characters of author-box residue per post moved to the "Về tác giả" box and the twin. The JSON-LD `Person` is valid.

## Recommended actions (priority order)

1. Run the V1 preview checks before production. Fix root RSC routing only if the check fails.
2. M1: add try/catch, a timeout and body cancellation around the self-fetch.
3. M2: skip a bad image with a logged path instead of failing the build.
4. M3: add `predev` and make the srcset test fail when `public/_img` is missing.
5. L1–L3: skip opening text when linking, tighten the generic phrases, and add a settings tag to the variant hash.
6. L4–L7 as convenient.

## Metrics

- Tests run: 3 files, 21/21 pass. I did not run typecheck, lint or build, because the brief excluded them while performance measurement was in progress.
- Corpus: 95 pages, 166 new contextual links, 97 new headings, 340 images with 1,040 srcset candidates (965 files, 44 MB, git-ignored).

## Unresolved questions

1. Is Deployment Protection on for previews? If so, the self-fetch returns 401, negotiation silently falls back to HTML, and preview discovery scans will fail. Run the negotiation check against the production alias, or use the bypass token.
2. Supabase region versus `sin1`: the owner question from the round-3 report is still open.
3. A separate observation not caused by this diff: one round-3 local build (scratchpad `build-r3c.log`) failed while prerendering `/og/*`. It was a native panic followed by `svgload_buffer: SVG rendering failed` under 23 workers. If this recurs on Vercel, the deploy fails; consider capping static-generation concurrency.
