import { getSiteUrl } from './site';

/** Verified business facts (sourced from the live site & legacy content). */
export const SITE_CONFIG = {
  name: 'Vận tải Phương Vy',
  description: 'Vận chuyển hàng hóa Bắc Nam, chành xe liên tỉnh và cho thuê xe tải toàn quốc.',
  slogan: 'Chất lượng, nhanh chóng, uy tín là niềm tin!',
  url: getSiteUrl(),
  companyName: 'Công ty TNHH Dịch vụ Vận tải Phương Vy',
  address: '38H4, Đường DN9, KP4, P. Tân Hưng Thuận, Quận 12, TP.HCM',
  yardAddress: '58 Quốc lộ 1A, Xã Bà Điểm, Huyện Hóc Môn, TP.HCM',
  hotline: '0933 871 139',
  hotlines: ['0933 871 139', '0702 00 6839', '0902 939 318'],
  landline: '(028) 6275 0737',
  businessHours: '8h00–21h00',
  zalo: '0902939318',
  email: 'vanchuyenphuongvy@gmail.com',
  facebook: 'https://www.facebook.com/vanchuyenphuongvy/',
  logo: '/wp-content/uploads/2018/07/logo-van-tai-phuong-vy-2.png',
  defaultImage: '/wp-content/uploads/2018/08/cong-ty-van-tai-phuong-vy.jpg',
  mapEmbed: 'https://www.google.com/maps?q=38H4+%C4%90%C6%B0%E1%BB%9Dng+DN9+T%C3%A2n+H%C6%B0ng+Thu%E1%BA%ADn+Qu%E1%BA%ADn+12&output=embed',
  taxId: '0313404000',
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
