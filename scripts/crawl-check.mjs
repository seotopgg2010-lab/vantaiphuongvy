#!/usr/bin/env node
/**
 * Full-site crawl check against a running server (dev, `next start`, or production).
 *   node scripts/crawl-check.mjs http://localhost:3000
 *
 * For every URL in /sitemap.xml it verifies: HTTP 200 without redirects, exactly one <h1>,
 * a self-referencing canonical with trailing slash, a <title> and meta description,
 * parseable JSON-LD, and that every internal <a href> and <img src> on the page resolves.
 * It also checks the WordPress redirect / 410 contract.
 */
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/+$/, '');
const site = 'https://vantaiphuongvy.com';
const problems = [];
const checkedTargets = new Map();

async function head(url) {
  if (checkedTargets.has(url)) return checkedTargets.get(url);
  const promise = fetch(url, { redirect: 'manual' }).then((res) => res.status).catch(() => 0);
  checkedTargets.set(url, promise);
  return promise;
}

function toLocal(href) {
  if (href.startsWith(site)) return href.slice(site.length) || '/';
  return href;
}

const sitemapXml = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => toLocal(match[1]));
console.log(`Crawling ${urls.length} sitemap URLs on ${base}`);

let index = 0;
async function worker() {
  while (index < urls.length) {
    const path = urls[index++];
    const res = await fetch(base + path, { redirect: 'manual' });
    if (res.status !== 200) { problems.push(`${path}: status ${res.status}`); continue; }
    const html = await res.text();
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) problems.push(`${path}: ${h1} <h1>`);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (canonical !== `${site}${path}`) problems.push(`${path}: canonical ${canonical}`);
    if (!/<title>[^<]{10,}<\/title>/.test(html)) problems.push(`${path}: missing/short <title>`);
    if (!/<meta name="description" content="[^"]{30,}"/.test(html)) problems.push(`${path}: missing/short meta description`);
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(json); } catch { problems.push(`${path}: invalid JSON-LD`); }
    }
    const targets = new Set();
    for (const [, href] of html.matchAll(/<a [^>]*href="(\/[^"#?]*)/g)) targets.add(href);
    for (const [, src] of html.matchAll(/<img [^>]*src="(\/wp-content\/[^"]+)"/g)) targets.add(src.replace(/&amp;/g, '&'));
    for (const target of targets) {
      const status = await head(base + target);
      if (status !== 200) problems.push(`${path}: link ${target} -> ${status}`);
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

const contract = [
  ['/wp-login.php', 410], ['/xmlrpc.php', 410], ['/sitemap980.xml', 410],
  ['/home-3/', 308], ['/sitemap_index.xml', 308], ['/feed/', 308], ['/?p=1337', 301],
  ['/en/', 404], ['/khong-ton-tai/', 404], ['/robots.txt', 200], ['/sitemap.xml', 200],
  // dotted single-segment paths must not fall through to the home page (soft 404)
  ['/favicon.ico', 404], ['/ads.txt', 404], ['/foo.php', 404], ['/index.html', 404],
  // machine-readable surfaces
  ['/index.md', 200], ['/blog.md', 200], ['/van-chuyen-hang-hoa/ha-noi.md', 200], ['/khong-ton-tai.md', 404],
  ['/llms.txt', 200], ['/llms-full.txt', 200], ['/og/index.png', 200], ['/og/van-chuyen-hang-hoa/ha-noi.png', 200],
];
for (const [path, expected] of contract) {
  const status = await head(base + path);
  if (status !== expected) problems.push(`contract ${path}: expected ${expected}, got ${status}`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(`OK — ${urls.length} pages, ${checkedTargets.size} unique targets, redirect contract intact.`);
