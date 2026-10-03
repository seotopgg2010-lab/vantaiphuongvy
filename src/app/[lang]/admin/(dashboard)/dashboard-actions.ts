'use server';
import { requirePermission } from '@/lib/supabase/require-admin';
import { hasPermission } from '@/lib/admin-permissions';
import { createAdminClient } from '@/lib/supabase/admin';

export async function getDashboardData() {
  // Any recognized staff member has at least one of these default permissions.
  let session;
  try { session = await requirePermission('content.read'); }
  catch { session = await requirePermission('contacts.read'); }
  const canReadContent = hasPermission(session.user.app_metadata, 'content.read');
  const canWriteContent = hasPermission(session.user.app_metadata, 'content.write');
  const canReadContacts = hasPermission(session.user.app_metadata, 'contacts.read');
  const supabase = createAdminClient();
  async function count(table: string, unread = false) {
    const query = supabase.from(table).select('id', { count: 'exact', head: true });
    const { count, error } = await (unread ? query.eq('is_read', false) : query);
    return error ? '--' : String(count ?? 0);
  }
  const [products, projects, blog_posts, contacts] = await Promise.all([
    canReadContent ? count('products') : '--', canReadContent ? count('projects') : '--',
    canReadContent ? count('blog_posts') : '--', canReadContacts ? count('contact_submissions', true) : '--',
  ]);
  return { counts: { products, projects, blog_posts, contacts }, canReadContent, canWriteContent, canReadContacts };
}
