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
  title: 'Cẩm nang vận tải – Tin tức & kinh nghiệm gửi hàng | Phương Vy',
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

/**
 * Home page copy restored from the WordPress home page so the page keeps the text it has ranked
 * with: wording kept, spelling and capitalisation fixed, and superlative claims about Phương Vy
 * ("tốt nhất", "thấp nhất", "an toàn nhất", "64 tỉnh thành") dropped because nothing backs them.
 */
export const ABOUT = [
  'Nếu bạn đang cần tìm dịch vụ vận chuyển hàng hóa trong nước? Đối tác vận chuyển hàng hóa có thể cam kết, bảo đảm thời gian giao nhận hàng? Bạn muốn một bảng báo giá cước vận chuyển hàng hóa tốt để bảo đảm lợi nhuận cho doanh nghiệp?',
  'Vận tải Phương Vy sẽ đáp ứng những mong muốn trên của bạn.',
  'Công ty TNHH Dịch vụ Vận tải Phương Vy với kinh nghiệm hoạt động trong lĩnh vực vận chuyển hàng hóa (chành xe) hơn 10 năm, cùng với đội ngũ nhân viên, xe tải hùng hậu cam kết bảo đảm thời gian giao hàng đúng thời hạn, đem lại cho quý khách sự hài lòng, kèm theo đó là việc tiết kiệm chi phí cho doanh nghiệp, cơ sở của mình.',
  'Vận tải Phương Vy đang dần cố gắng hoàn thiện mình qua thời gian hoạt động. Chúng tôi mong muốn đem lại sự hài lòng cho khách hàng từ tất cả dịch vụ vận chuyển hàng hóa của chúng tôi. Cảm ơn quý khách hàng đã tin tưởng sử dụng dịch vụ của Phương Vy trong thời gian qua.',
] as const;

/** Lead of the home "Dịch vụ" section: the WordPress home page's services paragraph. */
export const SERVICES_LEAD = 'Phương Vy là công ty vận chuyển hàng hóa Bắc Nam nhận gửi hàng đi toàn quốc tất cả các loại hàng hóa mà pháp luật Việt Nam cho phép, hoàn toàn không giới hạn về số lượng, kích thước, trọng lượng. Vận tải Phương Vy bảo đảm hoàn thành thời gian giao hàng đúng hẹn, nhanh chóng với giá thành phải chăng, phù hợp túi tiền của đa số doanh nghiệp hiện nay. Đặc biệt, Phương Vy có cung cấp dịch vụ cho thuê xe tải chở hàng đi tỉnh.';

/** "Tại sao nên chọn dịch vụ của Vận tải Phương Vy?" — the six reasons from the WordPress home page. */
export const COMMITMENTS = [
  { key: 'fast', title: 'Nhanh chóng', text: 'Giao hàng đúng hẹn, đúng thời gian cam kết chính là uy tín của Vận tải Phương Vy với khách hàng. Đây cũng chính là một trong những yếu tố quan trọng nhất để Phương Vy có thể tồn tại và đứng vững được trong lĩnh vực vận chuyển hàng hóa đến ngày hôm nay. Chúng tôi hiểu được thời gian là vàng bạc, tiền của và uy tín.' },
  { key: 'exact', title: 'Chính xác', text: 'Vận tải Phương Vy bảo đảm giao hàng đúng hạn, đúng địa điểm giao nhận. Cam kết sẽ không có một sự nhầm lẫn, thất lạc, nhầm địa chỉ hay bất kỳ tổn thất nào về hàng hóa xảy ra trong quá trình giao nhận, vận chuyển hàng hóa. Với chính sách và quản lý nghiêm ngặt, chúng tôi đem lại sự bảo đảm cho hàng hóa của khách hàng.' },
  { key: 'pro', title: 'Chuyên nghiệp', text: 'Với hơn 10 năm kinh nghiệm trong lĩnh vực chành xe và vận chuyển hàng hóa, đội ngũ nhân viên và lượng xe tải của Phương Vy phủ khắp các tỉnh thành. Chúng tôi cam kết xử lý mọi đơn hàng nhanh chóng, chính xác, không để mất một giây phút quý báu nào của khách hàng. Sự tín nhiệm và độ hài lòng của khách hàng luôn là ưu tiên hàng đầu của chúng tôi.' },
  { key: 'safe', title: 'An toàn', text: 'Công ty TNHH DV Vận tải Phương Vy trang bị những vật dụng, phương tiện vận tải tiên tiến, hiện đại cho quá trình vận chuyển, giao hàng. Quý khách sẽ hoàn toàn yên tâm khi chứng kiến đội ngũ nhân viên của Phương Vy đóng gói, bao bọc, vận chuyển, phân loại hàng hóa theo một quy trình an toàn.' },
  { key: 'easy', title: 'Tiện lợi', text: 'Quy trình giao nhận hàng hóa, thủ tục thuê xe tải đi tỉnh của Phương Vy rất đơn giản, không rườm rà gây khó chịu và mất thời gian của khách hàng. Hệ thống và quy trình chuẩn hóa giúp tiết kiệm thời gian quý báu cho khách hàng. Đây cũng là một trong những điểm cộng mà khách hàng hài lòng về Phương Vy.' },
  { key: 'save', title: 'Tiết kiệm', text: 'Vận tải Phương Vy luôn có những chính sách chiết khấu và giảm chi phí vận chuyển hàng cho khách hàng thân thiết và khách hàng mới, giữ mức giá cước cạnh tranh so với các đơn vị khác trên thị trường. Ngoài ra Phương Vy còn hỗ trợ đóng gói, bốc dỡ hàng tại kho để tiết kiệm tối đa chi phí cho khách hàng.' },
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
    imageAlt: 'Xe tải thùng bạt của Phương Vy chất đầy hàng chành xe đi tỉnh',
    cta: 'Xem tuyến vận chuyển',
  },
  {
    title: 'Cho thuê xe tải chở hàng',
    text: 'Xe tải từ 500 kg đến 30 tấn, thùng kín – thùng bạt – mui bạt, chạy nội thành và đi tỉnh theo chuyến.',
    href: '/thue-xe-tai/',
    image: '/wp-content/uploads/2018/08/thue-xe-tai-cong-ty-phuong-vy.jpg',
    imageAlt: 'Đội xe tải và đầu kéo của Phương Vy tại bãi xe',
    cta: 'Xem bảng giá thuê xe',
  },
] as const;

/** Press coverage from the live home page (tracking parameters stripped); vtc.vn and baobinhdinh.vn were dropped once their articles no longer existed (checked 10/10/2026). */
export const PRESS = [
  { outlet: '24h.com.vn', href: 'https://www.24h.com.vn/doanh-nghiep/tham-vong-cua-van-tai-phuong-vy-c849a1245089.html', image: '/wp-content/uploads/2023/12/bao-24h-977x430.jpg' },
  { outlet: 'cafef.vn', href: 'https://cafef.vn/van-tai-phuong-vy-khang-dinh-ten-tuoi-nho-nhanh-chong-va-dang-tin-cay-188230916091907459.chn', image: '/wp-content/uploads/2023/12/bao-cafef-1250x430.jpg' },
  { outlet: 'tienphong.vn', href: 'https://tienphong.vn/van-tai-phuong-vy-va-tham-vong-tien-len-vi-tri-so-1-nganh-van-tai-post1330759.tpo', image: '/wp-content/uploads/2023/12/bao-tienphong-1349x430.jpg' },
  { outlet: 'hanoimoi.vn', href: 'https://hanoimoi.vn/chon-ngay-van-tai-phuong-vy-467890.html', image: '/wp-content/uploads/2023/12/bao-hanoimoi-1289x430.jpg' },
  { outlet: 'baodanang.vn', href: 'https://baodanang.vn/can-biet/202111/van-tai-phuong-vy-gui-hang-tu-sai-gon-di-da-nang-gia-tot-3897332/', image: '/wp-content/uploads/2023/12/baodanang-1082x430.jpg' },
  { outlet: 'nguoiduatin.vn', href: 'https://www.nguoiduatin.vn/dich-vu-van-tai-hang-hoa-bac-nam-nao-co-chi-phi-re-va-giao-hang-toi-uu-a626665.html', image: '/wp-content/uploads/2023/12/bao-nguoiduatin-1274x430.jpg' },
  { outlet: 'baoquangninh.vn', href: 'https://baoquangninh.vn/van-tai-phuong-vy-dich-vu-gui-hang-sai-gon-quang-ninh-gia-tot-mua-dich-3164333.html', image: '/wp-content/uploads/2023/12/baoquangninh-1219x430.jpg' },
  { outlet: 'baothaibinh.com.vn', href: 'https://baothaibinh.com.vn/tin-tuc/206/140540/van-tai-phuong-vy-dich-vu-gui-hang-tu-sai-gon-di-thai-binh-chuyen-nghiep', image: '/wp-content/uploads/2023/12/baothaibinh-1299x430.jpg' },
  { outlet: 'baothanhhoa.vn', href: 'https://baothanhhoa.vn/thi-truong/gui-hang-sai-gon-thanh-hoa-va-nguoc-lai-chon-ngay-van-tai-phuong-vy/148739.htm', image: '/wp-content/uploads/2023/12/baothanhhoa-1233x430.jpg' },
  { outlet: 'vanhoavaphattrien.vn', href: 'https://vanhoavaphattrien.vn/dich-vu-van-tai-hang-hoa-bac-nam-giao-nhan-hang-hoa-tai-63-tinh-thanh-a20756.html', image: '/wp-content/uploads/2023/12/bao-vanhoavaphattrien-1089x430.jpg' },
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
  '/van-chuyen-hang-hoa/hai-phong': 'Chành xe đi Hải Phòng từ TP.HCM mất 2–3 ngày (khoảng 1.760 km, 3 chuyến mỗi ngày), từ Hà Nội 2–3 giờ. Hàng hư hỏng hoặc thất lạc được bồi thường 100% giá trị thực.',
  '/van-chuyen-hang-hoa/da-nang': 'Xe Phương Vy chạy TP.HCM – Đà Nẵng (khoảng 960 km) 3 chuyến mỗi ngày; hàng nguyên xe giao trong 24–36h. Mọi đơn có bảo hiểm cơ bản miễn phí và được giao tận nơi.',
  '/van-chuyen-hang-hoa/tphcm': 'Phương Vy nhận hàng tại TP.HCM đi các tỉnh bằng xe tải 1–30 tấn và container, xe chạy 5h–22h mỗi ngày kể cả thứ Bảy, Chủ nhật. Hàng ghép đi tỉnh thường mất 2–3 ngày.',
  '/van-chuyen-hang-hoa/ha-noi': 'Xe Phương Vy chạy TP.HCM – Hà Nội 3 chuyến mỗi ngày từ kho Hóc Môn: hàng nguyên xe giao trong 36–48h, hàng ghép 2–4 ngày. Giao tận nơi tại 30 quận huyện Hà Nội.',
  '/van-chuyen-hang-hoa': 'Chành xe từ TP.HCM đi các tỉnh và chiều ngược lại bằng xe tải 1–30 tấn, container; tuyến Bắc Nam khoảng 48 giờ. Hàng nặng tính cước theo kg, hàng nhẹ theo khối.',
  '/van-chuyen-hang-hoa/dau-nhot': 'Vận chuyển dầu nhớt, dầu nhờn và mỡ bôi trơn tuyến Bắc – Nam bằng xe tải từ 5 đến trên 20 tấn, đầu kéo, container. Giao tận nơi, miễn phí bốc xếp, xe chạy 5 chuyến mỗi ngày hai chiều.',
  '/van-chuyen-hang-hoa/duong-bien': 'Gửi hàng nội địa và đi nước ngoài bằng đường biển: nhận hàng lẻ từ 1 khối (CBM) hoặc nguyên container, tàu chạy nhiều chuyến mỗi tuần, giao nhận tận nơi (door to door).',
  '/van-chuyen-hang-hoa/duong-hang-khong': 'Gửi hàng bằng máy bay khi cần nhanh: thường nhận hàng sau 24 – 48 giờ; chuyển phát quốc tế 1 – 3 ngày đi châu Á, 3 – 4 ngày đi châu Âu, 4 – 5 ngày đi châu Mỹ. Lấy hàng và giao tận nơi.',
  '/van-chuyen-hang-hoa/may-moc-thiet-bi': 'Vận chuyển máy móc, thiết bị từ TP.HCM, Hà Nội đi toàn quốc bằng xe tải 1 – 35 tấn, đầu kéo container, xe cẩu và rơ moóc lùn, rơ moóc sàn cho hàng quá khổ.',
  '/van-chuyen-hang-hoa/sieu-truong-sieu-trong': 'Vận chuyển hàng siêu trường, siêu trọng, quá khổ quá tải và máy công trình trên tuyến Bắc – Nam, có cẩu xếp hàng. Từ TP.HCM đi Huế, Đà Nẵng từ 24 giờ, đi miền Tây từ 12 giờ.',
  '/van-chuyen-hang-hoa/xe-may': 'Gửi xe máy Bắc – Nam bằng xe tải, xe khách: xe xuất bến từ 15h đến 20h mỗi ngày, nhận xe chỉ từ 48 giờ, có lấy và giao xe tận nơi. Không tăng giá ngày lễ, Tết.',
  '/thue-xe-tai': 'Cho thuê xe tải thùng kín, mui bạt 0,5–30 tấn và container 20′–50′ chở hàng nội thành và đi tỉnh, có cẩu xếp hàng quá khổ. Miễn phí xuất hóa đơn, hàng giá trị lớn được mua bảo hiểm.',
  '/thue-xe-tai/da-nang': 'Thuê xe tải thùng dài đến 12 m chở hàng tại Đà Nẵng và đi các tỉnh. Miễn phí lưu kho, bốc dỡ, xe nâng và cẩu trục cho hàng quá khổ, quá tải.',
  '/thue-xe-tai/ha-noi': 'Thuê xe tải và container chở hàng tại Hà Nội, chạy chuyến trong ngày, giao tại kho hoặc tận nơi. Có cẩu nâng, nhân công bốc xếp và đầy đủ hồ sơ, hóa đơn.',
  '/thue-xe-tai/hcm': 'Thuê xe tải 0,5–30 tấn và container chở hàng nội thành TP.HCM và đi các tỉnh, kể cả thứ Bảy, Chủ nhật và ngày lễ. Có hợp đồng, hóa đơn GTGT và biên bản giao nhận.',
  '/gioi-thieu': 'Hơn 10 năm chành xe Bắc – Nam: từ dàn xe tải 10 – 15 tấn chạy TP.HCM, Hà Nội đi các tỉnh trước năm 2015 đến đội xe tải, xe cẩu, đầu kéo container và bãi xe ở TP.HCM, Đà Nẵng, Hà Nội.',
  '/faq': 'Giải nghĩa nhanh các khái niệm vận tải hay gặp — hình thức kinh doanh vận tải, rơ moóc và sơ mi rơ moóc, TEU, ETA — để bạn gửi hàng, thuê xe dễ hơn.',
  '/tuyen-dung': 'Phương Vy tuyển nhân viên kinh doanh, kế toán, SEO và tài xế xe tải tại TP.HCM và Hà Nội. Mô tả công việc, yêu cầu kinh nghiệm và giờ làm việc của từng vị trí ở bên dưới.',
  // Guides: what the reader gets from the article, shown under its H1.
  '/blog/bien-bao-cam-xe-tai-va-muc-phat': 'Biển cấm xe tải theo QCVN 41:2024, mức phạt theo Nghị định 168/2024 (sửa đổi năm 2026), quy định mới cho xe bán tải và khung giờ cấm tải ở TP.HCM, Hà Nội, Đà Nẵng, Nha Trang — cập nhật ngày 10/10/2026.',
  '/blog/can-tim-doi-tac-van-chuyen-hang-hoa': 'Phương Vy tìm chủ xe tải, tài xế hợp tác chở hàng đi các tỉnh, cam kết có hàng cả hai chiều đi và về. Chủ hàng cần xe vận chuyển cũng liên hệ qua hotline.',
  '/blog/dich-y-nghia-bien-so-xe-theo-phong-thuy-khoa-hoc': 'Các thành phần trên biển số xe (mã vùng, ký tự loại xe, số đăng ký), cách xem ý nghĩa con số theo phong thủy và biển số hợp tuổi. Bài viết lưu ý đây là quan điểm chủ quan, không có căn cứ khoa học rõ ràng.',
  '/blog/giay-to-van-chuyen-hang-hoa': 'Giấy tờ khi vận chuyển hàng hóa đường bộ: giấy tờ xe, chủ phương tiện và tài xế mà đơn vị vận tải phải có, cùng hóa đơn, chứng từ chứng minh nguồn gốc hàng mà chủ hàng cần cung cấp.',
  '/blog/hang-hoa-thuong-gap-trong-nganh-van-tai': 'Thế nào là hàng siêu trường (dài trên 20 m, rộng trên 2,5 m, cao trên 4,2 m, xe container trên 4,35 m) và siêu trọng (xe cùng hàng nặng trên 48 tấn) theo Thông tư 12/2025/TT-BXD, phương tiện chở chúng và cách gửi hàng lẻ, hàng ghép tuyến Bắc Nam.',
  '/blog/kich-thuoc-thung-xe-tai-trong-van-tai-hang-hoa': 'Kích thước thùng xe tải từ 500 kg đến 30 tấn và đặc điểm từng loại thùng như thùng lửng, thùng kín, giúp chọn đúng xe khi thuê xe tải hoặc gửi hàng.',
  '/blog/quy-dinh-van-chuyen-hang-hoa-nguy-hiem': 'Quy định vận chuyển hàng hóa nguy hiểm trên đường bộ theo Nghị định 161/2024/NĐ-CP, đường biển và hàng không (IATA): danh mục hàng, thủ tục cấp phép, mẫu bản khai và mã ký hiệu.',
  '/blog/van-chuyen-hang-hoa-nguy-hiem': 'Hàng nguy hiểm được chia thành 9 loại, từ chất nổ, khí ga, chất lỏng dễ cháy đến chất phóng xạ, chất ăn mòn. Bài viết nêu điều kiện vận chuyển và cách đóng gói an toàn.',
  '/blog/van-tai-phuong-vy-duoc-uu-tien-hoat-dong-tren-luong-xanh': 'Mùa dịch Covid-19 năm 2021, xe tải của Phương Vy được Sở GTVT TP.HCM cấp nhận diện ưu tiên lưu thông trên luồng xanh. Bài viết giải thích xe luồng xanh là gì, cách giao nhận và thanh toán khi gửi hàng mùa dịch.',
};
