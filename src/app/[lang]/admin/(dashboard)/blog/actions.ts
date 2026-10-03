'use server'
import { cmsRichText } from '@/lib/cms-validation';
import { requirePermission } from '@/lib/supabase/require-admin';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/errors';

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

export async function createBlog(formData: FormData) {
  try {
    await requirePermission('content.write');
    formData.set('content', cmsRichText(formData.get('content')));
    const supabase = createAdminClient();
    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string || generateSlug(formData.get('title') as string),
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      cover_image_url: formData.get('cover_image_url') as string || null,
      category_id: formData.get('category_id') as string || null,
      seo_title: formData.get('seo_title') as string || null,
      seo_description: formData.get('seo_description') as string || null,
      is_published: formData.get('is_published') === 'on',
      published_at: formData.get('published_at') as string || null,
    };
    const { error } = await supabase.from('blog_posts').insert(data);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/blog');
    revalidatePath('/tin-tuc');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function updateBlog(id: string, formData: FormData) {
  try {
    await requirePermission('content.write');
    formData.set('content', cmsRichText(formData.get('content')));
    const supabase = createAdminClient();
    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string || generateSlug(formData.get('title') as string),
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      cover_image_url: formData.get('cover_image_url') as string || null,
      category_id: formData.get('category_id') as string || null,
      seo_title: formData.get('seo_title') as string || null,
      seo_description: formData.get('seo_description') as string || null,
      is_published: formData.get('is_published') === 'on',
      published_at: formData.get('published_at') as string || null,
    };
    const { error } = await supabase.from('blog_posts').update(data).eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/blog');
    revalidatePath('/tin-tuc');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deleteBlog(id: string) {
  try {
    await requirePermission('content.delete');
    const supabase = createAdminClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/blog');
    revalidatePath('/tin-tuc');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
