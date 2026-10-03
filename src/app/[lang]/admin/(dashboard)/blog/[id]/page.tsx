'use client';
import React, { use, useState, useEffect } from 'react';
import { AdminForm } from '@/components/admin/AdminForm';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { BlogCategorySelect } from '@/components/admin/BlogCategorySelect';
import { updateBlog } from '../actions';
import { blogPosts } from '@/lib/data';
import { createBrowserClient } from '@supabase/ssr';
import { BlogPost } from '@/types/database';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditBlog({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('id', id).single()
      .then(({ data }) => {
        setPost(data || blogPosts.find((x) => x.slug === id) as unknown as BlogPost || { title: '', slug: '', category_id: '', is_published: true } as unknown as BlogPost);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await updateBlog(id, fd);
    if (result.success) alert('Đã cập nhật thành công');
    else alert('Lỗi: ' + (result.error || 'Không xác định'));
  };

  if (loading) return <div>Đang tải...</div>;
  if (!post) return <div>Không tìm thấy bài viết.</div>;

  return (
    <AdminForm title="Sửa Bài viết" backUrl="/admin/blog" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
          <input name="title" defaultValue={post.title ?? ''} required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input name="slug" defaultValue={post.slug ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <BlogCategorySelect defaultValue={post.category_id ?? ''} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trích dẫn (Excerpt)</label>
          <textarea name="excerpt" defaultValue={post.excerpt ?? ''} rows={3} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
          <RichTextEditor name="content" defaultValue={post.content ?? ''} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh bìa (URL)</label>
          <input name="cover_image_url" defaultValue={post.cover_image_url ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div className="flex items-center space-x-3 mt-4">
          <input type="checkbox" name="is_published" id="is_published" defaultChecked={post.is_published ?? false} className="w-4 h-4 text-[#2B7935] rounded focus:ring-[#2B7935]" />
          <label htmlFor="is_published" className="text-sm font-medium text-gray-700">Xuất bản</label>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input name="seo_title" defaultValue={post.seo_title ?? ''} placeholder="SEO Title" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea name="seo_description" defaultValue={post.seo_description ?? ''} rows={3} placeholder="Meta Description" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
        </div>
      </div>
    </AdminForm>
  );
}
