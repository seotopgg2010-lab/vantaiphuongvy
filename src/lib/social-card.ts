import { SITE_CONFIG } from './constants';
import { getLegacyByPath, legacyPosts } from './legacy-content';
import { displayTitle } from './legacy-render';
import { BLOG_PAGE, HERO, HERO_IMAGE } from './marketing';

/** Branded 1200×630 share image per indexable page, served as a static PNG at /og/<path>.png. */
export const SOCIAL_CARD_SIZE = { width: 1200, height: 630 } as const;

export type SocialCard = { eyebrow: string; title: string; image: string };

/** Public URL path of a page's card ("/" -> "/og/index.png", "/x/y" -> "/og/x/y.png"). */
export function socialCardPath(pagePath: string): string {
  return `/og${pagePath.replace(/\/+$/, '') || '/index'}.png`;
}

/** Card copy and photo for a page path ("/" for home, no trailing slash), or undefined. */
export function socialCardFor(path: string): SocialCard | undefined {
  if (path === '/') return { eyebrow: SITE_CONFIG.slogan, title: HERO.title, image: HERO_IMAGE.src };
  if (path === '/blog') return { eyebrow: 'Kiến thức vận tải', title: BLOG_PAGE.heading, image: legacyPosts[0]?.image || SITE_CONFIG.defaultImage };
  const item = getLegacyByPath(path);
  if (!item) return undefined;
  const eyebrow = {
    route: item.region === 'quoc-te' ? 'Vận chuyển quốc tế' : `Chành xe · TP.HCM – ${item.label}`,
    cargo: item.region === 'quoc-te' ? 'Vận chuyển quốc tế' : 'Vận chuyển theo loại hàng',
    'route-hub': 'Chành xe Bắc – Trung – Nam',
    truck: 'Cho thuê xe tải',
    'truck-hub': 'Cho thuê xe tải chở hàng',
    post: 'Cẩm nang vận tải',
    policy: 'Chính sách',
    page: SITE_CONFIG.name,
    home: SITE_CONFIG.name,
  }[item.template];
  return { eyebrow, title: displayTitle(item.title), image: item.image || SITE_CONFIG.defaultImage };
}
