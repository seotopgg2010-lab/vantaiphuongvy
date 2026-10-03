import Link from 'next/link';
import { Phone, Clock3 } from 'lucide-react';
import { localizedPath, toTelHref } from '@/lib/site';
import { SITE_CONFIG } from '@/lib/constants';

export function TopBar({ lang }: { lang: string }) {
  const links = [
    { label: 'Về chúng tôi', href: '/gioi-thieu' },
    { label: 'Tuyến vận chuyển', href: '/van-chuyen-hang-hoa' },
    { label: 'Cẩm nang', href: '/blog' },
    { label: 'Liên hệ', href: '/lien-he' },
  ];

  return (
    <div className="hidden border-b border-brief-gold/35 bg-brief-dark text-white md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[0.7rem] lg:px-8">
        <div className="flex items-center gap-5 text-sky-100">
          <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-brief-gold" aria-hidden="true" />Tư vấn {SITE_CONFIG.businessHours}</span>
          <a href={toTelHref(SITE_CONFIG.hotline)} className="inline-flex items-center gap-1.5 font-bold text-white transition hover:text-brief-gold"><Phone className="h-3.5 w-3.5 text-brief-gold" aria-hidden="true" />{SITE_CONFIG.hotline}</a>
        </div>
        <nav aria-label="Điều hướng nhanh" className="flex items-center divide-x divide-white/20">
          {links.map((link) => (
            <Link key={`${link.label}-${link.href}`} href={localizedPath(lang, link.href)} className="px-2.5 text-sky-100 transition hover:text-brief-gold first:pl-0">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
