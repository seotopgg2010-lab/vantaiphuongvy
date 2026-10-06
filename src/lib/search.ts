import type { LegacyEntry } from './legacy-types';

/** Match Vietnamese terms with or without diacritics, including đ. */
export function normalizeSearchText(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().trim();
}

/** Spellings people type for the same place, rewritten to one form after folding ("Sài Gòn", "HCM" and "TP.HCM" all become "tphcm"). */
const ALIASES: Array<[RegExp, string]> = [
  [/\b(?:tp\.? ?hcm|tphcm|hcm|ho chi minh|sai gon|saigon)\b/g, 'tphcm'],
  [/\bkon ?tum\b/g, 'kontum'],
  [/\b(?:dak ?lak|dac lac)\b/g, 'daklak'],
  [/\b(?:buon m[ae] thuot|bmt)\b/g, 'buonmathuot'],
  [/\bdak ?nong\b/g, 'daknong'],
];

const stripTags = (text: string) => text.replace(/<[^>]*>/g, ' ');

/** Folded words: no diacritics, aliases applied. */
function words(text: string): string[] {
  let folded = normalizeSearchText(stripTags(text));
  for (const [pattern, replacement] of ALIASES) folded = folded.replace(pattern, replacement);
  return folded.split(/[^a-z0-9]+/).filter(Boolean);
}

/** Words as written, diacritics kept, so "phạt" and "phát" can be told apart when ranking. */
function exactWords(text: string): string[] {
  return stripTags(text).normalize('NFC').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

/** True when consecutive words spell `joined`, so "hanoi" and "ha noi" both find "Hà Nội" but "nhat" does not find "Nha Trang". */
function containsRun(list: string[], joined: string): boolean {
  for (let start = 0; start < list.length; start++) {
    let run = '';
    for (let end = start; end < list.length && run.length < joined.length; end++) run += list[end];
    if (run === joined) return true;
  }
  return false;
}

type SearchDoc = {
  item: LegacyEntry;
  label: string[];
  title: string[];
  /** Label, title, summary and meta description together. */
  fields: Set<string>;
  /** Body words joined by spaces, padded, for phrase lookups. */
  body: string;
  exact: Set<string>;
};

const indexes = new WeakMap<LegacyEntry[], SearchDoc[]>();

function indexFor(items: LegacyEntry[]): SearchDoc[] {
  let docs = indexes.get(items);
  if (!docs) {
    docs = items.map((item) => {
      const meta = `${item.label} ${item.title} ${item.summary} ${item.seo.description ?? ''}`;
      return {
        item,
        label: words(item.label),
        title: words(item.title),
        fields: new Set(words(meta)),
        body: ` ${words(item.html).join(' ')} `,
        exact: new Set(exactWords(`${meta} ${item.html}`)),
      };
    });
    indexes.set(items, docs);
  }
  return docs;
}

/**
 * Pages matching the query, best first: the page the query names, then pages whose title,
 * summary or description has every query word (whole words, so "ha" never matches "hàng"),
 * then pages whose body has the query as a phrase. A query that contains a page's whole name
 * ("gửi hàng đi Đà Nẵng") lifts that page above pages that only mention the place; among equal
 * matches, words typed with the same diacritics rank first.
 */
export function searchPages(items: LegacyEntry[], query: string, limit = 40): LegacyEntry[] {
  const terms = words(query);
  if (!terms.length) return [];
  const joined = terms.join('');
  const phrase = ` ${terms.join(' ')} `;
  const typed = exactWords(query);
  const ranked: Array<{ item: LegacyEntry; score: number; exact: number }> = [];
  for (const doc of indexFor(items)) {
    let score = 0;
    if (doc.label.join('') === joined) score = 100;
    else if (terms.every((term) => doc.label.includes(term)) || containsRun(doc.label, joined)) score = 80;
    else if (containsRun(doc.title, joined)) score = 60;
    else if (terms.every((term) => doc.title.includes(term))) score = 50;
    else if (terms.every((term) => doc.fields.has(term))) score = 30;
    else if (doc.body.includes(phrase)) score = 10;
    if (!score) continue;
    if (doc.label.length && doc.label.every((word) => terms.includes(word))) score += 25;
    ranked.push({ item: doc.item, score, exact: typed.filter((word) => doc.exact.has(word)).length });
  }
  return ranked.sort((a, b) => b.score - a.score || b.exact - a.exact).slice(0, limit).map((entry) => entry.item);
}
