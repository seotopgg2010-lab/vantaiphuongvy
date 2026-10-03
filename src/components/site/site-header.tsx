'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronDown, Menu, Phone, Search, X } from 'lucide-react';
import type { NavLink, SiteNavigation } from '@/lib/navigation';
import { SITE_CONFIG, ZALO_URL } from '@/lib/constants';
import { toTelHref } from '@/lib/site';

type MenuKey = 'routes' | 'services' | null;

const fold = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

function useRouteFilter(nav: SiteNavigation, query: string) {
  return useMemo(() => {
    const q = fold(query.trim());
    if (!q) return null;
    return nav.regions.flatMap((region) => region.items).filter((item) => fold(item.label).includes(q)).slice(0, 12);
  }, [nav, query]);
}

export function SiteHeader({ nav }: { nav: SiteNavigation }) {
  const pathname = usePathname() || '/';
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [region, setRegion] = useState(nav.regions[0]?.id);
  const [query, setQuery] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const results = useRouteFilter(nav, query);
  const menuId = useId();

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) { setLastPath(pathname); setOpenMenu(null); setDrawer(false); setQuery(''); }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpenMenu(null); setDrawer(false); } };
    const onClick = (event: MouseEvent) => { if (!headerRef.current?.contains(event.target as Node)) setOpenMenu(null); };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { window.removeEventListener('scroll', onScroll); document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, []);
  useEffect(() => { document.documentElement.style.overflow = drawer ? 'hidden' : ''; }, [drawer]);

  const isActive = (prefix: string) => pathname === prefix || pathname.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`);
  const routesActive = isActive('/van-chuyen-hang-hoa') && !nav.cargo.some((c) => pathname.startsWith(c.href));
  const servicesActive = isActive('/thue-xe-tai') || nav.cargo.some((c) => pathname.startsWith(c.href));
  const activeRegion = nav.regions.find((r) => r.id === region) ?? nav.regions[0];

  const navItem = (active: boolean) => `relative inline-flex h-full items-center gap-1 px-3 text-[0.9375rem] font-medium transition-colors hover:text-brand-600 ${active ? 'text-brand-600 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-600' : 'text-ink'}`;

  return (
    <header ref={headerRef} onMouseLeave={() => setOpenMenu(null)} className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-shadow ${scrolled ? 'border-line shadow-[0_6px_24px_-12px_rgb(10_37_64/0.25)]' : 'border-transparent'}`}>
      <div className="container-x flex h-16 items-center gap-4 lg:h-[4.5rem]">
        <Link href="/" className="shrink-0" aria-label="Vận tải Phương Vy — Trang chủ">
          <Image src={SITE_CONFIG.logo} alt="Vận tải Phương Vy" width={1705} height={498} loading="eager" sizes="160px" className="h-9 w-auto lg:h-11" />
        </Link>

        <nav aria-label="Điều hướng chính" className="ml-6 hidden h-full items-stretch lg:flex">
          <button type="button" className={navItem(routesActive || openMenu === 'routes')} aria-expanded={openMenu === 'routes'} aria-controls={`${menuId}-routes`} onClick={() => setOpenMenu(openMenu === 'routes' ? null : 'routes')} onMouseEnter={() => setOpenMenu('routes')}>
            Tuyến vận chuyển <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === 'routes' ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          <button type="button" className={navItem(servicesActive || openMenu === 'services')} aria-expanded={openMenu === 'services'} aria-controls={`${menuId}-services`} onClick={() => setOpenMenu(openMenu === 'services' ? null : 'services')} onMouseEnter={() => setOpenMenu('services')}>
            Dịch vụ <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === 'services' ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          <Link href="/gioi-thieu/" className={navItem(isActive('/gioi-thieu'))} onMouseEnter={() => setOpenMenu(null)}>Giới thiệu</Link>
          <Link href="/blog/" className={navItem(isActive('/blog'))} onMouseEnter={() => setOpenMenu(null)}>Cẩm nang</Link>
          <Link href="/lien-he/" className={navItem(isActive('/lien-he'))} onMouseEnter={() => setOpenMenu(null)}>Liên hệ</Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/tim-kiem/" className="hidden h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-brand-50 hover:text-brand-600 sm:flex" aria-label="Tìm kiếm">
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>
          <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="hidden items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition hover:bg-brand-50 xl:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Phone className="h-4 w-4" aria-hidden="true" /></span>
            <span className="leading-tight"><span className="block text-[0.6875rem] font-medium uppercase tracking-wide text-muted">Hotline tư vấn</span><span className="block text-[0.9375rem] font-bold text-ink">{SITE_CONFIG.hotline}</span></span>
          </a>
          <Link href="/lien-he/#bao-gia" className="btn btn-primary btn-sm hidden sm:inline-flex">Báo giá nhanh</Link>
          <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white sm:hidden" aria-label={`Gọi ${SITE_CONFIG.hotline}`}>
            <Phone className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </a>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-brand-50 lg:hidden" aria-label="Mở menu" aria-expanded={drawer} aria-controls={`${menuId}-drawer`} onClick={() => setDrawer(true)}>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ---------- desktop mega menus ---------- */}
      {openMenu === 'routes' && (
        <div id={`${menuId}-routes`} className="absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-[0_24px_48px_-24px_rgb(10_37_64/0.35)] lg:block" onMouseLeave={() => setOpenMenu(null)}>
          <div className="container-x grid grid-cols-[14rem_1fr_17rem] gap-8 py-7">
            <div>
              <label className="relative block">
                <span className="sr-only">Tìm tỉnh thành</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tỉnh, thành phố…" className="field min-h-10 py-2 pl-9 text-sm" />
              </label>
              <ul className="mt-4 space-y-1" role="tablist" aria-label="Chọn miền">
                {nav.regions.map((r) => (
                  <li key={r.id}>
                    <button type="button" role="tab" aria-selected={r.id === activeRegion?.id && !results} onMouseEnter={() => { setRegion(r.id); setQuery(''); }} onFocus={() => setRegion(r.id)} onClick={() => { setRegion(r.id); setQuery(''); }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${r.id === activeRegion?.id && !results ? 'bg-brand-50 text-brand-700' : 'text-ink hover:bg-surface'}`}>
                      {r.label}<span className="text-xs font-medium text-subtle">{r.items.length}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">{results ? `Kết quả cho “${query}”` : `Chành xe đi ${activeRegion?.label}`}</p>
              <ul className="mt-3 grid grid-cols-3 gap-x-6 gap-y-0.5">
                {(results ?? activeRegion?.items ?? []).map((item) => (
                  <li key={item.href}><Link href={item.href} className="block rounded-md px-2 py-1.5 text-[0.9375rem] text-ink transition hover:bg-brand-50 hover:text-brand-700">{item.label}</Link></li>
                ))}
                {results?.length === 0 && <li className="col-span-3 text-sm text-muted">Chưa có trang riêng cho tỉnh này — <Link className="font-semibold text-brand-600" href="/lien-he/#bao-gia">gửi yêu cầu báo giá</Link>, Phương Vy vẫn nhận hàng đi 63 tỉnh thành.</li>}
              </ul>
            </div>
            <div className="rounded-2xl bg-grid-navy p-6 text-white">
              <p className="eyebrow eyebrow-light">Toàn quốc</p>
              <p className="mt-3 text-lg font-bold leading-snug text-white">Gửi hàng Bắc – Trung – Nam, nhận tận nơi</p>
              <p className="mt-2 text-sm leading-6 text-sky-100/80">Xem bảng giá cước và lộ trình tổng quan.</p>
              <Link href="/van-chuyen-hang-hoa/" className="btn btn-accent btn-sm mt-5">Tất cả tuyến <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      )}
      {openMenu === 'services' && (
        <div id={`${menuId}-services`} className="absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-[0_24px_48px_-24px_rgb(10_37_64/0.35)] lg:block" onMouseLeave={() => setOpenMenu(null)}>
          <div className="container-x grid grid-cols-3 gap-8 py-7">
            <MenuColumn title="Vận chuyển theo loại hàng" links={nav.cargo} />
            <MenuColumn title="Cho thuê xe tải" links={nav.trucks} />
            <MenuColumn title="Hỗ trợ khách hàng" links={[...nav.policies, { label: 'Câu hỏi thường gặp', href: '/faq/' }]} />
          </div>
        </div>
      )}

      {/* ---------- mobile drawer ---------- */}
      {drawer && (
        <div id={`${menuId}-drawer`} className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" aria-label="Đóng menu" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[min(24rem,92vw)] flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <Image src={SITE_CONFIG.logo} alt="Vận tải Phương Vy" width={1705} height={498} sizes="130px" className="h-8 w-auto" />
              <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface" aria-label="Đóng menu" onClick={() => setDrawer(false)}><X className="h-6 w-6" aria-hidden="true" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <label className="relative block">
                <span className="sr-only">Tìm tỉnh thành</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Gửi hàng đi tỉnh nào?" className="field pl-9" />
              </label>
              {results ? (
                <ul className="mt-3 divide-y divide-line">
                  {results.map((item) => <li key={item.href}><Link href={item.href} className="flex items-center justify-between py-3 font-medium">{item.label}<ArrowRight className="h-4 w-4 text-subtle" aria-hidden="true" /></Link></li>)}
                  {results.length === 0 && <li className="py-3 text-sm text-muted">Không tìm thấy — gọi {SITE_CONFIG.hotline} để được tư vấn.</li>}
                </ul>
              ) : (
                <div className="mt-3 divide-y divide-line">
                  {nav.regions.map((r) => <DrawerGroup key={r.id} title={`Tuyến ${r.label}`} links={r.items} columns />)}
                  <DrawerGroup title="Theo loại hàng" links={nav.cargo} />
                  <DrawerGroup title="Thuê xe tải" links={nav.trucks} />
                  <DrawerGroup title="Về Phương Vy" links={nav.company} defaultOpen />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
              <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="btn btn-primary"><Phone className="h-4 w-4" aria-hidden="true" />Gọi ngay</a>
              <a href={ZALO_URL} target="_blank" rel="noopener" data-track="click_zalo" className="btn btn-zalo">Chat Zalo</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MenuColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-subtle">{title}</p>
      <ul className="mt-3 space-y-0.5">
        {links.map((link) => <li key={link.href}><Link href={link.href} className="group flex items-center justify-between rounded-md px-2 py-2 text-[0.9375rem] text-ink transition hover:bg-brand-50 hover:text-brand-700">{link.label}<ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" aria-hidden="true" /></Link></li>)}
      </ul>
    </div>
  );
}

function DrawerGroup({ title, links, columns, defaultOpen }: { title: string; links: NavLink[]; columns?: boolean; defaultOpen?: boolean }) {
  return (
    <details className="group py-1" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-[0.9375rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
        {title}<ChevronDown className="h-4 w-4 text-subtle transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <ul className={`pb-3 ${columns ? 'grid grid-cols-2 gap-x-3' : 'space-y-0.5'}`}>
        {links.map((link) => <li key={link.href}><Link href={link.href} className="block rounded-md px-2 py-2 text-sm text-muted transition hover:bg-brand-50 hover:text-brand-700">{link.label}</Link></li>)}
      </ul>
    </details>
  );
}
