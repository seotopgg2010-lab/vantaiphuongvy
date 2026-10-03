import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Mail,
  Settings,
  Users,
  LogOut,
  FileStack,
  HelpCircle,
  Menu as MenuIcon
} from 'lucide-react';
import { signOut } from '../actions';
import { hasPermission } from '@/lib/admin-permissions';

export const metadata: Metadata = {
  title: 'Quản trị Vận tải Phương Vy',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.app_metadata?.role || !['admin', 'editor', 'support'].includes(user.app_metadata.role)) {
    redirect(`/${lang}/admin/login`);
  }

  const role = user.app_metadata.role;
  const adminBase = `/${lang}/admin`;
  const navItems = [
    { name: 'Dashboard', href: adminBase, icon: LayoutDashboard },
    ...(hasPermission(user.app_metadata, 'content.read') ? [
      { name: 'Blog', href: `${adminBase}/blog`, icon: FileText },
      { name: 'Media', href: `${adminBase}/media`, icon: ImageIcon },
      { name: 'Trang CMS', href: `${adminBase}/pages`, icon: FileStack },
      { name: 'FAQ', href: `${adminBase}/faqs`, icon: HelpCircle },
      { name: 'Menu/Nav', href: `${adminBase}/navigation`, icon: MenuIcon },
    ] : []),
    ...(hasPermission(user.app_metadata, 'contacts.read') ? [{ name: 'Liên hệ', href: `${adminBase}/contacts`, icon: Mail }] : []),
    ...(role === 'admin' ? [{ name: 'Nhân viên', href: `${adminBase}/staff`, icon: Users }] : []),
    ...(hasPermission(user.app_metadata, 'settings.manage') ? [{ name: 'Cài đặt', href: `${adminBase}/settings`, icon: Settings }] : []),
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF8F1]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-[#2B7935]">Admin Panel</h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded text-[#1F2522] hover:bg-gray-100 transition-colors"
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <form action={signOut.bind(null, lang)}>
            <button type="submit" className="flex items-center space-x-3 px-3 py-2 w-full rounded text-[#CB120F] hover:bg-red-50 transition-colors">
              <LogOut size={20} />
              <span>Đăng xuất</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <details className="border-b bg-white p-4 md:hidden"><summary className="cursor-pointer font-semibold">Menu quản trị</summary><nav aria-label="Menu quản trị di động" className="mt-3 grid grid-cols-2 gap-2">{navItems.map((item) => <Link key={item.href} href={item.href} className="rounded border p-2 text-sm">{item.name}</Link>)}</nav><form action={signOut.bind(null, lang)}><button className="mt-3 rounded border px-3 py-2 text-red-700">Đăng xuất</button></form></details>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
