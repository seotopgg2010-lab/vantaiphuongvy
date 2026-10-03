'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminForm } from '@/components/admin/AdminForm';
import { createFaq } from '../actions';

export default function NewFaqPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await createFaq(formData);

    if (result.success) {
      alert('Đã thêm FAQ mới');
      router.push('/admin/faqs');
      router.refresh();
    } else {
      alert('Lỗi khi thêm FAQ: ' + result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <AdminForm title="Thêm FAQ mới" backUrl="/admin/faqs" onSubmit={handleSubmit} isLoading={isSubmitting}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Câu hỏi <span className="text-red-500">*</span></label>
          <input type="text" name="question" required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trả lời <span className="text-red-500">*</span></label>
          <textarea name="answer" required rows={4} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <input type="text" name="category" placeholder="VD: Vận chuyển, Sản phẩm" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
            <input type="number" name="sort_order" defaultValue={0} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
        </div>
        <div>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer">
            <input type="checkbox" name="is_active" defaultChecked className="w-5 h-5 text-[#2B7935] border-gray-300 rounded focus:ring-[#2B7935]" />
            <span className="text-sm font-medium text-gray-900">Hiển thị</span>
          </label>
        </div>
      </div>
    </AdminForm>
  );
}
