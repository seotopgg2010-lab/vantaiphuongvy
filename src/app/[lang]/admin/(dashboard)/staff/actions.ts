'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/supabase/require-admin';
import { getErrorMessage } from '@/lib/errors';
import { canModifyStaff } from '@/lib/admin-permissions';

const roles = new Set(['admin', 'editor', 'support']);
const permissions = new Set(['content.read', 'content.write', 'content.delete', 'contacts.read', 'contacts.manage', 'settings.manage', 'staff.manage']);

function parsePermissions(value: FormDataEntryValue | null): string[] {
  if (typeof value !== 'string') return [];
  return [...new Set(value.split(',').map((item) => item.trim()).filter((item) => permissions.has(item)))];
}

export async function listStaff() {
  await requireAdmin();
  const { data, error } = await createAdminClient().auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return data.users.filter((user) => ['admin', 'editor', 'support'].includes(user.app_metadata?.role)).map((user) => ({
    id: user.id,
    email: user.email || '',
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at,
    role: typeof user.app_metadata?.role === 'string' ? user.app_metadata.role : 'staff',
    permissions: Array.isArray(user.app_metadata?.permissions) ? user.app_metadata.permissions : [],
    banned_until: user.banned_until,
  }));
}

export async function createStaff(formData: FormData) {
  try {
    await requireAdmin();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');
    const role = String(formData.get('role') || 'editor');
    if (!email || !email.includes('@')) throw new Error('Email nhân viên không hợp lệ.');
    if (password.length < 8) throw new Error('Mật khẩu phải có ít nhất 8 ký tự.');
    if (!roles.has(role) || role === 'admin') throw new Error('Không thể tạo thêm tài khoản admin từ màn hình này.');
    const { error } = await createAdminClient().auth.admin.createUser({
      email, password, email_confirm: true,
      app_metadata: { role, permissions: parsePermissions(formData.get('permissions')) },
    });
    if (error) throw error;
    revalidatePath('/[lang]/admin/staff', 'page');
    return { success: true };
  } catch (error) { return { success: false, error: getErrorMessage(error) }; }
}

export async function updateStaff(userId: string, formData: FormData) {
  try {
    const current = await requireAdmin();
    const target = await createAdminClient().auth.admin.getUserById(userId);
    if (target.error || !target.data.user || !canModifyStaff(current.user.id, target.data.user)) throw new Error('Chỉ được sửa tài khoản nhân viên khác; không được sửa admin.');
    const role = String(formData.get('role') || 'editor');
    if (!roles.has(role) || role === 'admin') throw new Error('Vai trò không hợp lệ.');
    const password = String(formData.get('password') || '');
    if (password && password.length < 8) throw new Error('Mật khẩu phải có ít nhất 8 ký tự.');
    const { error } = await createAdminClient().auth.admin.updateUserById(userId, {
      ...(password ? { password } : {}),
      app_metadata: { role, permissions: parsePermissions(formData.get('permissions')) },
    });
    if (error) throw error;
    revalidatePath('/[lang]/admin/staff', 'page');
    return { success: true };
  } catch (error) { return { success: false, error: getErrorMessage(error) }; }
}

export async function deleteStaff(userId: string) {
  try {
    const current = await requireAdmin();
    const target = await createAdminClient().auth.admin.getUserById(userId);
    if (target.error || !target.data.user || !canModifyStaff(current.user.id, target.data.user)) throw new Error('Chỉ được xóa tài khoản nhân viên khác; không được xóa admin.');
    const { error } = await createAdminClient().auth.admin.deleteUser(userId);
    if (error) throw error;
    revalidatePath('/[lang]/admin/staff', 'page');
    return { success: true };
  } catch (error) { return { success: false, error: getErrorMessage(error) }; }
}
