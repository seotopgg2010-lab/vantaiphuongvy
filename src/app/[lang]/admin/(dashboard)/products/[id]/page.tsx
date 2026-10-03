'use client';
import React, { use, useState, useEffect } from 'react';
import { AdminForm } from '@/components/admin/AdminForm';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { updateProduct } from '../actions';
import { createBrowserClient } from '@supabase/ssr';
import { Product } from '@/types/database';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data }) => {
        setProduct(data || null);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await updateProduct(id, fd);
    alert(result.success ? 'Đã cập nhật thành công' : `Lỗi: ${result.error || 'Không xác định'}`);
  };

  if (loading) return <div>Đang tải...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  return (
    <AdminForm title="Sửa Sản phẩm" backUrl="/admin/products" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
          <input name="name" defaultValue={product.name ?? ''} required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input name="slug" defaultValue={product.slug ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <select name="category_id" defaultValue={product.category_id ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]">
            <option value="noi-that-theo-concept">Nội thất theo concept</option>
            <option value="bang-hieu-nhan-dien">Bảng hiệu & Nhận diện</option>
            <option value="an-pham-bao-bi">Ấn phẩm & Bao bì</option>
            <option value="decor-trung-bay">Decor & Trưng bày</option>
            <option value="thiet-bi-vat-dung">Thiết bị & Vật dụng</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
          <textarea name="short_description" defaultValue={product.short_description ?? ''} rows={3} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả vận chuyển quốc tế</label>
          <textarea name="shipping_description" defaultValue={product.shipping_description ?? ''} rows={3} placeholder="Thiết kế, sản xuất tại Việt Nam và vận chuyển tận nơi đến Mỹ, Canada, Úc, Châu Âu..." className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
          <RichTextEditor name="description" defaultValue={product.description || ''} />
        </div>
        <div className="flex items-center space-x-3 mt-4">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked={product.is_active ?? false} className="w-4 h-4 text-[#2B7935] rounded focus:ring-[#2B7935]" />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Kích hoạt</label>
        </div>

        {/* Industry Links – Liên kết theo ngành */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">Ứng dụng theo ngành (hiển thị link trên trang sản phẩm)</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="industry_nail_spa" id="industry_nail_spa" defaultChecked={product.industry_links?.nail_spa ?? false} className="w-4 h-4 text-[#2B7935] rounded focus:ring-[#2B7935]" />
              <label htmlFor="industry_nail_spa" className="text-sm text-gray-700">Nail, Salon & Spa</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="industry_restaurant_fnb" id="industry_restaurant_fnb" defaultChecked={product.industry_links?.restaurant_fnb ?? false} className="w-4 h-4 text-[#2B7935] rounded focus:ring-[#2B7935]" />
              <label htmlFor="industry_restaurant_fnb" className="text-sm text-gray-700">Restaurant & F&B</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="industry_retail_shop" id="industry_retail_shop" defaultChecked={product.industry_links?.retail_shop ?? false} className="w-4 h-4 text-[#2B7935] rounded focus:ring-[#2B7935]" />
              <label htmlFor="industry_retail_shop" className="text-sm text-gray-700">Retail & Shop</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="industry_wedding_event" id="industry_wedding_event" defaultChecked={product.industry_links?.wedding_event ?? false} className="w-4 h-4 text-[#2B7935] rounded focus:ring-[#2B7935]" />
              <label htmlFor="industry_wedding_event" className="text-sm text-gray-700">Wedding & Event</label>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input name="seo_title" defaultValue={product.seo_title ?? ''} placeholder="SEO Title" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea name="seo_description" defaultValue={product.seo_description ?? ''} rows={3} placeholder="Meta Description" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
        </div>
      </div>
    </AdminForm>
  );
}
