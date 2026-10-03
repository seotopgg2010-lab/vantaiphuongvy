'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const isSupabaseAvailable = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseAvailable) {
      setError('Hệ thống đăng nhập chưa được cấu hình. Vui lòng liên hệ quản trị viên.');
      return;
    }

    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(`/${lang}/admin`);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F1]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-[#0d2b3e]">Quản trị Vận tải Phương Vy</h1>
        <p className="mb-6 text-center text-sm text-slate-600">Khu vực nội bộ</p>
        {error && (
          <div role="alert" className="bg-red-50 text-[#CB120F] p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-[#1F2522] mb-1">Email</label>
            <input
              id="admin-email"
              autoComplete="username"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B7935]"
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-[#1F2522] mb-1">Mật khẩu</label>
            <input
              id="admin-password"
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B7935]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !isSupabaseAvailable}
            className="w-full bg-[#1175bc] hover:bg-[#0b5d96] text-white font-medium py-2 px-4 rounded transition-colors"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
