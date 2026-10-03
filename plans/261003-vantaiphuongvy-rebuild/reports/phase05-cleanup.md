# Phase 05 audit / admin isolation report

## Decision

Giữ `/admin` tạm thời vì hệ thống nội bộ vẫn có thể cần CMS. Tuy nhiên admin được cô lập khỏi public SEO và không còn hiển thị branding Hamburg trong shell/login/settings fallback.

## Đã thực hiện

- Thêm metadata `noindex, nofollow` cho admin root và dashboard layout.
- Rebrand login thành `Quản trị Vận tải Phương Vy`.
- Rebrand dashboard shell cơ bản.
- Loại khỏi menu admin các module không phù hợp public Phương Vy:
  - Sản phẩm
  - Giải pháp
  - Dự án
  - Banners
  - Vận chuyển legacy CMS
- Giữ các module nội bộ có thể dùng lại:
  - Blog
  - Media
  - Trang CMS
  - FAQ
  - Menu/Nav
  - Liên hệ
  - Nhân viên
  - Cài đặt
- Cập nhật fallback settings sang thông tin Phương Vy đã kiểm chứng.
- Đổi nội dung consent analytics còn sót từ Hamburg sang Phương Vy.

## Chưa xóa

Các module/component Hamburg chết vẫn được giữ nguyên trong batch này để tránh xóa nhầm dependency động hoặc ảnh hưởng route admin hiện hữu. Chúng không được import bởi public routes. Việc xóa vật lý sẽ thực hiện sau khi có regression tests và một lần import-graph đầy đủ.

## Verification

- `npm run typecheck`: PASS
- `npm run lint`: PASS
- `npm run build`: PASS
- Hamburg project chỉ được kiểm tra read-only; không có thao tác ghi vào project đó.

## Rủi ro còn lại

- Một số admin page cũ vẫn tồn tại dưới URL trực tiếp nhưng đã bị `noindex` và robots chặn.
- Supabase admin schema hiện hữu chưa được thay thế bằng Supabase project riêng của Phương Vy; không triển khai lead capture cho tới khi có project/env chính thức.
