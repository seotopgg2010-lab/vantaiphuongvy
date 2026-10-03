import { revalidatePath, revalidateTag } from 'next/cache';

export const CMS_TAGS = {
  heroBanners: 'cms:hero-banners',
  navigation: 'cms:navigation',
  siteSettings: 'cms:site-settings',
} as const;

export function invalidateCms(tag: string, paths: string[] = []) {
  revalidateTag(tag, 'max');
  for (const path of paths) revalidatePath(path);
}

export function invalidateLocalizedLayout() {
  revalidatePath('/[lang]', 'layout');
}
