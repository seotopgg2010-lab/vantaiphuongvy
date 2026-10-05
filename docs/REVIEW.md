# Review checklist — UX & AX

Dùng trước khi merge thay đổi giao diện, nội dung hoặc route. Ảnh chụp đi kèm mọi thay đổi UI.

## UX (đối chiếu `docs/DESIGN.md`)

- [ ] **First impression:** trong 5 giây biết dịch vụ gì, cho ai, gọi ở đâu; CTA gọi hotline thấy ngay màn đầu ở 375×812.
- [ ] **Brand recall:** logo, xanh logo + vàng, Be Vietnam Pro, motif brand grid; favicon/apple-icon/social card cùng palette.
- [ ] **Content punch:** headline ≤ ~10 từ, nói kết quả; CTA = động từ + đối tượng; không số liệu chưa xác minh.
- [ ] **Hierarchy:** một hành động chính mỗi màn; thứ tự section theo câu chuyện.
- [ ] **Trust:** MST, địa chỉ, giờ làm việc, báo chí, ngày bài viết hiển thị đúng.
- [ ] **Motion:** 150–300 ms, transform/opacity; kiểm tra `prefers-reduced-motion`.
- [ ] **Responsive:** chụp 1440×900, 768×1024, 375×812 (+ reflow 320 px): không tràn ngang, không cắt chữ, không chồng lớp; target chạm ≥ 24 px (CTA ≥ 44 px).
- [ ] **Accessibility:** WCAG 2.2 AA tương phản, focus-visible, alt ảnh, landmark, đúng 1 `h1`.
- [ ] **Performance:** ảnh hero `preload`, ảnh dưới màn lazy; không script bên thứ ba mới ngoài GA4 + Google Ads của site cũ (`TRACKING`, chỉ trên domain chính, đo mọi khách như WordPress theo quyết định của chủ site); ảnh thân bài có `width`/`height` và `srcset` WebP; đo A/B lab (cùng máy, xen kẽ, trung vị ≥ 5 lượt) khi đổi font, ảnh hoặc component client.
- [ ] **Vercel Hobby:** không thêm matcher proxy cho trang công khai (`tests/public-routing.test.ts`); không mở rộng `images.qualities`/`deviceSizes`/`imageSizes` khi layout không cần; region function `sin1` (`vercel.json`). Gói Hobby chỉ cho phép dùng phi thương mại — xem báo cáo round 3.
- [ ] **Sau mỗi lần deploy đổi routing** (trên URL Vercel): `curl -H 'RSC: 1' <base>/?_rsc=x -L` và một trang tuyến trả `200 text/x-component`; `x-vercel-id` của trang HTML không có region function (không đi qua proxy); `/tim-kiem/?q=ha` chạy ở `sin1`; gửi thử form báo giá một lần; chạy lại discovery scan.

## AX / SEO discovery surfaces

- [ ] `npm test` xanh (URL contract, metadata, sitemap/robots, markdown twin, llms.txt, social card).
- [ ] `node scripts/crawl-check.mjs <base>` OK: mọi URL sitemap 200, 1 `h1`, canonical tự tham chiếu có `/` cuối, JSON-LD hợp lệ, link nội bộ và biến thể ảnh `/_img/` sống, hợp đồng 301/410/404 (gồm soft-404 cho path có dấu chấm), URL lạ trả trang 404 tiếng Việt (`app/global-not-found.tsx`).
- [ ] Discovery scan (`ak:enhance-ux-ax` → `check-discovery-surfaces.mjs <base> --site-origin https://vantaiphuongvy.com`) exit 0.
- [ ] Mỗi trang có `<link rel="alternate" type="text/markdown">` trỏ tới `/<path>.md` trả 200 `text/markdown` + `X-Robots-Tag: noindex`; `.md` không nằm trong sitemap.
- [ ] `/llms.txt`, `/llms-full.txt` trả 200, link tuyệt đối tới twin còn sống.
- [ ] `curl -H "Accept: text/markdown" <base>/<trang>/` trả twin `text/markdown` với `Vary: Accept` (proxy tự trả body, không rewrite) và `Cache-Control: private`; Accept của trình duyệt vẫn nhận HTML. Chạy lại discovery scan trên URL Vercel sau mỗi lần deploy.
- [ ] `sitemap.xml` có `<image:image>` (URL tuyệt đối `/wp-content/uploads/**`) cho ảnh của từng trang.
- [ ] Liên kết nội bộ (đếm trong `<main>` của trang khác): mỗi trang tuyến, loại hàng, xe tải ≥ 5; mỗi bài viết ≥ 3. Danh mục cuối footer (HTML server) liên kết mọi trang tuyến và thuê xe tải.
- [ ] Liên kết ngữ cảnh trong thân bài (`tests/internal-links.test.ts`): ≥ 50 trang dịch vụ có link trong bài; bài viết đúng chủ đề có link tới trang dịch vụ; không link trong heading, không tự liên kết. Đọc lại vài link mới trong ngữ cảnh khi thêm cụm từ vào `src/content/contextual-links.ts`.
- [ ] Không còn đoạn câu hỏi in đậm (đã thành heading) và tàn dư hộp tác giả trong thân bài (`tests/legacy-clean.test.ts`).
- [ ] Không trang nào nhảy cấp heading hoặc có heading VIẾT HOA (`tests/legacy-clean.test.ts`).
- [ ] `og:image` đầu tiên là `/og/<path>.png` 1200×630 có `og:image:alt`; xem thử card của trang chủ và một trang nội dung.
- [ ] Không đổi slug, canonical, title/description Rank Math hay URL ảnh `/wp-content/uploads/**` (nguồn SEO bất biến).
- [ ] Chính sách AI crawler trong `src/app/robots.ts` là quyết định của chủ site — không tự đổi.
