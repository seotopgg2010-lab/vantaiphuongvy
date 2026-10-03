type NavLink = { label: string; href: string };
export type BriefNavigationGroup = NavLink & { items: Array<{ label: string; items: NavLink[] }> };

const links = (items: Array<[string, string]>): NavLink[] => items.map(([label, href]) => ({ label, href }));

/**
 * Public navigation is deliberately built only from verified legacy Phương Vy
 * URLs. It exposes the service/routing breadth users expect while retaining
 * every legacy URL as the SEO source of truth.
 */
export const BRIEF_NAVIGATION: BriefNavigationGroup[] = [
  {
    label: 'Vận chuyển hàng hóa', href: '/van-chuyen-hang-hoa',
    items: [
      { label: 'Tuyến miền Bắc', items: links([['Hà Nội', '/van-chuyen-hang-hoa/ha-noi'], ['Hải Phòng', '/van-chuyen-hang-hoa/hai-phong'], ['Quảng Ninh', '/van-chuyen-hang-hoa/quang-ninh'], ['Bắc Ninh', '/van-chuyen-hang-hoa/bac-ninh'], ['Bắc Giang', '/van-chuyen-hang-hoa/bac-giang'], ['Hưng Yên', '/van-chuyen-hang-hoa/hung-yen'], ['Hải Dương', '/van-chuyen-hang-hoa/hai-duong'], ['Nam Định', '/van-chuyen-hang-hoa/nam-dinh'], ['Thái Bình', '/van-chuyen-hang-hoa/thai-binh'], ['Ninh Bình', '/van-chuyen-hang-hoa/ninh-binh'], ['Lào Cai', '/van-chuyen-hang-hoa/lao-cai'], ['Lạng Sơn', '/van-chuyen-hang-hoa/lang-son'], ['Cao Bằng', '/van-chuyen-hang-hoa/cao-bang'], ['Bắc Kạn', '/van-chuyen-hang-hoa/bac-kan'], ['Thái Nguyên', '/van-chuyen-hang-hoa/thai-nguyen'], ['Hòa Bình', '/van-chuyen-hang-hoa/hoa-binh'], ['Phú Thọ', '/van-chuyen-hang-hoa/phu-tho'], ['Yên Bái', '/van-chuyen-hang-hoa/yen-bai'], ['Điện Biên – Lai Châu', '/van-chuyen-hang-hoa/dien-bien-lai-chau'], ['Sơn La', '/van-chuyen-hang-hoa/son-la']]) },
      { label: 'Tuyến miền Trung', items: links([['Thanh Hóa', '/van-chuyen-hang-hoa/thanh-hoa'], ['Vinh Nghệ An', '/van-chuyen-hang-hoa/vinh-nghe-an'], ['Hà Tĩnh', '/van-chuyen-hang-hoa/ha-tinh'], ['Quảng Bình', '/van-chuyen-hang-hoa/quang-binh'], ['Quảng Trị', '/van-chuyen-hang-hoa/quang-tri'], ['Huế', '/van-chuyen-hang-hoa/hue'], ['Đà Nẵng', '/van-chuyen-hang-hoa/da-nang'], ['Quảng Nam', '/van-chuyen-hang-hoa/quang-nam'], ['Quảng Ngãi', '/van-chuyen-hang-hoa/quang-ngai'], ['Bình Định', '/van-chuyen-hang-hoa/binh-dinh'], ['Phú Yên', '/van-chuyen-hang-hoa/phu-yen'], ['Nha Trang', '/van-chuyen-hang-hoa/nha-trang'], ['Ninh Thuận', '/van-chuyen-hang-hoa/ninh-thuan'], ['Bình Thuận', '/van-chuyen-hang-hoa/binh-thuan']]) },
      { label: 'Tuyến miền Nam', items: links([['TP. Hồ Chí Minh', '/van-chuyen-hang-hoa/tphcm'], ['Bình Dương', '/van-chuyen-hang-hoa/binh-duong'], ['Đồng Nai', '/van-chuyen-hang-hoa/dong-nai'], ['Bình Phước', '/van-chuyen-hang-hoa/binh-phuoc'], ['Tây Ninh', '/van-chuyen-hang-hoa/tay-ninh'], ['Vũng Tàu', '/van-chuyen-hang-hoa/vung-tau'], ['Long An', '/van-chuyen-hang-hoa/long-an'], ['Tiền Giang', '/van-chuyen-hang-hoa/tien-giang'], ['Bến Tre', '/van-chuyen-hang-hoa/ben-tre'], ['Cần Thơ', '/van-chuyen-hang-hoa/can-tho'], ['An Giang', '/van-chuyen-hang-hoa/an-giang'], ['Đồng Tháp', '/van-chuyen-hang-hoa/dong-thap'], ['Vĩnh Long', '/van-chuyen-hang-hoa/vinh-long'], ['Trà Vinh', '/van-chuyen-hang-hoa/tra-vinh'], ['Hậu Giang', '/van-chuyen-hang-hoa/hau-giang'], ['Bạc Liêu', '/van-chuyen-hang-hoa/bac-lieu'], ['Sóc Trăng', '/van-chuyen-hang-hoa/soc-trang'], ['Cà Mau', '/van-chuyen-hang-hoa/ca-mau']]) },
      { label: 'Tây Nguyên & quốc tế', items: links([['Tây Nguyên', '/van-chuyen-hang-hoa/tay-nguyen'], ['Đắk Lắk', '/van-chuyen-hang-hoa/dak-lak'], ['Đắk Nông', '/van-chuyen-hang-hoa/dak-nong'], ['Gia Lai', '/van-chuyen-hang-hoa/gia-lai'], ['Kon Tum', '/van-chuyen-hang-hoa/kontum'], ['Đà Lạt – Lâm Đồng', '/van-chuyen-hang-hoa/da-lat-lam-dong'], ['Campuchia', '/van-chuyen-hang-hoa/campuchia'], ['Lào', '/van-chuyen-hang-hoa/lao'], ['Đường biển', '/van-chuyen-hang-hoa/duong-bien'], ['Đường hàng không', '/van-chuyen-hang-hoa/duong-hang-khong']]) },
    ],
  },
  {
    label: 'Dịch vụ chuyên biệt', href: '/van-chuyen-hang-hoa',
    items: [
      { label: 'Loại hàng', items: links([['Máy móc & thiết bị', '/van-chuyen-hang-hoa/may-moc-thiet-bi'], ['Vận chuyển xe máy', '/van-chuyen-hang-hoa/xe-may'], ['Hàng siêu trường siêu trọng', '/van-chuyen-hang-hoa/sieu-truong-sieu-trong'], ['Vận chuyển dầu nhớt', '/van-chuyen-hang-hoa/dau-nhot']]) },
      { label: 'Dịch vụ vận tải', items: links([['Vận chuyển hàng hóa', '/van-chuyen-hang-hoa'], ['Chành xe Phú Quốc', '/van-chuyen-hang-hoa/chanh-xe-phu-quoc'], ['Chành xe Buôn Mê Thuột', '/van-chuyen-hang-hoa/chanh-xe-chuyen-hang-di-buon-me-thuot']]) },
    ],
  },
  {
    label: 'Thuê xe tải', href: '/thue-xe-tai',
    items: [{ label: 'Khu vực phục vụ', items: links([['Thuê xe tải TP.HCM', '/thue-xe-tai/hcm'], ['Thuê xe tải Hà Nội', '/thue-xe-tai/ha-noi'], ['Thuê xe tải Đà Nẵng', '/thue-xe-tai/da-nang']]) }],
  },
  {
    label: 'Thông tin hỗ trợ', href: '/faq',
    items: [
      { label: 'Khách hàng', items: links([['Giới thiệu', '/gioi-thieu'], ['Liên hệ & báo giá', '/lien-he'], ['Câu hỏi thường gặp', '/faq'], ['Phương thức thanh toán', '/phuong-thuc-thanh-toan'], ['Chính sách vận chuyển', '/chinh-sach-van-chuyen-va-giao-hang'], ['Chính sách bảo mật', '/chinh-sach-bao-mat']]) },
      { label: 'Phương Vy', items: links([['Thư ngỏ', '/thu-ngo'], ['Tuyển dụng', '/tuyen-dung'], ['Cẩm nang vận tải', '/blog']]) },
    ],
  },
];

export function getBriefNavigation(lang: string): BriefNavigationGroup[] {
  void lang;
  return BRIEF_NAVIGATION;
}
