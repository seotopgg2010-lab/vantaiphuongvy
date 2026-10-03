'use server'

import { cmsRichText } from '@/lib/cms-validation';
import { requirePermission } from '@/lib/supabase/require-admin';
import { getErrorMessage } from '@/lib/errors';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

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

export async function createPage(formData: FormData) {
  try {
    await requirePermission('content.write');
    formData.set('content', cmsRichText(formData.get('content')));
    const supabase = createAdminClient();
    
    const title = formData.get('title') as string;
    let slug = formData.get('slug') as string;
    if (!slug) {
      slug = generateSlug(title);
    }
    const content = formData.get('content') as string;
    const seo_title = formData.get('seo_title') as string;
    const seo_description = formData.get('seo_description') as string;
    const is_published = formData.get('is_published') === 'on';

    const { error } = await supabase
      .from('pages')
      .insert({
        title,
        slug,
        content,
        seo_title,
        seo_description,
        is_published
      });

    if (error) throw error;

    revalidatePath('/admin/pages');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function updatePage(id: string, formData: FormData) {
  try {
    await requirePermission('content.write');
    formData.set('content', cmsRichText(formData.get('content')));
    const supabase = createAdminClient();
    
    const title = formData.get('title') as string;
    let slug = formData.get('slug') as string;
    if (!slug) {
      slug = generateSlug(title);
    }
    const content = formData.get('content') as string;
    const seo_title = formData.get('seo_title') as string;
    const seo_description = formData.get('seo_description') as string;
    const is_published = formData.get('is_published') === 'on';

    const { error } = await supabase
      .from('pages')
      .update({
        title,
        slug,
        content,
        seo_title,
        seo_description,
        is_published
      })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/pages');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deletePage(id: string) {
  try {
    await requirePermission('content.delete');
    const supabase = createAdminClient();
    
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/pages');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
