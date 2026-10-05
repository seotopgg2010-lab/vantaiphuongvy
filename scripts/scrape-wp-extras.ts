/**
 * One-off (re-runnable while WordPress still serves vantaiphuongvy.com) snapshot of
 * the WordPress data that is not in the pages/posts export but is visible to search
 * engines today:
 *   - approved comments (rendered under their post on the rebuilt site), with readers' phone
 *     numbers and e-mail addresses masked
 *   - attachment → parent post ids (old "/?attachment_id=" links redirect to the parent)
 *   - every /wp-content/uploads file the live pages show (<img>, lightbox links,
 *     og:image), so scripts/mirror-uploads.ts keeps those image URLs alive
 *   - the star-rating markup each live page publishes, for pages whose exported
 *     content has no rating widget (the export's widget payload wins otherwise)
 *
 * Usage: npm run content:extras [-- --origin https://vantaiphuongvy.com], then npm run content:mirror
 * Output: src/legacy-content/comments.json, attachments.json, live-images.json, live-ratings.json
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as cheerio from 'cheerio';
import { maskContacts } from '../src/lib/contact-mask';
import type { LegacyComment, LegacyRating } from '../src/lib/legacy-types';

type WpItem = { link: string };
type WpComment = { id: number; post: number; parent: number; author_name: string; date: string; content: { rendered: string }; status: string; type: string };

const root = process.cwd();
const originArg = process.argv.indexOf('--origin');
const ORIGIN = originArg > -1 ? process.argv[originArg + 1] : 'https://vantaiphuongvy.com';
const HOSTS = new Set(['vantaiphuongvy.com', 'www.vantaiphuongvy.com']);
const MEDIA_EXT = /\.(jpe?g|png|gif|webp|avif|svg|pdf)$/i;
const HEADERS = { 'user-agent': 'Mozilla/5.0 (PhuongVy migration snapshot)' };
const read = <T,>(file: string): T => JSON.parse(readFileSync(join(root, file), 'utf8')) as T;
const write = (file: string, data: unknown) => writeFileSync(join(root, file), `${JSON.stringify(data, null, 1)}\n`);

/** GET from the WordPress origin, retried on network errors and non-200 answers; throws after the third try. */
async function get(path: string): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(`${ORIGIN}${path}`, { headers: HEADERS });
      if (response.status === 200) return response;
      throw new Error(`${response.status} ${path}`);
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
    }
  }
}

async function getJson<T>(path: string): Promise<{ data: T; totalPages: number }> {
  const response = await get(path);
  return { data: (await response.json()) as T, totalPages: Number(response.headers.get('x-wp-totalpages') || 1) };
}

/** Every page of a WordPress REST collection. */
async function collection<T>(endpoint: string): Promise<T[]> {
  const separator = endpoint.includes('?') ? '&' : '?';
  const first = await getJson<T[]>(`${endpoint}${separator}per_page=100&page=1`);
  const items = [...first.data];
  for (let page = 2; page <= first.totalPages; page++) items.push(...(await getJson<T[]>(`${endpoint}${separator}per_page=100&page=${page}`)).data);
  return items;
}

function uploadPath(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim().replace(/&#038;|&amp;/g, '&'), ORIGIN);
    if (!HOSTS.has(url.hostname) || !url.pathname.startsWith('/wp-content/uploads/') || !MEDIA_EXT.test(url.pathname)) return null;
    return decodeURIComponent(url.pathname);
  } catch { return null; }
}

/** A live page's star rating markup (kk Star Ratings' CreativeWorkSeries), if it has one. */
function liveRating($: cheerio.CheerioAPI): LegacyRating | undefined {
  for (const script of $('script[type="application/ld+json"]').toArray()) {
    try {
      const data = JSON.parse($(script).text()) as { '@type'?: string; name?: string; aggregateRating?: { ratingValue?: string; bestRating?: string; ratingCount?: string } };
      const rating = data['@type'] === 'CreativeWorkSeries' ? data.aggregateRating : undefined;
      if (rating && data.name && Number(rating.ratingCount) > 0) return { name: data.name, score: Number(rating.ratingValue), best: Number(rating.bestRating) || 5, count: Number(rating.ratingCount) };
    } catch { /* invalid JSON-LD on the live page */ }
  }
  return undefined;
}

/** Upload paths every live page shows, and the rating markup each page publishes. */
async function livePages(): Promise<{ images: string[]; ratings: Record<string, LegacyRating> }> {
  const paths = [...read<WpItem[]>('src/legacy-content/pages.json'), ...read<WpItem[]>('src/legacy-content/posts.json')].map((item) => new URL(item.link).pathname);
  const found = new Set<string>();
  const ratings: Record<string, LegacyRating> = {};
  let index = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (index < paths.length) {
      const path = paths[index++];
      const $ = cheerio.load(await (await get(path)).text());
      // After the DNS move this domain serves the Next.js build: refuse to snapshot it as WordPress.
      if (!$('link[href*="/wp-content/themes/"], script[src*="/wp-content/"], link[href*="/wp-includes/"]').length) throw new Error(`${ORIGIN}${path} is not served by WordPress`);
      const add = (raw: string | undefined) => { const path = uploadPath(raw); if (path) found.add(path); };
      $('img').each((_, img) => { add($(img).attr('src')); add($(img).attr('data-src')); add($(img).attr('data-lazy-src')); });
      $('a[href]').each((_, a) => add($(a).attr('href')));
      add($('meta[property="og:image"]').attr('content'));
      const rating = liveRating($);
      if (rating) ratings[path.replace(/\/+$/, '') || '/'] = rating;
    }
  }));
  return { images: [...found].sort(), ratings: Object.fromEntries(Object.entries(ratings).sort(([a], [b]) => a.localeCompare(b))) };
}

async function main() {
  // Everything is fetched first and written only when every request succeeded, so a failed or
  // partial run never replaces a good snapshot.
  const comments = (await collection<WpComment>('/wp-json/wp/v2/comments?_fields=id,post,parent,author_name,date,content,status,type&orderby=id&order=asc'))
    .filter((comment) => comment.status === 'approved' && comment.type === 'comment')
    .map<LegacyComment>((comment) => ({ id: comment.id, post: comment.post, parent: comment.parent, author: maskContacts(comment.author_name), date: comment.date, html: maskContacts(comment.content.rendered) }));
  const media = await collection<{ id: number; post: number | null }>('/wp-json/wp/v2/media?_fields=id,post&orderby=id&order=asc');
  const { images, ratings } = await livePages();

  write('src/legacy-content/comments.json', comments);
  write('src/legacy-content/attachments.json', Object.fromEntries(media.map((item) => [item.id, item.post ?? 0])));
  write('src/legacy-content/live-images.json', images);
  write('src/legacy-content/live-ratings.json', ratings);
  console.log(`comments: ${comments.length}, attachments: ${media.length}, live upload paths: ${images.length}, pages with rating markup: ${Object.keys(ratings).length}`);
}

main().catch((error) => {
  console.error(`Snapshot not written: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
