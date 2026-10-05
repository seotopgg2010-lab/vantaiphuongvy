# SEO parity trước khi chuyển domain — 2026-10-06

## Kết quả

Đối chiếu từng URL giữa site WordPress đang chạy (`vantaiphuongvy.com`) và bản build production từ source, bản mới giữ lại mọi thứ WordPress đang cho Google thấy:

- **Sao đánh giá:** schema có trên 69/69 trang.
- **FAQ:** WordPress có trên 42 trang, bản mới có trên 50 trang.
- **Bình luận:** đủ 312 bình luận, đã ẩn số điện thoại và email của người đọc.
- **Ảnh:** mọi ảnh WordPress còn phục vụ đều đã chép sang.
- **Kho hàng:** danh sách 20 kho.
- **Trang chủ:** lời văn gốc được khôi phục.
- **Theo dõi:** thẻ xác minh Search Console, GA4 và Google Ads đã gắn lại.

Ở các điểm còn lại (tốc độ, H1, link nội bộ, schema hợp lệ), bản mới vẫn hơn WordPress như trong phép so trước khi sửa.

Code review độc lập ([báo cáo](code-reviewer-261006-0047-seo-parity-before-cutover.md)) tìm ra 3 lỗi chặn và 10 điểm nhỏ hơn. Tất cả đã được xử lý theo quyết định của chủ site (xem bên dưới).

**Chưa deploy:** tài khoản GitHub trên máy (`cherry9001`) không có quyền push vào `seotopgg2010-lab/vantaiphuongvy`.

Kế hoạch: [plan.md](../261006-0047-seo-parity-before-cutover/plan.md). Dữ liệu so sánh và ảnh chụp nằm trong `seo-parity-261006-0047-before-cutover/` (thư mục bằng chứng, không commit).

## Trước và sau khi sửa (WordPress đang chạy so với build từ source)

| Hạng mục | WordPress | Trước khi sửa | Sau khi sửa |
|---|---|---|---|
| URL trong sitemap trả 200, cùng title/canonical | 95 | 95 (khác duy nhất `/blog/`, WP canonical về `/category/blog/`) | như trước |
| Trang có schema sao (`CreativeWorkSeries`) | 69 | 0 | 69, cùng tên và số bình chọn, sao hiện dưới H1 và trong bản `.md` |
| Trang có `FAQPage` | 42 | 48 (thiếu An Giang, dầu nhớt) | 50, không thiếu trang nào của WP |
| Bình luận `/blog/can-tim-doi-tac-van-chuyen-hang-hoa/` | 311 | 0 | 311, cùng thứ tự và anchor `#comment-<id>`, số điện thoại/email đã ẩn |
| Ảnh WP còn phục vụ (sitemap ảnh và ảnh trên trang) chưa có bản sao | — | 220 | 0 (7 ảnh khác hỏng ngay trên WP) |
| Danh sách 20 kho hàng | mọi trang (footer) | không có | footer, trang Liên hệ, dải kho trên 20 trang tuyến/thuê xe của tỉnh có kho |
| Câu chữ trang chủ còn giữ (5-gram, toàn trang) | — | 6% | 37% |
| Xác minh Search Console, Pinterest | có | không | có |
| GA4 `G-4MSCYJN9G4`, Google Ads `AW-830959523` | đo mọi khách | không | đo mọi khách trên domain chính, như WordPress |
| Ngày bài viết và `lastmod` khi build trên máy UTC (Vercel) | — | trễ 1 ngày ở 6 bài; `lastmod` lệch 7 giờ | đúng ngày; `lastmod` khớp `modified_gmt` của WP |

Không đổi:
- GTM `GTM-WZNQCVK` (container rỗng, không có tag) và Universal Analytics (đã ngừng) không mang sang.
- `/locations.kml` vẫn trả 410, vì file của WordPress không có địa chỉ hay tọa độ.

## Quyết định của chủ site (06/10/2026)

- **Bình luận:** ẩn số điện thoại và email của người đọc (repo public). `src/lib/contact-mask.ts` thay ngay khi chụp dữ liệu: 63 bình luận có số điện thoại, 2 bình luận có email. Git và trang web không còn số thật.
- **Sao đánh giá:** giữ như WordPress. Đây là hiện trạng Google đang thấy trên site cũ.
- **Theo dõi:** đo mọi khách như WordPress, không banner xin đồng ý. Localhost, preview và bản vercel.app không gửi dữ liệu.

## Thay đổi chính

- **Dữ liệu chụp từ WordPress:** `npm run content:extras` (`scripts/scrape-wp-extras.ts`) ghi `comments.json`, `attachments.json`, `live-images.json` và `live-ratings.json`.
  - Script tôn trọng `--origin` và retry khi gặp lỗi.
  - Nó chỉ ghi file khi mọi request đều thành công, và từ chối chạy nếu domain không còn là WordPress.
  - `npm run content:mirror` chép thêm 213 file ảnh (+44 MB).
- **Pipeline (`scripts/build-legacy.ts`):**
  - Đọc payload kk Star Ratings thành `rating`, gắn bình luận dạng chữ thuần, đọc FAQ dạng "Hỏi:/Đáp:".
  - Ghi ngày giờ WordPress kèm `+07:00`.
  - `id-map.json` có thêm 420 attachment trỏ về trang cha.
- **Giao diện:**
  - `RatingSummary` (hero, dòng meta bài viết), `LegacyComments`, `WarehouseList`/`RouteWarehouses`.
  - Danh sách kho nằm trong `src/lib/warehouses.ts`, nên không lọt vào JS phía client.
  - Trang chủ có thêm phần "Công ty TNHH Dịch vụ Vận tải Phương Vy" và 6 lý do nguyên văn từ WordPress, đã bỏ các so sánh "nhất".
  - Link `#comment-<id>` tự mở danh sách bình luận đang thu gọn.
- **SEO:**
  - JSON-LD `CreativeWorkSeries`; robots meta cho `/blog/`.
  - `/index.php` → `/`; `/?attachment_id=` → trang cha, giống Rank Math.
  - URL viết hoa được trang 404 tự chuyển sang chữ thường, luôn trong cùng domain.
- **Tài liệu:** `AGENTS.md`, `docs/DESIGN.md`, `docs/REVIEW.md`, hướng dẫn deploy (phase 07).

## Kiểm tra

- `npm test` 50/50 (cả khi chạy với `TZ=UTC`), `npm run lint`, `npm run typecheck`, production build: đạt.
- `node scripts/crawl-check.mjs http://localhost:3102`: 95 trang, 1.398 đích, hợp đồng redirect nguyên vẹn.
- Quét 95 URL ở 320 và 375 px bằng Chrome headless: 0 trang tràn ngang.
- Ảnh chụp 1440×900, 768×1024, 375×812: trang tuyến Đà Nẵng/Thanh Hóa, trang chủ (giới thiệu, lý do), bài có bình luận, Liên hệ, footer (`seo-parity-261006-0047-before-cutover/shots/`).
- Dung lượng HTML:
  - Footer kho hàng thêm khoảng 16 nghìn ký tự mỗi trang (khoảng 3 KB sau gzip).
  - Bài có bình luận nặng 88 KB gzip (WordPress 944 KB chưa nén).
- PageSpeed Insights mobile (Google, trước khi sửa, bản Vercel round 2):
  - Trang chủ 95 so với WP 77; trang Đà Nẵng 94 so với WP 66.
  - Dữ liệu người dùng thật của WP: Core Web Vitals trượt (LCP 3,1 s, TTFB 2 s).

## Câu hỏi còn mở

- Push lên `main` để Vercel deploy cần tài khoản GitHub có quyền ghi vào repo.
