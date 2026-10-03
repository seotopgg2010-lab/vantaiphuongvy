'use client';
import React, { use, useState, useEffect } from 'react';
import { AdminForm } from '@/components/admin/AdminForm';
import { updateProject } from '../actions';
import { ProjectDetailFields } from '@/components/admin/ProjectDetailFields';
import { createBrowserClient } from '@supabase/ssr';
import { Project } from '@/types/database';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('projects').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        setProject(data || null);
        if (error) setError('Không tải được dự án. Kiểm tra quyền hoặc thử lại.');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await updateProject(id, fd);
    if (result.success) alert('Đã cập nhật thành công');
    else alert('Lỗi: ' + (result.error || 'Không xác định'));
  };

  if (loading) return <div>Đang tải...</div>;
  if (!project) return <div role="alert">{error || 'Không tìm thấy dự án.'}</div>;

  return (
    <AdminForm title="Sửa Dự án" backUrl="/admin/projects" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên dự án *</label>
          <input name="name" defaultValue={project.name ?? ''} required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input name="slug" defaultValue={project.slug ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí (Location)</label>
          <input name="location" defaultValue={project.location ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngành kinh doanh</label>
          <select name="business_type" defaultValue={project.business_type || 'Nail Salon'} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]">
            <option value="Nail Salon">Nail Salon</option>
            <option value="Spa">Spa</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Retail">Retail</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yêu cầu khách hàng</label>
          <textarea name="client_requirement" defaultValue={project.client_requirement ?? ''} rows={3} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Concept</label>
          <input name="concept" defaultValue={project.concept ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quy mô (Scope)</label>
          <input name="scope" defaultValue={project.scope ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea name="description" defaultValue={project.description ?? ''} rows={5} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div className="flex items-center space-x-3 mt-4">
          <input type="checkbox" name="is_featured" id="is_featured" defaultChecked={project.is_featured ?? false} className="w-4 h-4 text-[#2B7935] rounded focus:ring-[#2B7935]" />
          <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Dự án nổi bật</label>
        </div>
        <div className="flex items-center space-x-3 mt-2">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked={project.is_active !== false} className="w-4 h-4 text-[#2B7935] rounded focus:ring-[#2B7935]" />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Kích hoạt</label>
        </div>
        <div className="flex items-center space-x-3 mt-2">
          <input type="checkbox" name="is_published" id="is_published" defaultChecked={project.is_published ?? false} className="w-4 h-4 text-[#2B7935] rounded focus:ring-[#2B7935]" />
          <label htmlFor="is_published" className="text-sm font-medium text-gray-700">Đã duyệt để hiển thị công khai</label>
        </div>

        <ProjectDetailFields project={project} />
        <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input name="seo_title" defaultValue={project.seo_title ?? ''} placeholder="SEO Title" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea name="seo_description" defaultValue={project.seo_description ?? ''} rows={3} placeholder="Meta Description" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
        </div>
      </div>
    </AdminForm>
  );
}
