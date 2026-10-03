'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { AdminForm } from '@/components/admin/AdminForm';
import { createNavItem } from '../actions';
import { NavigationItem } from '@/types/database';

export default function NewNavigationItemPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentItems, setParentItems] = useState<Pick<NavigationItem, 'id' | 'label'>[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchParents = async () => {
      const { data } = await supabase.from('navigation_items').select('id, label').order('sort_order');
      if (data) setParentItems(data);
    };
    fetchParents();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await createNavItem(formData);

    if (result.success) {
      alert('Đã thêm menu item');
      router.push('/admin/navigation');
      router.refresh();
    } else {
      alert('Lỗi: ' + result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <AdminForm title="Thêm menu item" backUrl="/admin/navigation" onSubmit={handleSubmit} isLoading={isSubmitting}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label <span className="text-red-500">*</span></label>
          <input type="text" name="label" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
          <input type="text" name="url" placeholder="/san-xuat-cung-ung" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Menu cha</label>
          <select name="parent_id" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]">
            <option value="">— Không (Top level) —</option>
            {parentItems.map(item => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input type="text" name="image_url" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
          <input type="number" name="sort_order" defaultValue={0} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer">
            <input type="checkbox" name="is_active" defaultChecked className="w-5 h-5 text-[#2B7935] border-gray-300 rounded focus:ring-[#2B7935]" />
            <span className="text-sm font-medium text-gray-900">Hiển thị</span>
          </label>
        </div>
      </div>
    </AdminForm>
  );
}
