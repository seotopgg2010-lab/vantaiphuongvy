import 'server-only';
import type { LeadInput } from './lead-validation';

/**
 * Pluggable lead delivery. Configure at least one channel in the environment:
 *   TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID  → message to a Telegram chat/group
 *   LEAD_WEBHOOK_URL                       → JSON POST (Zapier, Make, n8n, Google Apps Script, CRM…)
 * Returns true when at least one channel accepted the lead.
 */
export function isLeadDeliveryConfigured() {
  return Boolean((process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) || process.env.LEAD_WEBHOOK_URL);
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
