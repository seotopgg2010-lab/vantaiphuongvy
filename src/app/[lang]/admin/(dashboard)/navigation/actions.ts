'use server'

import { requirePermission } from '@/lib/supabase/require-admin';
import { getErrorMessage } from '@/lib/errors';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createNavItem(formData: FormData) {
  try {
    await requirePermission('content.write');
    const supabase = createAdminClient();
    
    const data = {
      label: formData.get('label') as string,
      url: formData.get('url') as string || null,
      parent_id: formData.get('parent_id') as string || null,
      image_url: formData.get('image_url') as string || null,
      sort_order: parseInt(formData.get('sort_order') as string || '0'),
      is_active: formData.get('is_active') === 'on',
    };

    const { error } = await supabase.from('navigation_items').insert(data);
    if (error) throw error;

    revalidatePath('/admin/navigation');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function updateNavItem(id: string, formData: FormData) {
  try {
    await requirePermission('content.write');
    const supabase = createAdminClient();
    
    const data = {
      label: formData.get('label') as string,
      url: formData.get('url') as string || null,
      parent_id: formData.get('parent_id') as string || null,
      image_url: formData.get('image_url') as string || null,
      sort_order: parseInt(formData.get('sort_order') as string || '0'),
      is_active: formData.get('is_active') === 'on',
    };

    const { error } = await supabase.from('navigation_items').update(data).eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/navigation');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deleteNavItem(id: string) {
  try {
    await requirePermission('content.delete');
    const supabase = createAdminClient();
    
    const { error } = await supabase.from('navigation_items').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/navigation');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
