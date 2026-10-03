import { ReactNode } from 'react';
import { AdminPermissionGate } from '@/components/admin/AdminPermissionGate';
export default function Layout(props: { children: ReactNode; params: Promise<{ lang: string }> }) { return <AdminPermissionGate {...props} permission="contacts.read" />; }
