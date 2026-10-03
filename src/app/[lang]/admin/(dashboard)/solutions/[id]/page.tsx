'use client';
import React, { use, useState, useEffect } from 'react';
import { AdminForm } from '@/components/admin/AdminForm';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { updateSolution } from '../actions';
import { createBrowserClient } from '@supabase/ssr';
import { Solution } from '@/types/database';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditSolution({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('solutions').select('*').eq('id', id).single()
      .then(({ data }) => {
        setSolution(data || null);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await updateSolution(id, fd);
    if (result.success) alert('Đã cập nhật thành công');
    else alert('Lỗi: ' + (result.error || 'Không xác định'));
  };

  if (loading) return <div>Đang tải...</div>;
  if (!solution) return <div>Không tìm thấy giải pháp.</div>;

  return (
    <AdminForm title="Sửa Giải pháp" backUrl="/admin/solutions" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên giải pháp *</label>
          <input name="name" defaultValue={solution.name ?? ''} required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input name="slug" defaultValue={solution.slug ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
          <textarea name="short_description" defaultValue={solution.short_description ?? ''} rows={3} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
          <RichTextEditor name="description" defaultValue={solution.description ?? ''} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh Hero (URL)</label>
          <input name="hero_image_url" defaultValue={solution.hero_image_url ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div className="flex items-center space-x-3 mt-4">
          <label className="block w-full text-sm font-medium">Hạng mục cung cấp (mỗi dòng một mục)
            <textarea name="features" defaultValue={(solution.features || []).join('\n')} rows={5} className="mt-1 block w-full rounded-lg border p-2.5" />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium">Gallery (mỗi dòng một URL ảnh)
            <textarea name="images" defaultValue={(solution.images || []).join('\n')} rows={4} className="mt-1 block w-full rounded-lg border p-2.5" />
          </label>
        </div>
        <div className="flex items-center space-x-3 mt-4">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked={solution.is_active ?? false} className="w-4 h-4 text-[#2B7935] rounded focus:ring-[#2B7935]" />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Kích hoạt</label>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input name="seo_title" defaultValue={solution.seo_title ?? ''} placeholder="SEO Title" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea name="seo_description" defaultValue={solution.seo_description ?? ''} rows={3} placeholder="Meta Description" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
        </div>
      </div>
    </AdminForm>
  );
}
