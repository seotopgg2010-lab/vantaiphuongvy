import Link from 'next/link';
import { Clock3, FileText, Mail, MapPin, Phone } from 'lucide-react';
import { HomeLink } from '@/components/site/home-link';
import { UploadImage } from '@/components/site/upload-image';
import { WarehouseList } from '@/components/site/warehouse-list';
import { noBreakBrand } from '@/lib/legacy-render';
import { WAREHOUSES } from '@/lib/warehouses';
import type { NavLink, SiteNavigation } from '@/lib/navigation';
import { SITE_CONFIG, ZALO_URL } from '@/lib/constants';
import { toTelHref } from '@/lib/site';

const POPULAR = ['ha-noi', 'da-nang', 'hai-phong', 'nha-trang', 'hue', 'quang-ngai', 'vinh-nghe-an', 'thanh-hoa', 'can-tho', 'binh-duong'].map((slug) => `/van-chuyen-hang-hoa/${slug}/`);
/** Linked from every WordPress footer (same anchor text); the guide where truck owners apply as partners. */
const PARTNER_LINK: NavLink = { label: 'Tìm đối tác vận chuyển hàng hóa', href: '/blog/can-tim-doi-tac-van-chuyen-hang-hoa/' };

function Column({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h2>
      {/* Two columns on phones keep the footer short; one column from md, where the footer has its own columns. */}
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-1">
        {links.map((link) => <li key={link.href}><Link href={link.href} className="text-[0.9375rem] text-on-brand transition hover:text-white">{link.label}</Link></li>)}
      </ul>
    </div>
  );
}

export function SiteFooter({ nav }: { nav: SiteNavigation }) {
  const allRoutes = nav.regions.flatMap((region) => region.items);
  const popular = POPULAR.map((href) => allRoutes.find((item) => item.href === href)).filter((item): item is NavLink => Boolean(item));

  return (
    <footer className="bg-navy-950 text-on-brand" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Thông tin chân trang</h2>
      <div className="container-x grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:py-12">
        <div>
          <HomeLink className="inline-flex rounded-xl bg-white px-4 py-3">
            <UploadImage src={SITE_CONFIG.logo} alt="Vận tải Phương Vy" width={1705} height={498} sizes="150px" className="h-10 w-auto" />
          </HomeLink>
          <p className="mt-5 max-w-sm text-[0.9375rem] leading-7">{SITE_CONFIG.companyName} — vận chuyển hàng hóa Bắc Nam, chành xe liên tỉnh và cho thuê xe tải. <span className="text-white">{SITE_CONFIG.slogan}</span></p>
          <ul className="mt-6 space-y-3 text-[0.9375rem]">
            <li className="flex gap-3"><MapPin className="mt-1 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" /><span><span className="text-white">Văn phòng:</span> {SITE_CONFIG.address}</span></li>
            {/* The yard address is the first entry of the warehouse list below; the tax ID was on every WordPress footer. */}
            <li className="flex gap-3"><FileText className="mt-1 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" /><span><span className="text-white">Mã số thuế:</span> {SITE_CONFIG.taxId}</span></li>
            <li className="flex gap-3"><Clock3 className="mt-1 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" /><span>Tư vấn {SITE_CONFIG.businessHours}, tất cả các ngày</span></li>
            <li className="flex gap-3"><Mail className="mt-1 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" /><a href={`mailto:${SITE_CONFIG.email}`} className="break-all transition hover:text-white">{SITE_CONFIG.email}</a></li>
          </ul>
        </div>
        <Column title="Tuyến phổ biến" links={[...popular, { label: 'Xem tất cả tuyến →', href: '/van-chuyen-hang-hoa/' }]} />
        <div className="space-y-8">
          <Column title="Dịch vụ" links={[...nav.cargo, nav.trucks[0]]} />
        </div>
        <div className="space-y-8">
          <Column title="Phương Vy" links={nav.company.flatMap((link) => (link.href === '/tuyen-dung/' ? [link, PARTNER_LINK] : [link]))} />
          <Column title="Chính sách" links={nav.policies} />
        </div>
      </div>

      <section aria-labelledby="footer-warehouses" className="border-t border-white/10">
        <div className="container-x py-8">
          <h2 id="footer-warehouses" className="text-sm font-semibold uppercase tracking-wider text-white">Danh sách kho hàng</h2>
          <WarehouseList items={WAREHOUSES} tone="light" icons={false} className="mt-4 grid gap-x-8 gap-y-1.5 text-[0.8125rem] leading-6 sm:grid-cols-2 lg:grid-cols-4" />
        </div>
      </section>

      {/* Crawlable directory of every route and rental page. It sits after <main>, is server-only
          (no hydration) and skips prefetch, so it costs neither LCP nor bandwidth. */}
      <nav aria-labelledby="footer-directory" className="border-t border-white/10">
        <div className="container-x py-8">
          <h2 id="footer-directory" className="text-sm font-semibold uppercase tracking-wider text-white">Tuyến vận chuyển &amp; thuê xe tải</h2>
          <dl className="mt-4 grid gap-x-10 gap-y-4 text-[0.8125rem] leading-6 lg:grid-cols-2">
            {[...nav.regions, { id: 'thue-xe-tai', label: 'Thuê xe tải', items: nav.trucks }].map((group) => (
              <div key={group.id}>
                <dt className="font-semibold text-white">{group.label}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-x-3 [&_a]:inline-block [&_a]:text-on-brand [&_a]:transition [&_a:hover]:text-white">
                    {group.items.map((link) => <li key={link.href}><Link href={link.href} prefetch={false}>{link.label}</Link></li>)}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </nav>

      <div className="border-y border-white/10 bg-white/[0.06]">
        <div className="container-x flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-base font-semibold text-white">Cần báo giá gửi hàng? Gọi ngay để được tư vấn trong vài phút.</p>
          <div className="flex flex-wrap gap-2">
            {SITE_CONFIG.hotlines.map((phone, index) => (
              <a key={phone} href={toTelHref(phone)} data-track="click_call" className={`btn btn-sm ${index === 0 ? 'btn-accent' : 'btn-ghost-light'}`}><Phone className="h-4 w-4" aria-hidden="true" />{phone}</a>
            ))}
            <a href={ZALO_URL} target="_blank" rel="noopener" data-track="click_zalo" className="btn btn-sm btn-zalo">Zalo</a>
          </div>
        </div>
      </div>

      <div className="container-x flex flex-col gap-3 py-5 text-sm text-on-brand sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {noBreakBrand(SITE_CONFIG.companyName)}. Mọi quyền được bảo lưu.</p>
        <div className="flex gap-5">
          <a href={SITE_CONFIG.facebook} target="_blank" rel="noopener" className="transition hover:text-white">Facebook</a>
          <Link href="/sitemap.xml" prefetch={false} className="transition hover:text-white">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}
