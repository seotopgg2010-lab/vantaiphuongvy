import assert from 'node:assert/strict';
import test from 'node:test';
import { getLegacyByPath, legacyPosts } from '../src/lib/legacy-content';
import { renderTwin } from '../src/lib/markdown-twins';
import { getSiteUrl } from '../src/lib/site';
import { generateLegacyJsonLd, generateOrganizationJsonLd, ORGANIZATION_ID } from '../src/lib/seo';

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
