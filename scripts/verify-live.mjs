#!/usr/bin/env node
const base = (process.argv[2] || '').replace(/\/+$/, '');
if (!base) {
  console.error('Usage: node scripts/verify-live.mjs <base-url>');
  process.exit(2);
}

const paths = [
  ['/', 200], ['/blog/', 200], ['/van-chuyen-hang-hoa/', 200],
  ['/van-chuyen-hang-hoa/ha-noi/', 200], ['/thue-xe-tai/', 200],
  ['/gioi-thieu/', 200], ['/lien-he/', 200], ['/faq/', 200],
  ['/sitemap.xml', 200], ['/robots.txt', 200],
  ['/en', 404], ['/en/foo', 404], ['/bang-hieu', 404], ['/du-an', 404],
];

let failed = false;
for (const [path, expected] of paths) {
  const response = await fetch(`${base}${path}`, { redirect: 'manual' });
  const actual = response.status;
  const ok = actual === expected;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${actual} expected ${expected} ${path}`);
  if (!ok) failed = true;
}

process.exitCode = failed ? 1 : 0;
