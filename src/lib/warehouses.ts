/**
 * "Danh sách kho hàng" from the live WordPress footer, word for word; `paths` are the route and
 * truck pages of that province. Kept out of SITE_CONFIG because client components import that.
 */
export const WAREHOUSES = [
  { label: 'TPHCM', address: '58 Quốc lộ 1A, Xã Bà Điểm, Huyện Hóc Môn, TP.HCM', paths: ['/van-chuyen-hang-hoa/tphcm', '/thue-xe-tai/hcm'] },
  { label: 'Bình Thuận', address: '56 AH1, Xuân An, Thành phố Phan Thiết, Bình Thuận', paths: ['/van-chuyen-hang-hoa/binh-thuan', '/van-chuyen-hang-hoa/phan-thiet'] },
  { label: 'Nghệ An', address: 'Kho Tín Vững Tâm, ngã tư Hưng Tây, KCN Vsip Nghệ An (đường tránh Vinh)', paths: ['/van-chuyen-hang-hoa/vinh-nghe-an'] },
  { label: 'Thanh Hoá 1', address: 'Kho 631 Lê Lai, Phường Quảng Hưng, TP Thanh Hóa', paths: ['/van-chuyen-hang-hoa/thanh-hoa'] },
  { label: 'Thanh Hoá 2', address: 'VP 700 Lê Lai, Phường Quảng Hưng, TP Thanh Hóa', paths: ['/van-chuyen-hang-hoa/thanh-hoa'] },
  { label: 'Thanh Hoá 3', address: 'ĐL Hùng Vương, Quảng Thành, Thanh Hóa', paths: ['/van-chuyen-hang-hoa/thanh-hoa'] },
  { label: 'Đà Nẵng 1', address: '555 Trường Chinh, Quận Thanh Khê, Đà Nẵng', paths: ['/van-chuyen-hang-hoa/da-nang', '/thue-xe-tai/da-nang'] },
  { label: 'Đà Nẵng 2', address: 'Hoà Thọ Tây, Cẩm Lệ, Đà Nẵng', paths: ['/van-chuyen-hang-hoa/da-nang', '/thue-xe-tai/da-nang'] },
  { label: 'Quảng Trị', address: '657 Lê Duẩn, Đông Hải, Đông Hà, Quảng Trị', paths: ['/van-chuyen-hang-hoa/quang-tri'] },
  { label: 'Nghệ An', address: 'Hưng Tây, Hưng Nguyên, Nghệ An', paths: ['/van-chuyen-hang-hoa/vinh-nghe-an'] },
  { label: 'Quảng Nam', address: 'An Sơn, Tp. Tam Kỳ, Quảng Nam', paths: ['/van-chuyen-hang-hoa/quang-nam'] },
  { label: 'Quảng Ngãi', address: '74 Đinh Tiên Hoàng, Nghĩa Chánh Bắc, Quảng Ngãi', paths: ['/van-chuyen-hang-hoa/quang-ngai'] },
  { label: 'Ninh Thuận', address: 'Phủ Hà, Tp. Phan Rang – Tháp Chàm, Ninh Thuận', paths: ['/van-chuyen-hang-hoa/ninh-thuan'] },
  { label: 'Hà Nội', address: 'Số 1 Thuý Lĩnh, Lĩnh Nam, Hoàng Mai, Hà Nội', paths: ['/van-chuyen-hang-hoa/ha-noi', '/thue-xe-tai/ha-noi'] },
  { label: 'Phú Yên', address: 'Hoà An, Phú Hòa, Phú Yên', paths: ['/van-chuyen-hang-hoa/phu-yen'] },
  { label: 'Khánh Hòa', address: 'Vĩnh Lương, Nha Trang, Khánh Hòa', paths: ['/van-chuyen-hang-hoa/nha-trang'] },
  { label: 'Huế', address: 'Tổ 12, Thủy Phung, Hương Thủy, Thành phố Huế', paths: ['/van-chuyen-hang-hoa/hue'] },
  { label: 'Ninh Bình', address: 'Khánh An, Yên Khánh, Ninh Bình', paths: ['/van-chuyen-hang-hoa/ninh-binh'] },
  { label: 'Hà Tĩnh', address: 'Kỳ Thư, Kỳ Anh, Hà Tĩnh', paths: ['/van-chuyen-hang-hoa/ha-tinh'] },
  { label: 'Bình Định', address: 'Hùng Vương, Trần Quang Diệu, Quy Nhơn, Bình Định', paths: ['/van-chuyen-hang-hoa/binh-dinh'] },
] as const;

export type Warehouse = (typeof WAREHOUSES)[number];

/** Warehouses in the province a route or truck page serves ("/van-chuyen-hang-hoa/da-nang"). */
export function warehousesFor(path: string): Warehouse[] {
  return WAREHOUSES.filter((warehouse) => (warehouse.paths as readonly string[]).includes(path));
}

/** The province as the WordPress list names it: "Đà Nẵng 1" → "Đà Nẵng". */
export const warehouseArea = (warehouse: Warehouse) => warehouse.label.replace(/\s+\d+$/, '');
