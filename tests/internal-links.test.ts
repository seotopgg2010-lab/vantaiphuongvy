import assert from 'node:assert/strict';
import test from 'node:test';
import { cargoItems, legacyItems, legacyPosts, relatedPosts, relatedRoutes, relatedServices, routeItems, RETIRED_PATHS, truckItems } from '../src/lib/legacy-content';
import { heroContent } from '../src/lib/legacy-render';
import { HERO_LEADS } from '../src/lib/marketing';
import { renderTwin } from '../src/lib/markdown-twins';

const publicItems = legacyItems.filter((item) => item.path !== '/' && !RETIRED_PATHS.has(item.path));

/** How many other pages list `path` in the given related-links block. */
function inlinks(lists: Array<{ from: string; items: Array<{ path: string }> }>) {
  const counts = new Map<string, number>();
  for (const { from, items } of lists) for (const item of items) if (item.path !== from) counts.set(item.path, (counts.get(item.path) ?? 0) + 1);
  return counts;
}

test('related routes never link the page itself and stay within the limit', () => {
  for (const item of [...routeItems, ...cargoItems]) {
    const related = relatedRoutes(item);
    assert.ok(related.length > 0 && related.length <= 8, item.path);
    assert.equal(related.some((entry) => entry.path === item.path), false, item.path);
    assert.equal(new Set(related.map((entry) => entry.path)).size, related.length, `${item.path}: duplicates`);
  }
});

test('every route and cargo page is linked from at least five sibling pages (all siblings in small groups)', () => {
  const all = [...routeItems, ...cargoItems];
  const counts = inlinks(all.map((item) => ({ from: item.path, items: relatedRoutes(item) })));
  for (const item of all) {
    const group = all.filter((entry) => entry.region === item.region).length;
    assert.ok((counts.get(item.path) ?? 0) >= Math.min(5, group - 1), `${item.path}: ${counts.get(item.path) ?? 0} inlinks`);
  }
});

test('cargo pages link the other cargo services first', () => {
  for (const item of cargoItems) {
    const others = cargoItems.filter((entry) => entry.path !== item.path).map((entry) => entry.path);
    assert.deepEqual(relatedRoutes(item).slice(0, others.length).map((entry) => entry.path), others);
  }
});

test('related guides follow the page topic and spread across every guide', () => {
  const truck = truckItems[0];
  assert.ok(relatedPosts(truck).some((post) => post.path === '/blog/kich-thuoc-thung-xe-tai-trong-van-tai-hang-hoa'), 'truck page → truck body sizes guide');
  assert.ok(relatedPosts(legacyItems.find((item) => item.path === '/van-chuyen-hang-hoa/dau-nhot')!).some((post) => /nguy-hiem/.test(post.path)), 'oil page → dangerous goods guide');
  const counts = inlinks(publicItems.map((item) => ({ from: item.path, items: relatedPosts(item) })));
  for (const post of legacyPosts) assert.ok((counts.get(post.path) ?? 0) >= 3, `${post.path}: ${counts.get(post.path) ?? 0} inlinks`);
});

test('every guide links at least three service pages', () => {
  for (const post of legacyPosts) {
    const services = relatedServices(post);
    assert.ok(services.length >= 3, post.path);
    assert.ok(services.every((entry) => entry.kind === 'page'), post.path);
  }
});

test('curated hero leads are short, concrete and lead the markdown twin too', () => {
  for (const [path, lead] of Object.entries(HERO_LEADS)) {
    const item = legacyItems.find((entry) => entry.path === path);
    assert.ok(item, `${path} is not in the corpus`);
    assert.ok(lead.length >= 80 && lead.length <= 280, `${path}: ${lead.length} chars`);
    assert.equal(/SỐ 1|SIÊU RẺ|24\/7|24\/24/i.test(lead), false, `${path}: ad claim`);
    // Uppercase runs are acronyms only (TP.HCM, CBM, GTGT, TEU, ETA, IATA, QCVN), never shouting.
    for (const word of lead.match(/\p{Lu}{4,}/gu) ?? []) assert.ok(['GTGT', 'GTVT', 'BGTVT', 'IATA', 'QCVN'].includes(word), `${path}: ${word}`);
    const { lead: shown, body } = heroContent(item);
    assert.equal(shown, lead);
    assert.equal(body, item.html, `${path}: the original opening must stay in the body`);
    assert.ok(renderTwin(path)?.includes(lead), `${path}: twin is missing the lead`);
  }
});

const bodyLinks = (html: string) => [...html.matchAll(/<a href="(\/[^"#?]*)[^"]*">/g)].map((match) => match[1]).filter((href) => !href.startsWith('/wp-content/'));
const knownPages = new Set(legacyItems.map((item) => (item.path === '/' ? '/' : `${item.path}/`)).concat('/blog/'));

test('article links point at real pages, never at the page itself or from inside a heading', () => {
  for (const item of publicItems) {
    for (const href of bodyLinks(item.html)) {
      assert.notEqual(href, `${item.path}/`, `${item.path}: links to itself`);
      assert.ok(knownPages.has(href), `${item.path}: unknown page ${href}`);
    }
    assert.doesNotMatch(item.html, /<h[2-4][^>]*>[^<]*<a /, `${item.path}: link inside a heading`);
  }
});

test('guides and service pages link to each other inside the article text', () => {
  const services = new Set([...routeItems, ...cargoItems, ...truckItems].map((item) => `${item.path}/`).concat('/van-chuyen-hang-hoa/', '/thue-xe-tai/'));
  // Three guides have no phrase that naturally leads to a service page (truck-ban rules,
  // licence-plate feng shui, the 2021 green-lane notice); forcing one would read as spam.
  const offTopic = new Set(['/blog/bien-bao-cam-xe-tai-va-muc-phat', '/blog/dich-y-nghia-bien-so-xe-theo-phong-thuy-khoa-hoc', '/blog/van-tai-phuong-vy-duoc-uu-tien-hoat-dong-tren-luong-xanh']);
  for (const post of legacyPosts.filter((entry) => !offTopic.has(entry.path))) {
    assert.ok(bodyLinks(post.html).some((href) => services.has(href)), `${post.path}: no link to a service page`);
  }
  const servicePages = [...routeItems, ...cargoItems, ...truckItems];
  const linked = servicePages.filter((item) => bodyLinks(item.html).length > 0).length;
  assert.ok(linked >= 50, `${linked}/${servicePages.length} service pages link from their article text`);
  // The truck-size guide is the natural next read from pages that list truck types.
  const guide = '/blog/kich-thuoc-thung-xe-tai-trong-van-tai-hang-hoa/';
  assert.ok(publicItems.filter((item) => bodyLinks(item.html).includes(guide)).length >= 5, 'truck-size guide is linked from at least five articles');
});
