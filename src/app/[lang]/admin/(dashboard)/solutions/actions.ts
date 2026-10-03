'use server'
import { cmsRichText } from '@/lib/cms-validation';
import { requirePermission } from '@/lib/supabase/require-admin';
import { getErrorMessage } from '@/lib/errors';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

function lines(formData: FormData, name: string) {
  return String(formData.get(name) || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
}

function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
    .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
    .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
    .replace(/đ/gi, 'd')
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createSolution(formData: FormData) {
  try {
    await requirePermission('content.write');
    formData.set('description', cmsRichText(formData.get('description')));
    const supabase = createAdminClient();
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string || generateSlug(formData.get('name') as string),
      description: formData.get('description') as string,
      short_description: formData.get('short_description') as string || null,
      hero_image_url: formData.get('hero_image_url') as string || null,
      features: lines(formData, 'features'),
      images: lines(formData, 'images'),
      seo_title: formData.get('seo_title') as string || null,
      seo_description: formData.get('seo_description') as string || null,
      is_active: formData.get('is_active') === 'on',
    };
    const { error } = await supabase.from('solutions').insert(data);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/solutions');
    revalidatePath('/[lang]/giai-phap-tron-goi/[slug]', 'page');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function updateSolution(id: string, formData: FormData) {
  try {
    await requirePermission('content.write');
    formData.set('description', cmsRichText(formData.get('description')));
    const supabase = createAdminClient();
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string || generateSlug(formData.get('name') as string),
      description: formData.get('description') as string,
      short_description: formData.get('short_description') as string || null,
      hero_image_url: formData.get('hero_image_url') as string || null,
      features: lines(formData, 'features'),
      images: lines(formData, 'images'),
      seo_title: formData.get('seo_title') as string || null,
      seo_description: formData.get('seo_description') as string || null,
      is_active: formData.get('is_active') === 'on',
    };
    const { error } = await supabase.from('solutions').update(data).eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/solutions');
    revalidatePath('/[lang]/giai-phap-tron-goi/[slug]', 'page');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deleteSolution(id: string) {
  try {
    await requirePermission('content.delete');
    const supabase = createAdminClient();
    const { error } = await supabase.from('solutions').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/solutions');
    revalidatePath('/[lang]/giai-phap-tron-goi/[slug]', 'page');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
