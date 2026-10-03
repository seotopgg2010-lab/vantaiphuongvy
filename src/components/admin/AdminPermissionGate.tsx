import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { requirePermission, type Permission } from '@/lib/supabase/require-admin';

export async function AdminPermissionGate({ children, params, permission }: { children: ReactNode; params: Promise<{ lang: string }>; permission: Permission }) {
  const { lang } = await params;
  try { await requirePermission(permission); }
  catch { redirect(`/${lang}/admin`); }
  return <>{children}</>;
}
