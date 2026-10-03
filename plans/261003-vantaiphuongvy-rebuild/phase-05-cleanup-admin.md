---
phase: 5
name: "Dọn module chết + admin decision"
status: pending
effort: 1.5d
depends: [1, 4]
blocked: [open-question-2]
---

# Phase 05 — Dọn module chết & quyết định admin

## Mục tiêu

Xóa hoặc cô lập dứt điểm mọi code/content Hamburg còn sót trong repo để codebase chỉ còn Phương Vy; quyết định số phận `/admin`.

## Context — danh sách chết đã xác định (từ Phase 01 audit)

Không có import nào từ public route tới các nhóm sau (xác nhận lại trước khi xóa):

- `src/components/sections/` — HeroSection, HomeBriefSections, WhatWeDoSection, WhyChooseSection, ShippingSection, shipping-brief-details, ContactFormSection, v.v.
- `src/components/products/` — ProductDetailView, ProductCard…
- `src/components/brief/` — reference-contact-banner…
- `src/components/shipping/` — ShippingLandingSections…
- `src/content/` — `brief-demo.ts`, `brief-faqs.ts`, `category-guides.ts`, `products.json`, `reference-layout.ts`, `shipping-guides.ts` (giữ `brief-navigation.ts` vì Header/MobileMenu đang dùng).
- `src/lib/data.ts`, `src/lib/queries.ts` — Hamburg seed/query layer.
- `src/components/shared/ContactLeadConversion.tsx`, `ProductCard.tsx` nếu không còn ref.

**Tuyệt đối giữ**: `src/legacy-content/*`, `src/content/brief-navigation.ts` (đang dùng), mọi file được import bởi route public.

## Các bước thực hiện

1. **Re-verify dead list** — với từng file trong danh sách: `grep -Rn "<basename>" src --include="*.ts*" -l` → chỉ xóa khi không có import nào ngoài chính nó và các file cũng nằm trong dead list.

2. **Xóa theo cụm** (mỗi cụm = 1 lần chạy typecheck):
   - Cụm A: `src/components/sections/`, `src/components/products/`, `src/components/shipping/`, `src/components/brief/`.
   - Cụm B: `src/content/` trừ `brief-navigation.ts`; `src/lib/data.ts`, `src/lib/queries.ts`.
   - Cụm C: shared components chết (`ContactLeadConversion`, `ProductCard` nếu chết), `src/components/layout/MegaMenu.tsx` đã xóa — kiểm tra còn file mồ côi nào.

3. **Sau mỗi cụm**: `npm run typecheck && npm run lint`. Nếu fail → revert cụm đó, ghi vào report, chuyển sang cô lập (đổi tên `_disabled/` hoặc giữ nhưng đảm bảo không import vào public).

4. **Admin decision** — 2 nhánh theo trả lời user:
   - **Nhánh XÓA** (khuyến nghị nếu Phương Vy không cần CMS): xóa `src/app/[lang]/admin/`; xóa `src/lib/supabase*` server helpers chỉ admin dùng nếu Phase 04 không cần; bỏ `/admin` khỏi robots disallow (giữ disallow vô hại nếu không có route).
   - **Nhánh GIỮ**: rebrand admin (login page text/logo Phương Vy, đổi `hotline_germany` fields → fields Phương Vy, xóa modules `products`, `projects`, `solutions`, `shipping`, `categories`, `banners` liên quan Hamburg — hoặc ẩn menu), giữ `/admin` noindex + robots disallow, document tài khoản tạo thủ công.

5. **Dictionary cleanup** — `src/app/[lang]/dictionaries/vi.json` đã rút gọn; sau khi xóa components, giảm `Dictionary` type khỏi `Record<string, any>` nếu không còn legacy component nào typecheck cần nó (ưu tiên thu hẹp type nếu khả thi, không bắt buộc).

6. **`en.json`**: xóa file `src/app/[lang]/dictionaries/en.json` và mọi tham chiếu (dictionaries.ts chỉ `vi` đã xong; grep `en.json` để chắc).

7. **Báo cáo** `reports/phase05-cleanup.md`: bảng file xóa/cô lập/giữ + lý do + trạng thái typecheck sau mỗi cụm.

## Success criteria

- [ ] `grep -RInEi "hamburg" src` chỉ còn kết quả trong comment giải thích hoặc không còn.
- [ ] `npm run typecheck && npm run lint && npm run build` xanh sau khi xóa.
- [ ] Không file nào trong `src/legacy-content/` bị đụng.
- [ ] Admin: hoặc đã xóa hoàn toàn, hoặc rebrand + noindex, quyết định ghi trong report.
- [ ] Hamburg `diff --stat` trống.

## Risk

- Xóa nhầm file còn ref gián tiếp (dynamic import, string path) → build fail; rollback per cụm.
- Giữ admin mà không rebrand → user vô tình vào `/admin` thấy branding Hamburg → giảm thiểu bằng login page rebrand tối thiểu + noindex ngay cả khi chọn giữ.
