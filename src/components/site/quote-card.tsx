import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import { SITE_CONFIG, ZALO_URL } from '@/lib/constants';
import { toTelHref } from '@/lib/site';

/** Sticky sidebar conversion card used on service/route pages. */
export function QuoteCard({ heading = 'Nhận báo giá trong 5 phút', context }: { heading?: string; context?: string }) {
  return (
    <aside aria-label="Yêu cầu báo giá" className="overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-lift)]">
      <div className="bg-grid-navy px-6 py-5 text-white">
        <p className="eyebrow eyebrow-light">Báo giá miễn phí</p>
        <p className="mt-2 text-lg font-bold leading-snug text-white">{heading}</p>
        {context && <p className="mt-1 text-sm text-sky-100/80">{context}</p>}
      </div>
      <div className="space-y-4 px-6 py-5">
        <ul className="space-y-2 text-sm text-muted">
          {['Nhận hàng tận nơi, giao tận tay', 'Báo giá rõ ràng, không phát sinh', 'Có hóa đơn & bảo hiểm hàng hóa'].map((point) => (
            <li key={point} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />{point}</li>
          ))}
        </ul>
        <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="btn btn-primary w-full"><Phone className="h-4 w-4" aria-hidden="true" />Gọi {SITE_CONFIG.hotline}</a>
        <div className="grid grid-cols-2 gap-2">
          <a href={ZALO_URL} target="_blank" rel="noopener" data-track="click_zalo" className="btn btn-outline btn-sm"><MessageCircle className="h-4 w-4 text-[#0068ff]" aria-hidden="true" />Zalo</a>
          <Link href="/lien-he/#bao-gia" className="btn btn-outline btn-sm">Gửi yêu cầu <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <p className="text-center text-xs text-subtle">Tư vấn {SITE_CONFIG.businessHours} · Hotline 2: <a href={toTelHref(SITE_CONFIG.hotlines[1])} className="font-semibold text-ink">{SITE_CONFIG.hotlines[1]}</a></p>
      </div>
    </aside>
  );
}
