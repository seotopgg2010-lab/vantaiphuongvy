import type { Crumb } from '@/components/site/breadcrumbs';
import type { LegacyEntry } from './legacy-types';
import { withSlash } from './navigation';
import { canonicalUrl } from './seo';

/** Visible breadcrumb trail for a legacy entry (the last crumb has no link). */
export function legacyCrumbs(item: LegacyEntry): Crumb[] {
  const trail: Crumb[] = [{ name: 'Trang chủ', href: '/' }];
  if (item.template === 'route' || item.template === 'cargo') trail.push({ name: 'Vận chuyển hàng hóa', href: '/van-chuyen-hang-hoa/' });
  else if (item.template === 'truck') trail.push({ name: 'Thuê xe tải', href: '/thue-xe-tai/' });
  else if (item.template === 'post') trail.push({ name: 'Cẩm nang vận tải', href: '/blog/' });
  trail.push({ name: item.template === 'post' ? item.title : item.label });
  return trail;
}

/** Schema.org BreadcrumbList items with absolute canonical URLs. */
export function crumbsToJsonLd(crumbs: Crumb[], currentPath: string) {
  return crumbs.map((crumb) => ({ name: crumb.name, url: canonicalUrl(crumb.href ? crumb.href : withSlash(currentPath)) }));
}
