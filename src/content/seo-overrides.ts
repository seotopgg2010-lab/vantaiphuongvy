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
    title: 'Quy định vận chuyển hàng nguy hiểm, cấp phép | Phương Vy',
    description: 'Tổng hợp tất cả thông tin cần biết khi vận chuyển hàng hóa nguy hiểm trên tuyến đường bắc nam bằng đường bộ, tàu hỏa cũng như hàng không.',
    heading: 'Quy định vận chuyển hàng hóa nguy hiểm',
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
    title: 'Thuê xe tải 0,5–30 tấn nội thành, đi tỉnh | Phương Vy',
    description: 'Cho thuê xe tải thùng kín, mui bạt 0,5–30 tấn và container chở hàng nội thành, đi tỉnh; miễn phí lưu kho, bốc xếp tại kho. Gọi 0933 871 139.',
    heading: 'Thuê xe tải chở hàng nội thành và đi tỉnh',
  },
  '/thue-xe-tai/da-nang': {
    description: 'Vận tải Phương Vy cung cấp dịch vụ cho thuê xe tải chở hàng hóa tại Đà Nẵng, Quảng Nam, Hội An với giá thành siêu rẻ, nhanh chóng, chất lượng.',
  },
  '/thue-xe-tai/ha-noi': {
    title: 'Cho thuê xe tải chở hàng giá rẻ tại Hà Nội | Phương Vy',
  },
  '/van-chuyen-hang-hoa': {
    title: 'Vận chuyển hàng hóa Bắc Nam khoảng 48 giờ | Phương Vy',
    description: 'Chành xe Bắc Nam bằng xe tải 1–30 tấn và container, khoảng 48 giờ. Hàng nặng tính theo kg, hàng nhẹ theo khối; giảm 7% khách mới. Gọi 0933 871 139.',
    heading: 'Vận chuyển hàng hóa Bắc Nam',
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
    description: 'Chành xe gửi hàng đi Hà Tĩnh từ TPHCM, Hà Nội. Tuyến Hà Nội giao trong 9–12 tiếng, cước từ 800đ/kg cho đơn trên 1 tấn, miễn phí bốc xếp, giao tận nơi.',
  },
  '/van-chuyen-hang-hoa/hai-phong': {
    title: 'Chành xe gửi hàng đi Hải Phòng 2–3 ngày | Vận Tải Phương Vy',
    description: 'Gửi hàng đi Hải Phòng: từ TP.HCM 2–3 ngày, 3 chuyến mỗi ngày; từ Hà Nội 2–3 giờ, 5 chuyến mỗi ngày. Giảm 7% cho khách mới. Gọi 0933 871 139.',
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
    title: 'Vận chuyển máy móc thiết bị bằng xe 1–35 tấn | Phương Vy',
    description: 'Vận chuyển máy móc, thiết bị từ TP.HCM, Hà Nội đi toàn quốc bằng xe tải 1–35 tấn, xe cẩu, rơ moóc lùn, rơ moóc sàn. Gọi 0933 871 139 báo giá.',
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
    title: 'Chành xe gửi hàng đi Phan Thiết, Mũi Né | Vận Tải Phương Vy',
    description: 'Dịch vụ chành xe tải vận chuyển hàng hóa về Phan Thiết, Mũi Né, La Gi Bình Thuận từ Sài Gòn, Hà Nội với giá cước phí rẻ.',
  },
  '/van-chuyen-hang-hoa/phu-yen': {
    title: 'Chành xe gửi hàng từ TPHCM, Hà Nội đi Phú Yên | Phương Vy',
    description: 'Vận tải Phương Vy nhận chuyển hàng từ TPHCM (Sài Gòn), Hà Nội đi Tuy Hòa Phú Yên với giá cước phí rẻ, đặc biệt giao hàng tận nơi.',
  },
  '/van-chuyen-hang-hoa/quang-binh': {
    description: 'Vận tải Phương Vy cung cấp dịch vụ gửi hàng, chành xe Quảng Bình đi các tỉnh thành trên cả nước với giá thành hợp lý và tốc độ nhanh.',
  },
  '/van-chuyen-hang-hoa/quang-ngai': {
    description: 'Vận tải Phương Vy nhận chành xe gửi hàng hóa đi Quảng Ngãi đi các tỉnh với giá thành cạnh tranh. Xe chạy ngày 3 chuyến. Gọi ngay 0933 87 1139',
  },
  '/van-chuyen-hang-hoa/sieu-truong-sieu-trong': {
    title: 'Vận chuyển hàng siêu trường siêu trọng, có cẩu | Phương Vy',
    description: 'Chở hàng siêu trường siêu trọng, máy công trình từ TP.HCM: Đồng Nai, Vũng Tàu từ 4 giờ, miền Tây từ 12 giờ, có cẩu xếp hàng. Gọi 0933 871 139.',
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
    heading: 'Vận chuyển hàng hóa đi Tây Nguyên',
  },
  '/van-chuyen-hang-hoa/tay-ninh': {
    description: 'Vận tải Phương Vy cung cấp dịch vụ chành xe gửi hàng đi Tây Ninh từ các tỉnh miền bắc, miền trung và ngược lại với giá cước rẻ, thời gian nhanh chóng.',
  },
  '/van-chuyen-hang-hoa/thai-binh': {
    title: 'Vận chuyển gửi hàng hóa từ TPHCM đi Thái Bình trong 40h',
    description: 'Vận tải Phương Vy cung cấp dịch vụ chành xe vận chuyển hàng từ Sài Gòn đi Thái Bình nhanh chỉ trong 40h với giá cước cực rẻ.',
  },
  '/van-chuyen-hang-hoa/thai-nguyen': {
    description: 'Phương Vy cung cấp dịch vụ vận chuyển hàng hóa đi Thái Nguyên từ Sài Gòn, Hà Nội với thời gian nhanh chóng bằng xe tải, Giao hàng tận nơi.',
  },
  '/van-chuyen-hang-hoa/thanh-hoa': {
    title: 'Vận chuyển hàng, chành xe Sài Gòn đi Thanh Hóa nhanh, rẻ',
    description: 'Vận tải Phương Vy cung cấp dịch vụ vận chuyển gửi hàng hóa từ TPHCM đi Thanh Hóa với giá cước siêu rẻ, siêu hấp dẫn, thời gian chuyển hàng nhanh.',
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
    title: 'Vận chuyển xe máy Bắc Nam từ 48h, giao tận nơi | Phương Vy',
    description: 'Gửi xe máy Bắc – Nam bằng xe tải, xe khách: xuất bến 15h–20h mỗi ngày, nhận xe từ 48h, không tăng giá ngày lễ, Tết. Gọi 0933 871 139.',
    heading: 'Vận chuyển xe máy Bắc Nam',
  },
  '/van-chuyen-hang-hoa/yen-bai': {
    description: 'Vận chuyển hàng hóa đi Yên Bái từ TPHCM hay Hà Nội với mức giá cực cạnh tranh cùng vận tải Phương Vy. Gọi ngay 0933 87 1139 để nhận báo giá.',
  },
  // Money pages: the title and description lead with the service and a delivery-time or fleet fact from the page.
  '/van-chuyen-hang-hoa/ha-noi': {
    title: 'Gửi hàng TPHCM đi Hà Nội 36–48h, giao tận nơi | Phương Vy',
    description: 'Chành xe TPHCM đi Hà Nội 1.700 km: hàng nguyên xe 36–48h, hàng ghép 2–4 ngày, 3 chuyến mỗi ngày từ kho Hóc Môn. Gọi 0933 871 139.',
    heading: 'Vận chuyển hàng hóa TPHCM đi Hà Nội',
  },
  '/van-chuyen-hang-hoa/tphcm': {
    title: 'Vận chuyển hàng hóa TPHCM đi tỉnh, xe 1–30 tấn | Phương Vy',
    description: 'Chành xe Sài Gòn đi các tỉnh bằng xe tải 1–30 tấn và container; hàng ghép 2–3 ngày, xe chạy 5h–22h cả thứ Bảy, Chủ nhật. Gọi 0933 871 139.',
    heading: 'Vận chuyển hàng hóa TPHCM đi tỉnh và nội thành',
  },
  '/van-chuyen-hang-hoa/da-nang': {
    title: 'Chành xe TPHCM đi Đà Nẵng 24–36h, giao tận nơi | Phương Vy',
    description: 'Chành xe TPHCM đi Đà Nẵng khoảng 960 km: hàng nguyên xe 24–36h, 3 chuyến mỗi ngày, bảo hiểm cơ bản miễn phí, giao tận nơi. Gọi 0933 871 139.',
    heading: 'Vận chuyển gửi hàng hóa TPHCM đi Đà Nẵng',
  },
  '/thue-xe-tai/hcm': {
    title: 'Thuê xe tải TPHCM 0,5–30 tấn, chạy cả ngày lễ | Phương Vy',
    description: 'Thuê xe tải 0,5–30 tấn và container chở hàng nội thành TP.HCM, đi tỉnh, kể cả Chủ nhật, ngày lễ; có hợp đồng, hóa đơn GTGT. Gọi 0933 871 139.',
  },
  // Money pages: the title and description lead with the service and a delivery-time or fleet fact from the page.
  '/blog/can-tim-doi-tac-van-chuyen-hang-hoa': {
    description: 'Cần tìm đối tác vận chuyển hàng hóa cam kết đầy hàng ở 2 chiều đi và về. Lượng khách có hàng cần tìm công ty vận tải rất lớn',
  },
  '/van-chuyen-hang-hoa/hai-duong': {
    description: 'Vận tải Phương Vy chuyên vận chuyển hàng hóa gửi xe máy từ Hải Dương đi Hà Nội, TPHCM và ngược lại. Dịch vụ uy tín, nhanh chóng, an toàn. liên hệ ngay',
  },
  '/van-chuyen-hang-hoa/kontum': {
    description: 'Dịch vụ vận chuyển hàng hóa, chành xe từ Sài Gòn đi Kontum là một trong những thế mạnh của Phương Vy nhờ vào giá cước rẻ, chất lượng, uy tín.',
  },
  '/van-chuyen-hang-hoa/lao': {
    description: 'Vận tải Phương Vy cung cấp dịch vụ gửi hàng, chành xe hai chiều Lào - Việt Nam với giá cước ưu đãi, nhanh chóng đến tận nơi khách yêu cầu.',
  },
  '/van-chuyen-hang-hoa/ninh-thuan': {
    description: 'Vận tải Phương Vy cung cấp dịch vụ gửi hàng, chành xe Ninh Thuận đi các tỉnh và ngược lại với giá cước ưu đãi, thời gian vận chuyển nhanh chóng, đúng hẹn.',
  },
  '/van-chuyen-hang-hoa/quang-tri': {
    description: 'Vận tải Phương Vy cung cấp dịch vụ chành xe gửi hàng từ TPHCM (Sài Gòn), Hà Nội đi Quảng Trị với giá cước ưu đãi. Xe xuất bến liên tục.',
  },
};
