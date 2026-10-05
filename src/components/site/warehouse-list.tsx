import { MapPin } from 'lucide-react';
import { type Warehouse, warehouseArea, warehousesFor } from '@/lib/warehouses';

/**
 * "Đà Nẵng 1: 555 Trường Chinh, …" lines, as in the WordPress footer's "Danh sách kho hàng".
 * The footer (every page) renders them without per-line icons to keep each page light.
 */
export function WarehouseList({ items, tone = 'dark', icons = true, className = '' }: { items: readonly Warehouse[]; tone?: 'dark' | 'light'; icons?: boolean; className?: string }) {
  const light = tone === 'light';
  return (
    <ul className={className}>
      {items.map((warehouse, index) => (
        <li key={index} className={icons ? 'flex gap-2.5' : undefined}>
          {icons && <MapPin className={`mt-1 h-4 w-4 shrink-0 ${light ? 'text-accent-400' : 'text-brand-600'}`} aria-hidden="true" />}
          <span><span className={`font-semibold ${light ? 'text-white' : 'text-ink'}`}>{warehouse.label}:</span> {warehouse.address}</span>
        </li>
      ))}
    </ul>
  );
}

/** Warehouses in the province a route or truck page serves, shown right under its hero. */
export function RouteWarehouses({ path }: { path: string }) {
  const items = warehousesFor(path);
  if (!items.length) return null;
  return (
    <section aria-labelledby="route-warehouses" className="border-b border-line bg-surface">
      <div className="container-x flex flex-col gap-3 py-5 md:flex-row md:items-start md:gap-8">
        <h2 id="route-warehouses" className="shrink-0 text-base font-bold text-ink">Kho hàng Phương Vy tại {warehouseArea(items[0])}</h2>
        <WarehouseList items={items} className="grid gap-x-8 gap-y-2 text-[0.9375rem] text-muted sm:grid-cols-2" />
      </div>
    </section>
  );
}
