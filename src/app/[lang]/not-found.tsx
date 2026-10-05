import Link from 'next/link';
import { ArrowRight, Home, Phone } from 'lucide-react';
import { SiteChrome } from '@/components/site/site-chrome';
import { SITE_CONFIG } from '@/lib/constants';
import { toTelHref } from '@/lib/site';

const LINKS = [
  { href: '/van-chuyen-hang-hoa/', label: 'Vận chuyển hàng hóa' },
  { href: '/thue-xe-tai/', label: 'Thuê xe tải' },
  { href: '/blog/', label: 'Cẩm nang vận tải' },
  { href: '/lien-he/', label: 'Liên hệ & báo giá' },
];

/**
 * WordPress answered "/VAN-CHUYEN-HANG-HOA/da-nang/" with the page (canonical lowercase); here such a
 * link 404s, so the browser retries the lowercase URL. A server redirect would need a proxy matcher on
 * every path (a billed function per page view) for links Google never indexed.
 */
// Leading slashes collapse to one and the origin is explicit, so "//EXAMPLE.com/" can never leave the site.
const LOWERCASE_RETRY = 'try{var p=decodeURI(location.pathname),l=p.toLowerCase().replace(/^\\/+/,"/");if(p!==l)location.replace(location.origin+encodeURI(l)+location.search+location.hash)}catch(e){}';

/** Rendered outside the (site) layout (and by app/global-not-found.tsx), so it brings its own chrome. */
export default function NotFound() {
  return (
    <SiteChrome>
      <script dangerouslySetInnerHTML={{ __html: LOWERCASE_RETRY }} />
      <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-7xl font-extrabold tracking-tight text-brand-100 sm:text-8xl">404</p>
        <h1 className="h-section mt-4">Không tìm thấy trang</h1>
        <p className="lead mt-3 max-w-xl">Trang bạn tìm có thể đã được đổi địa chỉ. Hãy thử các mục dưới đây hoặc gọi hotline để được hỗ trợ.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary"><Home className="h-4 w-4" aria-hidden="true" />Về trang chủ</Link>
          <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="btn btn-outline"><Phone className="h-4 w-4" aria-hidden="true" />{SITE_CONFIG.hotline}</a>
        </div>
        <ul className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
          {LINKS.map((link) => (
            <li key={link.href}><Link href={link.href} className="flex items-center justify-between rounded-xl border border-line p-4 text-left font-semibold transition hover:border-brand-500 hover:text-brand-600">{link.label}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></li>
          ))}
        </ul>
      </section>
    </SiteChrome>
  );
}
