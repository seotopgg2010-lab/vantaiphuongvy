import Link from 'next/link';
import { Clock3, Mail, Phone } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { toTelHref } from '@/lib/site';

export function TopBar() {
  return (
    <div className="hidden bg-navy-950 text-[0.8125rem] text-sky-100/80 lg:block">
      <div className="container-x flex h-9 items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />Tư vấn {SITE_CONFIG.businessHours} mỗi ngày</span>
          {SITE_CONFIG.hotlines.map((phone) => (
            <a key={phone} href={toTelHref(phone)} data-track="click_call" className="inline-flex items-center gap-1.5 font-semibold text-white transition hover:text-accent-400">
              <Phone className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />{phone}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <a href={`mailto:${SITE_CONFIG.email}`} className="inline-flex items-center gap-1.5 transition hover:text-white"><Mail className="h-3.5 w-3.5" aria-hidden="true" />{SITE_CONFIG.email}</a>
          <Link href="/tuyen-dung/" className="transition hover:text-white">Tuyển dụng</Link>
          <Link href="/faq/" className="transition hover:text-white">Hỏi đáp</Link>
        </div>
      </div>
    </div>
  );
}
