import type { Project, BlogPost } from '@/types/database';

function hasText(value: string | null | undefined): boolean {
  return Boolean(value?.replace(/<[^>]*>/g, '').trim());
}

function hasDistinctImages(images: string[] | null | undefined): boolean {
  return new Set((images || []).filter(Boolean)).size >= 8;
}

export function isProjectIndexable(project: Pick<Project, 'client_requirement' | 'concept' | 'scope' | 'production_process' | 'packaging_details' | 'shipping_details' | 'result' | 'images'>) {
  return [project.client_requirement, project.concept, project.scope, project.production_process, project.packaging_details, project.shipping_details, project.result].every(hasText)
    && hasDistinctImages(project.images);
}

export function isArticleIndexable(post: Pick<BlogPost, 'content'>) {
  return (post.content || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length >= 150;
}

export function relatedServiceForArticle(categorySlug: string | undefined) {
  return ({
    'van-chuyen': '/van-chuyen-quoc-te',
    'bang-hieu-in-an': '/san-xuat-cung-ung/an-pham-bao-bi',
    'nail-spa': '/giai-phap-tron-goi/nail-salon',
    'restaurant-fnb': '/giai-phap-tron-goi/restaurant-fnb',
  } as Record<string, string>)[categorySlug || ''] || '/giai-phap-tron-goi';
}
