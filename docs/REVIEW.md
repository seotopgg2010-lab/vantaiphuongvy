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
- [ ] **Performance:** ảnh hero `preload`, ảnh dưới màn lazy; không script bên thứ ba mới.

## AX / SEO discovery surfaces

- [ ] `npm test` xanh (URL contract, metadata, sitemap/robots, markdown twin, llms.txt, social card).
- [ ] `node scripts/crawl-check.mjs <base>` OK: mọi URL sitemap 200, 1 `h1`, canonical tự tham chiếu có `/` cuối, JSON-LD hợp lệ, link nội bộ sống, hợp đồng 301/410/404 (gồm soft-404 cho path có dấu chấm).
- [ ] Discovery scan (`ak:enhance-ux-ax` → `check-discovery-surfaces.mjs <base> --site-origin https://vantaiphuongvy.com`) exit 0.
- [ ] Mỗi trang có `<link rel="alternate" type="text/markdown">` trỏ tới `/<path>.md` trả 200 `text/markdown` + `X-Robots-Tag: noindex`; `.md` không nằm trong sitemap.
- [ ] `/llms.txt`, `/llms-full.txt` trả 200, link tuyệt đối tới twin còn sống.
- [ ] `og:image` đầu tiên là `/og/<path>.png` 1200×630 có `og:image:alt`; xem thử card của trang chủ và một trang nội dung.
- [ ] Không đổi slug, canonical, title/description Rank Math hay URL ảnh `/wp-content/uploads/**` (nguồn SEO bất biến).
- [ ] Chính sách AI crawler trong `src/app/robots.ts` là quyết định của chủ site — không tự đổi.
