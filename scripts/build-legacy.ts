/**
 * Build-time content pipeline.
 *
 * Reads the immutable WordPress export (pages.json / posts.json — never edited)
 * plus the scraped Rank Math metadata, and emits a clean, template-ready corpus
 * at src/legacy-content/legacy-clean.json:
 *   - strips plugin chrome (kk-star-ratings, Easy TOC, Avia builder wrappers, inline styles);
 *     the star-rating payload is kept as `rating`
 *   - attaches the snapshotted WordPress comments (comments.json) as plain-text threads
 *   - keeps the original heading anchors (#Bang_Gia_...) so old deep links still work
 *   - rewrites images to the locally mirrored /wp-content/uploads/** paths (same URLs)
 *   - rewrites absolute internal links to relative ones
 *   - extracts TOC, FAQ, summary, hero image and quick facts per entry
 *
 * Usage: npx tsx scripts/build-legacy.ts
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as cheerio from 'cheerio';
import { Element as DomElement, Text as DomText, type AnyNode, type Element, type Text } from 'domhandler';
import sanitizeHtml from 'sanitize-html';
import { BRIEF_NAVIGATION } from '../src/content/brief-navigation';
import { CONTEXTUAL_LINKS, CONTEXTUAL_LINK_LIMITS, ROUTE_PHRASE_DIRECTIONS, ROUTE_PHRASE_VERBS } from '../src/content/contextual-links';
import { ARTICLE_UPDATES } from '../src/content/article-updates';
import { SEO_OVERRIDES } from '../src/content/seo-overrides';
import type { CommentThread, FaqEntry, LegacyAuthor, LegacyComment, LegacyEntry, LegacyRating, LegacyRegion, LegacyTemplate, TocEntry } from '../src/lib/legacy-types';
import { displayTitle } from '../src/lib/legacy-render';
import { applyArticleImages, buildArticleImages } from './legacy-images';
import { htmlToMarkdown } from './legacy-markdown';

type WpItem = {
  id: number; slug: string; link: string; date?: string; modified?: string;
  title: { rendered: string }; content: { rendered: string };
};
type SeoMeta = { title?: string; description?: string; ogImage?: string; robots?: string };

const root = process.cwd();
const read = <T,>(file: string): T => JSON.parse(readFileSync(join(root, file), 'utf8')) as T;
const pages = read<WpItem[]>('src/legacy-content/pages.json');
const posts = read<WpItem[]>('src/legacy-content/posts.json');
/** Internal links that pointed at slugs which never existed (404 on the live site too). */
const LINK_FIXES: Record<string, string> = {
  '/van-chuyen-hang-hoa/nghe-an/': '/van-chuyen-hang-hoa/vinh-nghe-an/',
  '/bang-gia-cuoc-van-chuyen/': '/van-chuyen-hang-hoa/',
};
// Filled once pathOf() is available (see below); paths without trailing slash, "/" for home.
const KNOWN_PATHS = new Set<string>(['/', '/blog', '/tim-kiem']);
const seoMeta = existsSync(join(root, 'src/legacy-content/seo-meta.json')) ? read<Record<string, SeoMeta>>('src/legacy-content/seo-meta.json') : {};
const manifestFile = 'plans/261003-vantaiphuongvy-rebuild/reports/uploads-manifest.json';
const brokenUploads = new Set(existsSync(join(root, manifestFile)) ? read<{ failed: Array<{ path: string }> }>(manifestFile).failed.map((f) => f.path) : []);

const SITE_HOSTS = new Set(['vantaiphuongvy.com', 'www.vantaiphuongvy.com']);
const CARGO_SLUGS = new Set(['xe-may', 'may-moc-thiet-bi', 'dau-nhot', 'sieu-truong-sieu-trong', 'duong-bien', 'duong-hang-khong']);
const POLICY_PATHS = new Set(['/chinh-sach-bao-mat', '/chinh-sach-van-chuyen-va-giao-hang', '/phuong-thuc-thanh-toan', '/thu-ngo']);
const BLOCK_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'table', 'figure', 'blockquote', 'div', 'section', 'hr', 'pre', 'aside', 'article', 'header', 'footer', 'main', 'nav', 'dl']);

// ---------- navigation-derived labels & regions ----------
const navLabel = new Map<string, string>();
const navRegion = new Map<string, LegacyRegion>();
const REGION_BY_GROUP: Record<string, LegacyRegion> = { 'Tuyến miền Bắc': 'bac', 'Tuyến miền Trung': 'trung', 'Tuyến miền Nam': 'nam', 'Loại hàng': 'loai-hang' };
const INTERNATIONAL = new Set(['/van-chuyen-hang-hoa/campuchia', '/van-chuyen-hang-hoa/lao', '/van-chuyen-hang-hoa/duong-bien', '/van-chuyen-hang-hoa/duong-hang-khong']);
for (const group of BRIEF_NAVIGATION) for (const column of group.items) for (const link of column.items) {
  if (!navLabel.has(link.href)) navLabel.set(link.href, link.label);
  const region = REGION_BY_GROUP[column.label] ?? (column.label.startsWith('Tây Nguyên') ? (INTERNATIONAL.has(link.href) ? 'quoc-te' : 'tay-nguyen') : undefined);
  if (region && !navRegion.has(link.href)) navRegion.set(link.href, region);
}
const OVERRIDES: Array<[string, string, LegacyRegion]> = [
  ['/van-chuyen-hang-hoa/chanh-xe-phu-quoc', 'Phú Quốc', 'nam'],
  ['/van-chuyen-hang-hoa/chanh-xe-chuyen-hang-di-buon-me-thuot', 'Buôn Ma Thuột', 'tay-nguyen'],
  ['/van-chuyen-hang-hoa/phan-thiet', 'Phan Thiết', 'trung'],
  ['/van-chuyen-hang-hoa/mong-cai', 'Móng Cái', 'bac'],
  ['/van-chuyen-hang-hoa/vinh-phuc', 'Vĩnh Phúc', 'bac'],
  // Sea and air freight are ways to ship, not destinations: they join the cargo services group.
  ['/van-chuyen-hang-hoa/duong-bien', 'Vận chuyển đường biển', 'loai-hang'],
  ['/van-chuyen-hang-hoa/duong-hang-khong', 'Vận chuyển hàng không', 'loai-hang'],
];
for (const [href, label, region] of OVERRIDES) { navLabel.set(href, label); navRegion.set(href, region); }
const LABEL_OVERRIDES: Array<[string, string]> = [
  ['/thue-xe-tai', 'Thuê xe tải'],
  ['/van-chuyen-hang-hoa', 'Vận chuyển hàng hóa'],
  ['/van-chuyen-hang-hoa/vinh-nghe-an', 'Vinh – Nghệ An'],
  ['/van-chuyen-hang-hoa/tphcm', 'Nội thành TP.HCM'],
  ['/van-chuyen-hang-hoa/duong-bien', 'Vận chuyển đường biển'],
  ['/van-chuyen-hang-hoa/duong-hang-khong', 'Vận chuyển hàng không'],
];
for (const [href, label] of LABEL_OVERRIDES) navLabel.set(href, label);

// ---------- helpers ----------
function decodeEntities(value: string): string {
  return cheerio.load(`<p>${value}</p>`, null, false)('p').text();
}
function pathOf(link: string): string { return new URL(link).pathname.replace(/\/+$/, '') || '/'; }
/**
 * WordPress REST dates are site-local times without an offset (site timezone Asia/Ho_Chi_Minh,
 * UTC+7, no DST). Written with the offset so a build on a UTC host shows the same day.
 */
function wpDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return /(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : `${value}+07:00`;
}
for (const item of [...pages, ...posts]) KNOWN_PATHS.add(pathOf(item.link));

function templateOf(path: string, kind: 'page' | 'post'): LegacyTemplate {
  if (kind === 'post') return 'post';
  if (path === '/') return 'home';
  if (path === '/van-chuyen-hang-hoa') return 'route-hub';
  if (path.startsWith('/van-chuyen-hang-hoa/')) return CARGO_SLUGS.has(path.split('/').pop()!) ? 'cargo' : 'route';
  if (path === '/thue-xe-tai') return 'truck-hub';
  if (path.startsWith('/thue-xe-tai/')) return 'truck';
  if (POLICY_PATHS.has(path)) return 'policy';
  return 'page';
}

function slugId(text: string, seen: Set<string>): string {
  const base = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'muc';
  let id = base; let n = 2;
  while (seen.has(id)) id = `${base}-${n++}`;
  seen.add(id); return id;
}

/** Map any WordPress upload URL to its locally mirrored path, or null if unusable. */
function localUpload(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.replace(/&#038;|&amp;/g, '&'), 'https://vantaiphuongvy.com');
    if (!SITE_HOSTS.has(url.hostname) || !url.pathname.startsWith('/wp-content/uploads/')) return null;
    const decoded = decodeURIComponent(url.pathname);
    if (brokenUploads.has(decoded) || !existsSync(join(root, 'public', decoded))) return null;
    return encodeURI(decoded);
  } catch { return null; }
}

function internalHref(raw: string): string | null {
  try {
    const url = new URL(raw.replace(/&#038;|&amp;/g, '&'), 'https://vantaiphuongvy.com');
    if (!SITE_HOSTS.has(url.hostname)) return null;
    if (url.pathname.startsWith('/wp-content/')) return localUpload(raw) ?? raw;
    const path = url.pathname === '/' ? '/' : `${url.pathname.replace(/\/+$/, '')}/`;
    return `${path}${url.search}${url.hash}`;
  } catch { return null; }
}

const textOf = ($: cheerio.CheerioAPI, el: AnyNode) => $(el).text().replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

// ---------- contextual links ----------
type LinkTarget = { href: string; pattern: RegExp };
const phrasePattern = (phrases: string[]) => {
  const alternatives = phrases.map((phrase) => phrase.normalize('NFC').replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'));
  return new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternatives.join('|')})(?![\\p{L}\\p{N}])`, 'iu');
};
/** Dictionary phrases first, then "gửi hàng đi <tỉnh>"-style phrases for every route page. */
const LINK_TARGETS: LinkTarget[] = [
  ...CONTEXTUAL_LINKS.map(({ href, phrases }) => ({ href, pattern: phrasePattern(phrases) })),
  ...[...navLabel].filter(([href]) => href.startsWith('/van-chuyen-hang-hoa/') && !CARGO_SLUGS.has(href.split('/').pop()!) && !INTERNATIONAL.has(href)).map(([href, label]) => {
    const places = label.split(/\s+[–-]\s+/).map((place) => place.trim()).filter(Boolean);
    const phrases = ROUTE_PHRASE_VERBS.flatMap((verb) => ROUTE_PHRASE_DIRECTIONS.flatMap((direction) => places.map((place) => `${verb} ${direction} ${place}`)));
    return { href: `${href}/`, pattern: phrasePattern(phrases) };
  }),
];
/** Links live in paragraphs and list items (and their inline text); never in headings, tables, callouts or figures. */
/**
 * Owner-approved sentence edits (src/content/claim-edits.json) that drop "nhất" / "số 1" / "hàng đầu"
 * claims, unproven comparisons with competitors and retired discounts (the running offer is 7% off for
 * new customers). Each edit names the sentence it belongs to and applies inside the run of text holding it.
 */
/** `remove` drops the whole block holding the sentence instead: its paragraph/list item/heading, or its table. */
type ClaimEdit = { sentence: string; changes: Array<[string, string]>; remove?: 'block' | 'table' };
const CLAIM_EDITS = read<ClaimEdit[]>('src/content/claim-edits.json');
const appliedClaimEdits = new Set<ClaimEdit>();
const TEXT_BLOCKS = new Set(['p', 'li', 'td', 'th', 'h2', 'h3', 'h4', 'figcaption', 'blockquote', 'ul', 'ol', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'div', 'figure', 'aside', 'hr', 'section']);
const normText = (value: string) => value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

function collectText(node: AnyNode, out: Text[]) {
  if (node.type === 'text') out.push(node as Text);
  else if ('children' in node) for (const child of (node as Element).children) collectText(child, out);
}

/** Runs of inline content (text and inline elements) between block boundaries: the unit a sentence lives in. */
function inlineRuns($: cheerio.CheerioAPI, parent: AnyNode, runs: AnyNode[][] = []): AnyNode[][] {
  let run: AnyNode[] = [];
  for (const node of $(parent).contents().toArray()) {
    if (node.type === 'tag' && TEXT_BLOCKS.has((node as Element).tagName)) {
      if (run.length) runs.push(run);
      run = [];
      inlineRuns($, node, runs);
    } else run.push(node);
  }
  if (run.length) runs.push(run);
  return runs;
}

const spacedPattern = (text: string, flags = '') => new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+'), flags);

/**
 * Replaces the first match at or after `from` in the run's text. A match inside one text node keeps
 * its markup; one that spans nodes puts the new text in the first node and cuts the rest of the match.
 */
function replaceInRun(texts: Text[], find: string, replace: string, from: number): boolean {
  const pattern = spacedPattern(find, 'g');
  pattern.lastIndex = from;
  const match = pattern.exec(texts.map((text) => text.data).join(''));
  if (!match) return false;
  const start = match.index;
  const end = start + match[0].length;
  let offset = 0;
  let placed = false;
  for (const text of texts) {
    const from = offset;
    offset += text.data.length;
    if (offset <= start || from >= end) continue;
    text.data = text.data.slice(0, Math.max(start, from) - from) + (placed ? '' : replace) + text.data.slice(Math.min(end, offset) - from);
    placed = true;
  }
  return true;
}

function applyClaimEdits($: cheerio.CheerioAPI) {
  const all: Text[] = [];
  for (const node of $.root().contents().toArray()) collectText(node, all);
  for (const text of all) text.data = text.data.normalize('NFC');
  const runs = inlineRuns($, $.root().get(0)!).map((run) => {
    const texts: Text[] = [];
    run.forEach((node) => collectText(node, texts));
    return texts;
  });
  const runText = (texts: Text[]) => normText(texts.map((text) => text.data).join(''));
  const alts = $('img[alt]').toArray().map((img) => ($(img).attr('alt') || '').normalize('NFC'));
  const pageText = [...runs.map(runText), ...alts].join('\n');
  // Longest sentence first: a shorter edited sentence can sit inside a longer one, whose edit already covers it.
  const edits = CLAIM_EDITS.filter((edit) => pageText.includes(edit.sentence)).sort((a, b) => b.sentence.length - a.sentence.length);
  if (!edits.length) return;
  const emptied = new Set<AnyNode>();
  const removed = new Set<AnyNode>();
  for (const texts of runs) {
    const original = runText(texts);
    for (const edit of edits) {
      if (!original.includes(edit.sentence)) continue;
      appliedClaimEdits.add(edit);
      if (edit.remove) {
        const block = $(texts[0].parent!).closest(edit.remove === 'table' ? 'table' : 'p, li, h2, h3, h4');
        if (!block.length) throw new Error(`claim edit: no ${edit.remove} around: ${edit.sentence}`);
        removed.add(block.get(0)!);
        continue;
      }
      // Edit inside this sentence only: the same phrase may also sit in another sentence of the run.
      const at = spacedPattern(edit.sentence).exec(texts.map((text) => text.data).join(''));
      if (!at) continue;
      const before = texts.map((text) => text.data);
      for (const [find, replace] of edit.changes) {
        if (!replaceInRun(texts, find, replace, at.index)) throw new Error(`claim edit "${find}" not found in: ${edit.sentence}`);
      }
      texts.forEach((text, index) => { if (text.data !== before[index] && !text.data.trim() && text.parent) emptied.add(text.parent); });
    }
  }
  $('img[alt]').each((_, img) => {
    let alt = ($(img).attr('alt') || '').normalize('NFC');
    for (const edit of edits) {
      if (!alt.includes(edit.sentence)) continue;
      for (const [find, replace] of edit.changes) alt = alt.replace(find, () => replace);
      appliedClaimEdits.add(edit);
    }
    $(img).attr('alt', alt);
  });
  for (const node of removed) $(node).closest('.table-scroll').add(node).first().remove();
  // A block left with no text by an edit (a stale "(MỚI NHẤT 2019)" label) goes with it.
  for (const node of emptied) {
    const block = $(node).closest('p, li, h2, h3, h4');
    if (block.length && !normText(block.text()) && !block.find('img').length) block.remove();
  }
}

const LINKABLE_TAGS = new Set(['p', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u']);

/**
 * Links the first mention of a descriptive phrase (src/content/contextual-links.ts) to its page,
 * in body paragraphs and list items only. Skips an opening paragraph (the hero may lift it) and
 * text outside paragraphs, targets the page already links to, and the page itself; stops at the cap.
 */
function addContextualLinks($: cheerio.CheerioAPI, path: string, limit: number) {
  const used = new Set([`${path}/`, ...$('a[href]').toArray().map((a) => ($(a).attr('href') || '').split(/[?#]/)[0])]);
  const first = $.root().children().first();
  const opening = first.is('p') ? first.get(0) : undefined;
  let added = 0;
  const linkText = (node: Text) => {
    let best: { index: number; length: number; href: string } | undefined;
    for (const target of LINK_TARGETS) {
      if (used.has(target.href)) continue;
      const match = target.pattern.exec(node.data);
      if (match && (!best || match.index < best.index)) best = { index: match.index, length: match[0].length, href: target.href };
    }
    if (!best) return;
    used.add(best.href);
    added++;
    const after = new DomText(node.data.slice(best.index + best.length));
    const label = new DomText(node.data.slice(best.index, best.index + best.length));
    const anchor = new DomElement('a', { href: best.href }, [label]);
    label.parent = anchor;
    $(node).replaceWith([new DomText(node.data.slice(0, best.index)), anchor, after]);
    if (added < limit) linkText(after);
  };
  const visit = (node: AnyNode) => {
    if (added >= limit) return;
    if (node.type === 'text') linkText(node as Text);
    else if (node.type === 'tag' && node !== opening && LINKABLE_TAGS.has((node as Element).tagName)) [...(node as Element).children].forEach(visit);
  };
  // Elements only: text sitting directly at the root (outside any paragraph) is never linked.
  $.root().children().toArray().forEach(visit);
}

// ---------- HTML transform ----------
function transform(html: string, title: string, path: string, linkLimit: number) {
  // A heading the editor closed with </p> ("<h2>Bảng Giá Cước</p>") swallows everything after it,
  // tables included; close it as the heading it is.
  const $ = cheerio.load(html.replace(/<(h[1-6])(\s[^>]*)?>([^<]*)<\/p>/gi, '<$1$2>$3</$1>'), null, false);

  // 0. The theme's "Về tác giả" box: the author's name and bio become data, the markup goes.
  const authorBox = $('.about-author').first();
  const authorName = authorBox.find('.author-name').text().replace(/\s+/g, ' ').trim();
  const authorBio = authorBox.find('.read-des').text().replace(/\s+/g, ' ').trim();
  const author: LegacyAuthor | undefined = authorName ? { name: authorName, ...(authorBio ? { bio: authorBio } : {}) } : undefined;
  $('.about-author').remove();

  // The kk Star Ratings widget (read-only on the live site) becomes data; its markup goes with the plugin chrome below.
  const rating = parseRating($('.kk-star-ratings').first().attr('data-payload'));

  // 1. plugin chrome & non-content
  // .av-countdown-timer: an expired promo countdown that would print as "0Weeks0Days0Hours…"
  $('.kk-star-ratings, #ez-toc-container, .ez-toc-container, .eztoc-hide, script, style, noscript, svg, form, iframe, button, input, .avia-iconfont, .avia-font-entypo-fontello, .hr-inner, .sharedaddy, .author-box, .av-countdown-timer').remove();
  $('img[src*="gravatar.com"]').remove();

  // 2. promotional gradient boxes -> semantic callouts (styled by our CSS)
  $('div[style*="background"]').each((_, el) => {
    if ($(el).find('a[href^="tel:"], a[href*="zalo.me"]').length) $(el).attr('data-callout', '1');
  });

  // 3. headings: keep original Easy-TOC anchors, flatten inner markup. ALL-CAPS headings are
  //    shown in sentence case; ids still derive from the original text, so old anchors keep working.
  const seen = new Set<string>();
  $('h1').each((_, el) => { (el as Element).tagName = 'h2'; });
  $('h2, h3, h4, h5, h6').each((_, el) => {
    const anchor = $(el).find('span.ez-toc-section[id]').first().attr('id');
    const text = textOf($, el);
    if (!text) { $(el).remove(); return; }
    const element = el as Element;
    if (element.tagName === 'h5' || element.tagName === 'h6') element.tagName = 'h4';
    let id = anchor && !seen.has(anchor) ? anchor : slugId(text, seen);
    seen.add(id);
    if (!/^[A-Za-z0-9_-]+$/.test(id)) id = slugId(text, seen);
    $(el).empty().text(displayTitle(text)).attr({ id });
    for (const attr of Object.keys(element.attribs)) if (attr !== 'id') $(el).removeAttr(attr);
  });

  // 4. WordPress caption markup -> figure/figcaption
  $('div.wp-caption').each((_, el) => { (el as Element).tagName = 'figure'; });
  $('p.wp-caption-text').each((_, el) => { (el as Element).tagName = 'figcaption'; });

  // 5. images -> local mirror, lazy, intrinsic size kept for CLS
  $('img').each((_, el) => {
    const src = localUpload($(el).attr('src')) ?? localUpload($(el).attr('data-src'));
    if (!src) { $(el).remove(); return; }
    const width = $(el).attr('width'); const height = $(el).attr('height');
    const alt = ($(el).attr('alt') || '').trim() || title;
    const attribs = (el as Element).attribs;
    for (const attr of Object.keys(attribs)) delete attribs[attr];
    $(el).attr({ src, alt, loading: 'lazy', decoding: 'async' });
    if (width && /^\d+$/.test(width)) $(el).attr('width', width);
    if (height && /^\d+$/.test(height)) $(el).attr('height', height);
  });

  // 6. links
  $('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    const hasOnlyImage = $(el).children('img').length > 0 && !textOf($, el);
    if (!href || href === '#' || (hasOnlyImage && /\/wp-content\/uploads\//.test(href))) { $(el).replaceWith($(el).contents()); return; }
    const internal = internalHref(href);
    const attribs = (el as Element).attribs;
    for (const attr of Object.keys(attribs)) if (attr !== 'href' && attr !== 'title') delete attribs[attr];
    if (internal) {
      const [pathPart, rest = ''] = internal.split(/(?=[?#])/);
      const fixed = LINK_FIXES[pathPart] ?? pathPart;
      const known = fixed.startsWith('/wp-content/') || fixed.startsWith('/#') || KNOWN_PATHS.has(fixed.replace(/\/$/, '') || '/');
      if (!known || /^\/(author|category|tag)\//.test(fixed)) { $(el).replaceWith($(el).contents()); return; }
      $(el).attr('href', `${fixed}${rest}`);
    }
    else if (/^https?:/i.test(href)) $(el).attr({ target: '_blank', rel: 'noopener' });
  });

  // 7. tables: drop presentational attributes, promote bold first row to a header
  $('table').each((_, table) => {
    $(table).find('*').addBack().each((__, node) => {
      const attribs = (node as Element).attribs || {};
      for (const attr of Object.keys(attribs)) if (!['colspan', 'rowspan'].includes(attr)) delete attribs[attr];
    });
    if (!$(table).find('th').length) {
      const firstRow = $(table).find('tr').first();
      const cells = firstRow.children('td');
      const allBold = cells.length > 1 && cells.toArray().every((cell) => { const text = textOf($, cell); return text.length > 0 && text.length < 60 && textOf($, $(cell).find('strong, b').get(0) ?? cell) === text && $(cell).find('strong, b').length > 0; });
      if (allBold && $(table).find('tr').length > 2) {
        cells.each((__, cell) => { (cell as Element).tagName = 'th'; $(cell).find('strong, b').each((___, b) => { $(b).replaceWith($(b).contents()); }); });
        const thead = $('<thead></thead>'); thead.append(firstRow.clone()); firstRow.remove();
        $(table).prepend(thead);
      }
    }
    $(table).wrap('<div class="table-scroll"></div>');
  });

  // 8. strip remaining presentational attributes everywhere (except our markers)
  $('*').each((_, node) => {
    const element = node as Element;
    if (element.tagName === 'img' || element.tagName === 'a' || /^h[2-4]$/.test(element.tagName)) return;
    for (const attr of Object.keys(element.attribs)) {
      if (attr === 'data-callout' || attr === 'colspan' || attr === 'rowspan') continue;
      if (attr === 'class' && element.attribs.class === 'table-scroll') continue;
      // A list split by a paragraph continues its numbering ("3." after the text, not "1.").
      if (element.tagName === 'ol' && attr === 'start' && /^\d+$/.test(element.attribs.start)) continue;
      delete element.attribs[attr];
    }
  });

  // 9. flatten layout wrappers (deepest first): block-only divs unwrap, inline-only divs become <p>
  $('span').each((_, el) => { $(el).replaceWith($(el).contents()); });
  $('section, article, header, footer, main').each((_, el) => { $(el).replaceWith($(el).contents()); });
  $('div').toArray().reverse().forEach((el) => {
    const element = el as Element;
    if (element.attribs.class === 'table-scroll') return;
    if (element.attribs['data-callout']) { element.tagName = 'aside'; element.attribs = { class: 'callout' }; return; }
    const hasBlock = element.children.some((child) => child.type === 'tag' && BLOCK_TAGS.has((child as Element).tagName));
    if (hasBlock) { $(el).replaceWith($(el).contents()); return; }
    if (textOf($, el) || $(el).find('img').length) element.tagName = 'p';
    else $(el).remove();
  });
  $('figure').each((_, el) => { if (!$(el).find('img').length) $(el).replaceWith($(el).contents()); });
  // a <p> may now contain block children after unwrapping — unwrap those paragraphs
  $('p').each((_, el) => {
    if ((el as Element).children.some((child) => child.type === 'tag' && BLOCK_TAGS.has((child as Element).tagName))) $(el).replaceWith($(el).contents());
  });

  // 10. empty / decorative leftovers
  $('strong, b, em, i, u').each((_, el) => { if (!textOf($, el) && !$(el).find('img').length) $(el).remove(); });
  $('p, li, figcaption, blockquote').each((_, el) => { if (!textOf($, el) && !$(el).find('img').length) $(el).remove(); });
  $('ul, ol').filter((_, el) => $(el).children().length === 0).remove();
  // hand-typed rating lines ("Đánh giá: 4.9/5 – 17 bình chọn") are unverifiable review claims
  $('p').each((_, el) => { if (/^(Đánh giá:?\s*)?[\d.,]+\s*\/\s*5\b.*bình chọn\)?$/i.test(textOf($, el))) $(el).remove(); });
  $('hr + hr').remove();
  // Avia slider remnants: "Previous/Next" + "1 2 3" anchor rows and image-only slide lists
  $('p').each((_, el) => {
    const links = $(el).find('a');
    if (links.length && links.toArray().every((a) => /^\/?#(prev|next|\d+)$/.test($(a).attr('href') || '')) && textOf($, el) === links.toArray().map((a) => textOf($, a)).join('')) $(el).remove();
  });
  $('ul').each((_, el) => {
    const items = $(el).children('li');
    if (items.length > 1 && items.toArray().every((li) => $(li).find('img').length > 0 && !textOf($, li))) $(el).remove();
  });
  $.root().children('br').remove();
  // Line breaks: collapse runs of <br>, and join lines that pasted text wrapped mid-sentence (no
  // closing punctuation before, lowercase after). Every other break is the author's own line.
  // (The CSS "br + br" matched breaks with text between them and merged all lines after the first.)
  const neighbour = (node: AnyNode | null, step: 'prev' | 'next') => {
    let current = node;
    while (current?.type === 'text' && !(current as Text).data.trim()) current = current[step];
    return current;
  };
  $('br').each((_, el) => {
    const previous = neighbour((el as Element).prev, 'prev');
    if (previous?.type === 'tag' && (previous as Element).tagName === 'br') { $(el).remove(); return; }
    const next = neighbour((el as Element).next, 'next');
    const before = previous ? $(previous).text().trimEnd() : '';
    const after = next ? $(next).text().trimStart() : '';
    if (before && after && !/[.:;!?…)»”"]$/.test(before) && /^\p{Ll}/u.test(after)) $(el).replaceWith(' ');
  });

  // 10b. dash lists typed as text ("– item<br>– item") become real lists; an intro line before
  //      the first dash stays a paragraph.
  const DASH = /^[–—\-+•]\s+/;
  $.root().children('p').each((_, el) => {
    const lines = ($(el).html() || '').split(/<br\s*\/?>/i).map((line) => line.trim()).filter(Boolean);
    const plain = lines.map((line) => cheerio.load(`<p>${line}</p>`, null, false)('p').text().replace(/\u00a0/g, ' ').trim());
    const first = plain.findIndex((text) => DASH.test(text));
    if (first < 0 || lines.length - first < 2 || !plain.slice(first).every((text) => DASH.test(text))) return;
    const items = lines.slice(first).map((line) => line.replace(/^((?:\s*<[^>]+>)*\s*)[–—\-+•](?:\s|&nbsp;)+/, '$1'));
    const intro = lines.slice(0, first).join('<br />');
    $(el).replaceWith(`${intro ? `<p>${intro}</p>` : ''}<ul>${items.map((item) => `<li>${item.trim()}</li>`).join('')}</ul>`);
  });

  // 10c. a paragraph that is only bold text and works as a heading — a question answered by the
  //      next block, or a short title introducing a list or table — becomes a heading one level
  //      below the section it sits in, so the outline, the FAQ extraction and the twin see it.
  let sectionLevel = 0;
  // An article with no headings at all only has its bold lines as section titles.
  const untitled = $.root().children('h2, h3, h4').length === 0;
  $.root().children().each((_, el) => {
    const element = el as Element;
    if (/^h[2-4]$/.test(element.tagName)) { sectionLevel = Number(element.tagName[1]); return; }
    if (element.tagName !== 'p') return;
    const kids = element.children.filter((child) => child.type !== 'text' || (child as Text).data.trim());
    const bold = kids.length === 1 && kids[0].type === 'tag' && ['strong', 'b'].includes((kids[0] as Element).tagName) ? $(kids[0]) : null;
    if (!bold || bold.find('a, img, br').length) return;
    const text = textOf($, el).replace(/\s+\?$/, '?');
    const next = $(el).next();
    const nextTag = next.length ? (next.get(0) as Element).tagName : '';
    const words = text.split(/\s+/).length;
    const question = text.endsWith('?') && text.length >= 12 && text.length <= 160 && ['p', 'ul', 'ol', 'div', 'figure'].includes(nextTag);
    const titleLike = !/[:.!,;?…]$/.test(text) && words >= 4 && words <= 16 && text.length <= 120 && !/\d{6,}|@/.test(text.replace(/\s/g, ''));
    const introducesBlock = nextTag === 'ul' || nextTag === 'ol' || (nextTag === 'div' && next.hasClass('table-scroll'));
    const listTitle = titleLike && (introducesBlock || (untitled && Boolean(nextTag)));
    if (!question && !listTitle) return;
    const level = sectionLevel ? Math.min(sectionLevel + 1, 4) : 2;
    $(el).replaceWith($(`<h${level}></h${level}>`).attr('id', slugId(text, seen)).text(displayTitle(text)));
  });

  // 11. outline: drop an opening heading that only repeats the page title (the template renders
  //     the H1), then renumber headings by nesting depth so levels never skip (H1 → h3, h2 → h4).
  //     FAQ detection below keeps reading the original level.
  const comparable = (value: string) => value.toLocaleLowerCase('vi').replace(/[^\p{L}\p{N}]+/gu, '');
  const opening = $.root().children().first();
  if (opening.is('h2, h3, h4') && comparable(textOf($, opening.get(0)!)) === comparable(title)) {
    const after = opening.next();
    opening.remove();
    if (after.is('hr')) after.remove();
  }
  const originalLevel = new Map<AnyNode, number>();
  const open: number[] = [];
  $('h2, h3, h4').each((_, el) => {
    const element = el as Element;
    const level = Number(element.tagName[1]);
    originalLevel.set(el, level);
    while (open.length && open[open.length - 1] >= level) open.pop();
    element.tagName = `h${Math.min(open.length + 2, 4)}`;
    open.push(level);
  });

  // 11b. owner-approved edits: no superlative claims, no unproven comparisons, one current offer
  applyClaimEdits($);

  // 12. contextual links to related services, routes and guides (first mention only, capped)
  if (linkLimit > 0) addContextualLinks($, path, linkLimit);

  // ---------- extraction ----------
  const toc: TocEntry[] = $('h2, h3').toArray().map((el) => ({ id: $(el).attr('id')!, text: textOf($, el), level: ((el as Element).tagName === 'h2' ? 2 : 3) as 2 | 3 })).filter((entry) => entry.text.length >= 4);

  const faq: FaqEntry[] = [];
  $('h2, h3, h4').each((_, el) => {
    if ((originalLevel.get(el) ?? 0) < 3) return;
    const question = textOf($, el).replace(/\s+\?$/, '?');
    if (!question.endsWith('?') || question.length < 10) return;
    const parts: string[] = [];
    let next = $(el).next();
    while (next.length && !/^h[2-4]$/.test((next.get(0) as Element).tagName)) {
      // An ALL-CAPS slogan line ("VẬN TẢI PHƯƠNG VY – TIÊN PHONG CÙNG KHÁCH HÀNG") is not part of the answer.
      const part = textOf($, next.get(0)!);
      if (!(/\p{Lu}{3}/u.test(part) && part === part.toLocaleUpperCase('vi'))) parts.push(part);
      next = next.next();
    }
    const answer = parts.join(' ').replace(/\s+/g, ' ').trim();
    if (answer.length >= 20) faq.push({ question, answer: answer.length > 700 ? `${answer.slice(0, 697).replace(/\s+\S*$/, '')}…` : answer });
  });
  // "Hỏi: …? => …" or "Hỏi: …?" followed by "Đáp: …" paragraphs, which WordPress also published as FAQPage.
  $('p').each((_, el) => {
    const ask = textOf($, el).match(/^Hỏi\s*:\s*(.+?\?)\s*(?:=>\s*)?(.*)$/i);
    if (!ask) return;
    const question = ask[1].replace(/\s+\?$/, '?');
    const reply = textOf($, $(el).next().get(0) ?? el).match(/^Đáp\s*:\s*(.+)$/i);
    const answer = (ask[2] || (reply ? reply[1] : '')).trim();
    if (answer.length >= 20 && !faq.some((entry) => entry.question === question)) faq.push({ question, answer: answer.length > 700 ? `${answer.slice(0, 697).replace(/\s+\S*$/, '')}…` : answer });
  });

  const paragraphs = $('p').toArray().map((el) => textOf($, el)).filter((text) => text.length >= 60 && !/bình chọn|Mục Lục/i.test(text));
  const firstImage = $('img').first();
  const words = textOf($, $.root().get(0)!).split(/\s+/).length;

  const clean = sanitizeHtml($.html(), {
    allowedTags: ['h2', 'h3', 'h4', 'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'hr', 'aside', 'div'],
    allowedAttributes: { a: ['href', 'title', 'target', 'rel'], img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'], h2: ['id'], h3: ['id'], h4: ['id'], aside: ['class'], div: ['class'], ol: ['start'] },
    allowedClasses: { aside: ['callout'], div: ['table-scroll'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
  }).replace(/\n{2,}/g, '\n').replace(/<p>\s*(<br\s*\/?>\s*)+/g, '<p>').replace(/(<br\s*\/?>\s*)+<\/p>/g, '</p>')
    // A link around nothing but spaces has no anchor text; keep the space, drop the link.
    .replace(/<a\s[^>]*>(\s*)<\/a>/g, '$1');

  return { html: clean, toc, faq, paragraphs, firstImage: firstImage.attr('src'), firstImageAlt: firstImage.attr('alt'), words, author, rating };
}

/** Visitor votes from a kk Star Ratings payload; pages nobody voted on carry no rating. */
function parseRating(payload: string | undefined): LegacyRating | undefined {
  if (!payload) return undefined;
  try {
    const data = JSON.parse(payload) as { title?: string; score?: string; best?: string; count?: string };
    const score = Number(data.score); const best = Number(data.best) || 5; const count = Number(data.count);
    if (!data.title || !(count > 0) || !(score > 0) || score > best) return undefined;
    return { name: decodeEntities(data.title).trim(), score, best, count };
  } catch { return undefined; }
}

/** Rating markup of live pages whose exported content has no widget (scripts/scrape-wp-extras.ts). */
const liveRatingsFile = 'src/legacy-content/live-ratings.json';
const liveRatings = existsSync(join(root, liveRatingsFile)) ? read<Record<string, LegacyRating>>(liveRatingsFile) : {};

// ---------- comments ----------
const commentsFile = 'src/legacy-content/comments.json';
const wpComments = existsSync(join(root, commentsFile)) ? read<LegacyComment[]>(commentsFile) : [];

/** Comment body as plain-text paragraphs (line breaks kept); links and markup are dropped. */
function commentParagraphs(html: string): string[] {
  const $ = cheerio.load(html, null, false);
  $('br').replaceWith('\n');
  const blocks = $('p').length ? $('p').toArray().map((p) => $(p).text()) : [$.root().text()];
  return blocks
    .map((block) => block.split('\n').map((line) => line.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n'))
    .filter(Boolean);
}

/** A post's comments as threads: newest thread first, replies oldest first (the live WordPress order). */
function commentThreads(postId: number): { threads: CommentThread[]; count: number } {
  const own = wpComments.filter((comment) => comment.post === postId);
  const ids = new Set(own.map((comment) => comment.id));
  const byDate = (a: LegacyComment, b: LegacyComment) => a.date.localeCompare(b.date) || a.id - b.id;
  const thread = (comment: LegacyComment): CommentThread => ({
    id: comment.id,
    author: decodeEntities(comment.author).trim() || 'Khách',
    date: wpDate(comment.date)!,
    paragraphs: commentParagraphs(comment.html),
    replies: own.filter((reply) => reply.parent === comment.id).sort(byDate).map(thread),
  });
  const threads = own.filter((comment) => !ids.has(comment.parent)).sort((a, b) => byDate(b, a)).map(thread);
  return { threads, count: own.length };
}

/** An upload's path without host, extension or WordPress size suffix: ".../2018/08/xe-tai-1030x710.jpg" → "/wp-content/uploads/2018/08/xe-tai". */
const uploadStem = (src: string) => src.replace(/[?#].*$/, '').replace(/^https?:\/\/[^/]+/, '').replace(/\.[a-z0-9]+$/i, '').replace(/-\d+x\d+$/, '').replace(/-scaled$/, '');

/** The alt the article gives the hero image when the same upload (any size) also appears in the body. */
function bodyAltFor(html: string, image: string): string | undefined {
  const stem = uploadStem(image);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
    const src = tag.match(/\ssrc="([^"]+)"/i)?.[1];
    const alt = tag.match(/\salt="([^"]*)"/i)?.[1]?.trim();
    if (src && alt && uploadStem(src) === stem) return decodeEntities(alt);
  }
  return undefined;
}

function extractFacts(texts: string[]) {
  const joined = texts.join(' ');
  const transit = joined.match(/(?:trong|chỉ|mất|từ)\s+(\d+\s*(?:[-–]\s*\d+\s*)?(?:h|giờ|tiếng|ngày))\b/i)?.[1]?.replace(/\s+/g, ' ');
  const priceFrom = joined.match(/từ\s+([\d.,]+\s*(?:đ|vnđ|đồng)\s*\/\s*(?:kg|m3|m³|khối|chuyến))/i)?.[1]?.replace(/\s+/g, '');
  return { transit, priceFrom };
}

/** Pages whose legacy body is not rendered (home, contact, retired) or that should stay neutral (policies) get no contextual links. */
function contextualLinkLimit(path: string, template: LegacyTemplate): number {
  if (template === 'home' || template === 'policy' || path === '/lien-he' || path === '/home-3') return 0;
  return template === 'post' ? CONTEXTUAL_LINK_LIMITS.post : CONTEXTUAL_LINK_LIMITS.page;
}

function build(item: WpItem, kind: 'page' | 'post'): LegacyEntry {
  const path = pathOf(item.link);
  const override = SEO_OVERRIDES[path] ?? {};
  const title = override.heading ?? decodeEntities(item.title.rendered).replace(/\s+/g, ' ').trim();
  const template = templateOf(path, kind);
  const update = ARTICLE_UPDATES[path];
  const original = transform(item.content.rendered, title, path, contextualLinkLimit(path, template));
  const { html, toc, faq, paragraphs, firstImage, firstImageAlt, words } = update ? transform(readFileSync(join(root, update.file), 'utf8'), title, path, contextualLinkLimit(path, template)) : original;
  const { author, rating } = original;
  const comments = commentThreads(item.id);
  const seo = seoMeta[path] ?? {};
  const seoDescription = seo.description ? decodeEntities(seo.description) : undefined;
  const summarySource = paragraphs[0] ?? title;
  const summary = summarySource.length > 200 ? `${summarySource.slice(0, 197).replace(/\s+\S*$/, '')}…` : summarySource;
  const label = navLabel.get(path) ?? (title.replace(/^(Vận chuyển gửi hàng hóa đi|Vận chuyển gửi hàng hóa|Vận chuyển hàng hóa đi|Vận chuyển hàng hóa|Chành xe gửi hàng đi|Chành xe|Cho thuê xe tải|Thuê xe tải)\s*/i, '').trim() || title);
  const image = localUpload(seo.ogImage) ?? firstImage ?? undefined;
  return {
    id: item.id, kind, path, slug: item.slug, template, title, label,
    region: navRegion.get(path),
    html, toc, faq, summary,
    image, imageAlt: (image === firstImage ? firstImageAlt : image && bodyAltFor(html, image)) || title,
    facts: extractFacts([seoDescription ?? '']),
    date: wpDate(item.date), modified: wpDate(update?.modified ?? item.modified),
    readingMinutes: Math.max(1, Math.round(words / 220)),
    // Route facts keep coming from the Rank Math description; only the served title and description change.
    seo: { title: override.title ?? (seo.title ? decodeEntities(seo.title) : undefined), description: override.description ?? seoDescription, robots: seo.robots },
    ...(author ? { author } : {}),
    ...(rating ?? liveRatings[path] ? { rating: rating ?? liveRatings[path] } : {}),
    ...(comments.count ? { comments: comments.threads, commentCount: comments.count } : {}),
  };
}

async function main() {
  const entries = [...pages.map((p) => build(p, 'page')), ...posts.map((p) => build(p, 'post'))].sort((a, b) => a.path.localeCompare(b.path));
  const unappliedClaimEdits = CLAIM_EDITS.filter((edit) => !appliedClaimEdits.has(edit));
  if (unappliedClaimEdits.length) throw new Error(`claim edits matching no page text:\n${unappliedClaimEdits.map((edit) => `  ${edit.sentence}`).join('\n')}`);

  // Article images: intrinsic size + responsive WebP srcset (static files in public/_img).
  const started = Date.now();
  const images = await buildArticleImages(entries.flatMap((entry) => [...entry.html.matchAll(/<img [^>]*?src="([^"]+)"/g)].map((match) => match[1])), root);
  for (const entry of entries) entry.html = applyArticleImages(entry.html, images);

  writeFileSync(join(root, 'src/legacy-content/legacy-clean.json'), `${JSON.stringify(entries)}\n`);
  // Tiny WordPress id -> canonical path map for ?p= / ?page_id= / ?attachment_id= redirects in the proxy (keeps the corpus
  // out of the proxy bundle). Attachments go to their parent page, as Rank Math redirected them; orphans to the home page.
  const idMap: Record<string, string> = Object.fromEntries(entries.map((entry) => [entry.id, entry.path === '/home-3' ? '/' : entry.path]));
  const attachmentsFile = 'src/legacy-content/attachments.json';
  const attachments = existsSync(join(root, attachmentsFile)) ? read<Record<string, number>>(attachmentsFile) : {};
  for (const [id, parent] of Object.entries(attachments)) idMap[id] ??= idMap[parent] ?? '/';
  writeFileSync(join(root, 'src/legacy-content/id-map.json'), `${JSON.stringify(idMap)}\n`);
  // Markdown bodies for the /<path>.md twins and llms-full.txt (kept out of the page bundles).
  writeFileSync(join(root, 'src/legacy-content/legacy-markdown.json'), `${JSON.stringify(Object.fromEntries(entries.map((entry) => [entry.path, htmlToMarkdown(entry.html)])))}\n`);

  const bytes = entries.reduce((sum, e) => sum + e.html.length, 0);
  const byTemplate = entries.reduce<Record<string, number>>((acc, e) => { acc[e.template] = (acc[e.template] ?? 0) + 1; return acc; }, {});
  console.log(`legacy-clean.json: ${entries.length} entries, ${(bytes / 1024 / 1024).toFixed(2)} MB html`, byTemplate);
  console.log(`with FAQ: ${entries.filter((e) => e.faq.length >= 2).length}, with image: ${entries.filter((e) => e.image).length}, with seo desc: ${entries.filter((e) => e.seo.description).length}`);
  console.log(`article images: ${images.size} sized, ${[...images.values()].filter((image) => image.srcset).length} with srcset (${((Date.now() - started) / 1000).toFixed(1)}s)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
