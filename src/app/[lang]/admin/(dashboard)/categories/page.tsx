'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { deleteCategory } from './actions';
import { Category } from '@/types/database';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
        if (error) throw error;
        setItems(data || []);
      } catch {
        setError('Không tải được dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (item: Category) => {
    if (!confirm(`Xóa "${item.name}"?`)) return;
    const result = await deleteCategory(item.id);
    if (result.success) setItems(prev => prev.filter(i => i.id !== item.id));
    else setError(result.error || 'Không xóa được dữ liệu.');
  };

  const handleEdit = (item: Category) => {
    return `/admin/categories/${item.id}`;
  };

  const columns = [
    { header: 'Tên', accessor: 'name' as keyof Category },
    { header: 'Slug', accessor: 'slug' as keyof Category },
    { header: 'Sắp xếp', accessor: 'sort_order' as keyof Category },
    { header: 'Trạng thái', accessor: (item: Category) => <StatusBadge active={item.is_active !== false} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#1F2522]">Quản lý Danh mục</h1>
        <Link href="/admin/categories/new" className="px-4 py-2 bg-[#2B7935] text-white rounded-lg hover:bg-[#216F31] transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>Thêm danh mục</span>
        </Link>
      </div>
      
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <AdminTable 
          columns={columns} 
          data={items} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          keyField="id" 
        />
      )}
    </div>
  );
}
