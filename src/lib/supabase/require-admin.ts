import { createClient } from './server';

import { hasPermission, type Permission } from '@/lib/admin-permissions';
export type { Permission } from '@/lib/admin-permissions';

async function requireStaff() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  const role = user?.app_metadata?.role;
  if (error || !user || !['admin', 'editor', 'support'].includes(role)) throw new Error('Forbidden: A staff account is required.');
  return { user, supabase };
}

export async function requireAdmin() {
  const { user, supabase } = await requireStaff();
  if (user.app_metadata?.role !== 'admin') throw new Error('Forbidden: An administrator account is required.');
  return { user, supabase };
}

export async function requirePermission(permission: Permission) {
  const { user, supabase } = await requireStaff();
  if (!hasPermission(user.app_metadata, permission)) throw new Error(`Forbidden: missing permission ${permission}.`);
  return { user, supabase };
}
