import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { legacyItems, RETIRED_PATHS } from '@/lib/legacy-content';
import { withSlash } from '@/lib/navigation';
import { displayTitle } from '@/lib/legacy-render';
import { matchesSearch } from '@/lib/search';
import { canonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: 'Tìm kiếm tuyến vận chuyển, dịch vụ | Vận Tải Phương Vy' },
  robots: { index: false, follow: true },
  alternates: { canonical: canonicalUrl('/tim-kiem') },
};

const SUGGESTIONS = ['Hà Nội', 'Đà Nẵng', 'Xe máy', 'Thuê xe tải', 'Máy móc'];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const search = await searchParams;
  const query = (typeof search.q === 'string' ? search.q : '').trim().slice(0, 120);
  const candidates = legacyItems.filter((item) => item.path !== '/' && !RETIRED_PATHS.has(item.path));
  // Rank label/title hits above body-only hits.
  const results = query
    ? [
        ...candidates.filter((item) => matchesSearch(query, item.label, item.title)),
        ...candidates.filter((item) => !matchesSearch(query, item.label, item.title) && matchesSearch(query, item.summary, item.seo.description)),
      ].slice(0, 40)
    : [];

  return (
    <>
      <section className="bg-grid-navy text-white">
        <div className="container-x py-10 md:py-14">
          <Breadcrumbs tone="light" items={[{ name: 'Trang chủ', href: '/' }, { name: 'Tìm kiếm' }]} />
          <h1 className="h-display mt-6 text-white">Tìm tuyến vận chuyển, dịch vụ</h1>
          <form method="get" role="search" className="mt-7 flex max-w-2xl gap-2">
            <label htmlFor="search-query" className="sr-only">Từ khóa</label>
            <input id="search-query" name="q" type="search" maxLength={120} defaultValue={query} placeholder="VD: Hà Nội, xe máy, thuê xe tải…" className="field min-w-0 flex-1 border-transparent" />
            <button type="submit" className="btn btn-accent shrink-0"><Search className="h-5 w-5" aria-hidden="true" /><span className="hidden sm:inline">Tìm kiếm</span></button>
          </form>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Gợi ý tìm kiếm">
            {SUGGESTIONS.map((term) => (
              <li key={term}><Link href={`/tim-kiem/?q=${encodeURIComponent(term)}`} className="inline-flex rounded-full border border-white/20 px-3 py-1.5 text-sm font-medium text-sky-50 transition hover:bg-white/10">{term}</Link></li>
            ))}
          </ul>
        </div>
      </section>
      <section className="container-x min-h-[40vh] py-10 md:py-14" aria-live="polite">
        {query && <p className="text-muted">{results.length} kết quả cho <strong className="text-ink">“{query}”</strong></p>}
        {results.length > 0 && (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {results.map((item) => (
              <li key={item.path}>
                <Link href={withSlash(item.path)} className="card card-hover group flex h-full flex-col p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">{item.kind === 'post' ? 'Cẩm nang' : item.template === 'truck' || item.template === 'truck-hub' ? 'Thuê xe tải' : item.template === 'route' ? 'Tuyến vận chuyển' : 'Dịch vụ & thông tin'}</span>
                  <span className="mt-2 text-lg font-bold text-ink group-hover:text-brand-600">{displayTitle(item.title)}</span>
                  {item.summary && <span className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{item.summary}</span>}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">Xem chi tiết <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {query && !results.length && (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
            <p className="font-semibold">Chưa tìm thấy trang phù hợp.</p>
            <p className="mt-1 text-sm text-muted">Phương Vy vẫn nhận vận chuyển đi hầu hết các tỉnh — liên hệ để được tư vấn trực tiếp.</p>
            <Link href="/lien-he/#bao-gia" className="btn btn-primary btn-sm mt-4">Gửi yêu cầu báo giá</Link>
          </div>
        )}
        {!query && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { href: '/van-chuyen-hang-hoa/', title: 'Tìm theo tuyến tỉnh thành', text: 'Hà Nội, Đà Nẵng, Cần Thơ…' },
              { href: '/van-chuyen-hang-hoa/xe-may/', title: 'Tìm theo loại hàng', text: 'Xe máy, máy móc, hàng siêu trường…' },
              { href: '/thue-xe-tai/', title: 'Thuê xe tải', text: 'Bảng giá thuê xe theo khu vực' },
            ].map((card) => (
              <Link key={card.href} href={card.href} className="card card-hover p-5"><span className="block font-bold text-ink">{card.title}</span><span className="mt-1 block text-sm text-muted">{card.text}</span></Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
