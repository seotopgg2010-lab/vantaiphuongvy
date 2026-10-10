import { MapPin } from 'lucide-react';
import { type Warehouse, WAREHOUSES, warehouseArea, warehousesFor } from '@/lib/warehouses';

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

/** The two origin warehouses (TP.HCM, Hà Nội) that the route hub and the cargo services ship from. */
const ORIGIN_WAREHOUSES = WAREHOUSES.filter((warehouse) => warehouse.paths.some((path) => path === '/van-chuyen-hang-hoa/tphcm' || path === '/van-chuyen-hang-hoa/ha-noi'));

/**
 * Warehouses in the province a route or truck page serves, shown right under its hero. `origins`
 * lists the TP.HCM and Hà Nội warehouses instead, for pages that ship nationwide (hub, cargo).
 */
export function RouteWarehouses({ path, origins = false }: { path: string; origins?: boolean }) {
  const items = origins ? ORIGIN_WAREHOUSES : warehousesFor(path);
  if (!items.length) return null;
  const area = origins ? 'TP.HCM và Hà Nội' : warehouseArea(items[0]);
  return (
    <section aria-labelledby="route-warehouses" className="border-b border-line bg-surface">
      <div className="container-x flex flex-col gap-3 py-5 md:flex-row md:items-start md:gap-8">
        <h2 id="route-warehouses" className="shrink-0 text-base font-bold text-ink">Kho hàng Phương Vy tại {area}</h2>
        <WarehouseList items={items} className="grid gap-x-8 gap-y-2 text-[0.9375rem] text-muted sm:grid-cols-2" />
      </div>
    </section>
  );
}
