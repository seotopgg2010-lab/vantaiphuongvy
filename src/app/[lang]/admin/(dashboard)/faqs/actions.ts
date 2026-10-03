'use server'

import { requirePermission } from '@/lib/supabase/require-admin';
import { getErrorMessage } from '@/lib/errors';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createFaq(formData: FormData) {
  try {
    await requirePermission('content.write');
    const supabase = createAdminClient();
    
    const data = {
      question: formData.get('question') as string,
      answer: formData.get('answer') as string,
      category: formData.get('category') as string || null,
      sort_order: parseInt(formData.get('sort_order') as string || '0'),
      is_active: formData.get('is_active') === 'on',
    };

    const { error } = await supabase.from('faqs').insert(data);
    if (error) throw error;

    revalidatePath('/admin/faqs');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function updateFaq(id: string, formData: FormData) {
  try {
    await requirePermission('content.write');
    const supabase = createAdminClient();
    
    const data = {
      question: formData.get('question') as string,
      answer: formData.get('answer') as string,
      category: formData.get('category') as string || null,
      sort_order: parseInt(formData.get('sort_order') as string || '0'),
      is_active: formData.get('is_active') === 'on',
    };

    const { error } = await supabase.from('faqs').update(data).eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/faqs');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function deleteFaq(id: string) {
  try {
    await requirePermission('content.delete');
    const supabase = createAdminClient();
    
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/faqs');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}
