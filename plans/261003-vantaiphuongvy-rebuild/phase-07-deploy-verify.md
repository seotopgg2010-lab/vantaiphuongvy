---
phase: 7
name: "Deploy staging → production + live verification"
status: pending
effort: 0.5d
depends: [6]
---

# Phase 07 — Deploy & live verification

## Mục tiêu

Site mới chạy trên production `vantaiphuongvy.com`, mọi URL SEO cũ trả 200 với canonical nguyên vẹn, DNS/host chuyển đổi an toàn có rollback.

## Context

- Repository mã nguồn: [seotopgg2010-lab/vantaiphuongvy](https://github.com/seotopgg2010-lab/vantaiphuongvy), nhánh `main`. Push lên GitHub là bước lưu mã nguồn; hosting và DNS production thực hiện theo các bước bên dưới.
- Đường deploy hiện có: GitHub `main` kích hoạt Vercel Production; bản public ở `https://vantaiphuongvy.vercel.app/`. Tra trạng thái và URL bản deploy qua GitHub Deployments của repository, rồi chạy [crawl-check](../../scripts/crawl-check.mjs) trên URL public để xác minh. Push source và đổi DNS là hai thao tác riêng; chưa chuyển DNS thì `vantaiphuongvy.com` vẫn chạy WordPress.
- Khi redeploy trên Vercel, giữ **Framework Preset = Next.js**, **Build Command = npm run build**, **Output Directory Override** tắt. Cấu hình `Other` trước đây chỉ phục vụ ảnh trong `public` và trả `404 NOT_FOUND` cho ứng dụng. Nếu bản mới lỗi, dùng bản Production thành công trước đó trong Vercel Deployments để rollback; chỉ thực hiện cutover DNS khi có yêu cầu riêng.
- Env cần: `NEXT_PUBLIC_SITE_URL=https://vantaiphuongvy.com`, và các biến cho form báo giá (Phase 04, xem `.env.local.example`): `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` của project Supabase riêng, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. Thiếu cả hai kênh thì form chỉ hiện lời nhắn gọi hotline. GA4 và Google Ads dùng ID của site WordPress trong `TRACKING` (`src/lib/constants.ts`), đo mọi khách trên domain chính như WordPress, không gửi dữ liệu từ localhost, preview hay vercel.app; `NEXT_PUBLIC_GA_MEASUREMENT_ID` chỉ cần khi đổi sang property GA4 khác.
- Đã chọn **Option B** bên dưới: mirror trong `public/wp-content/uploads/` gồm ảnh trong nội dung, ảnh sitemap ảnh của Rank Math và mọi ảnh trang WordPress đang hiển thị (`live-images.json`).
- WP cũ đang giữ ảnh tại cùng domain — **xung đột quan trọng**: khi domain trỏ sang Next.js, URL `/wp-content/uploads/...` sẽ do Next.js phục vụ. Phải có chiến lược ảnh:
  - **Option A**: giữ WP cũ trên subdomain `media.vantaiphuongvy.com` + rewrite trong `next.config.ts` `/wp-content/uploads/*` → `https://media.vantaiphuongvy.com/wp-content/uploads/*` (proxy hoặc redirect 301 — proxy tốt hơn cho SEO ảnh vì URL không đổi).
  - **Option B**: mirror toàn bộ ảnh uploads về `public/wp-content/uploads/` (tốn dung lượng nhưng self-contained, không phụ thuộc WP còn sống).
  - Chọn **A trước, B nếu WP sắp tắt**. Quyết định ghi trong report; không bao giờ đổi URL ảnh trong content.

## Các bước thực hiện

1. **Staging deploy** — deploy lên preview URL; chạy `node scripts/verify-live.mjs https://<staging>` (Phase 06). Toàn bộ assert phải xanh.

2. **Ảnh check** — trên staging, `curl -sI https://<staging>/wp-content/uploads/2018/07/logo-van-tai-phuong-vy-2.png` → 200 (qua rewrite/proxy) hoặc ít nhất redirect đúng đích; view-source homepage có ảnh hero load được (screenshot verify).

3. **Canonical check** — 5 URL đại diện: view-source có `<link rel="canonical" href="https://vantaiphuongvy.com/.../">` đúng (dù staging trả canonical production là đúng vì `getSiteUrl()` cố định domain production — xác nhận đây là hành vi mong muốn).

4. **DNS cutover** — point `vantaiphuongvy.com` + `www` → hosting mới. Giữ WP cũ chạy ở origin/IP cũ tối thiểu 7 ngày (rollback + ảnh proxy).
   - Ngay trước khi đổi DNS, nếu WordPress có bình luận, ảnh hoặc trang mới sau lần chụp gần nhất: chạy `npm run content:extras` rồi `npm run content:mirror` (khi WordPress còn trả lời ở domain), `npm test`, commit và deploy. Sau cutover các file chụp này không lấy lại được.
   - Trang chủ mới đã mang thẻ `google-site-verification` của WordPress, nên Search Console giữ quyền sở hữu. Xuất báo cáo Hiệu suất (trang, truy vấn, 3 tháng) làm mốc trước khi đổi DNS.

5. **Post-cutover verify** — chạy lại `verify-live.mjs https://vantaiphuongvy.com`: đủ 96+ URL sample (toàn bộ legacy nếu nhanh, hoặc 20 URL ngẫu nhiên + các trang trọng yếu `/`, `/van-chuyen-hang-hoa/`, `/thue-xe-tai/`, `/gioi-thieu/`, `/lien-he/`, `/faq/`, `/blog/`, 3 post, 3 route page).

6. **Search Console** — submit sitemap mới `sitemap.xml`; theo dõi coverage 48-72h; kiểm tra không có spike 404.

7. **Redirect legacy file WP** — các URL file PHP cũ (`/wp-json/*`, `xmlrpc.php`, `/feed/`) để Next 404 tự nhiên; không cần redirect (chúng không phải SEO pages). `/feed` nếu muốn giữ RSS thì thêm route feed.xml — optional, defer.

8. **Rollback plan** — nếu verification fail: trỏ DNS lại WP cũ (< 5 phút nếu TTL thấp); ghi rõ trong report.

9. **Cuối cùng**: `git -C D:/CodeVipPro/hamburg status --short` + `diff --stat` lần cuối; update `reports/final-verification.md` với toàn bộ output; đóng plan.

## Success criteria

- [ ] `verify-live.mjs` xanh 100% trên `https://vantaiphuongvy.com`.
- [ ] Ảnh WP-load qua domain chính hiển thị trong trình duyệt (screenshot home + 1 route page + 1 blog post).
- [ ] Search Console sitemap submitted.
- [ ] Rollback path đã được ghi chép và test điều kiện (ít nhất confirm WP cũ còn chạy ở origin).
- [ ] Hamburg repo sạch — không diff nào do batch này gây ra.

## Risk

- **Ảnh chết sau cutover** là rủi ro lớn nhất → proxy `media.` subdomain hoặc mirror `public/` phải xong trước DNS.
- DNS propagation chậm → TTL giảm trước 24h nếu quản trị được zone.
- Quên `NEXT_PUBLIC_SITE_URL` → canonical lệch domain staging → checklist env trong bước 1.
