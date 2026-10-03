/**
 * One-off (re-runnable) scraper: captures the Rank Math SEO metadata that the
 * live WordPress site serves for every immutable legacy URL, so the rebuilt
 * site keeps the exact titles/descriptions that currently rank.
 *
 * Usage: npx tsx scripts/scrape-seo-meta.ts [--origin https://vantaiphuongvy.com]
 * Output: src/legacy-content/seo-meta.json
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import * as cheerio from 'cheerio';

type WpItem = { link: string };
type SeoMeta = {
  title?: string;
  description?: string;
  ogImage?: string;
  robots?: string;
  canonical?: string;
  jsonLdTypes?: string[];
  status: number;
};

const root = process.cwd();
const originArg = process.argv.indexOf('--origin');
const ORIGIN = originArg > -1 ? process.argv[originArg + 1] : 'https://vantaiphuongvy.com';
const OUT = join(root, 'src/legacy-content/seo-meta.json');

const pages = JSON.parse(readFileSync(join(root, 'src/legacy-content/pages.json'), 'utf8')) as WpItem[];
const posts = JSON.parse(readFileSync(join(root, 'src/legacy-content/posts.json'), 'utf8')) as WpItem[];
const paths = [...pages, ...posts].map((item) => new URL(item.link).pathname.replace(/\/+$/, '') || '/');

const existing: Record<string, SeoMeta> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
const force = process.argv.includes('--force');

function collectTypes(node: unknown, out: Set<string>) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach((child) => collectTypes(child, out)); return; }
  const record = node as Record<string, unknown>;
  const type = record['@type'];
  if (typeof type === 'string') out.add(type);
  if (Array.isArray(type)) type.forEach((t) => typeof t === 'string' && out.add(t));
  Object.values(record).forEach((value) => collectTypes(value, out));
}

async function scrape(path: string): Promise<SeoMeta> {
  const url = `${ORIGIN}${path === '/' ? '/' : `${path}/`}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (PhuongVy migration audit)' }, redirect: 'follow' });
      const html = await response.text();
      const $ = cheerio.load(html);
      const types = new Set<string>();
      $('script[type="application/ld+json"]').each((_, el) => { try { collectTypes(JSON.parse($(el).text()), types); } catch { /* ignore */ } });
      const description = $('meta[name="description"]').toArray().map((el) => $(el).attr('content')?.trim()).find(Boolean);
      return {
        status: response.status,
        title: $('title').first().text().trim() || undefined,
        description: description || undefined,
        ogImage: $('meta[property="og:image"]').attr('content')?.trim() || undefined,
        robots: $('meta[name="robots"]').attr('content')?.trim() || undefined,
        canonical: $('link[rel="canonical"]').attr('href')?.trim() || undefined,
        jsonLdTypes: [...types].sort(),
      };
    } catch (error) {
      if (attempt === 3) { console.error(`FAIL ${url}`, error); return { status: 0 }; }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  return { status: 0 };
}

async function main() {
  const result: Record<string, SeoMeta> = { ...existing };
  const queue = paths.filter((path) => force || !existing[path] || existing[path].status !== 200);
  console.log(`Scraping ${queue.length}/${paths.length} URLs from ${ORIGIN}`);
  const CONCURRENCY = 4;
  let index = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (index < queue.length) {
      const path = queue[index++];
      result[path] = await scrape(path);
      console.log(`${result[path].status} ${path} — ${result[path].title ?? '(no title)'}`);
    }
  }));
  const sorted = Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(OUT, `${JSON.stringify(sorted, null, 2)}\n`);
  const missing = paths.filter((path) => !sorted[path]?.description);
  console.log(`Done. ${paths.length - missing.length}/${paths.length} have descriptions. Missing: ${missing.join(', ') || 'none'}`);
}

main();
