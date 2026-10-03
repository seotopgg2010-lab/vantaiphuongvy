'use server';
import { requirePermission } from '@/lib/supabase/require-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/errors';

export async function saveSettings(settings: Record<string, string>) {
  try {
    await requirePermission('settings.manage');
    const rows = Object.entries(settings).map(([key, value]) => {
      if (!/^[a-z][a-z0-9_]{0,79}$/.test(key) || typeof value !== 'string' || value.length > 10000) throw new Error('Cài đặt không hợp lệ.');
      return { key, value };
    });
    if (!rows.length || rows.length > 100) throw new Error('Số lượng cài đặt không hợp lệ.');
    const { error } = await createAdminClient().from('site_settings').upsert(rows, { onConflict: 'key' });
    if (error) throw error;
    revalidatePath('/[lang]', 'layout');
    return { success: true };
  } catch (error) { return { success: false, error: getErrorMessage(error) }; }
}
