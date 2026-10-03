'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Edit2, Trash2, Check, X, Loader2, GripVertical } from 'lucide-react';
import { HeroBanner } from '@/types/database';
import { getErrorMessage } from '@/lib/errors';
import { saveBanner, deleteBanner, setBannerActive } from './actions';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export default function BannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  type BannerForm = Omit<HeroBanner, 'id' | 'created_at' | 'updated_at'> & { id?: string };
  const [currentBanner, setCurrentBanner] = useState<BannerForm>({
    title: '',
    subtitle: '',
    image_url: '',
    mobile_image_url: '',
    cta_text: '',
    cta_link: '',
    sort_order: 0,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  
  const fetchBanners = useCallback(async () => {
    if (!supabaseUrl || !supabaseKey) {
      setError('Thiếu cấu hình Supabase.');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      setBanners(data || []);
    } catch (err: unknown) {
      console.error('Error fetching banners:', err);
      setError('Không thể tải danh sách banner. ' + getErrorMessage(err, ''));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchBanners(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchBanners]);

  const handleAddNew = () => {
    setCurrentBanner({
      title: '',
      subtitle: '',
      image_url: '',
      mobile_image_url: '',
      cta_text: '',
      cta_link: '',
      sort_order: banners.length,
      is_active: true
    });
    setIsEditing(true);
  };

  const handleEdit = (banner: HeroBanner) => {
    setCurrentBanner({ ...banner });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      await saveBanner(currentBanner);
      
      setIsEditing(false);
      setCurrentBanner({
        title: '',
        subtitle: '',
        image_url: '',
        mobile_image_url: '',
        cta_text: '',
        cta_link: '',
        sort_order: 0,
        is_active: true,
      });
      await fetchBanners();
    } catch (err: unknown) {
      console.error('Error saving banner:', err);
      setError('Lỗi khi lưu banner: ' + getErrorMessage(err, ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
    
    try {
      await deleteBanner(id);
      await fetchBanners();
    } catch (err: unknown) {
      console.error('Error deleting banner:', err);
      setError('Lỗi khi xóa banner: ' + getErrorMessage(err, ''));
    }
  };

  const toggleActive = async (banner: HeroBanner) => {
    try {
      await setBannerActive(banner.id, !banner.is_active);
      await fetchBanners();
    } catch (err: unknown) {
      setError('Lỗi cập nhật trạng thái: ' + getErrorMessage(err, ''));
    }
  };

  if (isEditing) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-[#1F2522]">
            {currentBanner.id ? 'Sửa Banner' : 'Thêm Banner Mới'}
          </h2>
          <button 
            onClick={() => setIsEditing(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tiêu đề (Title)</label>
              <input 
                type="text" 
                value={currentBanner.title || ''} 
                onChange={e => setCurrentBanner({...currentBanner, title: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#2B7935] focus:border-[#2B7935] outline-none"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phụ đề (Subtitle)</label>
              <input 
                type="text" 
                value={currentBanner.subtitle || ''} 
                onChange={e => setCurrentBanner({...currentBanner, subtitle: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#2B7935] focus:border-[#2B7935] outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Image URL (Desktop)</label>
              <input 
                type="text" 
                value={currentBanner.image_url || ''} 
                onChange={e => setCurrentBanner({...currentBanner, image_url: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#2B7935] focus:border-[#2B7935] outline-none"
                placeholder="https://..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mobile Image URL (Optional)</label>
              <input 
                type="text" 
                value={currentBanner.mobile_image_url || ''} 
                onChange={e => setCurrentBanner({...currentBanner, mobile_image_url: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#2B7935] focus:border-[#2B7935] outline-none"
                placeholder="https://..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">CTA Text</label>
              <input 
                type="text" 
                value={currentBanner.cta_text || ''} 
                onChange={e => setCurrentBanner({...currentBanner, cta_text: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#2B7935] focus:border-[#2B7935] outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">CTA Link</label>
              <input 
                type="text" 
                value={currentBanner.cta_link || ''} 
                onChange={e => setCurrentBanner({...currentBanner, cta_link: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#2B7935] focus:border-[#2B7935] outline-none"
                placeholder="/"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Thứ tự hiển thị (Sort Order)</label>
              <input 
                type="number" 
                value={currentBanner.sort_order || 0} 
                onChange={e => setCurrentBanner({...currentBanner, sort_order: parseInt(e.target.value) || 0})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#2B7935] focus:border-[#2B7935] outline-none"
              />
            </div>
            
            <div className="space-y-2 flex items-center h-full pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={currentBanner.is_active} 
                  onChange={e => setCurrentBanner({...currentBanner, is_active: e.target.checked})}
                  className="w-4 h-4 text-[#2B7935] focus:ring-[#2B7935] border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Hiển thị (Active)</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#2B7935] text-white rounded hover:bg-[#216F31] transition-colors flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Lưu Banner
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-100px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1F2522]">Quản lý Banners</h1>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#2B7935] text-white px-4 py-2 rounded-lg hover:bg-[#216F31] transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Thêm Banner
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#2B7935]" />
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-gray-500">Chưa có banner nào. Hãy thêm banner đầu tiên!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 w-10"></th>
                <th className="p-4 font-medium">Hình ảnh</th>
                <th className="p-4 font-medium">Thông tin</th>
                <th className="p-4 font-medium">Trạng thái</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-400">
                    <GripVertical className="w-5 h-5 cursor-move" />
                  </td>
                  <td className="p-4">
                    <div className="relative w-32 h-16 bg-gray-100 rounded overflow-hidden">
                      {banner.image_url ? (
                        <Image src={banner.image_url} alt={banner.title || 'Banner'} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{banner.title}</div>
                    {banner.subtitle && <div className="text-sm text-gray-500 truncate max-w-xs">{banner.subtitle}</div>}
                    <div className="text-xs text-gray-400 mt-1">Order: {banner.sort_order}</div>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleActive(banner)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {banner.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(banner)}
                        className="p-1.5 text-gray-500 hover:text-[#2B7935] hover:bg-green-50 rounded transition-colors"
                        title="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(banner.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
