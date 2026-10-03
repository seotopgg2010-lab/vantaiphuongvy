---
title: "Thiết kế lại vantaiphuongvy.com — giữ nguyên URL/SEO, giao diện vận tải hiện đại"
description: "Redesign toàn bộ website Vận tải Phương Vy trên Next.js 16 hiện có: UI hiện đại đúng ngành vận tải/chành xe Việt Nam, giữ tuyệt đối slug/canonical/ảnh WordPress cũ để bảo toàn SEO, Supabase riêng, một ngôn ngữ tiếng Việt."
status: in-progress
priority: P1
effort: 10d
tags: [frontend, seo, backend, database, critical]
blockedBy: []
blocks: []
created: 2026-10-03
updated: 2026-10-03
---

# Plan: vantaiphuongvy.com redesign (giữ link, tối ưu SEO)

## Safety boundary — bắt buộc

- **Project được phép chỉnh sửa duy nhất:** `D:/CodeVipPro/vantaiphuongvy`.
- `D:/CodeVipPro/hamburg` là project tham khảo **read-only**. Không sửa, xóa, checkout, reset, clean, commit, push hoặc chạy script ghi dữ liệu vào đó. Chỉ được dùng thao tác đọc (`read`, `diff`, `git show`, `git status`).
- `src/legacy-content/pages.json` (86 pages) và `src/legacy-content/posts.json` (9 posts) là **nguồn SEO bất biến** — không sửa URL, slug, link ảnh hoặc xóa record.
- Không xóa hàng loạt file. Trước khi xóa bất kỳ file/component nào phải `grep` kiểm tra import/dependency; ưu tiên cô lập hoặc thay nội dung.
- Trước và sau mỗi batch thay đổi phải chạy `git -C D:/CodeVipPro/hamburg status --short` và `git -C D:/CodeVipPro/hamburg diff --stat` để chứng minh Hamburg không bị tác động.
- Mọi câu "dọn nội dung Hamburg" có nghĩa là dọn nội dung Hamburg **đã copy sang codebase Phương Vy**, không phải đụng vào project Hamburg gốc.

## Outcome

Website `vantaiphuongvy.com` mới trên Next.js 16 với:

1. **SEO bảo toàn tuyệt đối** — mọi URL cũ (slug, trailing path, query pattern hợp lệ) trả 200; canonical giữ nguyên domain và path không đổi; ảnh vẫn phục vụ trên URL `https://vantaiphuongvy.com/wp-content/uploads/...`; sitemap/robots đúng; schema.org đầy đủ.
2. **UI hiện đại đúng ngành vận tải VN** — palette xanh dương/cyan/vàng theo brand thật; mobile-first; hotline 3 số, Zalo, báo giá, tìm tuyến, 6 cam kết, bảng giá, tin tức là trung tâm; không còn bất kỳ trace nào của Hamburg Connect (in ấn, bảng hiệu, nail, cưới hỏi, gửi hàng Mỹ/Canada/EU).
3. **Một ngôn ngữ duy nhất tiếng Việt** — không `/en`, không language switcher, không hreflang; `/en*` trả 404.
4. **Supabase riêng** — project/DB/storage/keys/seed hoàn toàn độc lập với Hamburg.
5. **Bằng chứng hoạt động thật** — 3 hotline (`0933 871 139`, `0702 00 6839`, `0902 939 318`), giờ `8h00–21h00`, địa chỉ `38H4, Đường DN9, KP4, P. Tân Hưng Thuận, Quận 12, TP.HCM`, Zalo `0902939318`, email `vanchuyenphuongvy@gmail.com` (xác nhận thêm `vanmai.phuongvy@gmail.com` trước khi đưa vào UI).

## Quyết định đã chốt (không thay đổi nếu không có yêu cầu mới)

- **Legacy JSON là nguồn SEO bất biến**: route `/[...legacy]` render toàn bộ 86 pages + 9 posts từ JSON.
- **Xóa route Hamburg thay vì redirect**: route không thuộc Phương Vy được xóa khỏi `src/app/[lang]`, trả 404.
- **Không sitemap động từ Supabase**: `src/app/sitemap.ts` chỉ lấy legacy items + `/blog`.
- **Một locale**: `dictionaries.ts` chỉ `vi`; `src/proxy.ts` rewrite URL không prefix → `/vi/*`, redirect `/vi/*` về không prefix, `/en*` → 404.
- **Public shell không đọc Supabase settings cũ**: tránh branding Hamburg rò rỉ từ DB.
- **Homepage dùng ảnh thật** + copy chỉnh sửa gọn từ nội dung legacy; không sao chép nguyên HTML cũ.
- **Contact form hiện không submit Supabase** — stub hướng về hotline/Zalo cho tới khi có decision về form backend.

## Bằng chứng đã audit (live site)

- Production `vantaiphuongvy.com` là WordPress Enfold, title `Công Ty TNHH Dịch Vụ Vận Tải Phương Vy`, OG image `cong-ty-van-tai-phuong-vy.jpg`.
- WP REST API public: `wp-json/wp/v2/pages?per_page=100` → **86 pages**, `wp-json/wp/v2/posts` → **9 posts**. Đã đối chiếu khớp với `pages.json`/`posts.json` local.
- Header thật: Trang chủ · Giới thiệu · Bảng giá · Vận chuyển hàng hóa · Dịch vụ khác · Tin tức · Liên hệ · Search; social: X, Facebook, Pinterest, Behance, Tumblr, Instagram, RSS.
- Homepage thật: hero slideshow (2 ảnh `slide-vantaiphuongvy-homepage-1/2.png`), slogan "Chất lượng, nhanh chóng, uy tín là niềm tin!", khối báo giá, 6 cam kết (Nhanh chóng / Chính xác / Chuyên nghiệp / An toàn / Tiện lợi / Tiết kiệm), tin tức khuyến mãi, báo chí nói về Phương Vy (12 báo), ưu đãi 10 năm (giảm 7%, miễn phí bốc dỡ, giao tận nơi, miễn phí lưu kho).
- `/van-chuyen-hang-hoa/`: bảng giá theo kg/m³/khu vực, lộ trình QL1A, mục lục dài; `/thue-xe-tai/`: bảng giá thuê xe, 5 dòng xe, quy trình thuê; `/faq/`: câu hỏi vận tải.
- Canonical trên production có trailing slash; sitemap production hiện là `wp-sitemap.xml`.
- Báo cáo chi tiết: `reports/visual-audit.md`, `reports/url-contract.json`.

## Trạng thái hiện tại (sau các batch đã làm)

**Đã xong**: rebrand constants/seo/layout, header/footer/topbar/floating/mobile menu tiếng Việt, homepage mới với hero + 6 cam kết đúng, blog/search/404 tiếng Việt, sitemap/robots, xóa route Hamburg public, cô lập shell khỏi Supabase settings, 1 locale `vi`, `/en` → 404, Zalo `0902939318`, 3 hotline + giờ + địa chỉ vào `SITE_CONFIG`/Footer/JSON-LD, `npm run typecheck` + `npm run lint` + `npm run build` xanh.

**Còn lại** — đúng phạm vi các phase bên dưới.

## Phases

| Phase | Tên | Trạng thái | Ước lượng |
|-------|-----|-----------|-----------|
| 01 | [Kiểm toán import & quét trace Hamburg còn sót](phase-01-audit-leftover.md) | completed | 0.5d |
| 02 | [Nâng cấp UI homepage + legacy template theo brand thật](phase-02-ui-polish.md) | completed | 2d |
| 03 | [Hoàn thiện SEO: schema, metadata, sitemap, canonical audit](phase-03-seo-hardening.md) | completed | 1d |
| 04 | [Form liên hệ & lead capture (Supabase riêng)](phase-04-contact-lead.md) | pending | 1d |
| 05 | [Dọn module chết + admin decision](phase-05-cleanup-admin.md) | completed | 1.5d |
| 06 | [Regression tests cho URL/SEO contract](phase-06-regression-tests.md) | completed | 1d |
| 07 | [Deploy staging → production + live verification](phase-07-deploy-verify.md) | in-progress | 0.5d |

## Risks chính

- **SEO regression** là rủi ro số 1: bất kỳ redirect/404 sai nào cũng mất ranking. → URL contract test trong Phase 06 là gate bắt buộc trước deploy.
- **Dữ liệu chưa xác nhận**: email phụ, giờ đóng/mở chính xác theo ngày, thông tin pháp lý. → Open questions bên dưới, không được "đoán" vào UI.
- **Admin còn nguyên bản Hamburg**: hiện `/admin` là nội bộ, đã bị robots chặn; quyết định giữ-rebrand hay xóa cần confirm.
- **Ảnh WP remote**: nếu domain WP gốc tắt sau khi chuyển host, ảnh chết. → Phase 02 phải copy ảnh cần thiết về `public/` hoặc CDN, giữ URL tương đương nếu có thể.

## Open questions cần user xác nhận

1. Email `vanmai.phuongvy@gmail.com` có còn dùng không, đưa vào UI hay chỉ `vanchuyenphuongvy@gmail.com`?
2. Giữ hay xóa `/admin` (CMS nội bộ)? Nếu giữ: rebrand sang Phương Vy + Supabase riêng, hay ẩn hoàn toàn?
3. Hotline nào là **số chính** hiển thị lớn nhất (hiện production nhấn `0933 871 139` và `0702 00 6839`)?
4. Địa chỉ kho Hà Nội/Đà Nẵng có cần hiển thị không (legacy nói có kho bãi 3 miền)?
5. Có muốn giữ trang báo chí "Báo chí nói về Vận tải Phương Vy" (12 báo) làm trust signal trên homepage mới?

## Handoff

Sau khi user trả lời open questions → chạy `/ak:cook` theo thứ tự phase. Phase 06 (regression tests) là **hard gate**: không có test xanh thì không deploy.
