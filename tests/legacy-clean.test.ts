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
    ['author box residue', /Về Tác giả|Chủ đề cùng Tác giả|<p>Xem thêm<\/p>/],
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

test('article images keep their upload URL, carry their size and offer right-sized WebP variants', () => {
  // The variants are git-ignored build output of the content pipeline (also run by predev/prebuild).
  assert.ok(existsSync(join(process.cwd(), 'public/_img')), 'public/_img is missing: run `npm run content:build` first');
  for (const item of legacyItems) {
    for (const [tag] of item.html.matchAll(/<img [^>]*>/g)) {
      const src = tag.match(/\ssrc="([^"]+)"/)?.[1] ?? '';
      assert.ok(src.startsWith('/wp-content/uploads/'), `${item.path}: ${src}`);
      const width = Number(tag.match(/\swidth="(\d+)"/)?.[1]);
      assert.ok(width > 0 && Number(tag.match(/\sheight="(\d+)"/)?.[1]) > 0, `${item.path}: ${src} has no intrinsic size`);
      const srcset = tag.match(/\ssrcset="([^"]+)"/)?.[1];
      if (!/\.(jpe?g|png|webp)$/i.test(src) || width <= 480) continue;
      assert.ok(srcset && /\ssizes="/.test(tag), `${item.path}: ${src} has no srcset/sizes`);
      const candidates = srcset.split(', ').map((candidate) => candidate.split(' ')[0]);
      assert.ok(candidates.length >= 2, `${item.path}: ${src} has one candidate`);
      for (const candidate of candidates) {
        assert.match(candidate, /^\/_img\/.+-\d+\.[0-9a-f]{8}\.webp$/, `${item.path}: ${candidate}`);
        assert.ok(existsSync(join(process.cwd(), 'public', decodeURI(candidate))), `missing ${candidate}: run \`npm run content:build\``);
      }
    }
  }
});

test('line breaks keep the author\'s lines but never split a sentence', () => {
  const hub = legacyItems.find((item) => item.path === '/van-chuyen-hang-hoa')!;
  assert.match(hub.html, /NINH BÌNH<br \/>\s*NAM ĐỊNH/, 'price table lists one province per line');
  for (const item of legacyItems) {
    assert.doesNotMatch(item.html, /[\p{Ll}\p{N},]<br \/>\s*\p{Ll}/u, `${item.path}: a sentence is split by a line break`);
  }
});

test('question paragraphs became headings and split lists keep their numbering', () => {
  for (const item of legacyItems) {
    assert.doesNotMatch(item.html, /<p>\s*<(strong|b)>[^<]{12,160}\?\s*<\/\1>\s*<\/p>/, `${item.path}: bold question paragraph`);
  }
  const papers = legacyItems.find((item) => item.path === '/blog/giay-to-van-chuyen-hang-hoa')!;
  assert.ok((papers.html.match(/<h2 /g) ?? []).length >= 2, 'papers guide has section headings');
  assert.ok((papers.html.match(/<ol start="\d+">/g) ?? []).length >= 3, 'papers guide keeps list numbering');
  assert.ok(legacyItems.filter((item) => item.kind === 'post').every((post) => post.author?.name), 'every guide names its author');
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

test('article headings form a clean outline under the page H1', () => {
  const comparable = (value: string) => value.toLocaleLowerCase('vi').replace(/[^\p{L}\p{N}]+/gu, '');
  for (const item of publicItems) {
    const headings = [...item.html.matchAll(/<h([2-4]) id="[^"]+">([^<]*)<\/h\1>/g)].map((match) => ({ level: Number(match[1]), text: match[2] }));
    let previous = 1;
    for (const heading of headings) {
      assert.ok(heading.level <= previous + 1, `${item.path}: h${previous} → h${heading.level} "${heading.text}"`);
      previous = heading.level;
      const letters = heading.text.replace(/[^\p{L}]/gu, '');
      assert.ok(letters.length < 6 || letters !== letters.toLocaleUpperCase('vi'), `${item.path}: ALL-CAPS heading "${heading.text}"`);
    }
    if (headings[0] && item.html.trimStart().startsWith('<h')) {
      assert.notEqual(comparable(headings[0].text), comparable(item.title), `${item.path}: opening heading repeats the H1`);
    }
  }
});
