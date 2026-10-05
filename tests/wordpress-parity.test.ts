import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import comments from '../src/legacy-content/comments.json';
import liveImages from '../src/legacy-content/live-images.json';
import liveRatings from '../src/legacy-content/live-ratings.json';
import { formatDateVi } from '../src/components/site/post-card';
import { EMAIL_PATTERN, PHONE_PATTERN } from '../src/lib/contact-mask';
import { getLegacyByPath, indexablePaths, legacyItems } from '../src/lib/legacy-content';
import { ratingScore } from '../src/lib/legacy-render';
import type { CommentThread, LegacyComment, LegacyRating } from '../src/lib/legacy-types';
import { renderLlmsFull, renderLlmsTxt, renderTwin } from '../src/lib/markdown-twins';
import { generateLegacyJsonLd } from '../src/lib/seo';
import { WAREHOUSES, warehousesFor } from '../src/lib/warehouses';

const root = process.cwd();
const read = (file: string) => readFileSync(join(root, file), 'utf8');

test('star ratings keep the WordPress votes and publish the same CreativeWorkSeries markup', () => {
  const rated = legacyItems.filter((item) => item.rating);
  // The live pages' own CreativeWorkSeries markup (snapshot) is the reference: same pages, names and numbers.
  // 68 of them come from the export's widget payload; one page publishes the markup only on the live site.
  // WordPress prints some names HTML-escaped ("TPHCM &amp; Hà Nội") or with a trailing space; ours are clean text.
  const clean = (name: string) => name.replace(/&amp;/g, '&').replace(/&#0?39;/g, "'").replace(/&quot;/g, '"').trim();
  const live = Object.fromEntries(Object.entries(liveRatings as Record<string, LegacyRating>).map(([path, rating]) => [path, { ...rating, name: clean(rating.name) }]));
  assert.equal(rated.length, 69);
  assert.deepEqual(Object.fromEntries(rated.map((item) => [item.path, item.rating])), live);
  for (const item of rated) {
    assert.ok(renderTwin(item.path)!.includes(`- Đánh giá: ${ratingScore(item.rating!)} (${item.rating!.count} bình chọn)`), `${item.path}: twin shows the rating`);
    const series = generateLegacyJsonLd(item, []).filter((block) => (block as { '@type'?: string })['@type'] === 'CreativeWorkSeries') as Array<{ name: string; aggregateRating: { ratingValue: number; ratingCount: number; bestRating: number } }>;
    assert.equal(series.length, 1, item.path);
    assert.equal(series[0].name, item.rating!.name);
    assert.deepEqual(series[0].aggregateRating, { '@type': 'AggregateRating', ratingValue: item.rating!.score, bestRating: item.rating!.best, ratingCount: item.rating!.count });
    assert.ok(item.rating!.count > 0 && item.rating!.score <= item.rating!.best, item.path);
  }
  // Pages nobody voted on carry no rating markup.
  for (const item of legacyItems.filter((entry) => !entry.rating)) {
    assert.equal(generateLegacyJsonLd(item, []).some((block) => (block as { '@type'?: string })['@type'] === 'CreativeWorkSeries'), false, item.path);
  }
});

test('"Hỏi: … / Đáp: …" blocks become FAQ entries, as WordPress published them', () => {
  assert.equal(getLegacyByPath('/van-chuyen-hang-hoa/an-giang')?.faq.length, 4);
  assert.equal(getLegacyByPath('/van-chuyen-hang-hoa/dau-nhot')?.faq[0].question, 'Vận chuyển dầu nhớt đầu nhờn Bắc Nam mất thời gian bao lâu?');
});

test('WordPress comments render as plain-text threads in the live order and stay out of the markdown twins', () => {
  const snapshot = comments as LegacyComment[];
  const count = (threads: CommentThread[]): number => threads.reduce((sum, thread) => sum + 1 + count(thread.replies), 0);
  for (const path of ['/blog/can-tim-doi-tac-van-chuyen-hang-hoa', '/blog/quy-dinh-van-chuyen-hang-hoa-nguy-hiem']) {
    const item = getLegacyByPath(path)!;
    const own = snapshot.filter((comment) => comment.post === item.id);
    assert.ok(own.length > 0, path);
    assert.equal(item.commentCount, own.length, path);
    assert.equal(count(item.comments!), own.length, `${path}: every comment is in a thread`);
  }
  const threads = getLegacyByPath('/blog/can-tim-doi-tac-van-chuyen-hang-hoa')!.comments!;
  assert.ok(threads.every((thread, index) => index === 0 || threads[index - 1].date >= thread.date), 'newest thread first');
  const replied = threads.find((thread) => thread.replies.length > 1)!;
  assert.ok(replied.replies.every((reply, index) => index === 0 || replied.replies[index - 1].date <= reply.date), 'replies oldest first');
  const all = (list: CommentThread[]): CommentThread[] => list.flatMap((thread) => [thread, ...all(thread.replies)]);
  for (const comment of all(threads)) {
    assert.ok(comment.paragraphs.length > 0 && comment.paragraphs.every((text) => !/[<>]/.test(text)), `comment ${comment.id} is plain text`);
  }
  // The repository is public: readers' phone numbers and e-mails are masked in the snapshot and everything built from it.
  const exposed = (text: string) => new RegExp(PHONE_PATTERN.source).test(text) || new RegExp(EMAIL_PATTERN.source).test(text);
  assert.deepEqual(snapshot.filter((comment) => exposed(comment.author) || exposed(comment.html)).map((comment) => comment.id), []);
  assert.deepEqual(legacyItems.flatMap((item) => all(item.comments ?? [])).filter((comment) => [comment.author, ...comment.paragraphs].some(exposed)).map((comment) => comment.id), []);
  assert.ok(snapshot.filter((comment) => comment.html.includes('[đã ẩn số điện thoại]')).length > 50);
  // Comments carry readers' phone numbers: they stay on the page, never in a twin or the llms files.
  const machineText = [...indexablePaths.map((path) => renderTwin(path)!), renderLlmsTxt(), renderLlmsFull()].join('\n');
  const leaked = all(threads).flatMap((comment) => comment.paragraphs).filter((text) => text.length >= 20 && machineText.includes(text));
  assert.deepEqual(leaked, []);
});

test('WordPress local times carry their +07:00 offset, so a UTC build host shows the same day', () => {
  const all = (list: CommentThread[]): CommentThread[] => list.flatMap((thread) => [thread, ...all(thread.replies)]);
  const dates = legacyItems.flatMap((item) => [item.date, item.modified, ...all(item.comments ?? []).map((comment) => comment.date)]).filter(Boolean) as string[];
  assert.ok(dates.length > 400);
  assert.deepEqual(dates.filter((date) => !/T\d\d:\d\d:\d\d\+07:00$/.test(date)), []);
  // Comment 48 was posted 15/06/2019 at 23:55 Vietnam time.
  const late = all(getLegacyByPath('/blog/can-tim-doi-tac-van-chuyen-hang-hoa')!.comments!).find((comment) => comment.id === 48)!;
  assert.equal(formatDateVi(late.date), '15/06/2019');
});

test('the WordPress warehouse list is complete and every province page shows its own warehouses', () => {
  assert.equal(WAREHOUSES.length, 20);
  for (const warehouse of WAREHOUSES) {
    for (const path of warehouse.paths) assert.ok(indexablePaths.includes(path), `${warehouse.label}: ${path}`);
  }
  assert.deepEqual(warehousesFor('/van-chuyen-hang-hoa/da-nang').map((warehouse) => warehouse.label), ['Đà Nẵng 1', 'Đà Nẵng 2']);
  assert.deepEqual(warehousesFor('/van-chuyen-hang-hoa/can-tho'), []);
  assert.match(renderTwin('/van-chuyen-hang-hoa/da-nang')!, /## Kho hàng Phương Vy tại Đà Nẵng\n\n- \*\*Đà Nẵng 1:\*\* 555 Trường Chinh/);
  const contact = renderTwin('/lien-he')!;
  for (const warehouse of WAREHOUSES) assert.ok(contact.includes(warehouse.address), warehouse.label);
});

test('every upload WordPress declared in its image sitemaps or showed on a live page is mirrored', () => {
  const failed = new Set((JSON.parse(read('plans/261003-vantaiphuongvy-rebuild/reports/uploads-manifest.json')) as { failed: Array<{ path: string }> }).failed.map((entry) => entry.path));
  const sitemapImages = ['page-sitemap.xml', 'post-sitemap.xml']
    .flatMap((file) => [...read(`src/legacy-content/${file}`).matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((match) => decodeURIComponent(new URL(match[1]).pathname)));
  const missing = [...new Set([...sitemapImages, ...(liveImages as string[])])]
    .filter((path) => !failed.has(path) && !existsSync(join(root, 'public', path)));
  assert.deepEqual(missing, []);
  // Only files that are broken on WordPress itself may be skipped.
  assert.ok(failed.size <= 7);
});
