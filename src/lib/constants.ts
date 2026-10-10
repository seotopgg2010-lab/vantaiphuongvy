import { getSiteUrl } from './site';

/**
 * Verified business facts (sourced from the live site & legacy content). Name, address, main phone,
 * hours and coordinates follow the company's Google Business Profile (read 10/10/2026), so the
 * site, its schema and the Maps listing agree.
 */
export const SITE_CONFIG = {
  name: 'Vận tải Phương Vy',
  description: 'Vận chuyển hàng hóa Bắc Nam, chành xe liên tỉnh và cho thuê xe tải toàn quốc.',
  slogan: 'Chất lượng, nhanh chóng, uy tín là niềm tin!',
  url: getSiteUrl(),
  companyName: 'Công ty TNHH Dịch vụ Vận tải Phương Vy',
  address: '38H4 Đường DN9, Khu phố 4, Phường Đông Hưng Thuận, TP. Hồ Chí Minh',
  /** The same address split for schema.org PostalAddress. */
  postalAddress: { streetAddress: '38H4 Đường DN9, Khu phố 4', addressLocality: 'Phường Đông Hưng Thuận', addressRegion: 'Thành phố Hồ Chí Minh', postalCode: '700000', addressCountry: 'VN' },
  geo: { latitude: 10.8438515, longitude: 106.6254635 },
  /** The Google Maps listing (Công ty TNHH DV Vận Tải Phương Vy). */
  mapsUrl: 'https://maps.google.com/?cid=5001195384627729197',
  yardAddress: '58 Quốc lộ 1A, Xã Bà Điểm, Huyện Hóc Môn, TP.HCM',
  hotline: '0902 939 318',
  hotlines: ['0902 939 318', '0933 871 139', '0702 00 6839'],
  landline: '(028) 6275 0737',
  businessHours: '7h00–20h00',
  /** schema.org opening hours, the same every day. */
  opens: '07:00',
  closes: '20:00',
  zalo: '0902939318',
  email: 'vanchuyenphuongvy@gmail.com',
  facebook: 'https://www.facebook.com/vanchuyenphuongvy/',
  logo: '/wp-content/uploads/2018/07/logo-van-tai-phuong-vy-2.png',
  defaultImage: '/wp-content/uploads/2018/08/cong-ty-van-tai-phuong-vy.jpg',
  mapEmbed: 'https://www.google.com/maps?q=C%C3%B4ng+ty+TNHH+DV+V%E1%BA%ADn+T%E1%BA%A3i+Ph%C6%B0%C6%A1ng+Vy&ll=10.8438515,106.6254635&z=17&output=embed',
  taxId: '0313404000',
  /** Ministry of Industry and Trade website notice, linked from every WordPress footer. */
  moitNotice: {
    href: 'http://online.gov.vn/Home/WebDetails/79057',
    badge: '/wp-content/uploads/2021/05/bo-cong-thuong.png',
  },
  yards: [
    { region: 'Bãi xe miền Nam', address: '58 Quốc lộ 1A, Xã Bà Điểm, Huyện Hóc Môn, TP.HCM' },
    { region: 'Bãi xe miền Trung', address: '555 Trường Chinh, Quận Thanh Khê, Đà Nẵng' },
    { region: 'Bãi xe miền Bắc', address: 'Số 1 Thúy Lĩnh, Lĩnh Nam, Hoàng Mai, Hà Nội' },
  ],
  salesContacts: [
    { name: 'Ms Vân', phones: ['0933 871 139', '0909 396 912'] },
    { name: 'Mr Trung', phones: ['0702 00 6839', '0902 939 318'] },
  ],
  emails: ['vanchuyenphuongvy@gmail.com', 'vanmai.phuongvy@gmail.com'],
} as const;

/**
 * Public site IDs carried over from the WordPress <head>. The Google Tag Manager
 * container there has no tags and the Universal Analytics property is retired,
 * so only GA4 and the Google Ads tag are loaded (after analytics consent).
 */
export const TRACKING = {
  googleSiteVerification: '2KdV5ddnqEuRZMlkOc0GueLlaw_-F1__Kc_O3-_4Bn0',
  pinterestVerification: 'b33cf3506370c4657a9f1134e1596db4',
  ga4: 'G-4MSCYJN9G4',
  googleAds: 'AW-830959523',
} as const;

export const ZALO_URL = `https://zalo.me/${SITE_CONFIG.zalo}`;
