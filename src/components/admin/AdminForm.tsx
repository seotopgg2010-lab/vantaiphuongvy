'use client';
import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface AdminFormProps {
  title: string;
  backUrl: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  saveText?: string;
  isLoading?: boolean;
}

export function AdminForm({ title, backUrl, onSubmit, children, saveText = 'Lưu', isLoading }: AdminFormProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const busy = pending || isLoading;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setPending(true); setError('');
    try { await onSubmit(event); }
    catch { setError('Không lưu được dữ liệu. Kiểm tra kết nối và thử lại.'); }
    finally { setPending(false); }
  }
  return (
    <div className="max-w-4xl">
      <div className="flex items-center mb-6 space-x-4">
        <Link aria-label="Quay lại danh sách" href={backUrl} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#1F2522]">{title}</h1>
      </div>
      
      <form onSubmit={submit} aria-busy={busy} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {error && <p role="alert" className="text-red-700">{error}</p>}
        {children}
        
        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={busy}
            className="px-6 py-2.5 bg-[#2B7935] text-white rounded-lg font-medium hover:bg-[#216F31] transition-colors disabled:opacity-70 flex items-center space-x-2"
          >
            {busy && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{busy ? 'Đang lưu...' : saveText}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
