'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { requirePermission } from '@/lib/supabase/require-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { getErrorMessage } from '@/lib/errors';
import { parseSectionContent, sectionOrder } from '@/lib/cms-validation';

const allowedTypes = new Set(['rich_text', 'hero', 'features', 'gallery', 'cta', 'html']);

export async function savePageSection(formData: FormData) {
  try {
    await requirePermission('content.write');
    const pageKey = String(formData.get('page_key') || '').trim();
    const sectionKey = String(formData.get('section_key') || '').trim();
    const locale = String(formData.get('locale') || 'vi');
    const sectionType = String(formData.get('section_type') || 'rich_text');
    if (!/^[a-z0-9][a-z0-9/_-]{0,119}$/i.test(pageKey) || !/^[a-z0-9][a-z0-9_-]{0,119}$/i.test(sectionKey) || !['vi', 'en'].includes(locale) || !allowedTypes.has(sectionType)) throw new Error('Thông tin section không hợp lệ.');
    const payload = {
      page_key: pageKey, section_key: sectionKey, locale, section_type: sectionType,
      content: parseSectionContent(formData.get('content')),
      sort_order: sectionOrder(formData.get('sort_order')),
      is_published: formData.get('is_published') === 'on',
    };
    const db = createAdminClient();
    const id = formData.get('id');
    let previousTag: string | undefined;
    if (id) {
      const { data: previous, error } = await db.from('page_sections').select('page_key,locale').eq('id', String(id)).single();
      if (error) throw error;
      previousTag = `cms:page:${previous.page_key}:${previous.locale}`;
    }
    const { error } = await (id
      ? db.from('page_sections').update(payload).eq('id', String(id)).select('id').single()
      : db.from('page_sections').upsert(payload, { onConflict: 'page_key,section_key,locale' }));
    if (error) throw error;
    if (previousTag) updateTag(previousTag);
    updateTag(`cms:page:${pageKey}:${locale}`);
    revalidatePath('/[lang]', 'layout');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deletePageSection(id: string) {
  try {
    await requirePermission('content.delete');
    const { data, error } = await createAdminClient().from('page_sections').delete().eq('id', id).select('page_key,locale').single();
    if (error) throw error;
    updateTag(`cms:page:${data.page_key}:${data.locale}`);
    revalidatePath('/[lang]', 'layout');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}
