import { cargoItems, routesByRegion, truckItems } from './legacy-content';

export type NavLink = { label: string; href: string };
export type NavRegion = { id: string; label: string; items: NavLink[] };
export type SiteNavigation = {
  regions: NavRegion[];
  cargo: NavLink[];
  trucks: NavLink[];
  company: NavLink[];
  policies: NavLink[];
};

export const withSlash = (path: string) => (path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`);

/** Small, serialisable navigation payload derived from the content corpus. */
export function getSiteNavigation(): SiteNavigation {
  return {
    regions: routesByRegion().map((group) => ({
      id: group.region,
      label: group.label,
      items: group.items.map((item) => ({ label: item.label, href: withSlash(item.path) })),
    })),
    cargo: cargoItems.map((item) => ({ label: item.label, href: withSlash(item.path) })),
    trucks: [{ label: 'Bảng giá thuê xe tải', href: '/thue-xe-tai/' }, ...truckItems.map((item) => ({ label: item.label, href: withSlash(item.path) }))],
    company: [
      { label: 'Giới thiệu', href: '/gioi-thieu/' },
      { label: 'Thư ngỏ', href: '/thu-ngo/' },
      { label: 'Tuyển dụng', href: '/tuyen-dung/' },
      { label: 'Câu hỏi thường gặp', href: '/faq/' },
      { label: 'Cẩm nang vận tải', href: '/blog/' },
      { label: 'Liên hệ', href: '/lien-he/' },
    ],
    policies: [
      { label: 'Chính sách vận chuyển & giao hàng', href: '/chinh-sach-van-chuyen-va-giao-hang/' },
      { label: 'Phương thức thanh toán', href: '/phuong-thuc-thanh-toan/' },
      { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat/' },
    ],
  };
}

/** Payload for the client-side RouteExplorer (labels, links and verified facts only). */
export function getExplorerRegions() {
  return routesByRegion().map((group) => ({
    id: group.region,
    label: group.label,
    items: group.items.map((item) => ({ label: item.label, href: withSlash(item.path), transit: item.facts.transit, priceFrom: item.facts.priceFrom })),
  }));
}
