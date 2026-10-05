'use client';

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight, Bike, ChevronDown, Cog, Droplets, FileText, Globe2, HelpCircle, MapPin, Menu, MessageCircle,
  Phone, Plane, Search, ShieldCheck, Ship, Truck, Weight, X, type LucideIcon,
} from 'lucide-react';
import { UploadImage } from '@/components/site/upload-image';
import type { NavLink, SiteNavigation } from '@/lib/navigation';
import { SITE_CONFIG, ZALO_URL } from '@/lib/constants';
import { POPULAR_ROUTES } from '@/lib/marketing';
import { toTelHref } from '@/lib/site';

type MenuKey = 'routes' | 'services' | null;

const CARGO_ICONS: Record<string, LucideIcon> = {
  'xe-may': Bike,
  'may-moc-thiet-bi': Cog,
  'dau-nhot': Droplets,
  'sieu-truong-sieu-trong': Weight,
  'duong-bien': Ship,
  'duong-hang-khong': Plane,
  campuchia: Globe2,
  lao: Globe2,
};
const slugOf = (href: string) => href.replace(/\/+$/, '').split('/').pop() ?? '';
const fold = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

function useRouteFilter(nav: SiteNavigation, query: string) {
  return useMemo(() => {
    const q = fold(query.trim());
    if (!q) return null;
    return nav.regions.flatMap((region) => region.items).filter((item) => fold(item.label).includes(q)).slice(0, 15);
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
  const closeTimer = useRef<number | undefined>(undefined);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const results = useRouteFilter(nav, query);
  const menuId = useId();

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) { setLastPath(pathname); setOpenMenu(null); setDrawer(false); setQuery(''); }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpenMenu(null); setDrawer(false); } };
    const onClick = (event: MouseEvent) => { if (!headerRef.current?.contains(event.target as Node)) setOpenMenu(null); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
      window.clearTimeout(closeTimer.current);
    };
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = drawer ? 'hidden' : '';
    if (drawer) closeButtonRef.current?.focus();
  }, [drawer]);

  // Hover intent: open immediately, close after a short grace period so diagonal mouse moves don't flicker.
  const openNow = (key: MenuKey) => { window.clearTimeout(closeTimer.current); setOpenMenu(key); };
  const closeSoon = () => { window.clearTimeout(closeTimer.current); closeTimer.current = window.setTimeout(() => setOpenMenu(null), 180); };
  const keepOpen = () => window.clearTimeout(closeTimer.current);

  const isActive = (prefix: string) => pathname === prefix || pathname.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`);
  const routesActive = isActive('/van-chuyen-hang-hoa') && !nav.cargo.some((c) => pathname.startsWith(c.href));
  const servicesActive = isActive('/thue-xe-tai') || nav.cargo.some((c) => pathname.startsWith(c.href));
  const activeRegion = nav.regions.find((r) => r.id === region) ?? nav.regions[0];
  const visibleRoutes = results ?? activeRegion?.items ?? [];
  const international = nav.regions.find((r) => r.id === 'quoc-te')?.items ?? [];

  const navItem = 'nav-underline inline-flex h-full items-center gap-1 px-3 text-[0.9375rem] font-semibold transition-colors hover:text-brand-600 data-[active=true]:text-brand-600';

  return (
    <header ref={headerRef} onMouseLeave={closeSoon} onMouseEnter={keepOpen} className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-shadow duration-300 ${scrolled || openMenu ? 'border-line shadow-[0_8px_24px_-14px_rgb(10_61_107/0.35)]' : 'border-transparent'}`}>
      <div className={`container-x flex items-center gap-4 transition-[height] duration-300 ${scrolled ? 'h-16' : 'h-16 lg:h-[4.75rem]'}`}>
        <Link href="/" className="shrink-0" aria-label="Vận tải Phương Vy — Trang chủ">
          <UploadImage src={SITE_CONFIG.logo} alt="Vận tải Phương Vy" width={1705} height={498} loading="eager" sizes="170px" className={`w-auto transition-[height] duration-300 ${scrolled ? 'h-9 lg:h-10' : 'h-9 lg:h-12'}`} />
        </Link>

        <nav aria-label="Điều hướng chính" className="ml-4 hidden h-full items-stretch lg:flex xl:ml-8">
          <button type="button" data-active={routesActive || openMenu === 'routes'} className={navItem} aria-expanded={openMenu === 'routes'} aria-controls={`${menuId}-routes`} onClick={() => setOpenMenu(openMenu === 'routes' ? null : 'routes')} onMouseEnter={() => openNow('routes')}>
            Tuyến vận chuyển <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openMenu === 'routes' ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          <button type="button" data-active={servicesActive || openMenu === 'services'} className={navItem} aria-expanded={openMenu === 'services'} aria-controls={`${menuId}-services`} onClick={() => setOpenMenu(openMenu === 'services' ? null : 'services')} onMouseEnter={() => openNow('services')}>
            Dịch vụ <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openMenu === 'services' ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          <Link href="/gioi-thieu/" data-active={isActive('/gioi-thieu')} className={navItem} onMouseEnter={() => openNow(null)}>Giới thiệu</Link>
          <Link href="/blog/" data-active={isActive('/blog')} className={navItem} onMouseEnter={() => openNow(null)}>Cẩm nang</Link>
          <Link href="/lien-he/" data-active={isActive('/lien-he')} className={navItem} onMouseEnter={() => openNow(null)}>Liên hệ</Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/tim-kiem/" className="hidden h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-brand-50 hover:text-brand-600 sm:flex" aria-label="Tìm kiếm">
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>
          <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="group hidden items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition hover:bg-brand-50 xl:flex">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/40 [animation-duration:2.4s]" aria-hidden="true" />
              <Phone className="relative h-4 w-4" aria-hidden="true" />
            </span>
            <span className="leading-tight"><span className="block text-[0.6875rem] font-medium uppercase tracking-wide text-muted">Hotline tư vấn</span><span className="block text-[0.9375rem] font-bold text-brand-700">{SITE_CONFIG.hotline}</span></span>
          </a>
          <Link href="/lien-he/#bao-gia" className="btn btn-accent btn-sm hidden sm:inline-flex"><FileText className="h-4 w-4" aria-hidden="true" />Báo giá nhanh</Link>
          <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white sm:hidden" aria-label={`Gọi ${SITE_CONFIG.hotline}`}>
            <Phone className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          </a>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-brand-50 lg:hidden" aria-label="Mở menu" aria-expanded={drawer} aria-controls={`${menuId}-drawer`} onClick={() => setDrawer(true)}>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ---------- desktop mega menu: routes ---------- */}
      {openMenu === 'routes' && activeRegion && (
        <div id={`${menuId}-routes`} className="animate-mega absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-[0_32px_64px_-32px_rgb(10_61_107/0.45)] lg:block" onMouseEnter={keepOpen}>
          <div className="container-x grid grid-cols-[15.5rem_minmax(0,1fr)_17rem]">
            <div className="border-r border-line py-6 pr-5">
              <label className="relative block">
                <span className="sr-only">Tìm tỉnh thành</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tỉnh, thành phố…" className="field min-h-10 bg-surface py-2 pl-9 text-sm" />
              </label>
              <p className="mt-5 px-1 text-[0.6875rem] font-bold uppercase tracking-wider text-subtle">Chọn khu vực</p>
              <ul className="mt-2 space-y-1">
                {nav.regions.map((r) => {
                  const selected = r.id === activeRegion.id && !results;
                  return (
                    <li key={r.id}>
                      <button type="button" aria-pressed={selected} onMouseEnter={() => { setRegion(r.id); setQuery(''); }} onFocus={() => setRegion(r.id)} onClick={() => { setRegion(r.id); setQuery(''); }}
                        className={`group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm font-semibold transition-all duration-200 ${selected ? 'bg-brand-600 text-white shadow-[0_10px_20px_-12px_rgb(18_117_188/0.9)]' : 'text-ink hover:bg-brand-50 hover:text-brand-700'}`}>
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${selected ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600 group-hover:bg-white'}`}><MapPin className="h-3.5 w-3.5" aria-hidden="true" /></span>
                        <span className="min-w-0 flex-1 leading-snug">{r.label}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[0.6875rem] font-bold ${selected ? 'bg-white/20 text-white' : 'bg-surface text-subtle'}`}>{r.items.length}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="min-w-0 px-7 py-6">
              <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                <p className="text-sm font-bold text-ink">
                  {results ? <>Kết quả cho “{query}”</> : <>Chành xe TP.HCM đi <span className="text-brand-600">{activeRegion.label}</span></>}
                  <span className="ml-2 text-xs font-medium text-subtle">{visibleRoutes.length} tuyến</span>
                </p>
                <Link href="/van-chuyen-hang-hoa/" className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">Trang tuyến vận chuyển <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" /></Link>
              </div>
              <ul key={results ? `q-${query}` : activeRegion.id} className="animate-fade mt-3 grid grid-cols-3 gap-x-3 gap-y-0.5">
                {visibleRoutes.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} data-active={pathname === item.href} className="group flex items-center gap-2 rounded-lg px-2.5 py-[0.4375rem] text-[0.9375rem] text-ink transition hover:bg-brand-50 hover:text-brand-700 data-[active=true]:bg-brand-50 data-[active=true]:font-semibold data-[active=true]:text-brand-700">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-100 transition group-hover:scale-125 group-hover:bg-brand-600" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                ))}
                {results?.length === 0 && <li className="col-span-3 px-2.5 py-2 text-sm text-muted">Chưa có trang riêng cho tỉnh này — <Link className="font-semibold text-brand-600" href="/lien-he/#bao-gia">gửi yêu cầu báo giá</Link>, Phương Vy vẫn nhận hàng đi các tỉnh thành khác.</li>}
              </ul>
            </div>

            <div className="border-l border-line py-6 pl-5">
              <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-subtle">Tuyến phổ biến</p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {POPULAR_ROUTES.map((route) => (
                  <li key={route.href}><Link href={route.href} className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-[0.8125rem] font-medium text-brand-700 transition hover:-translate-y-px hover:border-brand-600 hover:bg-brand-600 hover:text-white">{route.label}</Link></li>
                ))}
              </ul>
              <MenuCta className="mt-5" />
            </div>
          </div>
        </div>
      )}

      {/* ---------- desktop mega menu: services ---------- */}
      {openMenu === 'services' && (
        <div id={`${menuId}-services`} className="animate-mega absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-[0_32px_64px_-32px_rgb(10_61_107/0.45)] lg:block" onMouseEnter={keepOpen}>
          <div className="container-x grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_17rem] gap-8 py-6">
            <div>
              <MenuTitle href="/van-chuyen-hang-hoa/">Vận chuyển theo loại hàng</MenuTitle>
              <MenuTiles links={nav.cargo} pathname={pathname} />
              <MenuTitle className="mt-5" href="/van-chuyen-hang-hoa/duong-bien/">Quốc tế &amp; đa phương thức</MenuTitle>
              <MenuTiles links={international} pathname={pathname} />
            </div>
            <div>
              <MenuTitle href="/thue-xe-tai/">Cho thuê xe tải</MenuTitle>
              <ul className="mt-3 space-y-0.5">
                {nav.trucks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} data-active={pathname === link.href} className="group flex items-center gap-3 rounded-lg px-2 py-2 text-[0.9375rem] text-ink transition hover:bg-brand-50 hover:text-brand-700 data-[active=true]:bg-brand-50 data-[active=true]:font-semibold data-[active=true]:text-brand-700">
                      <Truck className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                      <span className="flex-1">{link.label}</span>
                      <ArrowRight className="h-4 w-4 -translate-x-1 text-brand-600 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <MenuTitle className="mt-5">Hỗ trợ khách hàng</MenuTitle>
              <ul className="mt-2 space-y-0.5">
                {[...nav.policies, { label: 'Câu hỏi thường gặp', href: '/faq/' }].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-muted transition hover:bg-brand-50 hover:text-brand-700">
                      {link.href === '/faq/' ? <HelpCircle className="h-4 w-4 shrink-0" aria-hidden="true" /> : <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />}{link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <MenuCta className="self-start" />
          </div>
        </div>
      )}

      {/* ---------- mobile drawer ----------
          Portalled to <body>: the header's backdrop-filter would otherwise become the containing
          block for position:fixed and clip the drawer to the header height. */}
      {drawer && createPortal(
        <div id={`${menuId}-drawer`} className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" tabIndex={-1} className="animate-fade absolute inset-0 bg-navy-950/45 backdrop-blur-sm" aria-label="Đóng menu" onClick={() => setDrawer(false)} />
          <div className="animate-drawer absolute inset-y-0 right-0 flex w-[min(24rem,92vw)] flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <UploadImage src={SITE_CONFIG.logo} alt="Vận tải Phương Vy" width={1705} height={498} sizes="130px" className="h-8 w-auto" />
              <button ref={closeButtonRef} type="button" className="flex h-10 w-10 items-center justify-center rounded-full transition hover:rotate-90 hover:bg-surface" aria-label="Đóng menu" onClick={() => setDrawer(false)}><X className="h-6 w-6" aria-hidden="true" /></button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              <label className="relative block">
                <span className="sr-only">Tìm tỉnh thành</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Gửi hàng đi tỉnh nào?" className="field bg-surface pl-9" />
              </label>
              {results ? (
                <ul className="animate-fade mt-3 divide-y divide-line">
                  {results.map((item) => <li key={item.href}><Link href={item.href} className="flex items-center justify-between py-3 font-medium">{item.label}<ArrowRight className="h-4 w-4 text-brand-600" aria-hidden="true" /></Link></li>)}
                  {results.length === 0 && <li className="py-3 text-sm text-muted">Không tìm thấy — gọi {SITE_CONFIG.hotline} để được tư vấn.</li>}
                </ul>
              ) : (
                <>
                  <ul className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { label: 'Tuyến xe', href: '/van-chuyen-hang-hoa/', icon: MapPin },
                      { label: 'Thuê xe tải', href: '/thue-xe-tai/', icon: Truck },
                      { label: 'Báo giá', href: '/lien-he/#bao-gia', icon: FileText },
                    ].map(({ label, href, icon: Icon }) => (
                      <li key={href}>
                        <Link href={href} className="flex flex-col items-center gap-1.5 rounded-xl border border-brand-100 bg-brand-50 px-2 py-3 text-center text-[0.8125rem] font-semibold text-brand-700 transition active:scale-95">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white"><Icon className="h-4 w-4" aria-hidden="true" /></span>{label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <DrawerHeading>Tuyến vận chuyển</DrawerHeading>
                  <div className="divide-y divide-line rounded-xl border border-line">
                    {nav.regions.map((r) => <DrawerGroup key={r.id} title={r.label} count={r.items.length} links={r.items} pathname={pathname} columns />)}
                  </div>
                  <DrawerHeading>Dịch vụ</DrawerHeading>
                  <div className="divide-y divide-line rounded-xl border border-line">
                    <DrawerGroup title="Theo loại hàng" count={nav.cargo.length} links={nav.cargo} pathname={pathname} icons />
                    <DrawerGroup title="Thuê xe tải" count={nav.trucks.length} links={nav.trucks} pathname={pathname} />
                  </div>
                  <DrawerHeading>Về Phương Vy</DrawerHeading>
                  <ul className="grid grid-cols-2 gap-x-3">
                    {nav.company.map((link) => (
                      <li key={link.href}><Link href={link.href} data-active={isActive(link.href.replace(/\/$/, ''))} className="block rounded-md px-2 py-2 text-sm font-medium text-ink transition hover:bg-brand-50 hover:text-brand-700 data-[active=true]:text-brand-700">{link.label}</Link></li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
              <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="btn btn-primary"><Phone className="h-4 w-4" aria-hidden="true" />Gọi ngay</a>
              <a href={ZALO_URL} target="_blank" rel="noopener" data-track="click_zalo" className="btn btn-zalo"><MessageCircle className="h-4 w-4" aria-hidden="true" />Chat Zalo</a>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}

function MenuTitle({ children, href, className = '' }: { children: ReactNode; href?: string; className?: string }) {
  const style = `flex items-center justify-between gap-2 border-b border-line pb-2 text-[0.6875rem] font-bold uppercase tracking-wider text-subtle ${className}`;
  return href ? (
    <Link href={href} className={`group ${style} hover:text-brand-600`}>{children}<ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" /></Link>
  ) : <p className={style}>{children}</p>;
}

function MenuTiles({ links, pathname }: { links: NavLink[]; pathname: string }) {
  return (
    <ul className="mt-3 grid grid-cols-2 gap-1.5">
      {links.map((link) => {
        const Icon = CARGO_ICONS[slugOf(link.href)] ?? Truck;
        return (
          <li key={link.href}>
            <Link href={link.href} data-active={pathname === link.href} className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition hover:border-brand-100 hover:bg-brand-50 data-[active=true]:border-brand-100 data-[active=true]:bg-brand-50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition duration-200 group-hover:scale-105 group-hover:bg-brand-600 group-hover:text-white"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <span className="text-[0.9375rem] font-semibold leading-snug text-ink group-hover:text-brand-700">{link.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
function MenuCta({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-brand-grid p-5 text-white ${className}`}>
      <Truck className="absolute -bottom-3 -right-3 h-24 w-24 text-white/10" aria-hidden="true" />
      <p className="eyebrow eyebrow-light">Báo giá miễn phí</p>
      <p className="mt-2 text-lg font-bold leading-snug text-white">Cần gửi hàng hôm nay?</p>
      <p className="mt-1 text-sm text-on-brand">Tư vấn {SITE_CONFIG.businessHours}, cả ngày lễ.</p>
      <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="btn btn-accent btn-sm relative mt-4 w-full"><Phone className="h-4 w-4" aria-hidden="true" />{SITE_CONFIG.hotline}</a>
      <a href={ZALO_URL} target="_blank" rel="noopener" data-track="click_zalo" className="btn btn-sm relative mt-2 w-full bg-white text-[#0055d4] hover:bg-brand-50"><MessageCircle className="h-4 w-4" aria-hidden="true" />Nhắn Zalo</a>
    </div>
  );
}

function DrawerHeading({ children }: { children: ReactNode }) {
  return <p className="mb-2 mt-6 text-[0.6875rem] font-bold uppercase tracking-wider text-subtle">{children}</p>;
}

function DrawerGroup({ title, count, links, pathname, columns, icons }: { title: string; count: number; links: NavLink[]; pathname: string; columns?: boolean; icons?: boolean }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[0.9375rem] font-semibold text-ink transition group-open:text-brand-700 [&::-webkit-details-marker]:hidden">
        <span className="flex-1">{title}</span>
        <span className="rounded-full bg-surface px-2 py-0.5 text-[0.6875rem] font-bold text-subtle group-open:bg-brand-50 group-open:text-brand-700">{count}</span>
        <ChevronDown className="h-4 w-4 text-subtle transition-transform duration-300 group-open:rotate-180 group-open:text-brand-600" aria-hidden="true" />
      </summary>
      <ul className={`animate-fade px-2 pb-3 ${columns ? 'grid grid-cols-2 gap-x-1' : 'space-y-0.5'}`}>
        {links.map((link) => {
          const Icon = icons ? CARGO_ICONS[slugOf(link.href)] ?? Truck : null;
          return (
            <li key={link.href}>
              <Link href={link.href} data-active={pathname === link.href} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted transition hover:bg-brand-50 hover:text-brand-700 data-[active=true]:bg-brand-50 data-[active=true]:font-semibold data-[active=true]:text-brand-700">
                {Icon && <Icon className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />}{link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
