import type { LegacyEntry } from './legacy-types';

const decode = (value: string) =>
  value
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const comparable = (value: string) => value.replace(/…$/, '').replace(/\s+/g, ' ').trim().slice(0, 80);

/**
 * Legacy pages open with an intro paragraph (often identical to the summary)
 * followed by a "📞 Gọi ngay … <tel>" line. The hero already shows both, so we
 * lift them out of the body to avoid printing the same text twice.
 */
export function splitLead(item: LegacyEntry): { lead?: string; body: string } {
  let body = item.html.trimStart();
  let lead: string | undefined;

  const first = body.match(/^<p>([\s\S]*?)<\/p>\s*/);
  if (first) {
    const text = decode(first[1]);
    const sameAsSummary = item.summary && text.startsWith(comparable(item.summary));
    if (text.length >= 40 && text.length <= 520 && sameAsSummary && !/<img/i.test(first[1])) {
      lead = text;
      body = body.slice(first[0].length);
      const callLine = body.match(/^<p>(?:(?!<\/p>)[\s\S]){0,160}?<a href="tel:[^"]+">[^<]*<\/a>\s*<\/p>\s*/);
      if (callLine) body = body.slice(callLine[0].length);
      body = body.replace(/^<hr \/>\s*/, '');
    }
  }
  return { lead, body };
}

const PROPER_NOUNS = ['Phương Vy', 'Việt Nam', 'Bắc Nam', 'Sài Gòn', 'Hà Nội', 'Đà Nẵng', 'TP.HCM', 'TPHCM', 'HCM'];

/** Sentence-case titles that were typed in ALL CAPS in WordPress (display only; SEO title is unchanged). */
export function displayTitle(title: string): string {
  const letters = title.replace(/[^\p{L}]/gu, '');
  if (letters.length < 6 || letters !== letters.toLocaleUpperCase('vi')) return title;
  let result = title.toLocaleLowerCase('vi');
  result = result.charAt(0).toLocaleUpperCase('vi') + result.slice(1);
  for (const noun of PROPER_NOUNS) result = result.replace(new RegExp(noun.toLocaleLowerCase('vi').replace('.', '\\.'), 'g'), noun);
  return result;
}
