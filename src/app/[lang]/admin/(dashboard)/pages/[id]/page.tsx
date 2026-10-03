'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { AdminForm } from '@/components/admin/AdminForm';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { updatePage } from '../actions';
import { Page } from '@/types/database';
import { getErrorMessage } from '@/lib/errors';


export default function EditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [page, setPage] = useState<Page | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        if (data) {
          setPage(data);
          setContent(data.content || '');
        }
      } catch (err: unknown) {
        alert('Lỗi khi tải trang: ' + getErrorMessage(err));
        router.push('/admin/pages');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [params.id, router, supabase]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    formData.append('content', content);

    const res = await updatePage(params.id, formData);
    
    if (res.success) {
      alert('Đã cập nhật trang');
      router.push('/admin/pages');
      router.refresh();
    } else {
      alert('Lỗi khi cập nhật: ' + res.error);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4">Đang tải...</div>;
  }

  if (!page) {
    return null;
  }

  return (
    <AdminForm
      title="Sửa Trang CMS"
      backUrl="/admin/pages"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-[#1F2522]">Tiêu đề</label>
          <input
            type="text"
            name="title"
            defaultValue={page.title}
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#1F2522]">Slug</label>
          <input
            type="text"
            name="slug"
            defaultValue={page.slug}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#1F2522]">Nội dung</label>
          <div className="bg-white">
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#1F2522]">SEO Title</label>
          <input
            type="text"
            name="seo_title"
            defaultValue={page.seo_title || ''}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#1F2522]">SEO Description</label>
          <textarea
            name="seo_description"
            defaultValue={page.seo_description || ''}
            rows={3}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={page.is_published}
              className="w-4 h-4 text-[#2B7935] focus:ring-[#2B7935] border-gray-300 rounded"
            />
            <span className="font-medium text-[#1F2522]">Xuất bản</span>
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#2B7935] text-white px-6 py-2.5 rounded-lg hover:bg-[#216F31] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </AdminForm>
  );
}
