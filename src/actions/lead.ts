'use server';

import { headers } from 'next/headers';
import { deliverLead } from '@/lib/lead-delivery';
import { looksLikeBot, validateLead, type LeadField } from '@/lib/lead-validation';
import { getTrustedClientIp } from '@/lib/request-ip';

export type LeadFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: Partial<Record<LeadField, string>>;
  values?: Record<string, string>;
};

// Best-effort in-memory throttle (per server instance). Pair with an edge/WAF limit in production.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function throttled(key: string, now = Date.now()) {
  const recent = (hits.get(key) || []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [entry, times] of hits) if (!times.some((time) => now - time < WINDOW_MS)) hits.delete(entry);
  return recent.length > MAX_PER_WINDOW;
}

export async function submitLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const raw = Object.fromEntries(formData.entries());
  const values = Object.fromEntries(Object.entries(raw).filter(([key]) => !['website', 'startedAt'].includes(key)).map(([key, value]) => [key, String(value)]));

  // Silently accept bots so they get no signal to adapt.
  if (looksLikeBot(raw.website, raw.startedAt)) return { status: 'success', message: 'Cảm ơn quý khách! Phương Vy sẽ gọi lại sớm.' };

  const result = validateLead(raw);
  if (!result.ok) return { status: 'error', message: 'Vui lòng kiểm tra lại thông tin.', errors: result.errors, values };

  const ip = getTrustedClientIp(await headers());
  if ((ip && throttled(`ip:${ip}`)) || throttled(`phone:${result.data.phone}`)) {
    return { status: 'error', message: 'Quý khách đã gửi nhiều yêu cầu. Vui lòng gọi hotline để được hỗ trợ ngay.', values };
  }

  const delivered = await deliverLead(result.data);
  if (!delivered) {
    return { status: 'error', message: 'Hệ thống nhận yêu cầu đang bận. Vui lòng gọi hotline 0933 871 139 hoặc nhắn Zalo để được báo giá ngay.', values };
  }
  return { status: 'success', message: `Cảm ơn ${result.data.name}! Nhân viên Phương Vy sẽ gọi lại số ${result.data.phone} trong giờ làm việc.` };
}
