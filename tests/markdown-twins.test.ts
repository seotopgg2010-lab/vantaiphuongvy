import assert from 'node:assert/strict';
import test from 'node:test';
import { htmlToMarkdown } from '../scripts/legacy-markdown';
import sitemap from '../src/app/sitemap';
import { indexablePaths, latestPostDate } from '../src/lib/legacy-content';
import { markdownPathFor, markdownRewriteTarget, prefersMarkdown } from '../src/lib/markdown-paths';
import { renderLlmsTxt, renderTwin } from '../src/lib/markdown-twins';
import { legacyMetadata, pageMetadata, canonicalUrl } from '../src/lib/seo';
import { getLegacyByPath } from '../src/lib/legacy-content';
import { getSiteUrl } from '../src/lib/site';
import { socialCardFor, socialCardPath } from '../src/lib/social-card';

test('markdown twin URLs map to and from page paths', () => {
  assert.equal(markdownPathFor('/'), '/index.md');
  assert.equal(markdownPathFor('/blog'), '/blog.md');
  assert.equal(markdownPathFor('/van-chuyen-hang-hoa/da-nang/'), '/van-chuyen-hang-hoa/da-nang.md');
  assert.equal(markdownRewriteTarget('/index.md'), '/md');
  assert.equal(markdownRewriteTarget('/blog.md'), '/md/blog');
  assert.equal(markdownRewriteTarget('/van-chuyen-hang-hoa/da-nang.md'), '/md/van-chuyen-hang-hoa/da-nang');
  for (const other of ['/', '/llms.txt', '/x.y.md', '/.md', '/a/b.md/c', '/wp-content/uploads/a.jpg']) {
    assert.equal(markdownRewriteTarget(other), null, other);
  }
});

test('legacy HTML converts to GitHub-flavoured Markdown', () => {
  const markdown = htmlToMarkdown([
    '<p>Giá từ <strong>1.500đ/kg</strong> — <a href="/lien-he/">liên hệ</a></p>',
    '<h2 id="bang-gia">Bảng giá</h2>',
    '<div class="table-scroll"><table><thead><tr><th>Khối lượng</th><th>Giá</th></tr></thead><tbody><tr><td>Dưới 50 kg</td><td>40.000đ | kiện</td></tr></tbody></table></div>',
    '<ul><li>Nhận hàng tận nơi</li><li>Có hóa đơn<ul><li>VAT</li></ul></li></ul>',
    '<figure><img src="/wp-content/uploads/a.jpg" alt="Xe tải" /><figcaption>Đội xe</figcaption></figure>',
    '<aside class="callout"><p>Gọi <a href="tel:0933871139">0933 871 139</a></p></aside>',
  ].join(''));
  assert.match(markdown, /^Giá từ \*\*1\.500đ\/kg\*\* — \[liên hệ\]\(\/lien-he\/\)$/m);
  assert.match(markdown, /^## Bảng giá$/m);
  assert.match(markdown, /^\| Khối lượng \| Giá \|\n\| --- \| --- \|\n\| Dưới 50 kg \| 40\.000đ \\\| kiện \|$/m);
  assert.match(markdown, /^- Có hóa đơn\n  - VAT$/m);
  assert.match(markdown, /^!\[Xe tải\]\(\/wp-content\/uploads\/a\.jpg\)\n\*Đội xe\*$/m);
  assert.match(markdown, /^> Gọi \[0933 871 139\]\(tel:0933871139\)$/m);
  assert.doesNotMatch(markdown, /<[a-z]/i);
});

test('every sitemap URL has a markdown twin with title, canonical link and no raw HTML', () => {
  const sitemapPaths = sitemap().map((entry) => new URL(entry.url).pathname.replace(/\/+$/, '') || '/').sort();
  assert.deepEqual([...indexablePaths].sort(), sitemapPaths);
  for (const path of indexablePaths) {
    const markdown = renderTwin(path);
    assert.ok(markdown, path);
    assert.match(markdown, /^# \S/, path);
    assert.ok(markdown.includes(`- Trang gốc: ${canonicalUrl(path)}`), path);
    assert.doesNotMatch(markdown.replace(/\\</g, ''), /<(p|div|table|a|img|span)\b/i, path);
    assert.doesNotMatch(markdown, /\]\(\/(?!\/)/, `${path}: relative link left in twin`);
  }
  assert.equal(renderTwin('/home-3'), undefined);
  assert.equal(renderTwin('/tim-kiem'), undefined);
});

test('llms.txt follows llmstxt.org shape and links only to existing twins', () => {
  const text = renderLlmsTxt();
  assert.match(text, /^# .+\n\n> .+/);
  const links = [...text.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
  assert.ok(links.length > 80);
  for (const link of links) {
    assert.ok(link.startsWith(getSiteUrl()), link);
    const path = new URL(link).pathname;
    if (path === '/llms-full.txt') continue;
    const target = markdownRewriteTarget(path);
    assert.ok(target, link);
    assert.ok(renderTwin(target.replace(/^\/md/, '') || '/'), link);
  }
});

test('every indexable page advertises a 1200×630 social card and its markdown twin', () => {
  for (const path of indexablePaths) {
    assert.ok(socialCardFor(path), path);
  }
  assert.equal(socialCardPath('/'), '/og/index.png');
  assert.equal(socialCardPath('/van-chuyen-hang-hoa/da-nang'), '/og/van-chuyen-hang-hoa/da-nang.png');

  const route = legacyMetadata(getLegacyByPath('/van-chuyen-hang-hoa/da-nang')!);
  const [card] = route.openGraph!.images as Array<{ url: string; width: number; height: number; alt: string }>;
  assert.deepEqual([card.url, card.width, card.height], ['/og/van-chuyen-hang-hoa/da-nang.png', 1200, 630]);
  assert.ok(card.alt.length > 10);
  assert.deepEqual(route.alternates?.types, { 'text/markdown': '/van-chuyen-hang-hoa/da-nang.md' });

  const home = legacyMetadata(getLegacyByPath('/')!);
  const homeImages = home.openGraph!.images as Array<{ alt: string }>;
  assert.ok(homeImages.every((image) => image.alt !== 'TRANG CHỦ'));

  const blog = pageMetadata({ title: 't', description: 'd', path: '/blog' });
  assert.deepEqual(blog.alternates?.types, { 'text/markdown': '/blog.md' });
});

test('the /blog lastmod follows the newest post instead of the build time', () => {
  const blog = sitemap().find((entry) => entry.url === `${getSiteUrl()}/blog/`);
  assert.ok(latestPostDate);
  assert.equal(new Date(blog!.lastModified!).toISOString(), new Date(latestPostDate).toISOString());
});

test('Accept negotiation picks markdown only when agents rank it at least as high as HTML', () => {
  for (const accept of ['text/markdown', 'text/markdown, text/plain;q=0.8', 'text/markdown, text/html;q=0.9', 'text/html;q=0.5, text/markdown', 'text/markdown, */*']) {
    assert.equal(prefersMarkdown(accept), true, accept);
  }
  for (const accept of [
    null, '', '*/*', 'text/plain',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'text/html, text/markdown;q=0.9', 'text/markdown;q=0', 'text/markdown;q=abc',
  ]) {
    assert.equal(prefersMarkdown(accept), false, String(accept));
  }
});
