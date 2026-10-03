'use client';
import React, { use, useState, useEffect } from 'react';
import { AdminForm } from '@/components/admin/AdminForm';
import { updateCategory } from '../actions';
import { createBrowserClient } from '@supabase/ssr';
import { Category } from '@/types/database';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditCategory({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('categories').select('*').eq('id', id).single()
      .then(({ data }) => {
        setCategory(data || null);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await updateCategory(id, fd);
    if (result.success) alert('Đã cập nhật thành công');
    else alert('Lỗi: ' + (result.error || 'Không xác định'));
  };

  if (loading) return <div>Đang tải...</div>;
  if (!category) return <div>Không tìm thấy danh mục.</div>;

  return (
    <AdminForm title="Sửa Danh mục" backUrl="/admin/categories" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
          <input name="name" defaultValue={category.name ?? ''} required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input name="slug" defaultValue={category.slug ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea name="description" defaultValue={category.description ?? ''} rows={3} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh (URL)</label>
          <input name="image_url" defaultValue={category.image_url ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
          <input type="number" name="sort_order" defaultValue={category.sort_order || 0} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div className="flex items-center space-x-3 mt-4">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked={category.is_active !== false} className="w-4 h-4 text-[#2B7935] rounded focus:ring-[#2B7935]" />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Kích hoạt</label>
        </div>
      </div>
    </AdminForm>
  );
}
