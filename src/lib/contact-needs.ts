export const CONTACT_NEED_VALUES = [
  'shipping',
  'sourcing',
  'project',
  'customs',
  'consulting',
  'other',
] as const;

export type ContactNeed = typeof CONTACT_NEED_VALUES[number];

const CONTACT_NEED_ALIASES: Record<string, ContactNeed> = {
  shipping: 'shipping',
  'van-chuyen': 'shipping',
  'vận chuyển': 'shipping',
  'international shipping': 'shipping',
  sourcing: 'sourcing',
  production: 'sourcing',
  'tim-nguon-san-xuat': 'sourcing',
  'tìm nguồn / sản xuất': 'sourcing',
  project: 'project',
  package: 'project',
  'du-an-tron-goi': 'project',
  'dự án trọn gói': 'project',
  customs: 'customs',
  'thủ tục xuất nhập khẩu': 'customs',
  consulting: 'consulting',
  'tu-van': 'consulting',
  'cần tư vấn': 'consulting',
  other: 'other',
};

export function normalizeContactNeed(value: string | null | undefined): ContactNeed | '' {
  const normalized = value?.trim().toLowerCase() || '';
  return CONTACT_NEED_ALIASES[normalized] || '';
}
