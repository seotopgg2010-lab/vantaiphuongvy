'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePermission } from '@/lib/supabase/require-admin';

const CONTACT_BUCKET = 'attachments';
const SIGNED_URL_TTL_SECONDS = 60 * 60;

type ContactActionResult =
  | { success: true }
  | { success: false; error: string };

export async function getAdminContacts() {
  await requirePermission('contacts.read');
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error('Không thể tải yêu cầu liên hệ.');

  const paths = Array.from(new Set((data || []).flatMap((item) => item.attachment_urls || [])));
  const { data: signedUrls, error: signedUrlError } = paths.length > 0
    ? await supabase.storage.from(CONTACT_BUCKET).createSignedUrls(paths, SIGNED_URL_TTL_SECONDS, { download: true })
    : { data: [], error: null };

  if (signedUrlError) throw new Error('Không thể tạo liên kết tệp đính kèm.');

  const attachmentLinks = Object.fromEntries(
    (signedUrls || [])
      .filter((entry) => Boolean(entry.path && entry.signedUrl))
      .map((entry) => [entry.path as string, entry.signedUrl as string]),
  );

  return { items: data || [], attachmentLinks };
}

export async function updateAdminContactReadState(id: string, isRead: boolean): Promise<ContactActionResult> {
  await requirePermission('contacts.manage');
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('contact_submissions')
    .update({ is_read: isRead })
    .eq('id', id);

  if (error) return { success: false, error: 'Không thể cập nhật trạng thái liên hệ.' };
  revalidatePath('/admin/contacts');
  return { success: true };
}

export async function deleteAdminContact(id: string): Promise<ContactActionResult> {
  await requirePermission('contacts.manage');
  const supabase = createAdminClient();
  const { data: contact, error: contactError } = await supabase
    .from('contact_submissions')
    .select('attachment_urls')
    .eq('id', id)
    .maybeSingle();

  if (contactError) return { success: false, error: 'Không thể tải yêu cầu liên hệ.' };

  const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
  if (error) return { success: false, error: 'Không thể xóa yêu cầu liên hệ.' };

  const paths = contact?.attachment_urls || [];
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage.from(CONTACT_BUCKET).remove(paths);
    if (storageError) console.error('Contact attachment deletion failed', storageError);
  }

  revalidatePath('/admin/contacts');
  return { success: true };
}
