'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { deleteProduct } from './actions';
import { Product } from '@/types/database';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
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

  const handleDelete = async (item: Product) => {
    if (!confirm(`Xóa "${item.name}"?`)) return;
    const result = await deleteProduct(item.id);
    if (result.success) setItems(prev => prev.filter(i => i.id !== item.id));
    else setError(result.error || 'Không xóa được dữ liệu.');
  };

  const filtered = items.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { header: 'Tên', accessor: 'name' as const },
    { header: 'Danh mục', accessor: (item: Product) => item.category_id || '---' },
    { header: 'Trạng thái', accessor: (item: Product) => <StatusBadge active={item.is_active} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#1F2522]">Sản phẩm</h1>
        <Link href="/admin/products/new" className="px-4 py-2 bg-[#2B7935] text-white rounded-lg hover:bg-[#216F31] transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>Thêm sản phẩm</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3">
        <Search className="text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Tìm kiếm sản phẩm..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
        />
      </div>

      {error && <p role="alert" className="text-red-700">{error}</p>}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <AdminTable
          columns={columns}
          data={filtered}
          onEdit={(item) => `/admin/products/${item.id}`}
          onDelete={handleDelete}
          keyField="id"
        />
      )}
    </div>
  );
}
