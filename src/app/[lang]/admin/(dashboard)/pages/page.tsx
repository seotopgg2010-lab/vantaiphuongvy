'use client';
import React, { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { PageSectionEditor } from '@/components/admin/PageSectionEditor';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { deletePage } from './actions';
import { Page } from '@/types/database';
import { getErrorMessage } from '@/lib/errors';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export default function PagesListPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (err: unknown) {
      alert('Lỗi khi tải danh sách trang: ' + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchPages(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchPages]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa trang này?')) {
      const res = await deletePage(id);
      if (res.success) {
        alert('Đã xóa trang');
        fetchPages();
      } else {
        alert('Lỗi khi xóa trang: ' + res.error);
      }
    }
  };

  const columns: Column<Page>[] = [
    { header: 'Tiêu đề', accessor: 'title' },
    { header: 'Slug', accessor: 'slug' },
    {
      header: 'Trạng thái',
      accessor: (row: Page) => (
        <StatusBadge status={row.is_published ? 'published' : 'draft'} />
      )
    },
    {
      header: 'Hành động',
      accessor: (row: Page) => (
        <div className="flex gap-3">
          <Link
            href={`/admin/pages/${row.id}`}
            className="text-[#2B7935] hover:underline"
          >
            Sửa
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-[#CB120F] hover:underline"
          >
            Xóa
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1F2522]">Quản lý Trang CMS</h1>
        <Link
          href="/admin/pages/new"
          className="bg-[#2B7935] text-white px-4 py-2 rounded-lg hover:bg-[#216F31] transition-colors"
        >
          Thêm trang mới
        </Link>
      </div>

      <PageSectionEditor />

      <AdminTable
        data={pages}
        columns={columns}
        loading={loading}
      />
    </div>
  );
}
