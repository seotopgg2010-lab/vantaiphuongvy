import assert from 'node:assert/strict';
import test from 'node:test';
import { getLegacyByPath, legacyItems, legacyPosts } from '../src/lib/legacy-content';
import { crumbsToJsonLd, legacyCrumbs } from '../src/lib/breadcrumbs';
import { PRESS } from '../src/lib/marketing';
import { WAREHOUSES } from '../src/lib/warehouses';
import { renderTwin } from '../src/lib/markdown-twins';
import { getSiteUrl } from '../src/lib/site';
import { FOUNDER, generateLegacyJsonLd, generateOrganizationJsonLd, generateWebSiteJsonLd, ORGANIZATION_ID, personId, WEBSITE_ID } from '../src/lib/seo';

const site = getSiteUrl();

function canonicalFor(path: string) {
  return `${site}${path === '/' ? '/' : `${path}/`}`;
}

test('canonical URL contract preserves the domain and WordPress trailing slash', () => {
  for (const path of ['/', '/gioi-thieu', '/lien-he', '/van-chuyen-hang-hoa', '/thue-xe-tai', '/faq']) {
    const canonical = canonicalFor(path);
    assert.ok(canonical.startsWith('https://vantaiphuongvy.com/'));
    assert.ok(canonical.endsWith('/'));
    assert.equal(canonical.includes('/en/'), false);
  }
});

test('organization schema contains verified business identity and all hotlines', () => {
  const schema = generateOrganizationJsonLd();
  assert.ok(Array.isArray(schema['@type']));
  assert.equal(schema.name, 'Công ty TNHH Dịch vụ Vận tải Phương Vy');
  assert.equal(schema.url, canonicalFor('/'));
  assert.equal(schema.telephone, '+84-933-871-139');
  assert.equal(schema.email, 'vanchuyenphuongvy@gmail.com');
});

test('blog post corpus exposes fields required for BlogPosting schema', () => {
  const post = legacyPosts[0];
  assert.ok(post, 'expected at least one legacy post');
  assert.equal(getLegacyByPath(post.path)?.kind, 'post');
  assert.ok(post.title.length > 0);
  assert.ok(post.date);
});

test('guides credit their named author as a Person working for the company', () => {
  for (const post of legacyPosts) {
    const article = generateLegacyJsonLd(post, []).find((block) => (block as { '@type'?: string })['@type'] === 'BlogPosting') as { author: { '@type': string; name: string; worksFor: { '@id': string } } };
    assert.equal(article.author['@type'], 'Person', post.path);
    assert.equal(article.author.name, post.author?.name, post.path);
    assert.equal(article.author.worksFor['@id'], ORGANIZATION_ID, post.path);
    assert.ok(renderTwin(post.path)?.includes(`- Tác giả: ${post.author?.name}`), `${post.path}: twin names the author`);
  }
});

test('organization schema carries the identity, founder, locations and press the site shows', () => {
  const schema = generateOrganizationJsonLd();
  assert.equal(schema.legalName, 'Công ty TNHH Dịch vụ Vận tải Phương Vy');
  assert.equal(schema.identifier.value, schema.taxID);
  assert.equal(schema.founder['@id'], personId(FOUNDER.name));
  const places = schema.location.map((place) => place.address.streetAddress);
  for (const warehouse of WAREHOUSES) assert.ok(places.includes(warehouse.address), warehouse.label);
  assert.deepEqual(schema.subjectOf.map((article) => article.url), PRESS.map((item) => item.href));
});

test('founder role and training come from the author box on the guides', () => {
  const bios = legacyPosts.filter((post) => post.author?.name === FOUNDER.name).map((post) => post.author?.bio?.toLowerCase() ?? '');
  assert.ok(bios.length > 0);
  for (const bio of bios) {
    assert.ok(bio.includes('ceo & founder'), 'bio names the CEO & founder role');
    assert.ok(bio.includes('giao thông vận tải tp.hcm'), 'bio names the university');
  }
});

/** Every `{ "@id": … }` reference inside a value, skipping the node's own id. */
function references(value: unknown, refs: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((entry) => references(entry, refs));
  else if (value && typeof value === 'object') {
    const node = value as Record<string, unknown>;
    if (typeof node['@id'] === 'string' && Object.keys(node).length === 1) refs.push(node['@id']);
    else Object.values(node).forEach((entry) => references(entry, refs));
  }
  return refs;
}

function definedIds(value: unknown, ids = new Set<string>()): Set<string> {
  if (Array.isArray(value)) value.forEach((entry) => definedIds(entry, ids));
  else if (value && typeof value === 'object') {
    const node = value as Record<string, unknown>;
    if (typeof node['@id'] === 'string' && Object.keys(node).length > 1) ids.add(node['@id']);
    Object.values(node).forEach((entry) => definedIds(entry, ids));
  }
  return ids;
}

test('every page graph links WebPage, breadcrumb and main entity, with no dangling @id', () => {
  const sitewide = [generateWebSiteJsonLd(), generateOrganizationJsonLd()];
  for (const item of legacyItems) {
    const crumbs = item.path === '/' ? [] : crumbsToJsonLd(legacyCrumbs(item), item.path);
    const blocks = generateLegacyJsonLd(item, crumbs) as Array<Record<string, unknown>>;
    const ids = definedIds([...sitewide, ...blocks]);
    for (const ref of references(blocks)) assert.ok(ids.has(ref), `${item.path}: ${ref} is defined`);
    const page = blocks.find((block) => String(block['@id']).endsWith('#webpage'));
    assert.ok(page, `${item.path}: has a WebPage node`);
    assert.deepEqual(page.isPartOf, { '@id': WEBSITE_ID }, item.path);
    if (item.path !== '/') assert.ok(page.breadcrumb, `${item.path}: WebPage points at its breadcrumb`);
    if (item.kind === 'post') assert.ok(String((page.mainEntity as { '@id': string })['@id']).endsWith('#article'), item.path);
  }
});

test('air and sea freight pages are not labelled as road transport', () => {
  for (const [path, type] of [['/van-chuyen-hang-hoa/duong-bien', 'đường biển'], ['/van-chuyen-hang-hoa/duong-hang-khong', 'đường hàng không']]) {
    const item = getLegacyByPath(path);
    assert.ok(item, path);
    const service = generateLegacyJsonLd(item, []).find((block) => (block as { '@type'?: string })['@type'] === 'Service') as { serviceType: string };
    assert.ok(service.serviceType.includes(type), path);
  }
});

test('city truck pages name the city they serve', () => {
  for (const [path, city] of [['/thue-xe-tai/da-nang', 'Đà Nẵng'], ['/thue-xe-tai/ha-noi', 'Hà Nội'], ['/thue-xe-tai/hcm', 'TP.HCM']]) {
    const item = getLegacyByPath(path);
    assert.ok(item, path);
    const service = generateLegacyJsonLd(item, []).find((block) => (block as { '@type'?: string })['@type'] === 'Service') as { areaServed: Array<{ name: string }> };
    assert.equal(service.areaServed[1].name, city, path);
  }
});
