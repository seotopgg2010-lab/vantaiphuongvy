'use server';
import { requirePermission } from '@/lib/supabase/require-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import type { HeroBanner } from '@/types/database';

export async function saveBanner(input: Omit<HeroBanner, 'id' | 'created_at' | 'updated_at'> & { id?: string }) {
  await requirePermission('content.write');
  const data = { title: input.title, subtitle: input.subtitle, image_url: input.image_url, mobile_image_url: input.mobile_image_url, cta_text: input.cta_text, cta_link: input.cta_link, sort_order: input.sort_order, is_active: input.is_active };
  if (typeof data.title !== 'string' || !data.title.trim() || data.title.length > 500 || !Number.isFinite(data.sort_order)) throw new Error('Banner không hợp lệ.');
  for (const value of [data.image_url, data.mobile_image_url, data.cta_link]) {
    if (value && (typeof value !== 'string' || !/^(https?:\/\/|\/(?!\/)|#)/i.test(value))) throw new Error('URL banner không hợp lệ.');
  }
  const supabase = createAdminClient();
  const { error } = input.id ? await supabase.from('hero_banners').update(data).eq('id', input.id) : await supabase.from('hero_banners').insert(data);
  if (error) throw error;
  revalidatePath('/[lang]', 'layout');
}

export async function deleteBanner(id: string) {
  await requirePermission('content.delete');
  const { error } = await createAdminClient().from('hero_banners').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/[lang]', 'layout');
}

export async function setBannerActive(id: string, active: boolean) {
  await requirePermission('content.write');
  if (typeof active !== 'boolean') throw new Error('Trạng thái không hợp lệ.');
  const { error } = await createAdminClient().from('hero_banners').update({ is_active: active }).eq('id', id);
  if (error) throw error;
  revalidatePath('/[lang]', 'layout');
}
