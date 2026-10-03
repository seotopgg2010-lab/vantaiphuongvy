import { renderRichText } from './rich-text';

/** One bounded, sanitized format for all rich-text fields saved by the CMS. */
export function cmsRichText(value: FormDataEntryValue | null): string {
  if (value === null) return '';
  if (typeof value !== 'string') throw new Error('Nội dung phải là văn bản.');
  if (value.length > 500_000) throw new Error('Nội dung quá dài (tối đa 500.000 ký tự).');
  return renderRichText(value);
}

export function parseSectionContent(value: FormDataEntryValue | null): Record<string, unknown> {
  if (typeof value !== 'string' || value.length > 500_000) throw new Error('Nội dung JSON không hợp lệ hoặc quá dài.');
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Content phải là JSON object hợp lệ.');
  const content = { ...parsed } as Record<string, unknown>;
  for (const key of ['html', 'body', 'content']) {
    if (typeof content[key] === 'string') content[key] = cmsRichText(content[key]);
  }
  return content;
}

export function cmsImageUrls(value: FormDataEntryValue | null): string[] {
  if (value === null || value === '') return [];
  if (typeof value !== 'string' || value.length > 50_000) throw new Error('Danh sách ảnh không hợp lệ.');
  const urls = [...new Set(value.split(/\r?\n/).map((url) => url.trim()).filter(Boolean))];
  if (urls.length > 50) throw new Error('Tối đa 50 ảnh cho một dự án.');
  for (const url of urls) {
    if (/^\/(?!\/)/.test(url) && !/[\\\s]/.test(url)) continue;
    try { const parsed = new URL(url); if (parsed.protocol === 'https:' && !parsed.username && !parsed.password) continue; } catch {}
    throw new Error('Ảnh phải dùng đường dẫn nội bộ hoặc URL HTTPS hợp lệ.');
  }
  return urls;
}
export function sectionOrder(value: FormDataEntryValue | null): number {
  const order = Number(value || 0);
  if (!Number.isSafeInteger(order) || Math.abs(order) > 1_000_000) throw new Error('Thứ tự section không hợp lệ.');
  return order;
}
