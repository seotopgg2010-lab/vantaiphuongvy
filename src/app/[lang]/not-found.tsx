'use client';

import Link from 'next/link';
import { Home, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toTelHref } from '@/lib/site';
import { SITE_CONFIG } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-bg-cream px-4 py-20">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="relative inline-block">
          <div className="select-none text-[150px] font-black leading-none text-brand-green/10 md:text-[200px]">404</div>
          <div className="absolute inset-0 flex items-center justify-center"><Home className="h-20 w-20 text-brand-green opacity-80" /></div>
        </div>
        <div>
          <h1 className="mb-4 text-3xl font-bold text-text md:text-4xl">Trang không tìm thấy</h1>
          <p className="mx-auto mb-8 max-w-lg text-lg text-text/70">Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi.</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/"><Button variant="cta" className="flex w-full items-center gap-2 sm:w-auto"><Home className="h-4 w-4" />Về trang chủ</Button></Link>
          <a href={toTelHref(SITE_CONFIG.hotline)}><Button variant="secondary" className="flex w-full items-center gap-2 sm:w-auto"><Phone className="h-4 w-4" />Gọi {SITE_CONFIG.hotline}</Button></a>
        </div>
      </div>
    </div>
  );
}
