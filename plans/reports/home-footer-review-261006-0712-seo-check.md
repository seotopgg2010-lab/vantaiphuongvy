# Rà soát trang chủ và footer — 2026-10-06

## Kết quả

Trang chủ và footer trên bản đang chạy (`7a77e26`, vantaiphuongvy.vercel.app) đạt các yêu cầu SEO kỹ thuật:
- Đúng 1 H1, heading không nhảy cấp.
- Canonical về `vantaiphuongvy.com/`, robots index.
- Open Graph có ảnh 1200×630.
- Có thẻ xác minh Search Console và Pinterest.
- Schema Organization/LocalBusiness và WebSite hợp lệ, link nội bộ đều có `/` cuối.

PageSpeed mobile: Performance 98, Accessibility 100, Best Practices 96, SEO 100 (LCP 2,4 s, CLS 0).

Rà soát tìm ra 9 điểm cần sửa. Đã sửa cả 9 trên nhánh `feat/ux-seo-ax-optimization`; chúng có hiệu lực sau khi push lên `main`.

## Đã sửa

| # | Vấn đề | Sửa |
|---|---|---|
| 1 | Trên Vercel, mọi request RSC tới `/` (prefetch, chuyển trang) trả 404 hoặc HTML: 2 request lỗi mỗi lượt xem trang, bấm logo phải tải lại toàn trang, PageSpeed trừ điểm Best Practices vì lỗi console | Link về trang chủ (logo header/footer, breadcrumb, trang 404) dùng `HomeLink`, một thẻ `<a>` thường; có test chặn `next/link` tới `/` |
| 2 | H3 vùng tuyến đọc thành "Miền Bắc22 tuyến" | Số tuyến đặt ngoài heading |
| 3 | Chỉ 3/67 thẻ tuyến có dòng thời gian ("40h"), trông lệch | Bỏ dòng phụ ở lưới tuyến rút gọn trên trang chủ |
| 4 | Khối hỏi đáp trang chủ là định nghĩa ("Vận tải là gì?…") | Dùng 4 câu khách hay hỏi của hub Vận chuyển hàng hóa (thời gian, giá, loại hàng, giao tận nơi); bản `.md` khớp |
| 5 | Câu trả lời FAQ dính khẩu hiệu viết hoa | Pipeline bỏ đoạn VIẾT HOA khỏi câu trả lời (chỉ 1 câu ở hub bị ảnh hưởng) |
| 6 | Heading ngắt dòng giữa "Phương / Vy", "Dịch / vụ" | `noBreakBrand` giữ liền tên thương hiệu trong heading và dòng bản quyền |
| 7 | 3 link ảnh thẻ bài viết không có anchor text | Alt ảnh là tiêu đề bài (link vẫn ẩn với trình đọc màn hình) |
| 8 | Footer thiếu mã số thuế, lặp địa chỉ bãi xe (đã có trong danh sách kho) | Thay dòng "Bãi xe" bằng "Mã số thuế: 0313404000" như footer WordPress |
| 9 | Footer bỏ mất link toàn site "Tìm đối tác vận chuyển hàng hóa" của WordPress; footer mobile dài khoảng 7 màn hình | Thêm lại link (cùng anchor text) vào cột Phương Vy; cột link chia 2 trên điện thoại |

## Kiểm tra

- `npm test` 53/53, `npm run lint`, `npm run typecheck`, production build: đạt.
- `scripts/crawl-check.mjs` local: 95 trang, 1.398 đích, hợp đồng redirect nguyên vẹn.
- Quét 95 URL ở 320 và 375 px: 0 trang tràn ngang.
- Ảnh chụp trang chủ trước và sau khi sửa ở 1440×900, 768×1024, 375×812 (thư mục tạm của phiên).
- Lỗi RSC chỉ tái hiện được trên Vercel; trên bản local (`next start`) trang chủ trả RSC đúng. Sau khi push cần kiểm lại trên Vercel rằng không còn request `/?_rsc=` lỗi.

## Quyết định của chủ site (2026-10-06)

- Giữ nguyên title "Công Ty TNHH Dịch Vụ Vận Tải Phương Vy" và meta description Rank Math của trang chủ.
- Ưu đãi "Kỷ niệm 10 năm thành lập — giảm 7% cước" vẫn còn hiệu lực.
- Title và description của các trang dịch vụ và bài viết được rà soát riêng trong `title-description-audit-261006-0810-services-posts.md`.
