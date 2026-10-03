'use client';
import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { AdminForm } from '@/components/admin/AdminForm';
import { saveSettings } from './actions';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const FALLBACK_SETTINGS = {
  company_name: 'Công ty TNHH Dịch vụ Vận tải Phương Vy',
  email: 'vanchuyenphuongvy@gmail.com',
  phone: '0933 871 139',
  hotline_germany: '0702 00 6839',
  zalo_link: 'https://zalo.me/0902939318',
  whatsapp_link: '',
  address_germany: '',
  address_hcm: '38H4, Đường DN9, KP4, P. Tân Hưng Thuận, Quận 12, TP.HCM',
  address_hanoi: '',
  facebook_url: 'https://www.facebook.com/vanchuyenphuongvy/',
  instagram_url: '',
  working_hours: '8h00–21h00',
  tagline: 'Chất lượng, nhanh chóng, uy tín là niềm tin!'
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (!error && data && data.length > 0) {
          const loadedSettings: Record<string, string> = {};
          data.forEach(item => {
            if (item.value !== null) loadedSettings[item.key] = item.value;
          });
          setSettings({ ...FALLBACK_SETTINGS, ...loadedSettings });
        }
      } catch {
        // use fallback
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await saveSettings(settings);
      if (!result.success) throw new Error(result.error || 'Không thể lưu cài đặt.');
      alert('Đã cập nhật cài đặt thành công');
    } catch {
      alert('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <AdminForm title="Cài đặt hệ thống" backUrl="/admin" onSubmit={handleSubmit}>
      <div className="space-y-6">
        
        {/* Contact Information */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty (company_name)</label>
              <input name="company_name" value={settings.company_name || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email liên hệ (email)</label>
              <input name="email" value={settings.email || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SĐT Việt Nam / Zalo (phone)</label>
              <input name="phone" value={settings.phone || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotline phụ (hotline_germany)</label>
              <input name="hotline_germany" value={settings.hotline_germany || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Zalo (zalo_link)</label>
              <input name="zalo_link" value={settings.zalo_link || ''} onChange={handleChange} placeholder="https://zalo.me/..." className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link WhatsApp (whatsapp_link)</label>
              <input name="whatsapp_link" value={settings.whatsapp_link || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
            </div>
          </div>
        </div>

        {/* Offices */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Offices (Địa chỉ)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ bổ sung (address_germany)</label>
              <input name="address_germany" value={settings.address_germany || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ TP.HCM (address_hcm)</label>
              <input name="address_hcm" value={settings.address_hcm || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Hà Nội (address_hanoi)</label>
              <input name="address_hanoi" value={settings.address_hanoi || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL (facebook_url)</label>
              <input name="facebook_url" value={settings.facebook_url || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL (instagram_url)</label>
              <input name="instagram_url" value={settings.instagram_url || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giờ làm việc (working_hours)</label>
            <input name="working_hours" value={settings.working_hours || ''} onChange={handleChange} placeholder="Thứ 2 - Thứ 6: 8:00 - 17:30" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
        </div>

        {/* Tagline */}
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tagline</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline hiển thị trên TopBar (tagline)</label>
            <input name="tagline" value={settings.tagline || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7935] focus:border-[#2B7935]" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="mt-4 px-4 py-2 bg-[#2B7935] text-white rounded-lg hover:bg-[#216F31]">
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>
    </AdminForm>
  );
}
