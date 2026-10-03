'use server';
import { requirePermission } from '@/lib/supabase/require-admin';
import { getErrorMessage } from '@/lib/errors';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { cmsRichText, cmsImageUrls } from '@/lib/cms-validation';

function projectData(form: FormData) {
  const name = String(form.get('name') || '').trim();
  const slug = String(form.get('slug') || name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).trim();
  if (!name || name.length > 200 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Tên hoặc slug dự án không hợp lệ.');
  return {
    name, slug,
    location: String(form.get('location') || ''), business_type: String(form.get('business_type') || ''),
    client_requirement: String(form.get('client_requirement') || ''), concept: String(form.get('concept') || ''), scope: String(form.get('scope') || ''),
    description: String(form.get('description') || ''),
    production_process: cmsRichText(form.get('production_process')), packaging_details: cmsRichText(form.get('packaging_details')),
    shipping_details: cmsRichText(form.get('shipping_details')), result: cmsRichText(form.get('result')),
    images: cmsImageUrls(form.get('images')),
    seo_title: String(form.get('seo_title') || '') || null, seo_description: String(form.get('seo_description') || '') || null,
    is_featured: form.get('is_featured') === 'on', is_active: form.get('is_active') === 'on', is_published: form.get('is_published') === 'on',
  };
}

export async function createProject(formData: FormData) {
  try {
    await requirePermission('content.write');
    const { error } = await createAdminClient().from('projects').insert(projectData(formData));
    if (error) throw error;
    revalidatePath('/[lang]', 'layout');
    return { success: true };
  } catch (error) { return { success: false, error: getErrorMessage(error) }; }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    await requirePermission('content.write');
    const { error } = await createAdminClient().from('projects').update(projectData(formData)).eq('id', id).select('id').single();
    if (error) throw error;
    revalidatePath('/[lang]', 'layout');
    return { success: true };
  } catch (error) { return { success: false, error: getErrorMessage(error) }; }
}

export async function deleteProject(id: string) {
  try {
    await requirePermission('content.delete');
    const { error } = await createAdminClient().from('projects').delete().eq('id', id).select('id').single();
    if (error) throw error;
    revalidatePath('/[lang]', 'layout');
    return { success: true };
  } catch (error) { return { success: false, error: getErrorMessage(error) }; }
}
