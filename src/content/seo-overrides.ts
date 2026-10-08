/**
 * Owner-approved rewrites of the Rank Math titles and descriptions captured in
 * src/legacy-content/seo-meta.json, which stays exactly as WordPress served it
 * (applied by scripts/build-legacy.ts). They fix spelling, give a description to
 * pages WordPress served without one, keep "giảm 7% cho khách hàng mới" as the only
 * offer, and drop "#1", "số 1" and "nhất" claims and shouting capitals while
 * keeping each title's keywords and word order, under 600 px in Google's results.
 * `heading` replaces the WordPress title used as the page H1. Keys are page paths
 * without the trailing slash.
 */
export type SeoOverride = { title?: string; description?: string; heading?: string };

export const SEO_OVERRIDES: Record<string, SeoOverride> = {
  // The home page keeps its Rank Math title; its description drops "lớn mạnh nhất" and "top đầu".
  '/': {
    description: 'Vận Tải Phương Vy là công ty vận tải hàng hóa tại Sài Gòn và Hà Nội, chuyên vận chuyển hàng hóa Bắc Nam, chành xe đi các tỉnh và cho thuê xe tải.',
  },
  '/blog/bien-bao-cam-xe-tai-va-muc-phat': {
    title: 'Giờ cấm xe tải 2026, biển báo cấm tải và mức phạt | Phương Vy',
    description: 'Giờ cấm xe tải ở TP.HCM, Hà Nội, Đà Nẵng, Nha Trang; biển cấm tải theo QCVN 41:2024 và mức phạt theo Nghị định 168/2024 sửa đổi năm 2026.',
    heading: 'Biển báo cấm xe tải, giờ cấm tải và mức phạt năm 2026',
  },
  '/blog/dich-y-nghia-bien-so-xe-theo-phong-thuy-khoa-hoc': {
    description: 'Phương pháp dịch biển số xe dựa trên phong thủy khoa học, giúp bạn có thể tự dịch nghĩa biển số xe của mình chỉ qua một bài viết.',
  },
  '/blog/giay-to-van-chuyen-hang-hoa': {
    title: 'Vận chuyển hàng hóa cần lưu ý những loại giấy tờ gì?',
    description: 'Gửi hàng đi xa cần giấy tờ gì? Danh sách giấy tờ nhà xe phải có và giấy tờ khách hàng cần chuẩn bị khi vận chuyển hàng hóa bằng đường bộ.',
  },
  '/blog/hang-hoa-thuong-gap-trong-nganh-van-tai': {
    title: 'Các loại hàng hóa thường gặp trong ngành vận tải | Phương Vy',
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
    description: 'Công ty Phương Vy qua quá trình hoạt động dần chứng minh mình là công ty cung cấp dịch vụ vận tải hàng hoá uy tín tại Sài Gòn và Hà Nội.',
  },
  '/thu-ngo': {
    title: 'Thư ngỏ - Vận Tải Phương Vy',
  },
  '/thue-xe-tai': {
    title: 'Bảng báo giá cho thuê xe tải chở hàng | Vận Tải Phương Vy',
    description: 'CẬP NHẬT bảng báo giá cho thuê xe tải chở hàng mới của vận tải Phương Vy chở hàng hóa từ bắc chí nam với giá thành rẻ, chất lượng dịch vụ tốt.',
  },
  '/thue-xe-tai/da-nang': {
    description: 'Vận tải Phương Vy cung cấp dịch vụ cho thuê xe tải chở hàng hóa tại Đà Nẵng, Quảng Nam, Hội An với giá thành SIÊU RẺ, nhanh chóng, chất lượng.',
  },
  '/thue-xe-tai/ha-noi': {
    title: 'Cho thuê xe tải chở hàng giá rẻ tại Hà Nội | Phương Vy',
  },
  '/van-chuyen-hang-hoa': {
    title: 'Dịch vụ vận chuyển hàng hóa Bắc Nam | Vận Tải Phương Vy',
    description: 'Bảng báo giá cước vận chuyển hàng hóa bắc nam giá rẻ bằng xe tải, container, tàu hỏa, đường sắt, đường biển, máy bay nhanh, uy tín.',
  },
  '/van-chuyen-hang-hoa/an-giang': {
    title: 'Chành xe gửi hàng đi An Giang trong ngày - Vận Tải Phương Vy',
    description: 'Dịch vụ chuyển hàng đi An Giang từ Sài Gòn (TPHCM), Hà Nội với giá cước giảm 7% cho khách hàng mới. Giao tận nơi cùng miễn phí bốc dỡ.',
  },
  '/van-chuyen-hang-hoa/bac-giang': {
    description: 'Dịch vụ vận chuyển hàng hóa Bắc Giang từ TPHCM, Hà Nội tại vận tải Phương Vy với giá thành ưu đãi, giảm 7% cho khách hàng mới. Miễn phí bốc dỡ hàng.',
  },
  '/van-chuyen-hang-hoa/bac-lieu': {
    title: 'Chành xe gửi hàng đi Bạc Liêu trong ngày - Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/bac-ninh': {
    description: 'Dịch vụ gửi hàng hóa, chành xe từ Sài Gòn đi Bắc Ninh với giá thành siêu rẻ, chất lượng tốt, uy tín. Gọi ngay cho chúng tôi.',
  },
  '/van-chuyen-hang-hoa/binh-dinh': {
    description: 'Xe vận tải Phương Vy cung cấp dịch vụ chành xe vận chuyển hàng hóa từ Sài Gòn, Hà Nội đi Quy Nhơn Bình Định với giá thành rẻ. Giảm 7% cho khách hàng mới.',
  },
  '/van-chuyen-hang-hoa/binh-duong': {
    title: 'Chành xe vận chuyển hàng hóa đi Bình Dương | Phương Vy',
  },
  '/van-chuyen-hang-hoa/binh-phuoc': {
    description: 'Dịch vụ chành xe vận chuyển hàng hóa đi Bình Phước từ mọi miền tổ quốc ✅ Giảm 7% cước cho khách hàng mới ✅ Giảm thêm khi vận chuyển 2 chiều. Liên Hệ Ngay !',
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
  '/van-chuyen-hang-hoa/da-lat-lam-dong': {
    description: 'Chành xe chuyển hàng đi Đà Lạt Lâm Đồng từ Sài Gòn, Hà Nội với giá thành cạnh tranh. Miễn phí hoàn toàn lưu kho và bốc dỡ hàng hóa.',
  },
  '/van-chuyen-hang-hoa/dak-lak': {
    title: 'Dịch vụ vận chuyển hàng hóa TPHCM – Đắk Lắk | Phương Vy',
    description: 'Chành xe gửi hàng hai chiều TPHCM, Hà Nội, Đà Nẵng – Đắk Lắk (Buôn Ma Thuột): máy móc, nội thất, hàng cồng kềnh. Miễn phí bốc dỡ, lưu kho.',
  },
  '/van-chuyen-hang-hoa/dak-nong': {
    title: 'Chành xe gửi hàng hóa đi Đắk Nông trong ngày - Phương Vy',
  },
  '/van-chuyen-hang-hoa/dien-bien-lai-chau': {
    description: 'Chành xe vận chuyển, gửi hàng đi Điện Biên, Lai Châu với cước phí rẻ, thời gian nhanh chóng cùng vận tải Phương Vy. Giảm 7% cho khách hàng mới.',
  },
  '/van-chuyen-hang-hoa/dong-nai': {
    title: 'Chành xe gửi hàng hóa đi Đồng Nai giá rẻ | Vận Tải Phương Vy',
    description: 'Vận tải Phương Vy cung cấp dịch vụ vận chuyển hàng hóa hai chiều Đồng Nai - Hà Nội với giá cước rẻ, thời gian nhanh chóng, giảm 7% cho khách hàng mới.',
  },
  '/van-chuyen-hang-hoa/dong-thap': {
    title: 'Chành xe gửi hàng đi Đồng Tháp giá rẻ - Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/duong-bien': {
    description: 'Vận chuyển hàng hóa nội địa và ra nước ngoài bằng đường biển cùng vận tải Phương Vy là lựa chọn tiết kiệm với giá cước siêu rẻ.',
  },
  '/van-chuyen-hang-hoa/duong-hang-khong': {
    title: 'Vận chuyển hàng hóa bằng đường hàng không | Phương Vy',
  },
  '/van-chuyen-hang-hoa/ha-tinh': {
    description: 'Chành xe gửi hàng đi Hà Tĩnh từ TPHCM, Hà Nội. Tuyến Hà Nội giao trong 9–18 tiếng, cước từ 800đ/kg hàng nguyên xe, miễn phí bốc xếp, giao tận nơi.',
  },
  '/van-chuyen-hang-hoa/hai-phong': {
    description: 'Dịch vụ chành xe chuyển hàng từ TPHCM (Sài Gòn), Hà Nội đi Hải Phòng với cước phí rẻ, giảm 7% cho khách hàng mới. Miễn phí bốc xếp, lưu kho.',
  },
  '/van-chuyen-hang-hoa/hau-giang': {
    title: 'Chành xe gửi hàng đi Hậu Giang cước rẻ - Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/hoa-binh': {
    title: 'Chành xe gửi hàng đi Hòa Bình nhanh chóng, cước rẻ',
    description: 'Dịch vụ chuyển hàng từ Sài Gòn (TPHCM), Hà Nội đi Hòa Bình với giá cước giảm 7% cho khách hàng mới. Giao tận nơi cùng miễn phí bốc dỡ.',
  },
  '/van-chuyen-hang-hoa/lang-son': {
    description: 'Vận tải Phương Vy nhận gửi hàng đi Lạng Sơn từ Sài Gòn, Hà Nội và nhiều tỉnh khác bằng xe tải với giá cước ưu đãi. Dịch vụ uy tín, chất lượng.',
  },
  '/van-chuyen-hang-hoa/long-an': {
    description: 'Phương Vy nhận chành xe vận chuyển hàng hóa từ miền tây Long An đi Hà Nội và ngược lại. Giá cước tốt, giảm 7% cho khách hàng mới.',
  },
  '/van-chuyen-hang-hoa/may-moc-thiet-bi': {
    title: 'Dịch vụ vận chuyển máy móc thiết bị - Vận Tải Phương Vy',
    heading: 'Dịch vụ vận chuyển máy móc thiết bị',
  },
  '/van-chuyen-hang-hoa/mong-cai': {
    description: 'Vận tải Phương Vy nhận vận chuyển hàng hóa từ Móng Cái đi Sài Gòn, Hà Nội với cước phí tốt, giao hàng tận nơi, miễn phí bốc xếp, lưu kho.',
  },
  '/van-chuyen-hang-hoa/nam-dinh': {
    title: 'Dịch vụ chành xe gửi hàng đi Nam Định - Vận Tải Phương Vy',
    description: 'Dịch vụ chuyển hàng đi Nam Định từ Sài Gòn (TPHCM), Hà Nội với giá cước giảm 7% cho khách hàng mới. Đặc biệt hàng giao tận nơi cùng miễn phí bốc dỡ.',
  },
  '/van-chuyen-hang-hoa/nha-trang': {
    title: 'Chành xe gửi hàng đi Nha Trang giá rẻ | Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/phan-thiet': {
    description: 'Dịch vụ chành xe tải vận chuyển hàng hóa về Phan Thiết, Mũi Né, La Gi Bình Thuận từ Sài Gòn, Hà Nội với giá cước phí rẻ.',
  },
  '/van-chuyen-hang-hoa/phu-yen': {
    title: 'Chành xe gửi hàng từ TPHCM, Hà Nội đi Phú Yên | Phương Vy',
  },
  '/van-chuyen-hang-hoa/quang-binh': {
    description: 'Vận tải Phương Vy cung cấp dịch vụ gửi hàng, chành xe Quảng Bình đi các tỉnh thành trên cả nước với giá thành hợp lý và tốc độ nhanh.',
  },
  '/van-chuyen-hang-hoa/quang-ngai': {
    description: 'Vận tải Phương Vy nhận chành xe gửi hàng hóa đi Quảng Ngãi đi các tỉnh với giá thành cạnh tranh. Xe chạy ngày 3 CHUYẾN. Gọi ngay 0933 87 1139',
  },
  '/van-chuyen-hang-hoa/sieu-truong-sieu-trong': {
    title: 'Dịch vụ vận chuyển hàng siêu trường siêu trọng | Phương Vy',
    description: 'Vận tải Phương Vy cung cấp dịch vụ vận chuyển hàng siêu trường siêu trọng, quá khổ quá tải, máy công trình trên tuyến bắc nam với giá cạnh tranh.',
  },
  '/van-chuyen-hang-hoa/soc-trang': {
    title: 'Chành xe gửi hàng đi Sóc Trăng nhanh chóng trong ngày',
  },
  '/van-chuyen-hang-hoa/son-la': {
    title: 'Dịch vụ gửi hàng đi Sơn La giá tốt - Vận Tải Phương Vy',
  },
  '/van-chuyen-hang-hoa/tay-nguyen': {
    title: 'Vận chuyển hàng hóa từ TPHCM đi Tây Nguyên | Phương Vy',
    description: 'Phương Vy cung cấp dịch vụ vận chuyển hàng hóa, chuyển hàng từ Sài Gòn đi các tỉnh Tây Nguyên với giá thành hợp lý, chất lượng dịch vụ tốt.',
  },
  '/van-chuyen-hang-hoa/tay-ninh': {
    description: 'Vận tải Phương Vy cung cấp dịch vụ chành xe gửi hàng đi Tây Ninh từ các tỉnh miền bắc, miền trung và ngược lại với giá cước rẻ, thời gian nhanh chóng.',
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
  '/van-chuyen-hang-hoa/vinh-nghe-an': {
    description: 'Dịch vụ chành xe tải vận chuyển hàng hóa đi Vinh, Nghệ An với cước phí rẻ. Miễn phí bốc dỡ hàng, giao hàng tận nơi khách yêu cầu.',
  },
  '/van-chuyen-hang-hoa/vinh-phuc': {
    description: 'Dịch vụ vận chuyển hàng hóa đi Vĩnh Phúc từ Sài Gòn và Hà Nội của vận tải Phương Vy, giá rẻ, giảm 7% cho khách hàng mới, miễn phí bốc dỡ hàng, lưu kho.',
  },
  '/van-chuyen-hang-hoa/xe-may': {
    description: 'Dịch vụ vận chuyển xe máy bắc nam bằng xe khách, ô tô tải, tàu hỏa đường sắt với giá cước phí rẻ, ưu đãi. KHÔNG TĂNG GIÁ ngày lễ, tết.',
  },
  '/van-chuyen-hang-hoa/yen-bai': {
    description: 'Vận chuyển hàng hóa đi Yên Bái từ TPHCM hay Hà Nội với mức giá cực cạnh tranh cùng vận tải Phương Vy. Gọi ngay 0933 87 1139 để nhận báo giá.',
  },
};
