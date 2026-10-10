import assert from 'node:assert/strict';
import test from 'node:test';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import { getSiteUrl } from '../src/lib/site';
import { legacyItems } from '../src/lib/legacy-content';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

test('sitemap contains public legacy corpus with canonical trailing slashes', () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.includes(`${getSiteUrl()}/blog/`));
  for (const item of legacyItems.filter((item) => item.path !== '/home-3')) {
    const suffix = item.path === '/' ? '/' : `${item.path}/`;
    assert.ok(urls.includes(`${getSiteUrl()}${suffix}`), item.path);
  }
  for (const forbidden of ['/home-3/', '/en/', '/bang-hieu/', '/du-an/', '/admin/']) {
    assert.equal(urls.some((url) => url.endsWith(forbidden)), false, forbidden);
  }
});

test('robots protects internal and unsupported locale paths', () => {
  const result = robots();
  const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
  assert.ok(Array.isArray(rule.disallow));
  assert.ok(rule.disallow.includes('/admin/'));
  assert.equal(rule.disallow.includes('/en/'), false, 'retired /en/ URLs must be crawlable to see their 404');
  assert.equal(result.sitemap, `${getSiteUrl()}/sitemap.xml`);
});

test('sitemap lists the photos each page shows as absolute upload URLs', () => {
  const entries = sitemap();
  const images = entries.flatMap((entry) => entry.images ?? []);
  assert.ok(images.length >= 300, `${images.length} image entries`);
  for (const entry of entries) {
    assert.ok((entry.images ?? []).length <= 1000, entry.url);
    assert.equal(new Set(entry.images).size, (entry.images ?? []).length, `${entry.url}: duplicate images`);
  }
  for (const image of images) {
    assert.ok(image.startsWith(`${getSiteUrl()}/wp-content/uploads/`), image);
    assert.ok(existsSync(join(process.cwd(), 'public', new URL(image).pathname)), `missing ${image}`);
  }
});
