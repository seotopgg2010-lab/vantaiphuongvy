import 'server-only';
import type { LeadInput } from './lead-validation';
import { createAdminClient } from './supabase/admin';

/**
 * Pluggable lead delivery. Configure at least one channel in the environment:
 *   NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY → row in contact_leads (supabase/migrations/001_contact_leads.sql)
 *   TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID  → message to a Telegram chat/group
 *   LEAD_WEBHOOK_URL                       → JSON POST (Zapier, Make, n8n, Google Apps Script, CRM…)
 * Returns true when at least one channel accepted the lead.
 */
const supabaseConfigured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export function isLeadDeliveryConfigured() {
  return supabaseConfigured() || Boolean((process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) || process.env.LEAD_WEBHOOK_URL);
}

/** Server-side insert with the service-role key; the table has row-level security and no public policies. */
async function store(lead: LeadInput) {
  const { error } = await createAdminClient()
    .from('contact_leads')
    .insert({
      name: lead.name,
      phone: lead.phone,
      service: lead.service || null,
      route_from: lead.from || null,
      route_to: lead.to || null,
      cargo: lead.cargo || null,
      note: lead.note || null,
      source_path: lead.page || null,
    })
    .abortSignal(AbortSignal.timeout(8000));
  if (error) throw new Error(`contact_leads insert: ${error.message}`);
  return true;
}

function formatLead(lead: LeadInput) {
  const time = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  return [
    '🚚 YÊU CẦU BÁO GIÁ MỚI — vantaiphuongvy.com',
    `Họ tên: ${lead.name}`,
    `SĐT: ${lead.phone}`,
    lead.service && `Dịch vụ: ${lead.service}`,
    (lead.from || lead.to) && `Tuyến: ${lead.from || '?'} → ${lead.to || '?'}`,
    lead.cargo && `Hàng hóa: ${lead.cargo}`,
    lead.note && `Ghi chú: ${lead.note}`,
    lead.page && `Trang gửi: ${lead.page}`,
    `Thời gian: ${time}`,
  ].filter(Boolean).join('\n');
}

async function post(url: string, body: unknown) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
    cache: 'no-store',
  });
  return response.ok;
}

export async function deliverLead(lead: LeadInput): Promise<boolean> {
  const tasks: Array<Promise<boolean>> = [];
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, LEAD_WEBHOOK_URL } = process.env;

  if (supabaseConfigured()) tasks.push(store(lead));
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    tasks.push(post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { chat_id: TELEGRAM_CHAT_ID, text: formatLead(lead), disable_web_page_preview: true }));
  }
  if (LEAD_WEBHOOK_URL) {
    tasks.push(post(LEAD_WEBHOOK_URL, { ...lead, source: 'vantaiphuongvy.com', createdAt: new Date().toISOString() }));
  }
  if (!tasks.length) return false;

  const results = await Promise.allSettled(tasks);
  results.forEach((result) => { if (result.status === 'rejected') console.error('[lead] delivery failed:', result.reason); });
  return results.some((result) => result.status === 'fulfilled' && result.value);
}
