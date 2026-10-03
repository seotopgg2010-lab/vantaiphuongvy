'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { deleteBlog } from './actions';
import { BlogPost } from '@/types/database';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
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

  const handleDelete = async (item: BlogPost) => {
    if (!confirm(`Xóa "${item.title}"?`)) return;
    const result = await deleteBlog(item.id);
    if (result.success) setItems(prev => prev.filter(i => i.id !== item.id));
    else setError(result.error || 'Không xóa được dữ liệu.');
  };

  const columns = [
    { header: 'Tiêu đề', accessor: 'title' as const },
    { header: 'Tác giả', accessor: 'author' as const },
    { header: 'Trạng thái', accessor: (item: BlogPost) => <StatusBadge active={item.is_published} activeText="Đã xuất bản" inactiveText="Bản nháp" /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1F2522]">Bài viết Blog</h1>
        <Link href="/admin/blog/new" className="px-4 py-2 bg-[#2B7935] text-white rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" /> <span>Thêm bài viết</span>
        </Link>
      </div>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <AdminTable 
          columns={columns} 
          data={items} 
          onEdit={(item) => `/admin/blog/${item.id}`} 
          onDelete={handleDelete} 
          keyField="id" 
        />
      )}
    </div>
  );
}
