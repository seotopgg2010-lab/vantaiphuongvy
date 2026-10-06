'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { ArrowRight, MapPin, Search, X } from 'lucide-react';

export type ExplorerRoute = { label: string; href: string; transit?: string; priceFrom?: string };
export type ExplorerRegion = { id: string; label: string; items: ExplorerRoute[] };

const fold = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().trim();

/**
 * Searchable route directory. Every region and route is always rendered;
 * filters only toggle the `hidden` attribute, so crawlers and no-JS visitors
 * get all route links whichever tab is selected first.
 */
export function RouteExplorer({ regions, compact = false, defaultRegion = 'all' }: { regions: ExplorerRegion[]; compact?: boolean; defaultRegion?: string }) {
  const [active, setActive] = useState<string>(defaultRegion);
  const [query, setQuery] = useState('');
  const inputId = useId();
  const total = regions.reduce((sum, region) => sum + region.items.length, 0);

  const groups = useMemo(() => {
    const q = fold(query);
    return regions.map((region) => {
      const items = region.items.map((item) => ({ ...item, match: !q || fold(item.label).includes(q) }));
      const count = items.filter((item) => item.match).length;
      return { ...region, items, count, shown: (Boolean(q) || active === 'all' || region.id === active) && count > 0 };
    });
  }, [regions, active, query]);

  const resultCount = groups.reduce((sum, region) => sum + (region.shown ? region.count : 0), 0);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Lọc theo khu vực" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {[{ id: 'all', label: `Tất cả (${total})` }, ...regions.map((region) => ({ id: region.id, label: region.label }))].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              onClick={() => setActive(tab.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${active === tab.id ? 'border-brand-600 bg-brand-600 text-white shadow-[0_6px_14px_-8px_rgb(18_117_188/0.9)]' : 'border-line bg-white text-ink hover:border-brand-600 hover:text-brand-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <label htmlFor={inputId} className="sr-only">Tìm tỉnh, thành phố</label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" aria-hidden="true" />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm tỉnh, thành phố…"
            autoComplete="off"
            className="field pl-10 pr-10"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Xóa tìm kiếm" className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-subtle hover:bg-surface hover:text-ink">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{query ? `${resultCount} tuyến phù hợp` : ''}</p>

      {resultCount === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
          <p className="font-semibold">Chưa có trang riêng cho “{query}”.</p>
          <p className="mt-1 text-sm text-muted">Phương Vy vẫn nhận hàng đi tỉnh này — gọi hotline hoặc gửi yêu cầu để được báo giá.</p>
          <Link href="/lien-he/#bao-gia" className="btn btn-primary btn-sm mt-4">Gửi yêu cầu báo giá</Link>
        </div>
      )}
      <div hidden={resultCount === 0} className="mt-8 flex flex-col gap-10">
        {groups.map((group) => (
          <section key={group.id} aria-label={group.label} hidden={!group.shown}>
            {/* The heading holds only the region name; the route count sits beside it, not inside it. */}
            <div className="flex items-center gap-3 text-sm text-subtle">
              <h3 className="font-semibold uppercase tracking-wider">{group.label}</h3>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
              <span className="font-medium">{group.count} tuyến</span>
            </div>
            <ul className={`mt-4 grid grid-cols-2 gap-2 sm:gap-3 ${compact ? 'lg:grid-cols-4' : 'lg:grid-cols-3 xl:grid-cols-4'}`}>
              {group.items.map((item) => (
                <li key={item.href} hidden={!item.match}>
                  <Link href={item.href} className="group flex h-full min-h-11 items-center gap-3 rounded-xl border border-line bg-white px-3 py-2.5 transition hover:border-brand-500 hover:shadow-[var(--shadow-card)] sm:p-3.5">
                    <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white sm:flex">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      {/* Wraps to 2 lines so long names ("Điện Biên – Lai Châu") stay readable in the 2-col mobile grid. */}
                      <span className="line-clamp-2 text-sm font-semibold text-ink wrap-break-word sm:text-base">{item.label}</span>
                      {/* Only a few routes have these facts; the compact home grid stays uniform without them. */}
                      {!compact && (item.transit || item.priceFrom) && (
                        <span className="block truncate text-xs text-muted">
                          {[item.transit && `${item.transit}`, item.priceFrom && `từ ${item.priceFrom}`].filter(Boolean).join(' · ')}
                        </span>
                      )}
                    </span>
                    <ArrowRight className="hidden h-4 w-4 shrink-0 text-subtle transition group-hover:translate-x-0.5 group-hover:text-brand-600 sm:block" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
