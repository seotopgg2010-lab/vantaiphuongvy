'use client';
import React, { use, useState, useEffect } from 'react';
import { AdminForm } from '@/components/admin/AdminForm';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { updateShippingRoute } from '../actions';
import { shippingRoutes } from '@/lib/data';
import { createBrowserClient } from '@supabase/ssr';
import { ShippingRoute } from '@/types/database';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditShippingRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [route, setRoute] = useState<ShippingRoute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('shipping_routes').select('*').eq('id', id).single()
      .then(({ data }) => {
        setRoute(data || shippingRoutes.find((x) => x.id === id || x.slug === id) as unknown as ShippingRoute || { name: '', slug: '', is_active: true } as unknown as ShippingRoute);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await updateShippingRoute(id, fd);
    if (result.success) alert('Đã cập nhật thành công');
    else alert('Lỗi: ' + (result.error || 'Không xác định'));
  };

  if (loading) return <div>Đang tải...</div>;
  if (!route) return <div>Không tìm thấy tuyến vận chuyển.</div>;

  return (
    <AdminForm title="Sửa Tuyến" backUrl="/admin/shipping" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên tuyến *</label>
          <input name="name" defaultValue={route.name ?? ''} required className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input name="slug" defaultValue={route.slug ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quốc gia</label>
          <input name="country" defaultValue={route.country ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <RichTextEditor name="description" defaultValue={route.description ?? ''} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian vận chuyển (transit info)</label>
          <input name="transit_info" defaultValue={route.transit_info ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thông tin dịch vụ (JSON)</label>
          <textarea
            name="service_types"
            defaultValue={JSON.stringify(route.service_types || {}, null, 2)}
            rows={6}
            placeholder='{"goods":["Hàng hóa thông thường","Bảng hiệu"],"air":"3-5 ngày","sea":"30-45 ngày","packing":"Đóng kiện gỗ tiêu chuẩn"}'
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935] font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Key hỗ trợ: goods, air, sea, packing, process (mảng), price_notes, time_notes, faqs (mảng question/answer)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh Hero (URL)</label>
          <input name="hero_image_url" defaultValue={route.hero_image_url ?? ''} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh tuyến vận chuyển (mỗi URL một dòng)</label>
          <textarea name="images" rows={4} defaultValue={(route.images || []).join('\n')} placeholder="https://.../route-1.jpg" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
        </div>
        <div className="flex items-center space-x-3 mt-4">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked={route.is_active ?? false} className="w-4 h-4 text-[#2B7935] rounded focus:ring-[#2B7935]" />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Kích hoạt</label>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input name="seo_title" defaultValue={route.seo_title ?? ''} placeholder="SEO Title" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea name="seo_description" defaultValue={route.seo_description ?? ''} rows={3} placeholder="Meta Description" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
        </div>
      </div>
    </AdminForm>
  );
}
