# UX/AX review: vantaiphuongvy.com (Next.js rebuild) — 2026-10-05

## Verdict

Bản dựng lại đã có nền SEO on-page rất tốt (95/95 URL trong sitemap trả 200, canonical tự tham chiếu, mỗi trang đúng 1 H1, không trùng title/description, JSON-LD hợp lệ). Lỗ hổng lớn nhất là **soft-404**: mọi URL một cấp có dấu chấm (`/favicon.ico`, `/ads.txt`, `/foo.php`, `/llms.txt`) trả về nội dung trang chủ với mã 200 và canonical `/`. Cơ hội tiếp theo là lớp AX (markdown twin, `llms.txt`), social card có thương hiệu 1200×630, và vài chỉnh sửa UX nhỏ giúp tăng niềm tin và nhận diện.

**Kết quả round 1:** toàn bộ Must và Should đã triển khai và đạt acceptance trên production build (`next build` + `next start`). Discovery scan từ 12 cảnh báo xuống 0 cảnh báo, 0 lỗi; crawl-check 95/95 trang OK cùng hợp đồng redirect/410/404 mới; build, lint, typecheck và 28 test đều xanh. DONE contract đạt, trừ hai mục ghi ở "Unresolved questions" (trang 404 có thương hiệu là lỗi có sẵn được tách thành tác vụ riêng; quyết định của chủ site về title Rank Math và AI crawler).

## Scope and environment

- Mode: `--auto` (ak:enhance-ux-ax), routed qua ak:agentkit. Focus: toàn site public (UI + SEO).
- Commit gốc: `5a4863e` trên `main`. Dev server: `npm run dev -- -p 3100` (`.claude/launch.json`, tên `vantaiphuongvy-dev`).
- Trang review: `/`, `/van-chuyen-hang-hoa/`, `/van-chuyen-hang-hoa/da-nang/`, `/thue-xe-tai/`, `/blog/`, `/blog/giay-to-van-chuyen-hang-hoa/`, `/blog/kich-thuoc-thung-xe-tai-trong-van-tai-hang-hoa/`, `/lien-he/`; SEO crawl toàn bộ 95 URL trong sitemap.
- Không chạy được: Core Web Vitals đo thật (chỉ có dev server); docs Next.js trong `node_modules/next/dist/docs` bị hook `scout-block` của AgentKit chặn đọc → hành vi Next 16 được xác minh bằng build + request thực tế. Python cục bộ thiếu module `tempfile` nên dùng `sharp` để cắt ảnh.
- Render-check (`ak:frontend-design/scripts/render-check.mjs`) chạy rất chậm trên dev server với trang dài; ảnh chụp bổ sung bằng browser pane ở đúng viewport.

## Baseline evidence

Thư mục: `enhance-ux-ax-261005-1130-ux-seo-optimization/round-1/baseline/`.

| Trang | 1440×900 | 768×1024 | 375×812 |
|---|---|---|---|
| Home | `home/1440x900*.{png,jpg}` | `home/768x1024*.{png,jpg}` | `home/375x812*.{png,jpg}` |
| Route Đà Nẵng | `route/` + browser pane | `route/` | `route/` + browser pane |
| Route hub, truck hub, blog, post, contact | thư mục tương ứng (nếu render-check hoàn tất) + browser pane | | |

- Render-check home: **0 errors**, 22 warnings (toàn bộ là false-positive: `label.sr-only` bị "clipped", tên + vai trò testimonial "touching" vì khoảng trắng nằm trong span sau).
- Discovery scan (`discovery-scan.txt`): **exit 0**, 0 error, 12 warning (thiếu `llms.txt`, `llms-full.txt`, markdown twin; riêng `/index.html.md` "returns HTML" chính là soft-404), 21 info (không có `rel=alternate` markdown; không chặn AI crawler nào).
- SEO crawl (`seo-audit.json`): 18 title > 60 ký tự, 4 description > 160 ký tự (đều là giá trị Rank Math đang chạy live), `og:image` không có width/height trên 95/95 trang, `/blog/` thiếu `og:image:alt`, alt ảnh social trang chủ là "TRANG CHỦ". Ảnh social gốc: 56 ảnh 1200×827, 13 ảnh 1800×1240, 10 ảnh vuông 1030×1030 → Facebook/Zalo cắt khung 1.91:1.
- Soft-404 xác nhận: `/favicon.ico`, `/ads.txt`, `/foo.php`, `/apple-touch-icon.png`, `/manifest.webmanifest`, `/llms.txt` → 200 `text/html`, `<title>` trang chủ, canonical `https://vantaiphuongvy.com/`.

## Scores

| Area | Score 0–3 | Evidence |
|---|---|---|
| First impression | 2 | `home/1440x900-s00.jpg`, `home/375x812-s00.jpg`: H1 nói rõ dịch vụ, CTA gọi + Zalo trên màn đầu ở cả desktop và mobile |
| Brand recall | 2 | Logo + palette xanh logo + vàng nhất quán; nhưng favicon dùng navy cũ `#0a2540` (`src/app/icon.svg`), `themeColor` lệch palette (`src/app/[lang]/layout.tsx`), link chia sẻ chỉ hiện ảnh legacy bị cắt, không có thương hiệu |
| Content punch | 2 | Headline rõ ràng; vài tiêu đề section chung chung ("Dịch vụ Vận tải Phương Vy đang cung cấp") |
| Clarity & hierarchy | 2 | Một hành động chính (Gọi hotline) mỗi màn; thanh hành động mobile cố định |
| Storytelling | 1 | Bằng chứng (12 báo đưa tin) nằm ở ~60% chiều dài trang chủ (màn 9/18 trên mobile, `home/375x812-s08.jpg`), xa điểm ra quyết định ở hero |
| Knowledge & trust | 2 | MST, địa chỉ, 3 bãi xe, giờ làm việc, bài viết có ngày; testimonial chỉ có tên gọi |
| Motion | 2 | 150–300 ms, chỉ transform/opacity, `prefers-reduced-motion` toàn cục (`globals.css:258`) |
| Responsive | 2 | Không overflow (render-check 0 error); tên tuyến bị cắt "Điện Biên – Lai Ch…" ở 375 px (`home/375x812-s03.jpg`); ảnh hero route bị crop 4:3 mất hotline in trên ảnh (browser pane, `/van-chuyen-hang-hoa/da-nang/`) |
| Accessibility | 2 | Skip link, focus-visible, token màu AA, aria-label đầy đủ |
| Performance feel | 2 (chưa đo) | Hero dùng `preload`, AVIF/WebP, kích thước ảnh đầy đủ; CWV thật cần đo trên production |
| AX / discovery | 1 | Soft-404, không có markdown twin / `llms.txt`, social card không chuẩn 1200×630 |

## Proposals

### P1 — Chặn soft-404 cho URL một cấp có dấu chấm (Must)
- Evidence: curl `/favicon.ico`, `/ads.txt`, `/foo.php`, `/llms.txt` → 200 HTML trang chủ, canonical `/`. Nguyên nhân: `src/proxy.ts:20` bỏ qua mọi path có `.`, Next khớp `[lang]` = `ads.txt` và render home.
- Change: `export const dynamicParams = false` trong `src/app/[lang]/layout.tsx` (chỉ locale `vi` render).
- Files: `src/app/[lang]/layout.tsx`, `tests/` (regression).
- Acceptance: trên production build, `/favicon.ico`, `/ads.txt`, `/foo.php`, `/x.html` → 404; `/`, một route, một post, `/blog/`, `/tim-kiem/?q=ha` → 200; `npm test` có test cho hợp đồng này.

### P2 — Markdown twin cho mọi trang indexable (Should)
- Evidence: scan WARN `markdown-variant` ×10, INFO `markdown-alternate` ×10.
- Change: build-time chuyển HTML legacy đã làm sạch → Markdown (cheerio, trong `scripts/build-legacy.ts`), lưu `src/legacy-content/legacy-markdown.json`; route handler tĩnh phục vụ `/<path>.md` (home: `/index.md`, blog: `/blog.md`) qua rewrite trong proxy; `<link rel="alternate" type="text/markdown">` trên mỗi trang; header `text/markdown; charset=utf-8` + `X-Robots-Tag: noindex`. Trang chủ và `/blog/` dựng markdown từ cùng nguồn dữ liệu đang render HTML (không drift).
- Files: `scripts/build-legacy.ts`, `scripts/legacy-markdown.ts` (mới), `src/legacy-content/legacy-markdown.json` (generated), `src/lib/markdown-twins.ts` (mới), `src/app/md/[[...slug]]/route.ts` (mới), `src/proxy.ts`, `src/lib/seo.ts`, `src/app/[lang]/(site)/blog/page.tsx`.
- Acceptance: `curl /van-chuyen-hang-hoa/da-nang.md` → 200 `text/markdown`, có H1, URL canonical, ngày cập nhật, bảng giá dạng bảng GFM; `X-Robots-Tag: noindex`; mọi trang trong sitemap có `rel=alternate` trỏ tới twin trả 200; `.md` không xuất hiện trong sitemap; scan không còn WARN `markdown-variant`.

### P3 — `/llms.txt` và `/llms-full.txt` (Should, hygiene chi phí thấp)
- Evidence: scan WARN `llms-txt`, `llms-full-txt`.
- Change: route handler tĩnh sinh từ cùng corpus: `llms.txt` theo llmstxt.org (H1, `>` tóm tắt, thông tin liên hệ, các mục H2 trỏ tới `.md` tuyệt đối); `llms-full.txt` ghép toàn bộ markdown theo thứ tự đọc. Header `noindex`.
- Files: `src/app/llms.txt/route.ts`, `src/app/llms-full.txt/route.ts`, `src/lib/markdown-twins.ts`.
- Acceptance: cả hai trả 200 `text/plain`/`text/markdown` + `X-Robots-Tag: noindex`; mọi link trong `llms.txt` trả 200; scan không còn WARN tương ứng. Không quảng bá đây là "đòn bẩy xếp hạng".

### P4 — Social card thương hiệu 1200×630 cho từng trang (Should)
- Evidence: `og:image` 95/95 trang không có width/height; ảnh gốc 1.45:1 hoặc vuông bị cắt; `/blog/` thiếu `og:image:alt`; alt trang chủ "TRANG CHỦ".
- Change: route handler tĩnh `next/og` sinh PNG 1200×630 tại `/og/<path>.png` (home `/og/index.png`): panel xanh logo với logo, tiêu đề trang, hotline + ảnh thật của trang. Metadata khai báo card (width/height/alt) làm `og:image` đầu tiên, giữ ảnh legacy làm ảnh thứ hai; JSON-LD giữ ảnh legacy.
- Files: `src/app/og/[...slug]/route.tsx` (mới), `src/lib/seo.ts`.
- Acceptance: `curl -I /og/van-chuyen-hang-hoa/da-nang.png` → 200 `image/png`, kích thước 1200×630 (sharp metadata); HTML có `og:image:width=1200`, `og:image:height=630`, `og:image:alt` khác rỗng trên mọi trang; ảnh card đọc được tiếng Việt có dấu (kiểm bằng vision).

### P5 — `lastmod` của `/blog/` không reset mỗi lần deploy (Should)
- Evidence: `src/app/sitemap.ts:27` dùng `new Date()`.
- Change: dùng ngày bài viết mới nhất (`modified` hoặc `date`).
- Acceptance: hai lần gọi sitemap cách nhau cho cùng `lastmod` của `/blog/`; test trong `tests/sitemap-robots.test.ts`.

### P6 — Nhóm hành động chia sẻ trên bài viết (Should)
- Evidence: bài viết không có cách chia sẻ/copy link (browser pane `/blog/kich-thuoc-thung-xe-tai-trong-van-tai-hang-hoa/`); khách SME hay gửi link qua Zalo/Facebook.
- Change: client component nhỏ cạnh dòng meta bài viết: "Chia sẻ" (`navigator.share` nếu có, fallback Facebook/Email), "Sao chép liên kết", menu "Hỏi AI về bài viết" (ChatGPT, Claude, Perplexity với prompt chứa URL `.md` tuyệt đối) và "Xem bản Markdown". Toast `aria-live`, không script bên thứ ba, chỉ gửi URL công khai.
- Files: `src/components/site/page-actions.tsx` (mới), `src/templates/legacy-page.tsx`.
- Acceptance: dùng được bằng bàn phím; copy link hiển thị toast; không layout shift; link ngoài có `rel="noopener noreferrer"`.

### U1 — Ảnh hero trang dịch vụ/tuyến không cắt mất chữ in trên ảnh (Should)
- Evidence: `/van-chuyen-hang-hoa/da-nang/` ở 1440: khung `aspect-[4/3]` cắt mất hotline in trên ảnh ("0933 87 11"); 69/95 ảnh legacy có tỉ lệ ~1.45.
- Change: khung ảnh `PageHero` theo tỉ lệ 16/11.
- Files: `src/templates/page-hero.tsx`.
- Acceptance: ảnh hero Đà Nẵng hiển thị trọn dòng hotline ở 1440 và 768; không overflow ở 375.

### U2 — Tên tuyến không bị cắt trong Route Explorer (Should)
- Evidence: `home/375x812-s03.jpg` "Điện Biên – Lai Ch…".
- Change: cho phép xuống dòng (tối đa 2 dòng) thay vì `truncate`.
- Files: `src/components/site/route-explorer.tsx`.
- Acceptance: ở 375 px mọi tên tuyến đọc đủ; chiều cao ô đồng đều theo hàng.

### U3 — Icon trang/thiết bị theo palette logo (Should)
- Evidence: `src/app/icon.svg` nền `#0a2540` (navy cũ), `themeColor: '#0a2540'`; không có apple-touch-icon.
- Change: cập nhật `icon.svg` theo token logo (`#1275bc`/`#0a3d6b`/`#f5b800`), thêm apple-touch-icon 180×180, `themeColor` = token `--navy-950`.
- Files: `src/app/icon.svg`, `src/app/apple-icon.png` (mới — ban đầu là route `apple-icon.tsx` dùng `next/og`, nhưng URL `/apple-icon` không có đuôi nên bị proxy viết thành `/vi/apple-icon/` → 404; chuyển sang PNG tĩnh render từ chính JSX đó), `src/app/[lang]/layout.tsx` (chỉ dòng `themeColor`).
- Acceptance: `<link rel="apple-touch-icon">` trả PNG 180×180; icon dùng đúng mã màu token.

### U4 — Dải "báo chí nói về Phương Vy" gần hero (Should)
- Evidence: Storytelling = 1; khối báo chí ở màn 9/18 trên mobile.
- Change: dải trust gọn ngay dưới StatsStrip trang chủ: "12 báo điện tử đã đưa tin" + tên các báo, link tới section `#press`.
- Files: `src/app/[lang]/(site)/page.tsx`, `src/components/site/marketing.tsx`.
- Acceptance: hiển thị trong màn hình thứ hai ở 375 px, không overflow ở 320 px; số báo lấy từ `PRESS.length` (không hard-code).

### G1 — Hướng dẫn dự án cho người và agent (Should)
- Change: `docs/DESIGN.md` (tokens, motion, breakpoints, voice), `docs/REVIEW.md` (checklist UX/AX, 3 viewport, discovery surfaces), thêm mục vào `AGENTS.md` (ngoài khối do `next dev` quản lý).
- Acceptance: các file tồn tại, nội dung khớp token trong `globals.css`; khối `nextjs-agent-rules` giữ nguyên.

### U5 — Không tràn ngang ở 320 px (Should, phát hiện khi xác minh)
- Evidence: quét toàn bộ 95 URL ở 320 px (script CDP, `round-1/after/reflow-320.txt`) tìm ra: khối báo giá (email không ngắt được, `sections.tsx`) trên mọi trang có form; `/lien-he/` (email trong ô thông tin, render-check "4px wider"); `/thue-xe-tai/` +17 px do rác widget đếm ngược WordPress "0Weeks0Days0Hours0Minutes0Seconds" còn sót trong corpus; `/blog/van-chuyen-hang-hoa-nguy-hiem/` +317 px (email dính `&nbsp;`); `/van-chuyen-hang-hoa/may-moc-thiet-bi/` +54 px (dòng "BÊN A : ………" trong mẫu hợp đồng); `/chinh-sach-bao-mat/` +3 px; lưới "tuyến liên quan" trên `/campuchia/`, `/lao/`, `/duong-bien/` +3,5 px.
- Change: `min-w-0` cho cột lưới và `break-all` cho email (khối báo giá, trang liên hệ); `.prose-pv { overflow-wrap: break-word }` cho nội dung legacy; `grid-cols-1` cho lưới tuyến liên quan; pipeline làm sạch loại `.av-countdown-timer` (kèm test chống tái phát).
- Files: `src/templates/sections.tsx`, `src/templates/contact-template.tsx`, `src/app/globals.css`, `scripts/build-legacy.ts`, `src/legacy-content/legacy-clean.json` (tái tạo), `tests/legacy-clean.test.ts`.
- Acceptance: quét 95 URL ở 320 px và 375 px báo 0 trang tràn (`reflow-320.txt`, `reflow-375.txt`).

### G2 — ESLint bỏ qua thư mục build phụ (Should, phát hiện khi xác minh)
- Evidence: `npm run lint` báo 10.379 vấn đề, toàn bộ trong `.next-build/` (thư mục `NEXT_DIST_DIR`, đã có trong `.gitignore` là `/.next-*/`).
- Change: thêm `.next-*/**` vào `globalIgnores` của `eslint.config.mjs`.
- Acceptance: `npm run lint` exit 0.

### Không triển khai (cần chủ site quyết định) — xem "Unresolved questions"
- Rút gọn 18 title > 60 ký tự, 4 description > 160 ký tự và các title VIẾT HOA: đây là giá trị Rank Math đang live, plan gốc chốt "giữ nguyên SEO legacy".
- Chính sách AI crawler (đang cho phép tất cả, kể cả bot huấn luyện GPTBot/ClaudeBot/CCBot).
- FAQPage JSON-LD đang có trên trang có ≥2 FAQ: vô hại, nhưng Google đã bỏ rich result FAQ (5/2026) — không kỳ vọng hiển thị đặc biệt.

## DONE contract

1. P1–P6, U1–U4, G1 đạt acceptance; mục bỏ qua có lý do ghi trong báo cáo.
2. `check-discovery-surfaces.mjs` exit 0 trên production build (`next start`) với `--site-origin https://vantaiphuongvy.com`, kiểm tra > 1 trang; mọi warning còn lại được sửa hoặc ghi lý do chấp nhận.
3. Ảnh 1440×900, 768×1024, 375×812 của các trang đã đổi (home, route, post) không overflow, chữ không bị cắt, không chồng lấn, không ảnh hỏng; vision review không có lỗi High.
4. Không hạng mục rubric nào giảm so với baseline; Storytelling và AX từ 1 lên ≥ 2.
5. Phím tắt bàn phím + reduced-motion hoạt động trên component tương tác mới (page actions).
6. `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` pass (hoặc lỗi có sẵn được chứng minh).
7. `docs/DESIGN.md`, `docs/REVIEW.md`, `AGENTS.md` phản ánh hướng thiết kế và checklist, giữ nội dung cũ.
8. Dev/prod server và process do review khởi động được dừng.

### Kết quả đối chiếu (round 1, production build `NEXT_DIST_DIR=.next-build`, `next start -p 3101`)

| # | Trạng thái | Bằng chứng |
|---|---|---|
| 1 | Đạt | P1–P6, U1–U5, G1–G2 đạt acceptance (chi tiết bên dưới). Thay đổi so với spec: U3 dùng PNG tĩnh thay vì route `next/og`; U4 trên điện thoại hiện 6 báo + "+6 báo khác" (khớp lưới báo chí sẵn có). |
| 2 | Đạt | `round-1/after/discovery-scan.txt`: exit 0, 20 trang, **0 error, 0 warning** (baseline: 12 warning). INFO còn lại: `content-negotiation` (tùy chọn, không làm vì cần `Vary: Accept` trên mọi trang HTML) và `ai-crawlers` (quyết định của chủ site). |
| 3 | Đạt | Render-check `round-1/after/home/` 0 error ở 320/375/768/1440; Đà Nẵng 1440/768/375 (`round-1/after-ux/`, browser pane): ảnh hero hiện trọn hotline; dải báo chí nằm trong màn hai ở 375. Quét reflow 95/95 URL ở 320 và 375 px: 0 trang tràn. Vision review không có lỗi High. Render-check treo ở 1440 px trên trang tuyến và bài viết (giống baseline) nên ảnh 1440 của hai trang này lấy từ browser pane. |
| 4 | Đạt | Storytelling 1 → 2 (bằng chứng báo chí ngay dưới hero); AX 1 → 3 (twin + llms + social card + soft-404 sửa); Brand recall giữ 2 → 3 (favicon/apple-icon/theme-color/social card cùng palette); không hạng mục nào giảm. |
| 5 | Đạt | `PageActions`: nút native, `summary` focus được và mở bằng Enter, mọi mục `tabIndex 0`, link ngoài `rel="noopener noreferrer"`, toast `role=status aria-live=polite`; chuyển động chỉ opacity/rotate, tắt bởi quy tắc reduced-motion toàn cục. |
| 6 | Đạt | `npm run typecheck` 0 lỗi; `npm run lint` 0 lỗi (sau G2); `npm test` 28/28; `npm run build` exit 0 (95 twin `.md` + 95 card `.png` prerender tĩnh); `node scripts/crawl-check.mjs http://localhost:3101` → "OK — 95 pages, 417 unique targets, redirect contract intact" (đã gồm hợp đồng mới: soft-404, `.md`, `llms`, `/og/`); `node scripts/verify-live.mjs` 21/21 PASS (đã sửa 4 kỳ vọng có sẵn thiếu dấu `/` cuối, vốn nhận 308 thay vì 404). |
| 7 | Đạt | `docs/DESIGN.md`, `docs/REVIEW.md` (mới, đặt trong `docs/` theo quy ước repo), mục "project rules" thêm vào `AGENTS.md` ngoài khối `nextjs-agent-rules` (giữ nguyên). |
| 8 | Đạt | Xem "Round log". |

## Round log

| Round | Proposals done | Checks passing | Regressions fixed | Notes |
|---|---|---|---|---|
| 1 | P1–P6, U1–U5, G1–G2 | Contract 1–8 | `/apple-icon` 404 qua proxy → PNG tĩnh; tràn ngang ở 320 px trên 9 nhóm trang (xem U5, gồm rác widget đếm ngược trong corpus); ESLint quét `.next-build/`; kỳ vọng sai trong `verify-live.mjs` | U1–U4 do agent `ui-ux-designer` triển khai, controller rà diff và xác minh lại trên production. Lỗi có sẵn ngoài phạm vi được tách thành tác vụ riêng: trang 404 có thương hiệu không hiển thị (Next dùng `/_not-found` mặc định); `/admin/login/` lặp redirect khi thiếu biến môi trường Supabase. |

## Unresolved questions

1. Có muốn rút gọn/viết thường các title Rank Math quá dài hoặc VIẾT HOA (18 title, 4 description) không? Đang giữ nguyên theo quyết định "SEO legacy bất biến".
2. Chính sách AI crawler: giữ cho phép tất cả, hay chặn bot huấn luyện (GPTBot, ClaudeBot, CCBot) nhưng vẫn cho bot tìm kiếm (OAI-SearchBot, Claude-SearchBot, PerplexityBot)?
3. Trang 404 tiếng Việt có điều hướng (`src/app/[lang]/not-found.tsx`) chưa từng được hiển thị — mọi URL lạ trả 404 đúng mã nhưng dùng trang mặc định của Next. Lỗi có sẵn, đã tách thành tác vụ riêng vì cần đọc tài liệu Next 16 (bị hook chặn trong phiên này).
4. Thư mục bằng chứng `enhance-ux-ax-261005-1130-ux-seo-optimization/` nặng hơn 60 MB ảnh chụp; nên giữ ngoài git (chỉ commit file báo cáo `.md`) hay thêm vào `.gitignore`?
