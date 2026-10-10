import assert from 'node:assert/strict';
import test from 'node:test';
import { CITY_TRUCK_PAGES, cargoItems, legacyItems, legacyPosts, relatedPosts, relatedRoutes, relatedServices, routeItems, RETIRED_PATHS, truckItems, truckRelatedRoutes } from '../src/lib/legacy-content';
import { crumbsToJsonLd, legacyCrumbs } from '../src/lib/breadcrumbs';
import { heroContent, heroSummary } from '../src/lib/legacy-render';
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

const byPath = (path: string) => legacyItems.find((item) => item.path === path)!;
const relatedPaths = (path: string) => relatedRoutes(byPath(path)).map((entry) => entry.path);

test('related routes are the nearest destinations, so neighbouring provinces link each other', () => {
  assert.ok(relatedPaths('/van-chuyen-hang-hoa/da-nang').includes('/van-chuyen-hang-hoa/quang-nam'));
  assert.ok(relatedPaths('/van-chuyen-hang-hoa/quang-nam').includes('/van-chuyen-hang-hoa/da-nang'));
  // Pages that serve the same place link each other.
  assert.ok(relatedPaths('/van-chuyen-hang-hoa/binh-thuan').includes('/van-chuyen-hang-hoa/phan-thiet'));
  assert.ok(relatedPaths('/van-chuyen-hang-hoa/phan-thiet').includes('/van-chuyen-hang-hoa/binh-thuan'));
  assert.ok(relatedPaths('/van-chuyen-hang-hoa/dak-lak').includes('/van-chuyen-hang-hoa/chanh-xe-chuyen-hang-di-buon-me-thuot'));
  assert.ok(relatedPaths('/van-chuyen-hang-hoa/ca-mau').includes('/van-chuyen-hang-hoa/bac-lieu'));
});

test('a city route and the truck rental page for the same city link each other first', () => {
  for (const [route, truck] of Object.entries(CITY_TRUCK_PAGES)) {
    assert.equal(relatedPaths(route)[0], truck, route);
    assert.equal(truckRelatedRoutes(byPath(truck))[0]?.path, route, truck);
  }
});

test('route trails name the region: Tây Nguyên as its page, other regions as a hub anchor kept out of JSON-LD', () => {
  const gialai = legacyCrumbs(byPath('/van-chuyen-hang-hoa/gia-lai'));
  assert.deepEqual(gialai.map((crumb) => crumb.href), ['/', '/van-chuyen-hang-hoa/', '/van-chuyen-hang-hoa/tay-nguyen/', undefined]);
  const danang = legacyCrumbs(byPath('/van-chuyen-hang-hoa/da-nang'));
  assert.equal(danang[2].href, '/van-chuyen-hang-hoa/#khu-vuc-trung');
  assert.deepEqual(crumbsToJsonLd(danang, '/van-chuyen-hang-hoa/da-nang').map((crumb) => crumb.name), ['Trang chủ', 'Vận chuyển hàng hóa', 'Đà Nẵng']);
  assert.equal(legacyCrumbs(byPath('/van-chuyen-hang-hoa/tay-nguyen')).length, 3, 'the region page has no crumb to itself');
  assert.equal(legacyCrumbs(byPath('/van-chuyen-hang-hoa/xe-may'))[2].href, '/van-chuyen-hang-hoa/#khu-vuc-loai-hang', 'cargo pages link their group on the hub');
  assert.equal(legacyCrumbs(byPath('/van-chuyen-hang-hoa/duong-bien'))[2].href, '/van-chuyen-hang-hoa/#khu-vuc-loai-hang', 'sea freight is a cargo service, not a destination');
});

test('the Tây Nguyên region page lists every route of the region first', () => {
  const members = routeItems.filter((item) => item.region === 'tay-nguyen' && item.path !== '/van-chuyen-hang-hoa/tay-nguyen').map((item) => item.path);
  assert.deepEqual(relatedPaths('/van-chuyen-hang-hoa/tay-nguyen').slice(0, members.length).sort(), [...members].sort());
});

test('hero intros not written for the hero carry no shouted words', () => {
  for (const item of [...routeItems, ...cargoItems, ...truckItems].filter((entry) => !HERO_LEADS[entry.path])) {
    const summary = heroSummary(item, heroContent(item).lead) ?? '';
    const shouted = summary.match(/\p{Lu}{4,}/gu)?.filter((word) => !['TPHCM', 'TNHH', 'GTGT'].includes(word)) ?? [];
    assert.deepEqual(shouted, [], item.path);
  }
});

test('Laos and Cambodia are listed on the domestic routes nearest to them', () => {
  for (const abroad of ['/van-chuyen-hang-hoa/lao', '/van-chuyen-hang-hoa/campuchia']) {
    const listedOn = routeItems.filter((item) => item.region !== 'quoc-te' && relatedPaths(item.path).includes(abroad));
    assert.ok(listedOn.length >= 3, `${abroad}: ${listedOn.length} domestic routes`);
  }
});

test('service pages show two on-topic guides at most', () => {
  for (const item of [...routeItems, ...cargoItems, ...truckItems]) assert.ok(relatedPosts(item, 2).length <= 2, item.path);
  const truckGuides = relatedPosts(truckItems[0], 2).map((post) => post.path);
  assert.equal(truckGuides.some((path) => /phong-thuy|luong-xanh|can-tim-doi-tac/.test(path)), false, 'no off-topic guides on truck pages');
});

test('the truck-ban guide links the route pages of the cities it covers', () => {
  const services = relatedServices(byPath('/blog/bien-bao-cam-xe-tai-va-muc-phat')).map((entry) => entry.path);
  assert.ok(services.includes('/van-chuyen-hang-hoa/tphcm') && services.includes('/van-chuyen-hang-hoa/ha-noi'));
});

test('article headings stay headings: no heading swallows a table, no empty links', () => {
  for (const item of legacyItems) {
    for (const [, text] of item.html.matchAll(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/g)) assert.ok(text.replace(/<[^>]+>/g, '').length <= 200, `${item.path}: heading of ${text.length} chars`);
    assert.equal(/<a\s[^>]*>\s*<\/a>/.test(item.html), false, `${item.path}: empty link`);
  }
});

test('article text runs down no competitors and promotes no overloading', () => {
  for (const item of legacyItems) {
    assert.equal(/Các công ty vận tải khác|chở quá tải cao nhất/.test(item.html), false, item.path);
  }
});
