---
phase: 2
name: "Nâng cấp UI homepage + legacy template theo brand thật"
status: completed
effort: 2d
depends: [1]
---

# Phase 02 — UI polish theo đúng brand vận tải Phương Vy

## Mục tiêu

Homepage và legacy page template đạt chuẩn "site vận tải Việt Nam hiện đại": đúng palette xanh/cyan/vàng, mobile-first, CTA gọi/Zalo/báo giá là trung tâm, bổ sung các section có thật trên site cũ (báo chí, ưu đãi, tin tức) mà hiện bản local đang thiếu.

## Context — gap so với site thật

| Khu vực | Site thật có | Local hiện có | Gap |
|---|---|---|---|
| Hero | Slideshow 2 ảnh + slogan "Chất lượng, nhanh chóng, uy tín là niềm tin!" | 1 ảnh tĩnh + headline tự đặt | Thiếu slogan thật + slide thứ 2 |
| Cam kết | 6 mục Nhanh chóng/Chính xác/Chuyên nghiệp/An toàn/Tiện lợi/Tiết kiệm | Đã có 6 mục | ✓ xong |
| Báo giá band | Band "NHẬN BẢNG BÁO GIÁ… HOTLINE 0933 87 1139 – 0702.00.6839" | Chưa có band riêng | Cần thêm CTA band 2 số |
| Tin tức | Grid 9 bài mới nhất từ posts | Chưa có trên home | Thêm từ `legacyPosts` |
| Báo chí | 12 báo (24h, cafef, hanoimoi, tienphong, vtc, nguoiduatin…) | Không có | Thêm trust strip |
| Ưu đãi | Banner giảm 7%, miễn phí bốc dỡ/lưu kho | Không có | Cân nhắc — cần user confirm còn hiệu lực |
| Footer | Menu đầy đủ + thanh toán + chính sách + tuyển dụng + FAQ | Có phần, thiếu phương thức thanh toán, chính sách giao hàng, thư ngỏ | Bổ sung cột/links |
| Legacy pages | Template Enfold dài | Template local đã OK nhưng ít brand | Polish header band + breadcrumb |

## Các bước thực hiện

1. **Slogan & hero** — `src/app/[lang]/page.tsx`:
   - Đưa slogan thật `"Chất lượng, nhanh chóng, uy tín là niềm tin!"` làm kicker/tagline chính.
   - Dùng cả 2 hero image (`slide-vantaiphuongvy-homepage-1.png`, `-2.png`): slideshow nhẹ bằng CSS crossfade hoặc component `HeroSlider` client (framer-motion đã có sẵn trong deps). Không lazy-load ảnh đầu (LCP).

2. **CTA band báo giá** — section mới giữa trang: nền `brief-dark`/`#0d2b3e`, chữ lớn "Nhận bảng báo giá vận chuyển hàng hóa / thuê xe tải", 2 nút gọi `0933 871 139` và `0702 00 6839`, link `/lien-he` "Yêu cầu báo giá".

3. **Tin tức trên homepage** — section "Tin tức & khuyến mãi": map 4-6 bài mới nhất từ `legacyPosts` (sort theo `date`), card ảnh (featured_media hoặc fallback), title, date, excerpt; link `/blog/{slug}`; nút "Xem tất cả" → `/blog`.

4. **Báo chí trust strip** — "Báo chí nói về Vận tải Phương Vy": tên 12 báo text-only (24h.com.vn, baobinhdinh, cafef, baodanang, hanoimoi, nguoiduatin, baoquangninh, baothaibinh, baothanhhoa, tienphong, vanhoavaphattrien, vtc). Nếu user xác nhận còn URL bài viết thật thì link, chưa có thì hiển thị text (không fake link).

5. **Ưu đãi band** — chỉ render nếu user confirm ưu đãi còn hiệu lực (xem open questions plan.md). Nếu có: band vàng "Kỷ niệm 10 năm — giảm 7% phí vận chuyển, miễn phí bốc dỡ, giao tận nơi, miễn phí lưu kho".

6. **Footer bổ sung** — `src/components/layout/Footer.tsx`:
   - Thêm link: `/thu-ngo`, `/phuong-thuc-thanh-toan`, `/chinh-sach-van-chuyen-va-giao-hang`, `/gioi-thieu`, `/tuyen-dung`, `/faq`, `/lien-he` — tất cả đều có trong legacy JSON.
   - Cột "Chính sách" riêng: Bảo mật · Thanh toán · Vận chuyển & giao hàng · FAQ.

7. **Legacy page template polish** — `src/app/[lang]/[...legacy]/page.tsx`:
   - Breadcrumb schema đã có; polish: header band giữ palette, font title kích thước hợp lý hơn cho title dài tiếng Việt, `prose` table responsive (bảng giá trong content WP là `<table>` → cần `.rich-content table { @apply ... }` overflow-x).
   - Thêm CTA cuối bài: "Cần báo giá tuyến này? Gọi 0933 871 139 / Zalo" — dùng `renderRichText` đã hỗ trợ append.
   - Kiểm tra `globals.css` `.rich-content` style cho `table`, `img`, `blockquote`, `.kk-star-ratings` (ẩn widget rating WP nếu render xấu — chỉ ẩn hiển thị, không sửa HTML gốc).

8. **Mobile check**: viewport 375px — hero text không tràn, CTA band stack dọc, footer 1 cột, floating actions không che nội dung (đã có padding-bottom body? kiểm tra).

9. **Ảnh fallback**: nếu lo sợ WP origin tắt sau migration — copy các ảnh chính (logo, 2 hero, `cac-loai-xe-cho-hang-tai-phuong-vy.jpg`, `cong-ty-van-tai-phuong-vy.jpg`) về `public/images/legacy/` và dùng local path cho ảnh *component-level*; **không đổi** URL ảnh bên trong `pages.json`/`posts.json` content (contract SEO ảnh). Ghi chú quyết định vào report.

## Success criteria

- [ ] Homepage có: hero (slogan thật + slideshow), dịch vụ, tuyến, 6 cam kết, CTA band 2 số, tin tức ≥4 bài, báo chí strip, footer đầy đủ link chính sách.
- [ ] Legacy page render bảng giá không vỡ layout mobile; CTA cuối bài xuất hiện.
- [ ] Không có emoji mới trong UI mới (production cũ có emoji nhưng design mới dùng lucide icons).
- [ ] `npm run build` xanh; screenshot mobile + desktop lưu `reports/screenshots/`.
- [ ] Hamburg `diff --stat` trống sau batch.

## Risk

- ưu đãi/báo chí hiển thị khi chưa confirm → thông tin sai trên production mới. Giảm thiểu: gate sau open question số 5.
- `dangerouslySetInnerHTML` của rich content có inline style WP → vỡ theme. Giảm thiểu: `.rich-content` CSS reset có chọn lọc, screenshot test 3 page đại diện (`/van-chuyen-hang-hoa`, `/thue-xe-tai`, `/gioi-thieu`).
