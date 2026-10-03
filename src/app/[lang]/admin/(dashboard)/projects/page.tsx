'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { deleteProject } from './actions';
import { Project } from '@/types/database';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setItems(data || []);
      } catch {
        setError('Không tải được danh sách dự án. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (item: Project) => {
    if (!confirm(`Xóa "${item.name}"?`)) return;
    const result = await deleteProject(item.id);
    if (result.success) setItems(prev => prev.filter(i => i.id !== item.id));
    else setError(result.error || 'Không xóa được dự án.');
  };

  const columns: Column<Project>[] = [
    { header: 'Tên', accessor: 'name' },
    { header: 'Vị trí', accessor: 'location' },
    { header: 'Trạng thái', accessor: (item: Project) => <span className="flex gap-2"><StatusBadge active={item.is_active} /><StatusBadge active={item.is_published} /></span> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dự án</h1>
        <Link href="/admin/projects/new" className="px-4 py-2 bg-[#2B7935] text-white rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" /> <span>Thêm dự án</span>
        </Link>
      </div>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <AdminTable 
          columns={columns} 
          data={items} 
          onEdit={(item) => `/admin/projects/${item.id}`} 
          onDelete={handleDelete}
          keyField="id" 
        />
      )}
    </div>
  );
}
