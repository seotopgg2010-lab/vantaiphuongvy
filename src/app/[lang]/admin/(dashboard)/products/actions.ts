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

export async function createProduct(formData: FormData) {
  try {
    await requirePermission('content.write');
    formData.set('description', cmsRichText(formData.get('description')));
    const supabase = createAdminClient();
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string || generateSlug(formData.get('name') as string),
      short_description: formData.get('short_description') as string,
      description: formData.get('description') as string,
      product_type: formData.get('product_type') as string || 'other',
      category_id: formData.get('category_id') as string || null,
      shipping_description: formData.get('shipping_description') as string || null,
      seo_title: formData.get('seo_title') as string || null,
      seo_description: formData.get('seo_description') as string || null,
      is_active: formData.get('is_active') === 'on',
      industry_links: {
        nail_spa: formData.get('industry_nail_spa') === 'on',
        restaurant_fnb: formData.get('industry_restaurant_fnb') === 'on',
        retail_shop: formData.get('industry_retail_shop') === 'on',
        wedding_event: formData.get('industry_wedding_event') === 'on',
      }
    };
    const { error } = await supabase.from('products').insert(data);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/products');
    revalidatePath('/san-xuat-cung-ung');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    await requirePermission('content.write');
    formData.set('description', cmsRichText(formData.get('description')));
    const supabase = createAdminClient();
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string || generateSlug(formData.get('name') as string),
      short_description: formData.get('short_description') as string,
      description: formData.get('description') as string,
      product_type: formData.get('product_type') as string || 'other',
      category_id: formData.get('category_id') as string || null,
      shipping_description: formData.get('shipping_description') as string || null,
      seo_title: formData.get('seo_title') as string || null,
      seo_description: formData.get('seo_description') as string || null,
      is_active: formData.get('is_active') === 'on',
      industry_links: {
        nail_spa: formData.get('industry_nail_spa') === 'on',
        restaurant_fnb: formData.get('industry_restaurant_fnb') === 'on',
        retail_shop: formData.get('industry_retail_shop') === 'on',
        wedding_event: formData.get('industry_wedding_event') === 'on',
      }
    };
    const { error } = await supabase.from('products').update(data).eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/products');
    revalidatePath('/san-xuat-cung-ung');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deleteProduct(id: string) {
  try {
    await requirePermission('content.delete');
    const supabase = createAdminClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/products');
    revalidatePath('/san-xuat-cung-ung');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
