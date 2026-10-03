---
phase: 1
name: "Kiểm toán import & quét trace Hamburg còn sót"
status: pending
effort: 0.5d
depends: []
---

# Phase 01 — Kiểm toán import & quét trace Hamburg còn sót

## Mục tiêu

Chứng minh bằng grep/tree rằng **không có runtime public nào** còn phụ thuộc vào nội dung/component Hamburg, và lập danh sách đầy đủ các file chết để Phase 05 dọn.

## Context

- Public routes còn lại: `/`, `/blog`, `/tim-kiem`, `/[...legacy]`, `robots.txt`, `sitemap.xml` (+ `/admin` nội bộ).
- Các file vẫn tồn tại trong repo nhưng **không được public import**: `src/components/sections/*`, `src/components/products/*`, `src/components/brief/*`, `src/components/shipping/*`, `src/content/brief-demo.ts`, `brief-faqs.ts`, `category-guides.ts`, `products.json`, `reference-layout.ts`, `shipping-guides.ts`, `src/lib/data.ts`, `src/lib/queries.ts`.
- `grep -RInE "hamburg|Hamburg" src` vẫn trả ~19 file — hầu hết là module chết + admin + `Analytics.tsx` (cookie key `hamburg-analytics-consent`).

## Các bước thực hiện

1. **Dependency trace từ entry points public**:
   ```bash
   # Liệt kê toàn bộ import graph của các route public
   grep -RIn "^import\|from '" src/app/\[lang\]/page.tsx \
     src/app/\[lang\]/layout.tsx src/app/\[lang\]/blog/page.tsx \
     src/app/\[lang\]/tim-kiem/page.tsx src/app/\[lang\]/\[...legacy\]/page.tsx \
     src/app/\[lang\]/not-found.tsx src/app/sitemap.ts src/app/robots.ts src/proxy.ts
   ```
   Với mỗi import → truy ngược 1 level để chắc chắn không có import lồng nào tới `content/brief-*`, `components/sections|products|brief|shipping`, `lib/data.ts`, `lib/queries.ts`, `lib/supabase*`.

2. **Quét trace Hamburg trong public path**:
   ```bash
   grep -RInEi "hamburg|connect|in ấn|bảng hiệu|nail|cưới hỏi|Mỹ|Canada|EU|printing|signage|wedding" \
     src/app/\[lang\] src/components/layout src/lib/constants.ts src/lib/seo.ts src/proxy.ts \
     --include="*.ts" --include="*.tsx" | grep -v admin
   ```
   Kết quả phải rỗng (trừ comment kỹ thuật đánh dấu "không còn").

3. **`Analytics.tsx` cookie key**: đổi `CONSENT_STORAGE_KEY = 'hamburg-analytics-consent'` → `'phuongvy-analytics-consent'` trong `src/components/shared/Analytics.tsx`. Kiểm tra file còn lại chỉ có comment/const tên Hamburg.

4. **Kiểm tra `src/lib/site.ts`, `src/proxy.ts`, `src/app/[lang]/dictionaries.ts`**: xác nhận không còn `en` được sinh ra URL public.

5. **Build route inventory**: lưu `find src/app -name "page.tsx"` ra `reports/public-routes.txt`; đối chiếu whitelist:
   - Public: `/`, `/blog`, `/tim-kiem`, `/[...legacy]`, `robots`, `sitemap`
   - Internal: `/admin/**`, `/admin/login`
   - Không được có route nào khác ở `[lang]/` top-level.

6. **Ghi report** `reports/phase01-audit.md`: bảng `file | type (dead/alive) | referenced-by | action-phase5`.

## Success criteria

- [ ] Không có import public nào tới Hamburg content/components (grep bằng chứng trong report).
- [ ] `Analytics.tsx` cookie key đổi sang `phuongvy-analytics-consent`; `npm run typecheck` xanh.
- [ ] `reports/public-routes.txt` + `reports/phase01-audit.md` tồn tại.
- [ ] `git -C D:/CodeVipPro/hamburg diff --stat` trống (không có thay đổi mới từ batch này).

## Risk

- Trace thiếu → sót dependency runtime. Giảm thiểu: chạy `npm run build` sau audit, route nào fail sẽ lộ ngay.
