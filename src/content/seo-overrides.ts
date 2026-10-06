/**
 * Owner-approved rewrites of the Rank Math titles and descriptions captured in
 * src/legacy-content/seo-meta.json, which stays exactly as WordPress served it
 * (applied by scripts/build-legacy.ts). They fix spelling, give a description to
 * pages WordPress served without one, and drop shouting capitals and unproven
 * "#1"/"nhất" claims from titles while keeping each title's keywords and word
 * order, under 600 px in Google's results. Keys are page paths without the
 * trailing slash.
 */
export type SeoOverride = { title?: string; description?: string };

export const SEO_OVERRIDES: Record<string, SeoOverride> = {
  '/blog/giay-to-van-chuyen-hang-hoa': {
    title: 'Vận chuyển hàng hóa cần lưu ý những loại giấy tờ gì?',
    description: 'Gửi hàng đi xa cần giấy tờ gì? Danh sách giấy tờ nhà xe phải có và giấy tờ khách hàng cần chuẩn bị khi vận chuyển hàng hóa bằng đường bộ.',
  },
  '/blog/quy-dinh-van-chuyen-hang-hoa-nguy-hiem': {
    description: 'Tổng hợp tất cả thông tin cần biết khi vận chuyển hàng hóa nguy hiểm trên tuyến đường bắc nam bằng đường bộ, tàu hỏa cũng như hàng không.',
  },
  '/blog/van-chuyen-hang-hoa-nguy-hiem': {
    title: 'Vận chuyển hàng hóa nguy hiểm: bạn cần biết gì? | Phương Vy',
    description: 'Hàng nguy hiểm được chia thành 9 loại. Bài viết tổng hợp yêu cầu về bao bì, phương tiện và cách đóng gói khi vận chuyển hàng hóa nguy hiểm.',
  },
  '/faq': {
    description: 'Giải đáp câu hỏi thường gặp về vận tải hàng hóa: vận tải là gì, các hình thức kinh doanh vận tải, giấy vận tải, POD và điều kiện cấp phép.',
  },
  '/gioi-thieu': {
    description: 'Công ty Phương Vy qua quá trình hoạt động dần chứng minh mình là công ty cung cấp dịch vụ vận tải hàng hoá SỐ 1 tại Sài Gòn và Hà Nội.',
  },
  '/thu-ngo': {
    title: 'Thư ngỏ - Vận Tải Phương Vy',
  },
  '/thue-xe-tai': {
    title: 'Bảng báo giá cho thuê xe tải chở hàng | Vận Tải Phương Vy',
    description: 'CẬP NHẬT bảng báo giá cho thuê xe tải chở hàng mới của vận tải Phương Vy chở hàng hóa từ bắc chí nam với giá thành rẻ, chất lượng dịch vụ SỐ 1.',
  },
  '/thue-xe-tai/da-nang': {
    description: 'Vận tải Phương Vy cung cấp dịch vụ cho thuê xe tải chở hàng hóa tại Đà Nẵng, Quảng Nam, Hội An với giá thành SIÊU RẺ, nhanh chóng, chất lượng.',
  },
  '/thue-xe-tai/ha-noi': {
    title: 'Cho thuê xe tải chở hàng giá rẻ tại Hà Nội | Phương Vy',
  },
  '/van-chuyen-hang-hoa': {
    title: 'Dịch vụ vận chuyển hàng hóa Bắc Nam | Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/an-giang': {
    title: 'Chành xe gửi hàng đi An Giang trong ngày - Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/bac-lieu': {
    title: 'Chành xe gửi hàng đi Bạc Liêu trong ngày - Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/ca-mau': {
    title: 'Chành xe gửi hàng đi Cà Mau trong ngày - Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/cao-bang': {
    title: 'Chành xe gửi hàng hóa đi Cao Bằng nhanh chóng, cước rẻ',
  },
  '/van-chuyen-hang-hoa/chanh-xe-chuyen-hang-di-buon-me-thuot': {
    description: 'Chành xe gửi hàng bằng xe tải đi Buôn Ma Thuột, Đắk Lắk từ Sài Gòn (TPHCM), Hà Nội và ngược lại với giá cước ưu đãi, miễn phí bốc dỡ hàng và lưu kho.',
  },
  '/van-chuyen-hang-hoa/chanh-xe-phu-quoc': {
    title: 'Chành xe gửi hàng đi Phú Quốc trong ngày - Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/dak-lak': {
    title: 'Dịch vụ vận chuyển hàng hóa TPHCM – Đắk Lắk | Phương Vy',
    description: 'Chành xe gửi hàng hai chiều TPHCM, Hà Nội, Đà Nẵng – Đắk Lắk (Buôn Ma Thuột): máy móc, nội thất, hàng cồng kềnh. Miễn phí bốc dỡ, lưu kho.',
  },
  '/van-chuyen-hang-hoa/dak-nong': {
    title: 'Chành xe gửi hàng hóa đi Đắk Nông trong ngày - Phương Vy',
  },
  '/van-chuyen-hang-hoa/dong-nai': {
    title: 'Chành xe gửi hàng hóa đi Đồng Nai giá rẻ | Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/dong-thap': {
    title: 'Chành xe gửi hàng đi Đồng Tháp giá rẻ - Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/ha-tinh': {
    description: 'Chành xe gửi hàng đi Hà Tĩnh từ TPHCM, Hà Nội. Tuyến Hà Nội giao trong 9–18 tiếng, cước từ 800đ/kg hàng nguyên xe, miễn phí bốc xếp, giao tận nơi.',
  },
  '/van-chuyen-hang-hoa/hau-giang': {
    title: 'Chành xe gửi hàng đi Hậu Giang cước rẻ - Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/hoa-binh': {
    title: 'Chành xe gửi hàng đi Hòa Bình nhanh chóng, cước rẻ',
  },
  '/van-chuyen-hang-hoa/long-an': {
    description: 'Phương Vy nhận chành xe vận chuyển hàng hóa từ miền tây Long An đi Hà Nội và ngược lại. Giá Cước tốt, chiết khấu 10% trong tháng này.',
  },
  '/van-chuyen-hang-hoa/may-moc-thiet-bi': {
    title: 'Dịch vụ vận chuyển máy móc thiết bị - Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/nam-dinh': {
    title: 'Dịch vụ chành xe gửi hàng đi Nam Định - Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/nha-trang': {
    title: 'Chành xe gửi hàng đi Nha Trang giá rẻ | Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/phan-thiet': {
    description: 'Dịch vụ chành xe tải vận chuyển hàng hóa về Phan Thiết, Mũi Né, La Gi Bình Thuận từ Sài Gòn, Hà Nội với giá cước phí RẺ nhất trên thị trường.',
  },
  '/van-chuyen-hang-hoa/phu-yen': {
    title: 'Chành xe gửi hàng từ TPHCM, Hà Nội đi Phú Yên | Phương Vy',
  },
  '/van-chuyen-hang-hoa/quang-binh': {
    description: 'Vận tải Phương Vy cung cấp dịch vụ gửi hàng, chành xe Quảng Bình đi các tỉnh thành trên cả nước với giá thành và tốc độ nhanh nhất hiện nay.',
  },
  '/van-chuyen-hang-hoa/sieu-truong-sieu-trong': {
    description: 'Vận tải Phương Vy cung cấp dịch vụ vận chuyển hàng siêu trường siêu trọng, quá khổ quá tải, máy công trình trên tuyến bắc nam với giá cạnh tranh nhất.',
  },
  '/van-chuyen-hang-hoa/soc-trang': {
    title: 'Chành xe gửi hàng đi Sóc Trăng nhanh chóng trong ngày',
  },
  '/van-chuyen-hang-hoa/son-la': {
    title: 'Dịch vụ gửi hàng đi Sơn La giá tốt - Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/thai-binh': {
    title: 'Vận chuyển gửi hàng hóa từ TPHCM đi Thái Bình trong 40h',
  },
  '/van-chuyen-hang-hoa/thai-nguyen': {
    description: 'Phương Vy cung cấp dịch vụ vận chuyển hàng hóa đi Thái Nguyên từ Sài Gòn, Hà Nội với thời gian nhanh chóng bằng xe tải, Giao hàng tận nơi.',
  },
  '/van-chuyen-hang-hoa/thanh-hoa': {
    title: 'Vận chuyển hàng, chành xe Sài Gòn đi Thanh Hóa nhanh, rẻ',
  },
  '/van-chuyen-hang-hoa/tien-giang': {
    title: 'Chành xe gửi hàng đi Tiền Giang nhanh chóng trong ngày',
  },
  '/van-chuyen-hang-hoa/tra-vinh': {
    title: 'Chành xe gửi hàng đi Trà Vinh trong ngày, cước rẻ',
  },
  '/van-chuyen-hang-hoa/vinh-long': {
    title: 'Chành xe gửi hàng đi Vĩnh Long giá rẻ | Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/yen-bai': {
    description: 'Vận chuyển hàng hóa đi Yên Bái từ TPHCM hay Hà Nội với mức giá cực cạnh tranh cùng vận tải Phương Vy. Gọi ngay 0933 87 1139 để nhận báo giá.',
  },
};
