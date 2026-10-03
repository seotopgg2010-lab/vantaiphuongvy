'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AdminForm } from '@/components/admin/AdminForm';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { createPage } from '../actions';


export default function NewPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    formData.append('content', content);

    const res = await createPage(formData);
    
    if (res.success) {
      alert('Đã thêm trang mới');
      router.push('/admin/pages');
      router.refresh();
    } else {
      alert('Lỗi khi thêm trang: ' + res.error);
      setIsSubmitting(false);
    }
  };

  return (
    <AdminForm
      title="Thêm Trang Mới"
      backUrl="/admin/pages"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-[#1F2522]">Tiêu đề</label>
          <input
            type="text"
            name="title"
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]"
            placeholder="Ví dụ: Giới thiệu"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#1F2522]">Slug (Tùy chọn)</label>
          <input
            type="text"
            name="slug"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]"
            placeholder="gioi-thieu (để trống để tự động tạo)"
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
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#1F2522]">SEO Description</label>
          <textarea
            name="seo_description"
            rows={3}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked
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
            {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
          </button>
        </div>
      </div>
    </AdminForm>
  );
}
