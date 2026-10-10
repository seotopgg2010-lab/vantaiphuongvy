import { SITE_CONFIG } from '@/lib/constants';
import { legacyPosts } from '@/lib/legacy-content';
import { displayTitle } from '@/lib/legacy-render';
import { HERO_LEADS } from '@/lib/marketing';
import { canonicalUrl } from '@/lib/seo';

export const dynamic = 'force-static';

const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** RSS 2.0 feed of the guides at /feed/, the address the WordPress feed had. */
export function GET() {
  const items = legacyPosts.map((post) => {
    const url = canonicalUrl(post.path);
    const description = HERO_LEADS[post.path] || post.seo.description || post.summary;
    return [
      '<item>',
      `<title>${escapeXml(displayTitle(post.title))}</title>`,
      `<link>${url}</link>`,
      `<guid isPermaLink="true">${url}</guid>`,
      post.date ? `<pubDate>${new Date(post.date).toUTCString()}</pubDate>` : '',
      post.author ? `<dc:creator>${escapeXml(post.author.name)}</dc:creator>` : '',
      `<description>${escapeXml(description)}</description>`,
      '</item>',
    ].filter(Boolean).join('');
  });
  const latest = legacyPosts.map((post) => post.modified || post.date || '').sort().at(-1);
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>Cẩm nang vận tải — ${escapeXml(SITE_CONFIG.name)}</title>`,
    `<link>${canonicalUrl('/blog')}</link>`,
    `<atom:link href="${canonicalUrl('/feed')}" rel="self" type="application/rss+xml" />`,
    `<description>${escapeXml(SITE_CONFIG.description)}</description>`,
    '<language>vi</language>',
    latest ? `<lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>` : '',
    ...items,
    '</channel>',
    '</rss>',
  ].filter(Boolean).join('\n');
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
}
