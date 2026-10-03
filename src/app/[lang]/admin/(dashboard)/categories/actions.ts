'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/supabase/require-admin';
import { getErrorMessage } from '@/lib/errors';

export async function createCategory(fd: FormData) {
  try {
    await requirePermission('content.write');
    const supabase = createAdminClient();
    const data = {
      name: fd.get('name') as string,
      slug: (fd.get('slug') as string) || (fd.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: fd.get('description') as string,
      image_url: fd.get('image_url') as string,
      sort_order: parseInt((fd.get('sort_order') as string) || '0', 10),
      is_active: fd.get('is_active') === 'on'
    };
    
    const { error } = await supabase.from('categories').insert([data]);
    if (error) return { success: false, error: error.message };
    
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateCategory(id: string, fd: FormData) {
  try {
    await requirePermission('content.write');
    const supabase = createAdminClient();
    const data = {
      name: fd.get('name') as string,
      slug: (fd.get('slug') as string) || (fd.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: fd.get('description') as string,
      image_url: fd.get('image_url') as string,
      sort_order: parseInt((fd.get('sort_order') as string) || '0', 10),
      is_active: fd.get('is_active') === 'on'
    };
    
    const { error } = await supabase.from('categories').update(data).eq('id', id);
    if (error) return { success: false, error: error.message };
    
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteCategory(id: string) {
  try {
    await requirePermission('content.delete');
    const supabase = createAdminClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}
