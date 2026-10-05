import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import seoMeta from '../src/legacy-content/seo-meta.json';
import { legacyItems, RETIRED_PATHS } from '../src/lib/legacy-content';
import { legacyMetadata } from '../src/lib/seo';
import { splitLead } from '../src/lib/legacy-render';

const META = seoMeta as Record<string, { title?: string; description?: string }>;
const publicItems = legacyItems.filter((item) => !RETIRED_PATHS.has(item.path));

test('cleaned HTML carries no WordPress plugin/theme residue', () => {
  const forbidden: Array<[string, RegExp]> = [
    ['kk-star-ratings', /kk-?star|kksr/i],
    ['ez-toc widget', /ez-toc-container|ez-toc-title/i],
    ['Avia classes', /class="[^"]*\bavia/i],
    ['inline styles', /\sstyle="/i],
    ['http image', /<img[^>]+src="http:/i],
    ['remote upload image', /<img[^>]+src="https?:\/\/(www\.)?vantaiphuongvy\.com/i],
    ['gravatar', /gravatar\.com/i],
    ['double-escaped entity', /&amp;amp;/],
    ['slider controls', /href="\/?#(prev|next|\d)"/],
    ['scripts', /<script/i],
    ['Avia countdown timer', /\d+Weeks\d+Days\d+Hours/],
  ];
  for (const item of legacyItems) {
    for (const [label, pattern] of forbidden) assert.equal(pattern.test(item.html), false, `${label} in ${item.path}`);
  }
});

test('every image referenced by the corpus exists in public/', () => {
  const missing: string[] = [];
  for (const item of legacyItems) {
    const sources = [...item.html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]);
    if (item.image) sources.push(item.image);
    for (const src of sources) {
      const file = join(process.cwd(), 'public', decodeURI(src.split('?')[0]));
      if (!existsSync(file)) missing.push(`${item.path}: ${src}`);
    }
  }
  assert.deepEqual(missing, []);
});

test('internal links are relative and keep the trailing-slash contract', () => {
  for (const item of legacyItems) {
    for (const [, href] of item.html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
      assert.equal(/^https?:\/\/(www\.)?vantaiphuongvy\.com/i.test(href), false, `${item.path}: absolute internal link ${href}`);
      if (href.startsWith('/') && !href.startsWith('/wp-content/') && !href.includes('#') && !href.includes('?')) {
        assert.ok(href.endsWith('/'), `${item.path}: ${href} must end with /`);
      }
    }
  }
});

test('Rank Math titles and descriptions are preserved for every public URL', () => {
  for (const item of publicItems) {
    const live = META[item.path];
    if (!live) continue;
    const metadata = legacyMetadata(item);
    const title = typeof metadata.title === 'object' && metadata.title && 'absolute' in metadata.title ? metadata.title.absolute : metadata.title;
    if (live.title) assert.equal(title, live.title, `title ${item.path}`);
    if (live.description) assert.equal(metadata.description, live.description, `description ${item.path}`);
    assert.ok(String(metadata.alternates?.canonical).endsWith(item.path === '/' ? '/' : `${item.path}/`), `canonical ${item.path}`);
  }
});

test('lifting the intro into the hero never drops body content', () => {
  for (const item of publicItems) {
    const { lead, body } = splitLead(item);
    if (!lead) assert.equal(body, item.html.trimStart(), item.path);
    else {
      assert.ok(body.length < item.html.length, item.path);
      assert.ok(body.length > item.html.length * 0.5, `${item.path}: lifted too much`);
    }
  }
});
