/**
 * Descriptive phrases that become a link to a page the first time they appear in
 * another page's article text (applied by scripts/build-legacy.ts). Longer, more
 * specific phrases come first within an entry. One link per target, a small cap
 * per page, and never a link from a page to itself keep the result natural.
 */
export type ContextualLink = { href: string; phrases: string[] };

export const CONTEXTUAL_LINKS: ContextualLink[] = [
  // Services
  { href: '/van-chuyen-hang-hoa/sieu-truong-sieu-trong/', phrases: ['hàng siêu trường siêu trọng', 'siêu trường siêu trọng', 'siêu trường, siêu trọng', 'hàng quá khổ quá tải', 'quá khổ quá tải', 'quá khổ, quá tải'] },
  { href: '/van-chuyen-hang-hoa/may-moc-thiet-bi/', phrases: ['vận chuyển máy móc thiết bị', 'vận chuyển máy móc', 'máy móc thiết bị'] },
  { href: '/van-chuyen-hang-hoa/xe-may/', phrases: ['gửi xe máy', 'vận chuyển xe máy', 'chuyển xe máy'] },
  // Modes and goods only link in a shipping context ("bằng đường biển", "chở dầu nhớt"), not in
  // lists of transport modes or a truck's own engine oil.
  { href: '/van-chuyen-hang-hoa/dau-nhot/', phrases: ['vận chuyển dầu nhớt', 'chở hàng dầu nhớt', 'chở dầu nhớt'] },
  { href: '/van-chuyen-hang-hoa/duong-bien/', phrases: ['vận chuyển hàng hóa bằng đường biển', 'vận chuyển đường biển', 'bằng đường biển'] },
  { href: '/van-chuyen-hang-hoa/duong-hang-khong/', phrases: ['vận chuyển hàng không', 'bằng đường hàng không'] },
  { href: '/thue-xe-tai/', phrases: ['cho thuê xe tải', 'thuê xe tải chở hàng', 'thuê xe tải'] },
  { href: '/van-chuyen-hang-hoa/', phrases: ['vận chuyển hàng hóa Bắc Nam', 'vận tải hàng hóa Bắc Nam', 'chành xe Bắc Nam', 'tuyến Bắc Nam'] },
  // Guides
  { href: '/blog/kich-thuoc-thung-xe-tai-trong-van-tai-hang-hoa/', phrases: ['kích thước thùng xe tải', 'kích thước thùng xe', 'tải trọng xe tải', 'các loại xe tải', 'mỗi loại xe tải', 'từng loại xe tải', 'nhiều loại xe tải'] },
  { href: '/blog/bien-bao-cam-xe-tai-va-muc-phat/', phrases: ['biển báo cấm xe tải', 'biển cấm xe tải', 'giờ cấm xe tải'] },
  { href: '/blog/quy-dinh-van-chuyen-hang-hoa-nguy-hiem/', phrases: ['quy định vận chuyển hàng hóa nguy hiểm', 'hàng hóa nguy hiểm', 'hàng nguy hiểm'] },
  { href: '/blog/van-chuyen-hang-hoa-nguy-hiem/', phrases: ['đóng gói hàng hóa nguy hiểm', 'đóng gói, vận chuyển hàng hóa nguy hiểm'] },
  { href: '/blog/giay-to-van-chuyen-hang-hoa/', phrases: ['giấy tờ vận chuyển hàng hóa', 'giấy tờ cần thiết khi vận chuyển', 'giấy tờ xe'] },
  { href: '/blog/hang-hoa-thuong-gap-trong-nganh-van-tai/', phrases: ['hàng lẻ hàng ghép', 'hàng lẻ, hàng ghép', 'hàng ghép hàng lẻ', 'hàng ghép, hàng lẻ'] },
];

/** Verb + direction phrases that point at a route page, e.g. "gửi hàng đi Hà Nội". */
export const ROUTE_PHRASE_VERBS = ['vận chuyển hàng hóa', 'vận chuyển hàng', 'gửi hàng hóa', 'gửi hàng', 'chuyển hàng', 'chở hàng', 'chành xe'];
export const ROUTE_PHRASE_DIRECTIONS = ['đi', 'ra', 'vào', 'tới', 'đến', 'lên'];

/** Link caps per page: up to five, so province links still fit after the service links. */
export const CONTEXTUAL_LINK_LIMITS = { post: 5, page: 5 } as const;
