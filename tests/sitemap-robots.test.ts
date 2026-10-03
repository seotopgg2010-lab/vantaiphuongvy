import assert from 'node:assert/strict';
import test from 'node:test';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import { getSiteUrl } from '../src/lib/site';
import { legacyItems } from '../src/lib/legacy-content';

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
  assert.ok(rule.disallow.includes('/en/'));
  assert.equal(result.sitemap, `${getSiteUrl()}/sitemap.xml`);
});
