---
phase: 4
name: "Form liên hệ & lead capture (Supabase riêng)"
status: in-progress
effort: 1d
depends: [3]
blocked: [open-question-2]
---

# Phase 04 — Contact form & lead capture

## Trạng thái (2026-10-06)

Chủ site chọn kênh nhận yêu cầu là Supabase kèm Telegram.

Đã xong:
- Form báo giá `LeadForm` gọi server action `src/actions/lead.ts`, có kiểm tra dữ liệu, honeypot và giới hạn số lần gửi.
- `src/lib/lead-delivery.ts` lưu mỗi yêu cầu vào `contact_leads` bằng service-role key và gửi tin Telegram. Yêu cầu được nhận khi ít nhất một kênh nhận thành công.
- Schema: `supabase/migrations/001_contact_leads.sql`. Bảng bật RLS, không có policy công khai và đã thu hồi quyền của `anon`/`authenticated`.
- Danh sách biến môi trường: `.env.local.example`.

Chủ site cần làm:
1. Chạy file SQL trên trong Supabase SQL Editor của project Phương Vy.
2. Thêm `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` vào Vercel (Production), rồi redeploy.
3. Gửi thử một yêu cầu, kiểm tra có một dòng mới trong `contact_leads` và một tin trên Telegram.

Bản ghi bên dưới là kế hoạch gốc.

## Mục tiêu

`/lien-he` có form báo giá thật lưu vào Supabase **project riêng của Phương Vy**, có honeypot + rate limit cơ bản; không dùng lại bảng/contact pipeline của Hamburg.

## Context

- `src/components/forms/ContactForm.tsx` hiện là stub chỉ hiển thị hotline/Zalo vì action `/lien-he/actions` đã bị xóa cùng route Hamburg.
- Production có form CF7 với fields: Họ tên, Email, SĐT, nội dung (và trên `/thue-xe-tai` form báo giá tương tự).
- Supabase client đã có trong `src/lib/supabase*` (kiểm tra tên chính xác) — cần env `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` của project **mới**, không reuse env Hamburg.

## Các bước thực hiện

1. **Schema** — `supabase/migrations/001_contact_leads.sql` (migrations mới của Phương Vy, không kế thừa file Hamburg):
   ```sql
   create table contact_leads (
     id uuid primary key default gen_random_uuid(),
     created_at timestamptz not null default now(),
     name text not null,
     phone text not null,
     email text,
     service text,            -- 'van-chuyen' | 'thue-xe' | 'khac'
     route_from text, route_to text,
     message text,
     source_path text,        -- trang submit
     status text not null default 'new'
   );
   alter table contact_leads enable row level security;
   -- chỉ service role ghi; không policy public select
   ```

2. **Server action** — `src/app/[lang]/lien-he/actions.ts` (tạo lại route `/lien-he` nếu quyết định form nằm ở trang riêng, hoặc embed trong `[...legacy]` khi `path === '/lien-he'` — ưu tiên option 2 để giữ URL legacy `/lien-he/` từ JSON không phải route file riêng):
   - Validate server-side: `name` 2-100 ký tự, `phone` regex VN `^0\d{9,10}$`, `email` optional RFC-lite, `message` ≤2000.
   - Honeypot field `website` (hidden, phải rỗng) + timestamp check ≥2s.
   - Rate limit: 3 submit/IP/giờ — dùng `headers().get('x-forwarded-for')` + bảng `lead_rate_limits` hoặc in-memory LRU đơn giản cho MVP.
   - Insert qua service role client; trả `{ ok: true }` — không leak error DB ra client.

3. **Form UI** — `src/components/forms/ContactForm.tsx`: fields Họ tên*, SĐT*, Email, Dịch vụ (select: Vận chuyển hàng / Thuê xe tải / Khác), Tuyến (từ → đến), Nội dung; submit → server action → trạng thái success "Đã nhận yêu cầu, Phương Vy sẽ liên hệ trong giờ làm việc 8h00–21h00" + fallback hotline.

4. **Mount**: trong `[...legacy]/page.tsx` khi `item.path === '/lien-he'` render `<ContactForm/>` phía trên/dưới rich content; hoặc trong trang `/thue-xe-tai` mount form báo giá tương tự với `service` preset.

5. **Env**: `.env.local` keys mới `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — document trong `.env.example`, KHÔNG commit giá trị thật.

6. **Thông báo (tùy chọn)**: webhook gửi email/Zalo khi có lead mới — nếu quá phức tạp thì defer, chỉ cần admin đọc được.

## Success criteria

- [ ] Submit form trên `/lien-he/` lưu được record vào `contact_leads` (kiểm tra bằng Supabase dashboard/SQL).
- [ ] Submit rỗng/sai SĐT → lỗi validation tiếng Việt; honeypot điền → bỏ qua âm thầm.
- [ ] Không dùng chung bảng/key với Hamburg (env riêng được document).
- [ ] `npm run build` xanh; form accessible (label, aria-invalid, focus vào lỗi đầu tiên).

## Risk

- Không có Supabase project riêng sẵn → phase bị block; cần user tạo project + cấp env trước khi cook.
- Spam: nếu chưa có rate-limit backend, thêm Turnstile/hCaptcha sau — ghi vào follow-up.
