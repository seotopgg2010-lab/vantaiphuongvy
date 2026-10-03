'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { deleteSolution } from './actions';
import { Solution } from '@/types/database';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SolutionsPage() {
  const [items, setItems] = useState<Solution[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase.from('solutions').select('*').order('sort_order', { ascending: true });
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

  const handleDelete = async (item: Solution) => {
    if (!confirm(`Xóa "${item.name}"?`)) return;
    const result = await deleteSolution(item.id);
    if (result.success) setItems(prev => prev.filter(i => i.id !== item.id));
    else setError(result.error || 'Không xóa được dữ liệu.');
  };

  const columns = [
    { header: 'Tên', accessor: 'name' as const },
    { header: 'Trạng thái', accessor: (item: Solution) => <StatusBadge active={item.is_active} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1F2522]">Giải pháp</h1>
        <Link href="/admin/solutions/new" className="px-4 py-2 bg-[#2B7935] text-white rounded-lg hover:bg-[#216F31] transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>Thêm giải pháp</span>
        </Link>
      </div>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Đang tải...</div>
      ) : (
        <AdminTable
          columns={columns}
          data={items}
          onEdit={(item) => `/admin/solutions/${item.id}`}
          onDelete={handleDelete}
          keyField="id"
        />
      )}
    </div>
  );
}
