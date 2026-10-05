/**
 * Static marketing copy for the public site. Every claim here is taken from
 * the live WordPress home page (src/legacy-content) — do not add unverified
 * figures, ratings or "24/7" promises.
 */

/** Most-requested destinations (shown in the hero search card and the routes mega menu). */
export const POPULAR_ROUTES = [
  { label: 'Hà Nội', href: '/van-chuyen-hang-hoa/ha-noi/' },
  { label: 'Đà Nẵng', href: '/van-chuyen-hang-hoa/da-nang/' },
  { label: 'Huế', href: '/van-chuyen-hang-hoa/hue/' },
  { label: 'Nha Trang', href: '/van-chuyen-hang-hoa/nha-trang/' },
  { label: 'Hải Phòng', href: '/van-chuyen-hang-hoa/hai-phong/' },
  { label: 'Cần Thơ', href: '/van-chuyen-hang-hoa/can-tho/' },
  { label: 'Phú Quốc', href: '/van-chuyen-hang-hoa/chanh-xe-phu-quoc/' },
] as const;

/** /blog index copy (page, metadata and markdown twin). */
export const BLOG_PAGE = {
  title: 'Cẩm nang vận tải – Tin tức & kinh nghiệm gửi hàng | Vận Tải Phương Vy',
  heading: 'Cẩm nang vận tải',
  description: 'Kinh nghiệm vận chuyển hàng hóa, giấy tờ cần thiết, quy định tải trọng, kích thước thùng xe và tin tức mới nhất từ Vận tải Phương Vy.',
} as const;

/** Home hero copy (rendered by the home page and its markdown twin). */
export const HERO = {
  title: 'Vận chuyển hàng hóa Bắc Nam & cho thuê xe tải toàn quốc',
  lead: 'Hơn 10 năm chành xe từ TP.HCM đi các tỉnh và ngược lại. Nhận hàng tận nơi, xe chạy hàng ngày, giá cước rõ ràng — có hóa đơn và bảo hiểm hàng hóa.',
  points: ['Miễn phí bốc dỡ & lưu kho', 'Giao hàng tận nơi', 'Xe tải 0,5 – 30 tấn', 'Làm việc cả ngày lễ'],
} as const;

export const HERO_IMAGE = {
  src: '/wp-content/uploads/2018/08/thue-xe-tai-cong-ty-phuong-vy.jpg',
  alt: 'Đội xe tải của Vận tải Phương Vy tại bãi xe TP.HCM',
};

export const STATS = [
  { value: '10+', label: 'năm kinh nghiệm chành xe' },
  { value: 'Toàn quốc', label: 'nhận & giao hàng tận nơi' },
  { value: '0,5–30 tấn', label: 'xe tải đủ loại tải trọng' },
  { value: '7 ngày', label: 'làm việc mỗi tuần, cả ngày lễ' },
] as const;

export const COMMITMENTS = [
  { key: 'fast', title: 'Nhanh chóng', text: 'Giao hàng đúng hẹn, đúng thời gian cam kết — thời gian của khách hàng là uy tín của Phương Vy.' },
  { key: 'exact', title: 'Chính xác', text: 'Giao đúng hạn, đúng địa điểm; quy trình quản lý nghiêm ngặt để không nhầm lẫn, thất lạc hàng hóa.' },
  { key: 'pro', title: 'Chuyên nghiệp', text: 'Hơn 10 năm chành xe, đội ngũ và xe tải phủ khắp các tỉnh thành, xử lý đơn hàng nhanh nhất.' },
  { key: 'safe', title: 'An toàn', text: 'Đóng gói, chằng buộc, phân loại hàng theo quy trình chuẩn; phương tiện được bảo dưỡng định kỳ.' },
  { key: 'easy', title: 'Tiện lợi', text: 'Thủ tục gửi hàng, thuê xe đơn giản — gọi điện hoặc nhắn Zalo là có xe đến nhận tận nơi.' },
  { key: 'save', title: 'Tiết kiệm', text: 'Giá cước cạnh tranh, chiết khấu cho khách quen; hỗ trợ đóng gói, bốc dỡ tại kho.' },
] as const;

export const PROCESS_STEPS = [
  { title: 'Liên hệ báo giá', text: 'Gọi hotline, nhắn Zalo hoặc gửi form: cho biết điểm đi, điểm đến, loại hàng và khối lượng.' },
  { title: 'Nhận hàng tận nơi', text: 'Xe đến lấy hàng tại kho/nhà hoặc quý khách gửi tại kho Phương Vy ở TP.HCM.' },
  { title: 'Đóng gói & vận chuyển', text: 'Hàng được kiểm đếm, đóng gói, chằng buộc và chạy theo lịch xe cố định mỗi ngày.' },
  { title: 'Giao hàng & thanh toán', text: 'Giao tận tay người nhận, đối chiếu chứng từ; thanh toán linh hoạt, có hóa đơn VAT.' },
] as const;

export const OFFER = {
  title: 'Kỷ niệm 10 năm thành lập — giảm 7% cước',
  services: ['Vận chuyển hàng hóa', 'Chành xe gửi hàng', 'Dịch vụ thuê xe tải'],
  perks: ['Miễn phí bốc dỡ hàng', 'Giao hàng tận nơi', 'Miễn phí lưu kho'],
} as const;

export const SERVICES = [
  {
    title: 'Vận chuyển hàng hóa Bắc Nam',
    text: 'Chành xe gửi hàng từ TP.HCM đi các tỉnh và ngược lại: hàng lẻ, hàng nguyên chuyến, không giới hạn số lượng.',
    href: '/van-chuyen-hang-hoa/',
    image: '/wp-content/uploads/2018/08/chanh-xe-tai-phuong-vy.jpg',
    cta: 'Xem tuyến vận chuyển',
  },
  {
    title: 'Cho thuê xe tải chở hàng',
    text: 'Xe tải từ 500 kg đến 30 tấn, thùng kín – thùng bạt – mui bạt, chạy nội thành và đi tỉnh theo chuyến.',
    href: '/thue-xe-tai/',
    image: '/wp-content/uploads/2018/08/thue-xe-tai-cong-ty-phuong-vy.jpg',
    cta: 'Xem bảng giá thuê xe',
  },
] as const;

/** Press coverage from the live home page (tracking parameters stripped). */
export const PRESS = [
  { outlet: '24h.com.vn', href: 'https://www.24h.com.vn/doanh-nghiep/tham-vong-cua-van-tai-phuong-vy-c849a1245089.html', image: '/wp-content/uploads/2023/12/bao-24h-977x430.jpg' },
  { outlet: 'cafef.vn', href: 'https://cafef.vn/van-tai-phuong-vy-khang-dinh-ten-tuoi-nho-nhanh-chong-va-dang-tin-cay-188230916091907459.chn', image: '/wp-content/uploads/2023/12/bao-cafef-1250x430.jpg' },
  { outlet: 'tienphong.vn', href: 'https://tienphong.vn/van-tai-phuong-vy-va-tham-vong-tien-len-vi-tri-so-1-nganh-van-tai-post1330759.tpo', image: '/wp-content/uploads/2023/12/bao-tienphong-1349x430.jpg' },
  { outlet: 'vtc.vn', href: 'https://vtc.vn/van-chuyen-hang-hoa-bac-nam-de-dang-cung-van-tai-phuong-vy-ar820727.html', image: '/wp-content/uploads/2023/12/bao-vtc-1223x430.jpg' },
  { outlet: 'hanoimoi.vn', href: 'https://hanoimoi.vn/chon-ngay-van-tai-phuong-vy-467890.html', image: '/wp-content/uploads/2023/12/bao-hanoimoi-1289x430.jpg' },
  { outlet: 'baodanang.vn', href: 'https://baodanang.vn/can-biet/202111/van-tai-phuong-vy-gui-hang-tu-sai-gon-di-da-nang-gia-tot-3897332/', image: '/wp-content/uploads/2023/12/baodanang-1082x430.jpg' },
  { outlet: 'nguoiduatin.vn', href: 'https://www.nguoiduatin.vn/dich-vu-van-tai-hang-hoa-bac-nam-nao-co-chi-phi-re-va-giao-hang-toi-uu-a626665.html', image: '/wp-content/uploads/2023/12/bao-nguoiduatin-1274x430.jpg' },
  { outlet: 'baoquangninh.vn', href: 'https://baoquangninh.vn/van-tai-phuong-vy-dich-vu-gui-hang-sai-gon-quang-ninh-gia-tot-mua-dich-3164333.html', image: '/wp-content/uploads/2023/12/baoquangninh-1219x430.jpg' },
  { outlet: 'baothaibinh.com.vn', href: 'https://baothaibinh.com.vn/tin-tuc/206/140540/van-tai-phuong-vy-dich-vu-gui-hang-tu-sai-gon-di-thai-binh-chuyen-nghiep', image: '/wp-content/uploads/2023/12/baothaibinh-1299x430.jpg' },
  { outlet: 'baothanhhoa.vn', href: 'https://baothanhhoa.vn/thi-truong/gui-hang-sai-gon-thanh-hoa-va-nguoc-lai-chon-ngay-van-tai-phuong-vy/148739.htm', image: '/wp-content/uploads/2023/12/baothanhhoa-1233x430.jpg' },
  { outlet: 'vanhoavaphattrien.vn', href: 'https://vanhoavaphattrien.vn/dich-vu-van-tai-hang-hoa-bac-nam-giao-nhan-hang-hoa-tai-63-tinh-thanh-a20756.html', image: '/wp-content/uploads/2023/12/bao-vanhoavaphattrien-1089x430.jpg' },
  { outlet: 'baobinhdinh.vn', href: 'https://baobinhdinh.vn/viewer.aspx?macm=39&macmp=39&mabb=222823', image: '/wp-content/uploads/2023/12/baobinhdinh-1033x430.jpg' },
] as const;

export const TESTIMONIALS = [
  { name: 'Anh Văn', role: 'Chủ shop thời trang', quote: 'Tôi đã sử dụng dịch vụ của Phương Vy được 2 năm. Từ cách thức đến thời gian giao hàng đều rất đúng hạn, đặc biệt có nhiều ưu đãi tốt cho khách hàng cũ.' },
  { name: 'Anh Tâm', role: 'Vật liệu xây dựng', quote: 'Dịch vụ chở hàng chuyên nghiệp, vận chuyển nhanh chóng đúng hẹn. Công ty chiết khấu tốt và hỗ trợ bốc dỡ hàng cho chúng tôi.' },
  { name: 'Chị Mai', role: 'Bán hàng online', quote: 'Chành xe Phương Vy linh động giao hàng tận nơi, tăng chuyến cả ngày lễ tết nên hàng của tôi luôn đến tay khách đúng hẹn.' },
] as const;

/**
 * Hero intros for pages whose WordPress opening is missing, a generic story
 * opener or an ALL-CAPS ad line. Outcome first, one or two sentences, and every
 * fact is taken from that page's own content or Rank Math description. The
 * original opening paragraph stays in the article body.
 */
export const HERO_LEADS: Record<string, string> = {
  '/van-chuyen-hang-hoa': 'Chành xe từ TP.HCM đi các tỉnh và chiều ngược lại bằng xe tải, container. Hàng nặng tính cước theo kg, hàng nhẹ theo khối; mỗi tuyến có bảng giá, thời gian và lịch xe riêng.',
  '/van-chuyen-hang-hoa/dau-nhot': 'Vận chuyển dầu nhớt, dầu nhờn và mỡ bôi trơn tuyến Bắc – Nam bằng xe tải từ 5 đến trên 20 tấn, đầu kéo, container. Giao tận nơi, miễn phí bốc xếp, xe chạy 5 chuyến mỗi ngày hai chiều.',
  '/van-chuyen-hang-hoa/duong-bien': 'Gửi hàng nội địa và đi nước ngoài bằng đường biển: nhận hàng lẻ từ 1 khối (CBM) hoặc nguyên container, tàu chạy nhiều chuyến mỗi tuần, giao nhận tận nơi (door to door).',
  '/van-chuyen-hang-hoa/duong-hang-khong': 'Gửi hàng bằng máy bay khi cần nhanh: thường nhận hàng sau 24 – 48 giờ; chuyển phát quốc tế 1 – 3 ngày đi châu Á, 3 – 4 ngày đi châu Âu, 4 – 5 ngày đi châu Mỹ. Lấy hàng và giao tận nơi.',
  '/van-chuyen-hang-hoa/may-moc-thiet-bi': 'Vận chuyển máy móc, thiết bị từ TP.HCM, Hà Nội đi toàn quốc bằng xe tải 1 – 35 tấn, đầu kéo container, xe cẩu và rơ moóc lùn, rơ moóc sàn cho hàng quá khổ.',
  '/van-chuyen-hang-hoa/sieu-truong-sieu-trong': 'Vận chuyển hàng siêu trường, siêu trọng, quá khổ quá tải và máy công trình trên tuyến Bắc – Nam, có hỗ trợ cẩu xếp hàng. Giao nhận tận nơi, hồ sơ, hợp đồng và hóa đơn rõ ràng.',
  '/van-chuyen-hang-hoa/xe-may': 'Gửi xe máy Bắc – Nam bằng xe tải, xe khách: xe xuất bến từ 15h đến 20h mỗi ngày, nhận xe chỉ từ 48 giờ, có lấy và giao xe tận nơi. Không tăng giá ngày lễ, Tết.',
  '/thue-xe-tai': 'Cho thuê xe tải thùng kín, mui bạt và container 20′ – 50′ chở hàng nội thành và đi tỉnh, có cẩu xếp hàng quá khổ. Miễn phí xuất hóa đơn, hàng giá trị lớn được mua bảo hiểm.',
  '/thue-xe-tai/da-nang': 'Thuê xe tải thùng dài đến 12 m chở hàng tại Đà Nẵng và đi các tỉnh. Miễn phí lưu kho, bốc dỡ, xe nâng và cẩu trục cho hàng quá khổ, quá tải.',
  '/thue-xe-tai/ha-noi': 'Thuê xe tải và container chở hàng tại Hà Nội, chạy chuyến trong ngày, giao tại kho hoặc tận nơi. Có cẩu nâng, nhân công bốc xếp và đầy đủ hồ sơ, hóa đơn.',
  '/thue-xe-tai/hcm': 'Thuê xe tải và container chở hàng nội thành TP.HCM và đi các tỉnh, kể cả thứ Bảy, Chủ nhật và ngày lễ. Có hợp đồng, hóa đơn GTGT và biên bản giao nhận.',
  '/gioi-thieu': 'Hơn 10 năm chành xe Bắc – Nam: từ dàn xe tải 10 – 15 tấn chạy TP.HCM, Hà Nội đi các tỉnh trước năm 2015 đến đội xe tải, xe cẩu, đầu kéo container và bãi xe ở TP.HCM, Đà Nẵng, Hà Nội.',
  '/faq': 'Giải nghĩa nhanh các khái niệm vận tải hay gặp — hình thức kinh doanh vận tải, rơ moóc và sơ mi rơ moóc, TEU, ETA — để bạn gửi hàng, thuê xe dễ hơn.',
  '/tuyen-dung': 'Phương Vy tuyển nhân viên kinh doanh, kế toán, SEO và tài xế xe tải tại TP.HCM và Hà Nội. Mô tả công việc, yêu cầu kinh nghiệm và giờ làm việc của từng vị trí ở bên dưới.',
};
