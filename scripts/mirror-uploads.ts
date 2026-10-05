/**
 * Mirrors every WordPress upload referenced by the site into
 * public/wp-content/uploads/** using the *identical* path, so image URLs stay
 * byte-for-byte the same after the domain is switched away from WordPress
 * (protects Google Images rankings, OG previews and inbound hotlinks).
 *
 * Usage: npx tsx scripts/mirror-uploads.ts [--origin https://vantaiphuongvy.com]
 * Sources: image/link URLs in the export, Rank Math og:images, the WordPress image sitemaps and
 * src/legacy-content/live-images.json (scripts/scrape-wp-extras.ts).
 * Output: public/wp-content/uploads/**, plans/.../reports/uploads-manifest.json
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const originArg = process.argv.indexOf('--origin');
const ORIGIN = originArg > -1 ? process.argv[originArg + 1] : 'https://vantaiphuongvy.com';
const HOSTS = new Set(['vantaiphuongvy.com', 'www.vantaiphuongvy.com']);
const MEDIA_EXT = /\.(jpe?g|png|gif|webp|avif|svg|pdf)$/i;
const REPORT = join(root, 'plans/261003-vantaiphuongvy-rebuild/reports/uploads-manifest.json');

function uploadPath(raw: string): string | null {
  try {
    const url = new URL(raw.replace(/&#038;|&amp;/g, '&'), ORIGIN);
    if (!HOSTS.has(url.hostname) || !url.pathname.startsWith('/wp-content/uploads/')) return null;
    if (!MEDIA_EXT.test(url.pathname)) return null;
    return decodeURIComponent(url.pathname);
  } catch { return null; }
}

function walk(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (/\.(tsx?|json|css)$/.test(name) && !full.includes('pages.json') && !full.includes('posts.json')) files.push(full);
  }
  return files;
}

function collect(): string[] {
  const found = new Set<string>();
  const add = (raw: string | undefined) => { const path = raw && uploadPath(raw); if (path) found.add(path); };
  for (const file of ['pages.json', 'posts.json']) {
    const items = JSON.parse(readFileSync(join(root, 'src/legacy-content', file), 'utf8')) as Array<{ content: { rendered: string } }>;
    for (const item of items) {
      const html = item.content.rendered;
      for (const match of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) add(match[1]);
      for (const match of html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)) add(match[1]);
    }
  }
  const seoFile = join(root, 'src/legacy-content/seo-meta.json');
  if (existsSync(seoFile)) for (const meta of Object.values(JSON.parse(readFileSync(seoFile, 'utf8')) as Record<string, { ogImage?: string }>)) add(meta.ogImage);
  // Images WordPress declared to search engines (Rank Math image sitemaps) and uploads the live
  // pages showed outside the exported content (featured images, theme, lightbox links): kept so
  // their URLs, which Google Images may have indexed, still answer 200 after the cutover.
  for (const file of ['page-sitemap.xml', 'post-sitemap.xml']) {
    for (const match of readFileSync(join(root, 'src/legacy-content', file), 'utf8').matchAll(/<image:loc>([^<]+)<\/image:loc>/g)) add(match[1]);
  }
  const liveFile = join(root, 'src/legacy-content/live-images.json');
  if (existsSync(liveFile)) for (const path of JSON.parse(readFileSync(liveFile, 'utf8')) as string[]) add(path);
  for (const file of walk(join(root, 'src'))) {
    for (const match of readFileSync(file, 'utf8').matchAll(/https?:\/\/(?:www\.)?vantaiphuongvy\.com\/wp-content\/uploads\/[^\s'"`)]+/g)) add(match[0]);
  }
  return [...found].sort();
}

async function download(path: string): Promise<{ path: string; status: number; bytes: number; skipped?: boolean }> {
  const target = join(root, 'public', path);
  if (existsSync(target) && statSync(target).size > 0) return { path, status: 200, bytes: statSync(target).size, skipped: true };
  const url = `${ORIGIN}${encodeURI(path)}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (PhuongVy migration mirror)' } });
      if (!response.ok) return { path, status: response.status, bytes: 0 };
      const buffer = Buffer.from(await response.arrayBuffer());
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, buffer);
      return { path, status: response.status, bytes: buffer.length };
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  return { path, status: 0, bytes: 0 };
}

async function main() {
  const paths = collect();
  console.log(`Mirroring ${paths.length} uploads from ${ORIGIN}`);
  const results: Awaited<ReturnType<typeof download>>[] = [];
  let index = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (index < paths.length) {
      const result = await download(paths[index++]);
      results.push(result);
      if (result.status !== 200) console.log(`  ${result.status} ${result.path}`);
    }
  }));
  results.sort((a, b) => a.path.localeCompare(b.path));
  const ok = results.filter((r) => r.status === 200);
  const failed = results.filter((r) => r.status !== 200);
  const totalMb = ok.reduce((sum, r) => sum + r.bytes, 0) / 1024 / 1024;
  mkdirSync(dirname(REPORT), { recursive: true });
  writeFileSync(REPORT, `${JSON.stringify({ origin: ORIGIN, total: results.length, ok: ok.length, failed: failed.map(({ path, status }) => ({ path, status })), totalMb: Number(totalMb.toFixed(1)) }, null, 2)}\n`);
  console.log(`Done: ${ok.length}/${results.length} ok, ${failed.length} failed, ${totalMb.toFixed(1)} MB`);
}

main();
