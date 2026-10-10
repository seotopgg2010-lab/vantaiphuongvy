/** Pure validation for the public quote-request (lead) form. Shared by the server action and tests. */

export const LEAD_SERVICES = ['Gửi hàng / chành xe', 'Thuê xe tải nguyên chuyến', 'Vận chuyển máy móc, hàng nặng', 'Khác'] as const;

export type LeadInput = {
  name: string;
  phone: string;
  service: string;
  from: string;
  to: string;
  cargo: string;
  note: string;
  page: string;
};

export type LeadField = keyof LeadInput;
export type LeadValidation = { ok: true; data: LeadInput } | { ok: false; errors: Partial<Record<LeadField, string>> };

/** Field lengths; supabase/migrations/001_contact_leads.sql enforces the same limits. */
export const LEAD_LIMITS: Record<LeadField, number> = { name: 80, phone: 20, service: 60, from: 120, to: 120, cargo: 200, note: 1000, page: 200 };

const clean = (value: unknown, max: number) =>
  String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

/** Vietnamese mobile (03/05/07/08/09) or landline (02x) number, with optional +84/84 prefix. */
export function normalizeVietnamesePhone(raw: string): string | null {
  const compact = raw.replace(/[\s.\-()]/g, '');
  const match = compact.match(/^(?:\+?84|0)((?:3|5|7|8|9)\d{8}|2\d{9})$/);
  return match ? `0${match[1]}` : null;
}

export function validateLead(input: Record<string, unknown>): LeadValidation {
  const data = Object.fromEntries((Object.keys(LEAD_LIMITS) as LeadField[]).map((key) => [key, clean(input[key], LEAD_LIMITS[key])])) as LeadInput;
  const errors: Partial<Record<LeadField, string>> = {};

  if (data.name.length < 2) errors.name = 'Vui lòng nhập họ tên (ít nhất 2 ký tự).';
  const phone = normalizeVietnamesePhone(data.phone);
  if (!phone) errors.phone = 'Số điện thoại chưa đúng (ví dụ 0902 939 318).';
  else data.phone = phone;
  if (data.service && !(LEAD_SERVICES as readonly string[]).includes(data.service)) errors.service = 'Dịch vụ không hợp lệ.';
  if (data.page && !data.page.startsWith('/')) data.page = '';

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

/** Bot heuristics: hidden honeypot filled, or the form was submitted implausibly fast. */
export function looksLikeBot(honeypot: unknown, startedAt: unknown, now = Date.now()): boolean {
  if (String(honeypot ?? '').trim()) return true;
  const started = Number(startedAt);
  if (!Number.isFinite(started) || started <= 0) return true;
  const elapsed = now - started;
  return elapsed < 2500 || elapsed > 1000 * 60 * 60 * 12;
}
