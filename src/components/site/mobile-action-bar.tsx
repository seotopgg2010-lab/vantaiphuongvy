import Link from 'next/link';
import { FileText, MessageCircle, Phone } from 'lucide-react';
import { SITE_CONFIG, ZALO_URL } from '@/lib/constants';
import { toTelHref } from '@/lib/site';

/** Thumb-reachable conversion bar, mobile & tablet only. */
export function MobileActionBar() {
  return (
    <nav aria-label="Liên hệ nhanh" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgb(10_37_64/0.3)] backdrop-blur-md lg:hidden">
      <div className="grid h-[4.25rem] grid-cols-3">
        <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="flex flex-col items-center justify-center gap-1 text-xs font-semibold text-brand-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white"><Phone className="h-4 w-4" aria-hidden="true" /></span>Gọi ngay
        </a>
        <a href={ZALO_URL} target="_blank" rel="noopener" data-track="click_zalo" className="flex flex-col items-center justify-center gap-1 text-xs font-semibold text-[#0055d4]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0068ff] text-white"><MessageCircle className="h-4 w-4" aria-hidden="true" /></span>Zalo
        </a>
        <Link href="/lien-he/#bao-gia" className="flex flex-col items-center justify-center gap-1 text-xs font-semibold text-navy-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-navy-950"><FileText className="h-4 w-4" aria-hidden="true" /></span>Báo giá
        </Link>
      </div>
    </nav>
  );
}
