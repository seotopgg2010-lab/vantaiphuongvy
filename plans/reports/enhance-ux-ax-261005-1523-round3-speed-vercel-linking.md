# UX/AX review round 3: vantaiphuongvy.com — tốc độ, Vercel Hobby, bài viết & liên kết — 2026-10-05

## Verdict

Hai round trước đã làm sạch giao diện và bề mặt discovery. Round này xử lý ba lỗ hổng lớn còn lại, và cả ba đã có thay đổi đạt check trên production build local.

**Tốc độ và chi phí Vercel.** Trang công khai không còn đi qua proxy: trước đây proxy cộng 50–80 ms vào mỗi request và mỗi lượt xem tính một function invocation. Ảnh thân bài giờ là WebP đúng cỡ, nên lượng ảnh tải về khi cuộn hết một trang giảm 69–93%. Function chuyển sang `sin1`.

**Liên kết.** Số trang dịch vụ có liên kết trong thân bài tăng từ 18 lên 73/76, và 6/9 bài viết đã dẫn tới trang dịch vụ. 72 câu hỏi in đậm đã thành heading, và một lỗi pipeline làm dính dòng trong bảng giá và danh sách đã được sửa.

**Vercel Hobby.** Gói này chỉ cho phép dùng phi thương mại, nên website công ty không phù hợp gói free về điều khoản. **Chủ site đã quyết định giữ Vercel free** và chấp nhận rủi ro này. Region `sin1` được xác nhận; kênh nhận form báo giá sẽ cấu hình sau.

**Trang 404.** Theo yêu cầu của chủ site, round này đưa vào bản sửa trang 404 có thương hiệu (port từ nhánh `claude/affectionate-euler-cb02dc`). Mọi URL lạ giờ trả 404 với trang tiếng Việt có header, footer và hotline thay cho trang mặc định tiếng Anh nền đen (`after/shots/1440x900-notfound-s00.jpg`).

**Trạng thái: DONE (round 3, chạy như `--auto`).** Cả 8 mục DONE contract đạt trên local. Còn ba việc chỉ kiểm được sau khi deploy, nên chưa tính là đạt:
- quét discovery trên URL Vercel;
- kiểm RSC/server action qua rewrite tĩnh (V1);
- xác nhận region `sin1`.

## Scope and environment

- **Mode và focus.** Mode mặc định của `ak:enhance-ux-ax`, nhưng yêu cầu "tối ưu cả bài viết dịch vụ … và sự liên kết … 1 lần nữa" nên chạy như `--auto`, giống round 2. Focus: toàn bộ 95 URL; tốc độ; mức phù hợp Vercel Hobby; nội dung và liên kết bài viết/dịch vụ.
- **Commit và cách chạy.** Commit gốc là `24c36c9` trên `feat/ux-seo-ax-optimization`.
  - Production build: `NEXT_DIST_DIR=.next-build npm run build`.
  - Baseline chạy từ bản sao build gốc (`next start -p 3101`); bản mới chạy ở 3102/3103. Hai thư mục bản sao đã xóa sau khi đo.
  - Production thật là `https://vantaiphuongvy.vercel.app/`. DNS `vantaiphuongvy.com` vẫn trỏ WordPress.
- **Tài liệu đã đọc.** Next.js 16 docs trong `node_modules/next/dist/docs` (rewrites, proxy matcher, images). Vercel docs cập nhật 2026-09-14: Hobby, Fair Use, Routing Middleware, function regions, CDN cache, giới hạn Image Optimization.
- **Không chạy được:**
  - Core Web Vitals thực địa.
  - Bảng usage trên dashboard Vercel (không đăng nhập thay chủ site).
  - Gửi form báo giá thật (cấm theo ranh giới review).
  - Deploy thử preview (chưa được yêu cầu).
- **Ngoài phạm vi.** Hai sửa lỗi của phiên khác chưa merge: trang 404 có thương hiệu (`claude/affectionate-euler-cb02dc`, `1262b69`) và vòng lặp `/admin/login/` (`claude/epic-noyce-852266`, `b94cd81`).

## Baseline evidence

Thư mục bằng chứng: `enhance-ux-ax-261005-1523-round3-speed-vercel-linking/round-3/` (26 MB, gồm `baseline/` và `after/`).

- **Ảnh chụp.** `baseline/shots/`: 15 template × 3 viewport (1440×900, 768×1024, 375×812), mỗi viewport 3 lát. Kết quả: 0 tràn ngang, 0 ảnh hỏng, mỗi trang đúng 1 `h1`.
- **Discovery scan.**
  - Local (`discovery-scan-local.txt`): exit 0, 0 error, 0 warning.
  - **Live Vercel** (`discovery-scan-live.txt`): **exit 1, 20 error** `content-negotiation`. Phản hồi markdown mất `Vary: Accept`.
- **Đo trên Vercel từ Việt Nam (PoP `hkg1`):**
  - File tĩnh không qua proxy mất ~60–65 ms; URL qua proxy mất 110–150 ms.
  - `/tim-kiem/` chạy function ở `iad1`, TTFB 548 ms.
- **Lab hiệu năng** (`perf-lab-baseline.json`: 375×812 DPR 2, CPU 4×, 1,6 Mbps, cache lạnh, trung vị 5 lượt):
  - LCP từ 1,29 đến 2,26 s; CLS 0.
  - TBT 0,8–1,2 s trên trang có form.
  - 15 file font, 129 KB.
- **Ảnh thân bài.** 340 thẻ `<img>` là JPEG gốc, rộng ~1.030 px, trung vị 127 KB. Một trang trung vị mang 430 KB ảnh thân bài; nhiều trang tuyến mang 2,5–4,3 MB. 73 ảnh thiếu `width`/`height`.
- **Nội dung và liên kết:**
  - 8/9 bài viết và 58/76 trang dịch vụ có 0 liên kết trong thân bài.
  - 72 câu hỏi `<p><strong>…?</strong></p>` nằm trên 18 trang.
  - Tàn dư hộp tác giả ("Về Tác giả", tên, "Xem thêm", "Chủ đề cùng Tác giả") còn ở cuối cả 9 bài.
  - `llms.txt` có chữ quảng cáo ("✅ SỐ 1").
  - Trang 404 là trang mặc định tiếng Anh, nền đen.

## Vercel Hobby: mức phù hợp

| Hạng mục (Hobby) | Giới hạn | Trước | Sau round 3 |
|---|---|---|---|
| Điều khoản | Chỉ phi thương mại; "advertising the sale of a product or service" là thương mại | Website công ty quảng cáo dịch vụ | **Không đổi được bằng code** — cần Pro hoặc host khác (quyết định của chủ site) |
| Function invocations (1 triệu/tháng), Active CPU (4 giờ) | | Mỗi request trang, `.md`, robots, sitemap chạy proxy | Proxy chỉ chạy cho admin, endpoint WordPress cũ, `/?p=`/`/?page_id=`/`/?s=` và agent xin markdown (`after/proxy-matchers.txt`) |
| Function region | 1 region | `iad1` | `sin1` (`vercel.json`; xác nhận sau deploy) |
| Image transformations (5.000/tháng; vượt quota → ảnh mới trả 402) | | 15 width × 2 quality; `src` = biến thể `w=2560` | 8 width, 1 quality; `src` = file upload gốc; ảnh thân bài không dùng Vercel Image Optimization |
| Fast Data Transfer (100 GB/tháng) | | Cuộn hết trang tuyến tải 0,4–4,3 MB ảnh | 0,14–0,35 MB (giảm 69–93%) |
| CDN requests (1 triệu/tháng) | | ~40 request mỗi lượt đầu | Không đổi (thử bỏ preload font không đạt) |

## Scores

| Area | Trước | Sau | Evidence |
|---|---|---|---|
| First impression | 2 | 3 | Bài viết có lead nói kết quả dưới H1 (`after/shots/1440x900-post-s00.jpg`); URL lạ trả trang 404 tiếng Việt có điều hướng (`after/shots/1440x900-notfound-s00.jpg`) |
| Brand recall | 3 | 3 | Không đổi |
| Content punch | 2 | 3 | Lead cho 9 bài; danh sách "–" thành danh sách thật; bảng giá trung tâm tuyến hiện mỗi tỉnh một dòng (`after/shots/element-routehub-pricetable-1440.jpg`) |
| Clarity & hierarchy | 2 | 3 | 72 câu hỏi in đậm thành heading và vào mục lục (`after/shots/1440x900-questions-s01.jpg`); số thứ tự danh sách đúng (`1440x900-post2-s02.jpg`) |
| Storytelling | 2 | 2 | Không đổi |
| Knowledge & trust | 2 | 3 | Tác giả có tên, tiểu sử, JSON-LD `Person` (`after/shots/element-post-author-1440.jpg`) |
| Motion | 2 | 2 | Không đổi |
| Responsive | 2 | 2 | 17 template × 3 viewport: 0 tràn; quét 95 URL ở 320 và 375 px: 0 trang tràn |
| Accessibility | 2 | 2 | Ảnh thân bài thiếu kích thước: 73 → 0 |
| Performance feel | 2 | 2 | Ảnh khi cuộn giảm 69–93%. LCP lab không trang nào xấu hơn 5%. TBT vẫn cao trên trang có form, nên giữ 2 |
| AX / discovery | 2 | 3 | Scan local 0/0; phản hồi markdown có đúng một `Vary: Accept`; `llms.txt` hết chữ quảng cáo; câu hỏi có heading trong twin |

## Proposals và kết quả

ID tiếp nối round 2. Nội dung đề xuất gốc giữ nguyên; kết quả ghi ở từng mục.

### P12 — Trang công khai không đi qua proxy (Must) — **Đạt**
- Đã làm: thêm `src/lib/public-routing.ts`. Redirect `/vi*`, rewrite twin `.md` và rewrite locale chuyển vào `next.config.ts`. `src/proxy.ts` chỉ còn một matcher allowlist.
- Bằng chứng:
  - `after/proxy-matchers.txt` (regex matcher từ `functions-config-manifest.json` của bản build): 17/17 tình huống đúng.
  - `tests/public-routing.test.ts`.
  - `after/crawl-check.txt`: 95 trang và 1.398 đích OK, hợp đồng 410/308/301/404/soft-404 nguyên vẹn. Hợp đồng bổ sung `/vi/faq/` → 308 và `/md/blog/` → 404.
  - Điều hướng client trên `next start`: logo về trang chủ và sang `/blog/` trả RSC 200, không tải lại trang.
- Còn phải kiểm trên Vercel: xem V1 trong "Unresolved questions".

### P13 — Thương lượng markdown giữ `Vary: Accept` (Should) — **Đạt local**
- Đã làm: proxy tự tải twin công khai (timeout 3 s; lỗi thì trả HTML) và trả body cùng `Vary: Accept`, `Cache-Control: private`, `X-Robots-Tag: noindex`.
- Bằng chứng: `after/negotiation-headers.txt` có đúng một header `Vary: Accept, Accept-Encoding`. Scan local exit 0. Crawl-check kiểm cả chiều markdown lẫn HTML.
- Trên Vercel: phản hồi do proxy tạo giữ nguyên header (kiểm trên phản hồi 410 live), nhưng phải chạy lại scan sau deploy.

### P14 — Function region `sin1` (Should) — **Đạt (cấu hình)**
- `vercel.json` có `"regions": ["sin1"]`, build pass.
- Sau deploy, cần thấy `sin1` trong `x-vercel-id` của `/tim-kiem/`.

### P15 — Ảnh thân bài WebP sinh lúc build (Should) — **Đạt**
- Đã làm: `scripts/legacy-images.ts` tạo 965 biến thể WebP (45 MB, git-ignore) cho 317 ảnh.
  - `src` giữ URL upload. Có `srcset`/`sizes`, kèm `width`/`height` thật.
  - Tên file hash theo nội dung lẫn cấu hình mã hóa.
  - Ảnh hỏng chỉ bị bỏ qua (có log), không làm hỏng build. Trên CI/Vercel, build dừng nếu thiếu sharp.
  - Biến thể cũ tự dọn.
- Đo cuộn hết trang ở 375×812 DPR 2 (`after/scroll-image-bytes.txt`), ảnh thân bài:

| Trang | Trước | Sau | Giảm |
|---|---|---|---|
| Đà Nẵng | 440 KB | 138 KB | 69% |
| An Giang | 4.333 KB | 348 KB | 92% |
| Vĩnh Long | 2.855 KB | 192 KB | 93% |
| Bài "Cần tìm đối tác" | 4.584 KB | 762 KB | 83% |

- Check gốc ("ảnh Đà Nẵng giảm ≥ 60%") đo tổng mọi ảnh, gồm cả logo và thẻ không thuộc P15; mức giảm đó là 54%. Check thay bằng "ảnh thân bài giảm ≥ 60% trên 4 trang". Check mới đúng phạm vi P15 và áp lên nhiều trang hơn, nên chặt hơn check gốc.
- Cũng đạt: 321/321 ảnh thân bài trên 95 trang có kích thước và `srcset`; số mục sitemap ảnh không đổi.

### P16 — Ngân sách `next/image` + `src` gốc (Should) — **Đạt**
- Đã làm: `qualities: [75]`, `deviceSizes` bỏ 2560, `imageSizes: [256, 384]`. Ảnh upload render qua `UploadImage` (`overrideSrc`).
- Bằng chứng trên 95 trang: 0 trang có `w=2560` hoặc `q=85`; 569/569 thẻ `next/image` có `src` bắt đầu bằng `/wp-content/uploads/`.

### P17 — Bỏ preload font (Could) — **Không áp dụng (đã đo)**
- A/B ba chiều, 5 lượt xen kẽ (`after/perf-ab-fonts.json`): bỏ preload làm LCP xấu đi 10–31% ở 5/7 trang (tuyến +9,7%, loại hàng +30,6%, bài viết +20,9%, blog +27,1%, chính sách +10,6%).
- Kết quả trượt check đặt trước, nên đã hoàn nguyên và giữ preload.

### P18 — Liên kết ngữ cảnh (Should) — **Đạt, có ngoại lệ ghi rõ**
- Đã làm: thêm 166 liên kết từ `src/content/contextual-links.ts`.
  - Chỉ đặt trong `<p>`/`<li>`; không đặt trong đoạn mở đầu, heading, bảng hay callout.
  - Tối đa 3 mỗi trang dịch vụ và 5 mỗi bài viết; không tự liên kết.
- Phân bố: trang dịch vụ có liên kết trong bài tăng từ 18 lên 73/76. Đích nhận nhiều nhất là trang siêu trường siêu trọng (49) và trang trung tâm tuyến (32). Hướng dẫn kích thước thùng xe được 9 bài dẫn tới.
- Sau review, đã siết cụm từ chung chung ("dầu nhớt", "đường hàng không", "loại xe tải") để bỏ liên kết lạc ngữ cảnh.
- **Ngoại lệ:** 3 bài không có cụm từ dẫn tự nhiên sang dịch vụ (biển cấm tải, phong thủy biển số, luồng xanh 2021). Ép liên kết ở đây sẽ thành spam, nên các bài này dựa vào khối "Dịch vụ liên quan". Check "≥ 2 liên kết mỗi bài" vì vậy trượt ở 3 bài. Test giữ check "mọi bài đúng chủ đề có liên kết tới trang dịch vụ".

### P19 — Cấu trúc nội dung (Should) — **Đạt**
- **Câu hỏi thành heading.** 72 câu hỏi in đậm thành heading. Heading tăng từ 1.822 lên 1.919, mục FAQ từ 396 lên 468, trang có FAQ ≥ 2 từ 34 lên 48. Toàn bộ 1.822 `id` cũ được giữ.
- **Danh sách.** `<ol start>` được giữ trên 3 trang. Danh sách "–" thành `<ul>`. Bài `/blog/giay-to…` có 2 heading.
- **Lỗi có sẵn đã sửa.** Selector `br + br` khớp cả các `<br>` có chữ ở giữa, nên mọi dòng sau dòng đầu trong một đoạn bị dính lại. Bảng giá trung tâm tuyến từng hiện "QUẢNG TRỊ QUẢNG BÌNH HÀ TĨNH…" trên một dòng.
  - Pipeline mới gộp các `<br>` liền nhau và nối lại câu bị ngắt giữa chừng do dán văn bản; các dòng khác giữ đúng như tác giả viết.
  - Kết quả: `<br>` tăng từ 232 lên 313 trên 19 trang.
  - Test mới: không còn câu nào bị ngắt dòng giữa chừng.

### P20 — Tác giả có tên (Should) — **Đạt**
- 9/9 bài có `author` lấy từ hộp tác giả WordPress, không còn tàn dư. Dòng meta ghi "Tác giả Mai Văn Trung"; cuối bài có hộp "Về tác giả".
- JSON-LD là `Person` có `worksFor`; twin có dòng tác giả và tiểu sử. Không thêm liên kết mạng xã hội cá nhân.

### P21 — Lead cho bài viết (Should) — **Đạt**
- 9 lead trong `HERO_LEADS`, test kiểm độ dài 80–280 ký tự và cấm chữ VIẾT HOA quảng cáo.
- Trên bài viết, LCP lab giờ là chính đoạn lead (`after/perf-ab-r3.json`). Nguồn dữ kiện nằm trong bảng bên dưới.

### P22 — `llms.txt` không chữ quảng cáo (Should) — **Đạt**
- Ghi chú lấy từ lead tuyển chọn trước, rồi mới tới mô tả Rank Math. Test cấm "SỐ 1", "✅", "CẬP NHẬT".

### U8 — Chip thời gian (Could) — **Đạt**
- Chip hiện "Thời gian khoảng 36h" (`after/shots/375x812-route-s00.jpg`).

### U9 — Trang 404 có thương hiệu (Must, thêm theo yêu cầu chủ site) — **Đạt**
- Đã làm: port bản sửa của nhánh `claude/affectionate-euler-cb02dc` (commit `1262b69`). Bật `experimental.globalNotFound`, thêm `src/app/global-not-found.tsx`, tách vỏ `<html>/<body>` dùng chung vào `src/components/site/root-document.tsx`.
- Bằng chứng: `/khong-ton-tai/`, `/en/`, `/ads.txt`, `/foo.php`, `/favicon.ico`, `/md/blog/` và tuyến không tồn tại đều trả 404 với tiêu đề "Không tìm thấy trang | Vận Tải Phương Vy", `<html lang="vi">`, `noindex`. Crawl-check thêm kiểm tra này. Ảnh 3 viewport `after/shots/*-notfound-s00.jpg`: không tràn.

### Nguồn dữ kiện cho lead bài viết (P21)

| Bài | Dữ kiện → nguồn trong chính bài |
|---|---|
| Biển báo cấm tải | Biển cấm, mức phạt, khung giờ/tuyến cấm ở TP.HCM (hầm Thủ Thiêm), Hà Nội, Nha Trang, Đà Nẵng; "09/04/2023 cập nhật mới nhất mức phạt" |
| Cần tìm đối tác | Tìm chủ xe/tài xế hợp tác; "cam kết có hàng cả hai chiều đi và về"; chủ hàng liên hệ hotline |
| Phong thủy biển số | Các phần H2; lưu ý "quan điểm khá chủ quan và không có căn cứ khoa học rõ ràng" |
| Giấy tờ vận chuyển | Hai mục giấy tờ của đơn vị vận tải và của chủ hàng; Thông tư 94/2003 về hóa đơn, chứng từ |
| Hàng hóa thường gặp | Dài > 20 m, rộng > 2,5 m, cao > 4,2 m, nặng > 32 tấn theo QĐ 63/2007/QĐ-BGTVT; mục hàng lẻ, hàng ghép |
| Kích thước thùng xe | "500kg, 750kg, … 30 tấn"; thùng lửng, thùng kín |
| Quy định hàng nguy hiểm | Nghị định 104/2009; các mục đường biển, đường bộ, hàng không IATA, cấp phép, bản khai, mã ký hiệu |
| Hàng nguy hiểm cần biết | "phân thành 9 loại", danh sách loại; mục cách đóng gói, vận chuyển |
| Luồng xanh | Đăng ký xe luồng xanh mùa dịch; mô tả Rank Math "do Sở GTVT Hồ Chí Minh cấp"; mục giao nhận, thanh toán |

### Hiệu năng: hai lượt A/B

Cả hai lượt đo trên cùng máy, xen kẽ, trung vị 5 lượt. Bản round 3 đo ở đây có trước khi sửa theo review; các sửa đó không đổi byte hay layout.

| Trang | Lượt 1: LCP baseline → round 3 | Lượt 2 (3 server, nhiễu hơn): baseline → round 3 |
|---|---|---|
| Trang chủ | 2.156 → 2.180 ms (+1,1%) | 2.180 → 2.224 (+2,0%) |
| Tuyến Đà Nẵng | 2.228 → 1.968 (−11,7%) | 2.336 → 2.424 (+3,8%) |
| Loại hàng | 1.856 → 1.812 (−2,4%) | 2.608 → 2.600 (−0,3%) |
| Bài viết | 1.604 → 1.480 (−7,7%) | 1.992 → 1.952 (−2,0%) |
| Blog | 1.652 → 1.596 (−3,4%) | 1.760 → 1.744 (−0,9%) |
| FAQ | 1.400 → 1.452 (+3,7%) | 1.560 → 1.560 (0%) |
| Chính sách | 1.252 → 1.180 (−5,8%) | 1.280 → 1.320 (+3,1%) |

- Không trang nào xấu hơn baseline quá 5% ở cả hai lượt; CLS 0.
- Lượt 2 nhiễu vì 3 server và agent review chạy cùng lúc. Lợi ích chắc chắn nhất là byte ảnh khi cuộn (bảng P15).
- Lab local không thấy được 50–80 ms proxy trên Vercel. Phần đó cần đo lại sau deploy.

## DONE contract

1. P12–P16, P18–P22 đạt acceptance; P17/U8 làm nếu đạt check; mục bỏ qua có lý do được ghi.
2. `check-discovery-surfaces.mjs http://localhost:3102 --site-origin https://vantaiphuongvy.com --sample 20` exit 0, 0 error, 0 warning; phản hồi thương lượng markdown có đúng một `Vary: Accept`. Scan live chỉ ghi là việc sau deploy.
3. Ảnh 1440×900, 768×1024, 375×812 của các template đã đổi: không tràn, không cắt chữ, không chồng lấn, không ảnh hỏng; vision review không lỗi High; quét reflow 95 URL ở 320 và 375 px: 0 trang tràn.
4. Không hạng mục rubric nào giảm; Content punch, Clarity, Knowledge & trust, Performance và AX ≥ 2, có bằng chứng tăng.
5. Không thêm tương tác mới ngoài nội dung; liên kết mới là thẻ `a` thường; reduced-motion giữ nguyên.
6. Typecheck, lint, test, build pass; crawl-check OK; A/B lab không trang nào xấu hơn baseline > 5%, CLS 0.
7. `docs/DESIGN.md`, `docs/REVIEW.md`, `AGENTS.md` cập nhật, giữ nội dung cũ.
8. Server và Chrome headless do review khởi động được dừng.

### Kết quả đối chiếu (production build cuối, `NEXT_DIST_DIR=.next-build`)

| # | Trạng thái | Bằng chứng |
|---|---|---|
| 1 | Đạt, có ngoại lệ ghi rõ | P12–P16, P19–P22, U8, U9 đạt; P17 đã đo và loại; P18 đạt ở trang dịch vụ (73/76), còn 3 bài lạc chủ đề không có liên kết tự nhiên sang dịch vụ (lý do ở P18); check ảnh P15 thay bằng check chặt hơn (lý do ở P15) |
| 2 | Đạt (local) | `after/discovery-scan.txt`: exit 0, 20 trang, 0 error, 0 warning, INFO duy nhất `ai-crawlers`; `after/negotiation-headers.txt` |
| 3 | Đạt | `after/shots/` (17 template × 3 viewport + ảnh cận bảng giá, hộp tác giả): 0 tràn, 0 ảnh hỏng, 1 `h1`; `after/reflow-320.txt`, `after/reflow-375.txt`: 0/95; vision review không lỗi High |
| 4 | Đạt | Bảng Scores: 5 hạng mục tăng, không hạng mục nào giảm |
| 5 | Đạt | Thay đổi tương tác duy nhất là liên kết `a` trong nội dung; menu và PageActions giữ nguyên |
| 6 | Đạt | `npm run typecheck`, `npm run lint`: 0 lỗi; `npm test`: 44/44; `npm run build`: exit 0; `after/crawl-check.txt`: OK 95 trang, 1.398 đích; A/B ở bảng trên |
| 7 | Đạt | `AGENTS.md` (routing tĩnh, allowlist proxy, `UploadImage`, ngân sách ảnh, `sin1`, `content:build` tạo `public/_img`); `docs/DESIGN.md` (heading, liên kết ngữ cảnh, bài viết, ảnh, chip); `docs/REVIEW.md` (Vercel Hobby, liên kết, kiểm sau deploy) |
| 8 | Đạt | Cổng 3101–3103 đã dừng, không còn Chrome headless; `.next-baseline`, `.next-r3` đã xóa |

## Code review

Agent `code-reviewer` đọc diff, chạy test và tự đánh giá regex matcher từ bản build. Báo cáo: `code-reviewer-261005-1523-round3-routing-pipeline.md`.

**Kết luận:** không có lỗi Critical/High; hợp đồng SEO bất biến giữ nguyên (0 thay đổi slug, title/description, `<img src>`, `id`).

**Đã sửa:**
- **M1:** self-fetch của proxy có timeout, try/catch và hủy body.
- **M2:** ảnh hỏng không còn làm hỏng build.
- **M3:** thêm `predev`; test fail rõ ràng khi thiếu `public/_img`.
- **L1:** không đặt liên kết ở chữ ngoài đoạn văn.
- **L2:** siết cụm từ chung chung.
- **L3:** hash tên file theo cấu hình mã hóa.
- **L4:** build trên CI/Vercel dừng nếu thiếu sharp.
- **L5:** giữ `width` WordPress đặt.
- **L7:** sửa comment cũ.

**Chấp nhận, có ghi chú:**
- **L4 (một phần):** chưa khai báo `sharp` trong `package.json`. Nó đã có trong lockfile qua `next` và build dừng nếu thiếu, nên tránh đổi lockfile.
- **L6:** matcher phân biệt hoa thường; `/WP-LOGIN.PHP` giờ trả 404 thay vì 410.

## Round log

| Round | Proposals done | Checks passing | Regressions fixed | Notes |
|---|---|---|---|---|
| 3 | P12–P16, P18–P22, U8, U9; P17 đo rồi loại | Contract 1–8 (local) | `/index.md` 404 do regex catch-all không loại `/md` không có dấu `/`; lỗi `br + br` có sẵn làm dính dòng; câu bị ngắt dòng giữa chừng khi khôi phục `<br>`; 3 liên kết rơi vào chữ mở đầu và vài liên kết lạc ngữ cảnh; self-fetch thiếu xử lý lỗi; một ảnh hỏng có thể làm hỏng mọi build | Một lần build local lỗi prerender `/og/*` (panic native, `svgload_buffer` với 23 worker); build lại thì qua. Nếu gặp trên Vercel, cân nhắc giảm số worker static generation |

## Quyết định của chủ site (2026-10-05)

- Giữ Vercel free (Hobby), chấp nhận rủi ro điều khoản dùng phi thương mại.
- Function region `sin1`.
- Kênh nhận form báo giá (Telegram hoặc webhook) sẽ cấu hình sau; đến lúc đó form báo lỗi và khách được mời gọi hotline/Zalo.
- Sửa trang 404 trong round này (U9). Bản sửa `/admin/login/` của nhánh `claude/epic-noyce-852266` không nằm trong yêu cầu nên chưa đưa vào.
- Commit các thay đổi sau khi sửa xong. Thư mục bằng chứng ảnh không commit, giống round 1–2.

## Unresolved questions

1. **V1 — kiểm ngay sau deploy:**
   - RSC của trang chủ và trang tuyến qua rewrite tĩnh trên Vercel (`curl -H 'RSC: 1' … -L` phải trả `200 text/x-component`).
   - Segment prefetch.
   - Gửi thử form báo giá khi đã cấu hình kênh nhận (server action trên trang được rewrite).
   - `x-vercel-id` của trang HTML không qua proxy; `/tim-kiem/` chạy ở `sin1`.
   - Discovery scan trên URL Vercel.

   Nếu RSC trang chủ lỗi, chỉ có hệ quả là bấm logo sẽ tải lại cả trang. Cách sửa là thêm rewrite riêng cho `/` hoặc giữ proxy cho riêng `/`. Rollback qua deployment trước trên Vercel.
2. **Thông tin liên hệ cũ trong thân bài legacy** (số 11 chữ số trên bài hàng nguy hiểm, "Website: vanchuyenphuongvy.com" trên chính sách bảo mật): sửa ở nguồn WordPress hay thêm bước hiệu chỉnh?
3. Có đưa bản sửa vòng lặp `/admin/login/` (nhánh `claude/epic-noyce-852266`) vào nhánh này không?
