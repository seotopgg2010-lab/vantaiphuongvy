export type ContentRow = Record<string, unknown>;

function normalize(value: unknown): unknown {
  if (typeof value === 'string') return value.trim().replace(/\r\n/g, '\n');
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, normalize(item)]));
  return value ?? null;
}
export const sameContent = (left: unknown, right: unknown) => JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));

/** Update known seed values or empty fields; preserve later editorial work. */
export function planContentPatch(current: ContentRow, desired: ContentRow, previous: ContentRow) {
  const patch: ContentRow = {};
  const conflicts: string[] = [];
  for (const [field, value] of Object.entries(desired)) {
    if (sameContent(current[field], value)) continue;
    const existing = current[field];
    const empty = existing == null || existing === '' || (Array.isArray(existing) && existing.length === 0);
    if (empty || sameContent(existing, previous[field])) patch[field] = value;
    else conflicts.push(field);
  }
  return { patch, conflicts };
}
