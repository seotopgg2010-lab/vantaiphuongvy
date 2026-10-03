import { localizedPath } from '@/lib/site';

export type BriefLocale = 'vi' | 'en';

export const BRIEF_ROUTES = {
  home: '/',
  shipping: '/van-chuyen-quoc-te',
  storefrontSignage: '/bang-hieu/bang-hieu-mat-tien',
  japaneseRestaurant: '/cung-ung-setup/nha-hang-am-thuc/nha-hang-nhat-ban',
} as const;

export const STOREFRONT_SIGNAGE_SLUG = 'bang-hieu-mat-tien';
export const STOREFRONT_SIGNAGE_CATEGORY_SLUG = 'bang-hieu-nhan-dien';

export function getBriefRoutePath(locale: BriefLocale, path: string): string {
  return localizedPath(locale, path);
}

export function getStorefrontCanonicalPath(locale: BriefLocale): string {
  return getBriefRoutePath(locale, BRIEF_ROUTES.storefrontSignage);
}

export function getLegacyStorefrontPath(locale: BriefLocale): string {
  return getBriefRoutePath(
    locale,
    `/san-xuat-cung-ung/${STOREFRONT_SIGNAGE_CATEGORY_SLUG}/${STOREFRONT_SIGNAGE_SLUG}`,
  );
}

export function isStorefrontSignageSlug(slug: string): boolean {
  return slug === STOREFRONT_SIGNAGE_SLUG;
}
