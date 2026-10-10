import type { Crumb } from '@/components/site/breadcrumbs';
import { REGION_LABELS } from './legacy-content';
import type { LegacyEntry } from './legacy-types';
import { regionAnchor, withSlash } from './navigation';
import { canonicalUrl } from './seo';

const TAY_NGUYEN = '/van-chuyen-hang-hoa/tay-nguyen';

/**
 * The region level of a route trail: Tây Nguyên has its own page; the other regions are groups
 * on the route hub, so their crumb links the group's anchor there.
 */
function regionCrumb(item: LegacyEntry): Crumb | undefined {
  if (!item.region || item.region === 'loai-hang' || item.path === TAY_NGUYEN) return undefined;
  if (item.region === 'tay-nguyen') return { name: REGION_LABELS['tay-nguyen'], href: `${TAY_NGUYEN}/` };
  return { name: REGION_LABELS[item.region], href: `/van-chuyen-hang-hoa/#${regionAnchor(item.region)}` };
}

/** Visible breadcrumb trail for a legacy entry (the last crumb has no link). */
export function legacyCrumbs(item: LegacyEntry): Crumb[] {
  const trail: Crumb[] = [{ name: 'Trang chủ', href: '/' }];
  if (item.template === 'route' || item.template === 'cargo') {
    trail.push({ name: 'Vận chuyển hàng hóa', href: '/van-chuyen-hang-hoa/' });
    const region = regionCrumb(item);
    if (region) trail.push(region);
  } else if (item.template === 'truck') trail.push({ name: 'Thuê xe tải', href: '/thue-xe-tai/' });
  else if (item.template === 'post') trail.push({ name: 'Cẩm nang vận tải', href: '/blog/' });
  trail.push({ name: item.template === 'post' ? item.title : item.label });
  return trail;
}

/** Schema.org BreadcrumbList items with absolute canonical URLs; in-page anchors (region groups) are not pages, so they are left out. */
export function crumbsToJsonLd(crumbs: Crumb[], currentPath: string) {
  return crumbs.filter((crumb) => !crumb.href?.includes('#')).map((crumb) => ({ name: crumb.name, url: canonicalUrl(crumb.href ? crumb.href : withSlash(currentPath)) }));
}
