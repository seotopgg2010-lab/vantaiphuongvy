export type Permission = 'content.read' | 'content.write' | 'content.delete' | 'contacts.read' | 'contacts.manage' | 'settings.manage' | 'staff.manage';

export function hasPermission(metadata: Record<string, unknown> | undefined, permission: Permission): boolean {
  const role = metadata?.role;
  if (!['admin', 'editor', 'support'].includes(String(role))) return false;
  if (role === 'admin') return true;
  // Staff management is deliberately reserved for administrators.
  if (permission === 'staff.manage') return false;
  const defaults: Permission[] = role === 'editor' ? ['content.read', 'content.write'] : ['contacts.read', 'contacts.manage'];
  return defaults.includes(permission) || (Array.isArray(metadata?.permissions) && metadata.permissions.includes(permission));
}

export function canModifyStaff(currentId: string, target: { id: string; app_metadata?: Record<string, unknown> }): boolean {
  return currentId !== target.id && ['editor', 'support'].includes(String(target.app_metadata?.role));
}
