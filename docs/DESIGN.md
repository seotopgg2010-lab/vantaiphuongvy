# Design — Vận tải Phương Vy

**Brand essence:** chành xe Bắc Nam đáng tin cậy, nói giá rõ ràng và gọi là có xe — "Chất lượng, nhanh chóng, uy tín là niềm tin!"

## Art direction

- Hiện đại, chuyên nghiệp, đúng ngành vận tải Việt Nam: lưới gọn, nhiều khoảng trắng, một màu nhấn (vàng) cho hành động chính.
- Đáng tin: ảnh thật của đội xe/bãi xe (`public/wp-content/uploads/**`), số liệu chỉ lấy từ nội dung đã xác minh (`src/lib/marketing.ts`), không "24/7", không rating tự gán — sao đánh giá chỉ là số bình chọn của widget kk Star Ratings trên WordPress (`rating` trong corpus).
- Motif lặp lại: nền "brand grid" (gradient xanh logo + lưới 44 px, `.bg-brand-grid`) cho hero, quy trình, CTA và social card; vạch vàng trước eyebrow.
- Kể chuyện theo chương: dịch vụ → tuyến → về Phương Vy & vì sao chọn → quy trình → ưu đãi → báo chí/khách hàng → hỏi đáp → báo giá. Bằng chứng (báo chí) được nhắc sớm ngay dưới hero.

## Tokens (nguồn: `src/app/globals.css`)

| Nhóm | Token | Giá trị | Dùng cho |
|---|---|---|---|
| Brand | `--brand-600` | `#1275bc` | Xanh logo: link, nút primary, icon |
| | `--brand-700` | `#0b5c98` | Hover, header bảng |
| | `--brand-400` / `--brand-50` / `--brand-100` | `#04a4e4` / `#f1f8fd` / `#dff0fb` | Điểm nhấn, nền nhạt |
| Navy | `--navy-950` / `--navy-900` | `#0a3d6b` / `#0c4a82` | Footer, chữ trên nền vàng, `theme-color` |
| Accent | `--accent-500` / `--accent-400` | `#f5b800` / `#ffc933` | Nút gọi hotline (CTA chính), vạch eyebrow |
| Text | `--ink` / `--muted` / `--subtle` | `#0f2236` / `#52687b` / `#5e6f82` | Chữ chính / phụ / chú thích (≥ 4.5:1) |
| Surface | `--surface` / `--line` | `#f5f9fd` / `#e1e9f0` | Nền section xen kẽ, viền |
| On brand | `--on-brand` | `#e6f2fc` | Chữ thân trên nền xanh (≥ 4.5:1) |

- **Type:** Be Vietnam Pro (400–800, subset `vietnamese`). `.h-display` `clamp(2.125rem, 4.6vw, 3.625rem)`/800; `.h-section` `clamp(1.75rem, 3.2vw, 2.5rem)`/750; thân 16–17 px, line-height 1.65–1.8; `.eyebrow` 13 px uppercase tracking 0.08em.
- **Spacing:** `.container-x` max 80rem, padding 1.25 / 1.5 / 2 rem (mobile / sm / lg); section `py-12 md:py-16`.
- **Radius:** nút và field `0.625rem`; card `1rem`; khối nổi `1.5rem`; pill `999px`.
- **Shadow:** `--shadow-card` cho card tĩnh, `--shadow-lift` cho hover và khối nổi.

## Motion

- 150–300 ms, `cubic-bezier(.2,.8,.2,1)` khi vào (`pv-drop`, `pv-fade`, `pv-slide`), chỉ `transform`/`opacity`.
- Hover card: nhấc 3 px + đổi shadow trong 200 ms. Không scroll-jacking, không nội dung ẩn chờ JS.
- `prefers-reduced-motion: reduce` tắt animation/transition toàn cục (`globals.css`).

## Breakpoints & layout

- Tailwind mặc định: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Kiểm tra ở 1440×900, 768×1024, 375×812 và reflow 320 px.
- Dưới `lg`: thanh hành động cố định (Gọi ngay · Zalo · Báo giá), body chừa `padding-bottom` + safe-area.
- Bảng giá luôn nằm trong `.table-scroll` (cuộn ngang trong khung, không tràn trang).

## Component rules

- Mỗi màn một hành động chính: **Gọi hotline** (`.btn-accent`). Zalo là phụ (`.btn-ghost-light` / `.btn-zalo`), "Gửi yêu cầu" trỏ `#bao-gia`.
- Section mở bằng `SectionHeading` (eyebrow + `h2.h-section` + lead + link "xem tất cả").
- Ảnh legacy thường có chữ/hotline in sẵn: đặt trong khung 16/11 (`PageHero`), không dùng làm nền phủ chữ.
- Bài viết có `PageActions` (Chia sẻ · Sao chép liên kết · Hỏi AI) — chỉ gửi URL công khai và bản `.md` công khai.
- Social card `/og/<path>.png` (1200×630) do `src/app/og/[...slug]/route.tsx` sinh: panel brand grid + logo + tiêu đề + hotline + ảnh thật của trang.
- Lead trong hero: 1–2 câu (80–280 ký tự), nói kết quả trước. Trang có đoạn mở đầu WordPress yếu, trống hoặc VIẾT HOA quảng cáo dùng `HERO_LEADS` (`src/lib/marketing.ts`): chỉ dữ kiện có trong chính trang đó, không mâu thuẫn với chip trong hero (ví dụ không ghi tải trọng khác "Xe 0,5 – 30 tấn"); đoạn gốc vẫn giữ trong thân bài.
- Mọi trang tuyến và thuê xe tải có liên kết trong HTML server ở danh mục cuối footer (server component, đặt sau `<main>`, `prefetch={false}`). Mega menu chỉ render khi mở (desktop): render sẵn 65 KB menu ẩn ở đầu trang làm LCP của trang nhẹ chậm hơn 11–14% khi đo A/B. `RouteExplorer` render mọi tuyến, lọc bằng thuộc tính `hidden`.
- Liên kết liên quan: `relatedRoutes` lấy các tuyến láng giềng trong cùng vùng (trang loại hàng lấy các dịch vụ loại hàng khác), `relatedPosts` chọn bài theo chủ đề (`POST_TOPICS`), bài viết có khối "Dịch vụ liên quan" (`relatedServices`). Bài viết mới cần thêm chủ đề vào `POST_TOPICS`.
- Heading trong nội dung legacy được pipeline chuẩn hóa: không nhảy cấp, không lặp H1, không VIẾT HOA (dạng câu qua `displayTitle`, giữ `id` cũ). Đoạn chỉ có chữ đậm là câu hỏi (có câu trả lời theo sau) hoặc tiêu đề ngắn dẫn vào danh sách/bảng thành heading cấp dưới mục chứa nó; dòng "– …" ngăn bằng `<br>` thành danh sách thật; `<ol start>` giữ số thứ tự.
- Liên kết ngữ cảnh trong thân bài: lần nhắc đầu tiên của cụm từ trong `src/content/contextual-links.ts` (dịch vụ, bài viết, "gửi hàng đi <tỉnh>") thành link — tối đa 3 mỗi trang dịch vụ, 5 mỗi bài viết; không trong heading, bảng, callout hay đoạn mở đầu; không tự liên kết; mỗi đích một lần. Không ép link khi bài không có cụm từ tự nhiên.
- Bài viết: dưới H1 là lead (`HERO_LEADS`, 1–2 câu: người đọc nhận được gì, dữ kiện lấy từ chính bài); dòng meta ghi "Tác giả …"; cuối bài có hộp "Về tác giả" (tên + tiểu sử lấy từ hộp tác giả WordPress, không thêm liên kết mạng xã hội cá nhân). Tiêu đề VIẾT HOA hiển thị dạng câu cả trong thẻ bài viết.
- Ảnh: ảnh thân bài có `width`/`height` thật và `srcset` WebP 480/768/1080 px sinh lúc build (`/_img/…`, cache immutable), `src` giữ URL `/wp-content/uploads/**`. Ảnh qua `next/image` dùng `UploadImage` để `src` vẫn là URL upload (crawler không tốn lượt tối ưu ảnh).
- Chip dữ kiện viết bằng chữ: "Thời gian khoảng 36h" (không dùng "~", ở cỡ chữ chip dễ đọc thành "-36h").
- Những gì trang WordPress đang cho Google thấy được giữ lại khi chuyển sang (đối chiếu từng URL, `tests/wordpress-parity.test.ts`):
  - **Sao đánh giá** (`RatingSummary`) nằm ngay dưới H1 (bài viết: cuối dòng meta), đúng vị trí widget cũ, kèm JSON-LD `CreativeWorkSeries` cùng tên và số. Chỉ trang có bình chọn mới hiện; không cho bình chọn mới vì widget cũ cũng chỉ đọc.
  - **Bình luận cũ** (`LegacyComments`): chữ thuần, giữ anchor `#comment-<id>`, luồng mới nhất trước, trả lời theo thời gian; 12 luồng đầu mở, phần còn lại trong `<details>`. Không có form bình luận; câu hỏi mới đi qua hotline hoặc form báo giá. Số điện thoại và email của người đọc được ẩn ngay khi chụp dữ liệu (`src/lib/contact-mask.ts`), vì repo công khai. Bình luận là nội dung người dùng nên không đưa vào bản `.md` hay `llms-full.txt`.
  - **Danh sách kho hàng** (`src/lib/warehouses.ts`, nguyên văn footer WordPress): đầy đủ ở footer (không icon từng dòng, cho nhẹ trang) và trang Liên hệ; trang tuyến/thuê xe của tỉnh có kho hiện dải "Kho hàng Phương Vy tại …" ngay dưới hero.
  - **Chữ trang chủ** (`ABOUT`, `SERVICES_LEAD`, `COMMITMENTS`): giữ lời văn WordPress, chỉ sửa chính tả và bỏ các so sánh "nhất" không chứng minh được.
- Không có banner cookie: GA4 + Google Ads (ID của site cũ, `TRACKING`) đo mọi khách trên domain chính như WordPress, theo quyết định của chủ site ngày 06/10/2026. Localhost, preview và bản vercel.app không gửi dữ liệu.

## Voice & tone

- Tiếng Việt, xưng "Phương Vy" – "quý khách/bạn", câu ngắn, nói kết quả trước ("Giao trong ~36h", "Giá từ 1.500đ/kg").
- Con số cụ thể thay cho tính từ; mọi con số phải có trong nội dung legacy hoặc `marketing.ts`.

| Nên | Không nên |
|---|---|
| "Gọi 0933 871 139" | "Liên hệ ngay hôm nay!!!" |
| "Xe tải 0,5 – 30 tấn" | "Đội xe hùng hậu nhất Việt Nam" |
| "12 báo điện tử đã đưa tin" (đếm từ `PRESS`) | "Được hàng nghìn khách hàng tin tưởng" (không có nguồn) |
