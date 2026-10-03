---
phase: 6
name: "Regression tests cho URL/SEO contract"
status: completed
effort: 1d
depends: [2, 3, 5]
---

# Phase 06 — Regression tests (hard gate trước deploy)

## Mục tiêu

Suite test tự động khóa toàn bộ SEO contract: URL cũ 200, URL Hamburg 404, sitemap/robots đúng, canonical/JSON-LD đúng domain. **Không deploy khi suite chưa xanh.**

## Context

- `package.json` có test script (jest/vitest — kiểm tra thực tế, lần trước `npm test` chạy nhưng "no tests found").
- `tests/` đã tồn tại (`tests/contact-validation.test.ts` ở Hamburg — kiểm tra bản local có không; nếu không có thì tạo mới).
- Contract nguồn: `src/legacy-content/pages.json` + `posts.json` + `reports/url-contract.json`.

## Các bước thực hiện

1. **Framework**: dùng runner hiện có của project (kiểm tra `package.json` scripts + deps; nếu jest thì viết `*.test.ts` trong `tests/`).

2. **`tests/url-contract.test.ts`** — unit-level:
   - Mọi `item.path` trong `legacyItems` → `getLegacyByPath(path)` trả item (86+9 case).
   - Không path nào trùng nhau.
   - `getLegacyByPath('/bang-hieu')`, `/du-an`, `/van-chuyen-quoc-te`, `/giai-phap-tron-goi`, `/san-xuat-cung-ung`, `/dieu-khoan-su-dung`, `/cam-on`, `/en`, `/en/anything` → `undefined`.

3. **`tests/sitemap-robots.test.ts`**:
   - `sitemap()` output: chứa mọi legacy path (trừ `/home-3`), chứa `/blog`; **không** chứa `/en`, `/bang-hieu`, `/du-an`, `/van-chuyen-quoc-te`, `/giai-phap-tron-goi`, `/san-xuat-cung-ung`, `/home-3`, `/admin`.
   - `robots()` output: `disallow` chứa `/admin/`, `/en/`; `sitemap` URL đúng domain.

4. **`tests/metadata-schema.test.ts`**:
   - `generateMetadata` của home/legacy: canonical = `https://vantaiphuongvy.com{path}` (+`/`), không `hreflang`, không `en` alternate.
   - JSON-LD home: `@type LocalBusiness`, `telephone` chứa 3 số, `address` đúng `38H4`, `url` đúng domain.
   - JSON-LD post: `BlogPosting` với `datePublished` hợp lệ.

5. **`tests/proxy-locale.test.ts`** — logic `src/proxy.ts` (pure function nếu tách được; nếu không test qua integration):
   - `/` → rewrite `/vi`; `/van-chuyen-hang-hoa/` → rewrite `/vi/van-chuyen-hang-hoa/`.
   - `/vi/*` → redirect 301 không prefix.
   - `/en`, `/en/*` → 404 response.

6. **Integration smoke (script)** — `scripts/verify-live.mjs` chạy sau deploy staging:
   ```
   curl -s -o /dev/null -w "%{http_code} %{url_effective}\n" \
     https://<staging>/ /blog /blog/{post-slug} /van-chuyen-hang-hoa/ \
     /van-chuyen-hang-hoa/ha-noi/ /thue-xe-tai/ /gioi-thieu/ /lien-he/ /faq/ \
     /en /en/foo /bang-hieu /du-an /sitemap.xml /robots.txt
   ```
   Assert: legacy=200, `/en*`=404, `/bang-hieu`=404, sitemap/robots=200.

7. **npm test xanh** + gắn vào quy trình: document trong plan rằng bất kỳ PR/deploy nào phải chạy `npm test` trước.

## Success criteria

- [ ] `npm test` chạy được và xanh với ≥3 suite (url-contract, sitemap-robots, metadata).
- [ ] Script `verify-live.mjs` tồn tại, chạy được `node scripts/verify-live.mjs <base-url>`.
- [ ] Toàn bộ legacy path trong JSON đều có test coverage (không hardcode một vài URL).

## Risk

- Test env khác production (base URL) → dùng `getSiteUrl()` trong code và truyền base cho integration script, không hardcode trong test.
- Legacy JSON lớn → test loop 96 case vẫn nhanh (pure data, không network).
