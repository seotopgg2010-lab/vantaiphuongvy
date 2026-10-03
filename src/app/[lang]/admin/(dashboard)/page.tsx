'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Package, FolderOpen, FileText, Mail, PlusCircle, Eye } from 'lucide-react';
import { getDashboardData } from './dashboard-actions';

export default function AdminDashboard() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang || 'vi';
  const [counts, setCounts] = useState({ products: '--', projects: '--', blog_posts: '--', contacts: '--' });

  const [access, setAccess] = useState({ canReadContent: false, canWriteContent: false, canReadContacts: false });
  useEffect(() => {
    let active = true;
    void getDashboardData().then((data) => { if (active) { setCounts(data.counts); setAccess(data); } }).catch(() => {});
    return () => { active = false; };
  }, []);

  const currentDate = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const stats = [
    { label: 'Tổng sản phẩm', count: counts.products, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tổng dự án', count: counts.projects, icon: FolderOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Bài viết blog', count: counts.blog_posts, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Yêu cầu mới', count: counts.contacts, icon: Mail, color: 'text-[#CB120F]', bg: 'bg-red-50' },
  ].filter((stat) => stat.icon === Mail ? access.canReadContacts : access.canReadContent);

  const quickActions = [
    { label: 'Thêm sản phẩm', href: `/${lang}/admin/products/new`, icon: PlusCircle },
    { label: 'Thêm bài viết', href: `/${lang}/admin/blog/new`, icon: PlusCircle },
    { label: 'Xem yêu cầu', href: `/${lang}/admin/contacts`, icon: Eye },
  ].filter((action) => action.icon === Eye ? access.canReadContacts : access.canWriteContent);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2522]">Chào mừng trở lại!</h1>
        <p className="text-gray-500 mt-1">{currentDate}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                <p className="text-3xl font-bold text-[#1F2522] mt-1">{stat.count}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#1F2522]">Thao tác nhanh</h2>
        </div>
        <div className="p-6 flex flex-wrap gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link 
                key={idx} 
                href={action.href}
                className="flex items-center space-x-2 px-4 py-2.5 bg-[#FAF8F1] border border-[#F1D478] text-[#AF8526] hover:bg-[#F1D478]/20 rounded-lg font-medium transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
