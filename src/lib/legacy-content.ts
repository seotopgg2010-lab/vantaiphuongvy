import pages from '@/legacy-content/pages.json';
import posts from '@/legacy-content/posts.json';
import { richTextSummary } from './rich-text';

const OLD_ORIGIN = 'https://vantaiphuongvy.com';

type WpItem = { id: number; slug: string; link: string; title: { rendered: string }; content: { rendered: string }; excerpt?: { rendered: string }; date?: string; modified?: string; featured_media?: number };

function decode(value: string) {
  return value.replace(/&#8211;|&#x2013;/g, '–').replace(/&#8217;|&#x2019;/g, '’').replace(/&#038;|&#x26;/g, '&').replace(/&#8216;|&#x2018;/g, '‘').replace(/&#8220;|&#x201c;/g, '“').replace(/&#8221;|&#x201d;/g, '”').replace(/&#039;|&#x27;/g, "'").replace(/&nbsp;/g, ' ');
}
function pathFromLink(link: string) { return new URL(link).pathname.replace(/\/+$/, '') || '/'; }
function normalize(item: WpItem, kind: 'page' | 'post') {
  const title = decode(item.title.rendered.replace(/<[^>]+>/g, ''));
  const content = item.content?.rendered || '';
  const excerpt = richTextSummary(content, 170);
  const image = content.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || undefined;
  return { ...item, kind, title, content, excerpt, path: pathFromLink(item.link), image: image?.startsWith('//') ? `https:${image}` : image };
}

export const legacyPages = (pages as WpItem[]).map(x => normalize(x, 'page'));
export const legacyPosts = (posts as WpItem[]).map(x => normalize(x, 'post'));
export const legacyItems = [...legacyPages, ...legacyPosts];
export function getLegacyByPath(path: string) { const clean = path.replace(/\/+$/, '') || '/'; return legacyItems.find(x => x.path === clean); }
export function getLegacyBySlug(slug: string) { return legacyPosts.find(x => x.slug === slug); }
export function oldImageUrl(url: string | undefined) { return url ? (url.startsWith('http') ? url : `${OLD_ORIGIN}${url}`) : undefined; }
export { OLD_ORIGIN };
