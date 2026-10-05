import assert from 'node:assert/strict';
import test from 'node:test';
import { indexablePaths } from '../src/lib/legacy-content';
import { markdownPathFor } from '../src/lib/markdown-paths';
import { LOCALE_REDIRECTS, PUBLIC_REWRITES } from '../src/lib/public-routing';
import { config } from '../src/proxy';

// The same path matcher Next.js compiles redirect, rewrite and proxy sources with.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { pathToRegexp, compile } = require('next/dist/compiled/path-to-regexp') as {
  pathToRegexp: (source: string, keys: Array<{ name: string | number }>) => RegExp;
  compile: (destination: string, options: { validate: boolean }) => (params: Record<string, string>) => string;
};

type Rule = { source: string; destination: string };

/** Apply rules like Next does: the first matching rule rewrites; with `chain`, later rules see the result. */
function apply(rules: Rule[], path: string, chain = false): string | null {
  let current: string | null = null;
  for (const rule of rules) {
    const keys: Array<{ name: string | number }> = [];
    const match = pathToRegexp(rule.source, keys).exec(current ?? path);
    if (!match) continue;
    const params = Object.fromEntries(keys.map((key, index) => [key.name, match[index + 1] ?? '']));
    current = compile(rule.destination, { validate: false })(params);
    if (!chain) return current;
  }
  return current;
}

const withSlash = (path: string) => (path === '/' ? '/' : `${path}/`);

test('every public page URL is served from the default-locale segment by a static rewrite', () => {
  for (const path of indexablePaths) {
    assert.equal(apply(PUBLIC_REWRITES.afterFiles, withSlash(path)), path === '/' ? '/vi' : `/vi${withSlash(path)}`, path);
  }
  assert.equal(apply(PUBLIC_REWRITES.afterFiles, '/tim-kiem/'), '/vi/tim-kiem/');
  // Unknown dotted paths still land in [lang], whose dynamicParams = false answers 404 (no soft 404).
  assert.equal(apply(PUBLIC_REWRITES.afterFiles, '/ads.txt'), '/vi/ads.txt');
  for (const internal of ['/og/index.png', '/og/van-chuyen-hang-hoa/ha-noi.png', '/md', '/md/blog', '/_next/static/chunks/a.js', '/vi/faq/']) {
    assert.equal(apply(PUBLIC_REWRITES.afterFiles, internal), null, internal);
  }
});

test('markdown twin URLs map to the /md route, which is not reachable directly', () => {
  for (const path of indexablePaths) {
    assert.equal(apply(PUBLIC_REWRITES.beforeFiles, markdownPathFor(path), true), path === '/' ? '/md' : `/md${path}`, path);
  }
  for (const other of ['/x.y.md', '/a/b.md/c', '/llms.txt', '/wp-content/uploads/a.jpg']) {
    assert.equal(apply(PUBLIC_REWRITES.beforeFiles, other, true), null, other);
  }
  // A direct /md request lands under [lang], which 404s.
  for (const direct of ['/md', '/md/blog', '/md/van-chuyen-hang-hoa/ha-noi/']) {
    assert.match(apply(PUBLIC_REWRITES.beforeFiles, direct, true) ?? '', /^\/vi\/md(\/|$)/, direct);
  }
});

test('the internal /vi prefix redirects permanently to the public URL', () => {
  assert.ok(LOCALE_REDIRECTS.every((rule) => rule.permanent));
  assert.equal(apply(LOCALE_REDIRECTS, '/vi'), '/');
  assert.equal(apply(LOCALE_REDIRECTS, '/vi/faq/'), '/faq/');
  assert.equal(apply(LOCALE_REDIRECTS, '/van-chuyen-hang-hoa/vinh-phuc/'), null);
});

test('the proxy matcher is an allowlist that ordinary page views never hit', () => {
  const paths = config.matcher.filter((entry): entry is string => typeof entry === 'string');
  const conditional = config.matcher.filter((entry) => typeof entry !== 'string');
  const hits = (path: string) => paths.some((source) => pathToRegexp(source, []).test(path));
  for (const page of ['/', '/van-chuyen-hang-hoa/da-nang/', '/blog/', '/faq/', '/van-chuyen-hang-hoa/da-nang.md', '/sitemap.xml', '/robots.txt', '/llms.txt', '/og/index.png']) {
    assert.equal(hits(page), false, page);
  }
  for (const proxied of ['/admin/', '/admin/login/', '/wp-login.php', '/xmlrpc.php', '/wp-admin/', '/wp-json/wp/v2/posts', '/sitemap980.xml']) {
    assert.equal(hits(proxied), true, proxied);
  }
  // Path-wide entries only apply under a condition: a WordPress query on "/" or an agent's markdown Accept header.
  for (const entry of conditional) {
    const has = entry.has ?? [];
    assert.ok(has.length > 0, entry.source);
    if (entry.source === '/') assert.ok(has.every((item) => item.type === 'query' && ['p', 'page_id', 'attachment_id', 's'].includes(item.key)), entry.source);
    else assert.deepEqual(has, [{ type: 'header', key: 'accept', value: '.*text/markdown.*' }]);
  }
});
