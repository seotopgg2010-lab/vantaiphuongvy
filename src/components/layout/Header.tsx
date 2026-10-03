'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { localizedPath } from '@/lib/site';
import { MobileMenu } from './MobileMenu';
import { usePathname } from 'next/navigation';
import { getBriefNavigation } from '@/content/brief-navigation';

type DesktopLink = { vi: string; en: string; href: string; menu?: string };
const DESKTOP_LINKS: DesktopLink[] = [
  { vi: 'Vận chuyển hàng hóa', en: 'Freight transport', href: '/van-chuyen-hang-hoa', menu: 'Vận chuyển hàng hóa' as string },
  { vi: 'Dịch vụ chuyên biệt', en: 'Specialized services', href: '/van-chuyen-hang-hoa', menu: 'Dịch vụ chuyên biệt' as string },
  { vi: 'Thuê xe tải', en: 'Truck rental', href: '/thue-xe-tai', menu: 'Thuê xe tải' as string },
  { vi: 'Hỗ trợ', en: 'Support', href: '/faq', menu: 'Thông tin hỗ trợ' as string },
  { vi: 'Cẩm nang', en: 'Guides', href: '/blog' },
  { vi: 'Liên hệ', en: 'Contact', href: '/lien-he' },
] as const;

export function Header({ lang, dict }: { lang: string; dict: Dictionary }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isEnglish = lang.toLowerCase().startsWith('en');
  const pathname = usePathname();
  const publicPathname = localizedPath(lang, pathname);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setActiveMenu(null); setIsSearchOpen(false); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);
  const selectedMenu = getBriefNavigation(lang).find(group => group.label === activeMenu);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-brief-neutral bg-white/95 shadow-[0_4px_24px_rgba(13,43,62,.08)] backdrop-blur-md">
        <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:h-[5.5rem] lg:px-8">
          <button
            type="button"
            className="rounded-md p-2 text-brief-ink transition hover:bg-brief-champagne focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brief-red lg:hidden"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href={localizedPath(lang, '/')} className="shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brief-red" aria-label="Vận tải Phương Vy home">
            <Image src="https://vantaiphuongvy.com/wp-content/uploads/2018/07/logo-van-tai-phuong-vy-2.png" alt="Vận tải Phương Vy" width={220} height={65} priority className="h-9 w-auto object-contain sm:h-11 lg:h-12" />
          </Link>

          <nav aria-label={isEnglish ? 'Main navigation' : 'Điều hướng chính'} className="ml-auto hidden items-center gap-3 lg:flex" onMouseLeave={() => setActiveMenu(null)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveMenu(null); }}>
            {DESKTOP_LINKS.map(link => {
              const hasMenu = Boolean(link.menu);
              const linkPath = localizedPath(lang, link.href);
              const active = publicPathname === linkPath || publicPathname.startsWith(`${linkPath}/`);
              return <div key={link.vi} className="flex items-center">
                <Link href={localizedPath(lang, link.href)} aria-current={active ? 'page' : undefined} onMouseEnter={() => setActiveMenu(hasMenu ? link.menu ?? null : null)} onClick={() => setActiveMenu(null)} className={`border-b-2 py-2 text-xs transition hover:border-brief-gold hover:text-brief-red ${active ? 'border-brief-red text-brief-red' : 'border-transparent text-brief-ink'}`}>{isEnglish ? link.en : link.vi}</Link>
                {hasMenu && <button type="button" className="p-1 text-brief-soft-ink" aria-label={`${isEnglish ? 'Expand' : 'Mở menu'} ${isEnglish ? link.en : link.vi}`} aria-expanded={activeMenu === link.menu} aria-controls="desktop-service-menu" onClick={() => setActiveMenu(activeMenu === link.menu ? null : link.menu ?? null)}><ChevronDown className="h-3 w-3" aria-hidden="true" /></button>}
              </div>;
            })}
            {selectedMenu && <div id="desktop-service-menu" className="absolute inset-x-0 top-full max-h-[min(34rem,calc(100vh-6rem))] overflow-y-auto border-t border-brief-gold/30 bg-white shadow-xl">
              <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-8 gap-y-7 px-8 py-8">
                {selectedMenu.items.map(group => <div key={group.label}><p className="mb-3 text-sm font-semibold text-brief-ink">{group.label}</p><ul className="space-y-2">{group.items.map(item => <li key={item.label}><Link href={localizedPath(lang, item.href)} onClick={() => setActiveMenu(null)} className="text-sm text-brief-soft-ink hover:text-brief-red">{item.label}</Link></li>)}</ul></div>)}
              </div>
            </div>}
          </nav>

          <button type="button" onClick={() => { setIsSearchOpen(!isSearchOpen); setActiveMenu(null); }} aria-expanded={isSearchOpen} aria-controls="site-search" className="ml-auto rounded-md p-2 text-brief-ink transition hover:bg-brief-champagne focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brief-red xl:ml-1" aria-label={dict.header.searchPlaceholder}>
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="ml-auto hidden shrink-0 sm:block xl:ml-0"><Link href={localizedPath(lang, '/lien-he')} className="brief-button-primary rounded-md px-4 py-2 sm:px-5">
            {isEnglish ? 'Get a quote' : 'Báo giá nhanh'}
          </Link></div>
        </div>
        {isSearchOpen && <form id="site-search" action={localizedPath(lang, '/tim-kiem')} method="get" className="mx-auto flex max-w-7xl gap-3 border-t border-brief-neutral px-4 py-4 sm:px-6 lg:px-8">
          <label htmlFor="site-search-query" className="sr-only">{isEnglish ? 'Search products and services' : 'Tìm sản phẩm, dịch vụ'}</label>
          <input id="site-search-query" name="q" type="search" autoFocus required maxLength={120} placeholder={isEnglish ? 'Find products and services…' : 'Tìm sản phẩm, dịch vụ…'} className="min-w-0 flex-1 rounded-lg border border-brief-neutral px-4 py-3 text-sm text-brief-ink focus:border-brief-red focus:outline-none" />
          <button type="submit" className="brief-button-primary rounded-md">{isEnglish ? 'Search' : 'Tìm'}</button>
        </form>}
      </header>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} lang={lang} dict={dict} />
    </>
  );
}
