/** Match Vietnamese terms with or without diacritics, including đ. */
export function normalizeSearchText(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().trim();
}

export function matchesSearch(query: string, ...fields: Array<string | null | undefined>) {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return false;
  const text = normalizeSearchText(fields.filter(Boolean).join(' ').replace(/<[^>]*>/g, ' '));
  return terms.every(term => text.includes(term));
}
