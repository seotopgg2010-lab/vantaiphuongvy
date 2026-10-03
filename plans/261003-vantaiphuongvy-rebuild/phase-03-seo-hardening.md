---
phase: 3
name: "Hoàn thiện SEO: schema, metadata, sitemap, canonical audit"
status: completed
effort: 1d
depends: [2]
---

# Phase 03 — SEO hardening

## Mục tiêu

Mọi tín hiệu SEO on-page đạt hoặc vượt site cũ: canonical đúng, OG/Twitter đầy đủ có ảnh, JSON-LD phù hợp từng loại trang, sitemap/robots chuẩn, không còn metadata tiếng Anh hay hreflang.

## Context

- Canonical production: `https://vantaiphuongvy.com/<path>/` (có trailing slash). Local `getSiteUrl()`/`localizedPath()` phải sinh cùng dạng hoặc có redirect nhất quán `/path` → `/path/` (Next mặc định `trailingSlash: false` — cần quyết định: bật `trailingSlash: true` trong `next.config.ts` để khớp 1:1 với URL WP cũ, **đây là cách an toàn nhất cho SEO**).
- OG image production: `cong-ty-van-tai-phuong-vy.jpg`. Local layout metadata chưa set `openGraph.images`/`twitter.images`.
- Schema hiện có: LocalBusiness (home) + BreadcrumbList (legacy). Thiếu: Organization trong `generateOrganizationJsonLd` đã có — cần audit nội dung; thiếu Service cho trang dịch vụ, BlogPosting cho `/blog/*`, FAQPage cho `/faq`.

## Các bước thực hiện

1. **Trailing slash parity** — quyết định trong `next.config.ts`:
   - Option A (khuyến nghị): `trailingSlash: true` → mọi URL render có `/`, khớp canonical WP cũ 1:1, không cần redirect.
   - Option B: giữ không-slash + redirect 301 `*/` → `*` — rủi ro chain redirect trên 86+9 URL.
   - Chọn A; cập nhật `sitemap.ts` và canonical builder để luôn có `/` cuối.

2. **OG/Twitter images** — `src/app/[lang]/layout.tsx` `generateMetadata`: thêm `openGraph.images` + `twitter.images` = `https://vantaiphuongvy.com/wp-content/uploads/2018/08/cong-ty-van-tai-phuong-vy.jpg` (1200×630 fallback nếu có bản lớn, nếu không dùng bản 860×860 khai báo đúng kích thước).

3. **Schema per page type**:
   - `/` → LocalBusiness + Organization (đã có; audit thêm `openingHoursSpecification` `Mo-Su 08:00-21:00`, `sameAs` facebook/zalo).
   - `/van-chuyen-hang-hoa*` & `/thue-xe-tai*` → thêm `Service` JSON-LD (serviceType, provider=Organization, areaServed=VN) trong `[...legacy]/page.tsx` khi path match.
   - `/blog/{slug}` (trong `[...legacy]` kind=post) → `BlogPosting` (headline, datePublished, dateModified, image, author Organization).
   - `/faq` → `FAQPage` — parse Q/A từ content nếu cấu trúc hợp lý, nếu không skip (không fake schema).
   - Mọi trang → `BreadcrumbList` (đã có).

4. **Metadata per legacy page** — `[...legacy]/page.tsx` `generateMetadata`: title = item.title, description = excerpt hoặc 155 ký tự đầu của text content (strip HTML), canonical = `${SITE}/${path}/`, og:image = featured_media URL nếu item có, fallback ảnh công ty.

5. **Robots** — `src/app/robots.ts`: giữ `Disallow: /admin/`, `/en/`; thêm `Sitemap: https://vantaiphuongvy.com/sitemap.xml`; đảm bảo không disallow nhầm `/vi/` (vì `/vi/*` redirect nên không cần disallow, nhưng disallow cũng an toàn — chọn disallow để chắc chắn Google không index URL prefixed).

6. **Sitemap** — audit lại: 86 page + 9 post + `/blog` (tính theo item.path). Đảm bảo không chứa `/home-3`, không chứa `/en`, không chứa route đã xóa. Priority: `/` = 1.0, pages = 0.8, posts = 0.6, `/blog` = 0.7.

7. **404 contract** — URL không tồn tại trả 404 (không redirect). `/en`, `/en/*` → 404. `/vi/*` → 301 về không prefix. Test bằng `curl -o /dev/null -w "%{http_code}"`.

8. **Internal links** — header/footer/nav chỉ link tới URL tồn tại trong legacy JSON hoặc `/blog`. Grep kiểm chứng.

## Success criteria

- [ ] `curl https://<deploy>/sitemap.xml` có đúng ~96 URL (86+9+blog), không `/en`, không `/home-3`, không route xóa.
- [ ] `curl -sI /van-chuyen-hang-hoa/` → canonical `https://vantaiphuongvy.com/van-chuyen-hang-hoa/`; view-source có OG+Twitter+JSON-LD.
- [ ] Rich Results Test (hoặc `schema.org` validator) pass: LocalBusiness, Service, BlogPosting, BreadcrumbList.
- [ ] `/en` → 404, `/vi/` → 301 → `/`.
- [ ] Meta description không rỗng trên `/`, `/gioi-thieu`, `/lien-he`, `/van-chuyen-hang-hoa`.

## Risk

- `trailingSlash: true` đổi toàn bộ internal link → double-check `localizedPath()` sinh đúng.
- FAQPage parse sai → Google phạt spam schema → chỉ emit khi parse được cặp Q/A rõ ràng.
