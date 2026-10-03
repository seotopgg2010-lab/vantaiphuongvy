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

function parseImageUrls(formData: FormData): string[] {
  return formData.getAll('images')
    .flatMap((value) => String(value).split(/\r?\n/))
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function createShippingRoute(formData: FormData) {
  try {
    await requirePermission('content.write');
    formData.set('description', cmsRichText(formData.get('description')));
    const supabase = createAdminClient();
    const serviceTypesRaw = formData.get('service_types') as string | null;
    const imagesRaw = parseImageUrls(formData);

    const data: Record<string, unknown> = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string || generateSlug(formData.get('name') as string),
      description: formData.get('description') as string,
      country: formData.get('country') as string || null,
      transit_info: formData.get('transit_info') as string || null,
      hero_image_url: formData.get('hero_image_url') as string || null,
      seo_title: formData.get('seo_title') as string || null,
      seo_description: formData.get('seo_description') as string || null,
      is_active: formData.get('is_active') === 'on',
    };

    if (serviceTypesRaw !== null) {
      try {
        data.service_types = serviceTypesRaw.trim() ? JSON.parse(serviceTypesRaw) : {};
      } catch {
        return { success: false, error: 'Thông tin dịch vụ phải là JSON hợp lệ.' };
      }
    }
    data.images = imagesRaw;
    const { error } = await supabase.from('shipping_routes').insert(data);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/shipping');
    revalidatePath('/van-chuyen-quoc-te');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function updateShippingRoute(id: string, formData: FormData) {
  try {
    await requirePermission('content.write');
    formData.set('description', cmsRichText(formData.get('description')));
    const supabase = createAdminClient();
    const serviceTypesRaw = formData.get('service_types') as string | null;
    const imagesRaw = parseImageUrls(formData);

    const data: Record<string, unknown> = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string || generateSlug(formData.get('name') as string),
      description: formData.get('description') as string,
      country: formData.get('country') as string || null,
      transit_info: formData.get('transit_info') as string || null,
      hero_image_url: formData.get('hero_image_url') as string || null,
      seo_title: formData.get('seo_title') as string || null,
      seo_description: formData.get('seo_description') as string || null,
      is_active: formData.get('is_active') === 'on',
    };

    if (serviceTypesRaw !== null) {
      try {
        data.service_types = serviceTypesRaw.trim() ? JSON.parse(serviceTypesRaw) : {};
      } catch {
        return { success: false, error: 'Thông tin dịch vụ phải là JSON hợp lệ.' };
      }
    }
    data.images = imagesRaw;
    const { error } = await supabase.from('shipping_routes').update(data).eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/shipping');
    revalidatePath('/van-chuyen-quoc-te');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deleteShippingRoute(id: string) {
  try {
    await requirePermission('content.delete');
    const supabase = createAdminClient();
    const { error } = await supabase.from('shipping_routes').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/shipping');
    revalidatePath('/van-chuyen-quoc-te');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
