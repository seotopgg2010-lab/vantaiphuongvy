import type { BriefLocale } from '@/lib/brief/routes';

type LocalizedText = Record<BriefLocale, string>;

export type BriefImage = {
  src: string;
  alt: string;
  status: 'reference' | 'temporary';
};

export type BriefAction = {
  label: LocalizedText;
  href: string;
  variant: 'primary' | 'secondary';
};

export type BriefBenefit = {
  title: LocalizedText;
  description: LocalizedText;
};

export const HOME_HERO_FALLBACK = {
  title: {
    vi: 'Kết nối nguồn lực Việt Nam với thế giới',
    en: "Connecting Vietnam's resources to global businesses",
  },
  description: {
    vi: 'Từ tìm nguồn, sản xuất theo yêu cầu đến vận chuyển và xuất nhập khẩu quốc tế — Hamburg Connect kết nối những gì anh chị cần từ Việt Nam đến nơi anh chị đang sống và kinh doanh.',
    en: 'From sourcing and made-to-order production to international shipping and import-export support, Hamburg Connect connects what you need in Vietnam to where you live and do business.',
  },
  capabilityLine: {
    vi: 'Sản phẩm · Nguồn lực · Sản xuất theo yêu cầu · Vận chuyển quốc tế',
    en: 'Products · Resources · Made-to-order production · International shipping',
  },
  scriptAccent: {
    vi: 'Từ Việt Nam đến những chân trời xa',
    en: 'From Vietnam to distant horizons',
  },
  image: {
    desktop: '/images/reference/harbor-morning_tam.webp',
    mobile: '/images/reference/harbor-mobile_tam.webp',
    alt: {
      vi: 'Cảng Hamburg với tàu hàng và Elbphilharmonie',
      en: 'Hamburg port with cargo shipping and Elbphilharmonie',
    },
    status: 'temporary' as const,
  },
  actions: [
    { label: { vi: 'Liên hệ', en: 'Contact' }, href: '/lien-he', variant: 'primary' as const },
    { label: { vi: 'Xem dịch vụ', en: 'View services' }, href: '#dich-vu', variant: 'secondary' as const },
  ],
  benefits: [
    { title: { vi: 'Vận chuyển quốc tế', en: 'International shipping' }, description: { vi: 'Đường biển · đường hàng không · chuyển phát nhanh', en: 'Sea freight · air freight · express' } },
    { title: { vi: 'Sản xuất theo yêu cầu', en: 'Made-to-order production' }, description: { vi: 'Nội thất · bảng hiệu · in ấn · bao bì', en: 'Interiors · signage · printing · packaging' } },
    { title: { vi: 'Đa dạng nguồn lực Việt Nam', en: 'Diverse resources in Vietnam' }, description: { vi: 'Sản phẩm · nguyên vật liệu · xưởng đối tác', en: 'Products · materials · partner workshops' } },
    { title: { vi: 'Đồng hành cùng khách ở xa', en: 'Support for customers abroad' }, description: { vi: 'Tư vấn · giải pháp · hỗ trợ thủ tục', en: 'Advice · solutions · procedural support' } },
  ],};

export const STOREFRONT_SIGNAGE_DEMO = {
  code: 'BH_01',
  environment: 'Outdoor',
  description: {
    vi: 'Bảng hiệu mặt tiền được thiết kế theo nhận diện thương hiệu và kích thước mặt tiền của tiệm. Chất liệu mica, alu hoặc inox có thể kết hợp đèn LED hắt sáng hoặc sáng viền.',
    en: 'Storefront signage is tailored to the brand identity and frontage dimensions of each business. Acrylic, aluminium composite and stainless steel can be combined with halo-lit or edge-lit LED details.',
  },
  shippingDescription: {
    vi: 'Đóng gói chuẩn xuất khẩu, vận chuyển bằng đường biển, đường hàng không hoặc chuyển phát nhanh quốc tế, giao tận nơi. Có gói bao trọn thuế phí (DDP) khi anh chị cần.',
    en: 'Export-standard packing and international sea, air or express shipping are available to the final delivery address. An all-inclusive duty-and-tax package (DDP) is available when needed.',
  },
  options: [
    { title: { vi: 'Kích thước', en: 'Size' }, values: { vi: ['Theo kích thước mặt tiền'], en: ['Tailored to storefront dimensions'] } },
    { title: { vi: 'Ánh sáng', en: 'Lighting' }, values: { vi: ['Không đèn', 'Đèn rọi', 'Chữ LED'], en: ['Unlit', 'Spotlit', 'LED lettering'] } },
    { title: { vi: 'Chất liệu', en: 'Materials' }, values: { vi: ['Mica', 'Alu', 'Inox'], en: ['Acrylic', 'Aluminium composite', 'Stainless steel'] } },
  ],
  gallery: [
    { src: '/images/hero/hero_showcase.jpg', alt: 'Bảng hiệu mặt tiền BH_01', status: 'reference' as const },
    { src: '/images/section_provided_3.jpg', alt: 'Hoàn thiện bảng hiệu BH_01', status: 'reference' as const },
  ] satisfies BriefImage[],
};

export const JAPANESE_RESTAURANT_CONCEPT = {
  slug: 'nha-hang-nhat-ban',
  title: {
    vi: 'Nhà hàng Nhật Bản',
    en: 'Japanese Restaurant',
  },
  description: {
    vi: 'Cung ứng nội thất, bát đĩa, nhận diện và vật tư cho nhà hàng Nhật với gỗ tối màu, đèn lồng giấy, quầy sushi và không gian tĩnh tại. Mỗi phong cách có bộ ảnh và mã riêng để anh chị chọn nhanh.',
    en: 'Supply interiors, tableware, branding and operating items for Japanese restaurants, with dark wood, paper lanterns, sushi counters and a calm atmosphere. Each style has its own image set and reference code.',
  },
  shippingDescription: {
    vi: 'Đóng gói chuẩn xuất khẩu, vận chuyển bằng đường biển, đường hàng không hoặc chuyển phát nhanh quốc tế, giao tận nơi. Có gói bao trọn thuế phí (DDP) khi anh chị cần.',
    en: 'Export-standard packing and international sea, air or express shipping are available to the final delivery address. An all-inclusive duty-and-tax package (DDP) is available when needed.',
  },
  hero: { src: '/images/reference/japanese-modern_tam.webp', alt: 'Không gian nhà hàng cho concept Nhật Bản', status: 'reference' as const },
  styles: [
    {
      code: 'NB-01',
      title: { vi: 'Sushi hiện đại', en: 'Modern sushi' },
      description: { vi: 'Đường nét gọn, quầy sushi sáng rõ và vật liệu được chọn để tạo nhịp điệu hiện đại.', en: 'Clean lines, a defined sushi counter and selected materials create a contemporary rhythm.' },
      images: [
        { src: '/images/reference/japanese-modern_tam.webp', alt: 'Sushi hiện đại NB-01', status: 'reference' as const },
        { src: '/images/reference/restaurant-menu_tam.webp', alt: 'Vật phẩm Sushi hiện đại NB-01', status: 'reference' as const },
      ],
    },
    {
      code: 'NB-02',
      title: { vi: 'Sushi truyền thống', en: 'Traditional sushi' },
      description: { vi: 'Gỗ tối màu, đèn lồng giấy và chi tiết thủ công tạo cảm giác tĩnh tại, gần gũi.', en: 'Dark wood, paper lanterns and crafted details create a calm, welcoming setting.' },
      images: [
        { src: '/images/reference/japanese-traditional_tam.webp', alt: 'Sushi truyền thống NB-02', status: 'reference' as const },
        { src: '/images/reference/print-packaging_tam.webp', alt: 'Vật phẩm Sushi truyền thống NB-02', status: 'reference' as const },
      ],
    },
  ],
  scopeGroups: [
    {
      title: { vi: 'Máy móc & thiết bị', en: 'Equipment & appliances' },
      description: { vi: 'Tủ trưng bày sushi, tủ mát, nồi giữ cơm và thiết bị bếp được tư vấn theo thông số điện tại nơi nhận.', en: 'Sushi display refrigeration, coolers, rice warmers and kitchen equipment are specified for the destination electrical standard.' },
    },
    {
      title: { vi: 'Nội thất & thiết bị chuyên dụng', en: 'Interiors & specialist fixtures' },
      description: { vi: 'Quầy sushi gỗ, bàn ghế, booth, bàn thấp, vách gỗ lam, kệ và tủ được làm theo thiết kế.', en: 'Wooden sushi counters, tables, booths, low seating, slatted walls, shelving and cabinetry are made to the design.' },
    },
    {
      title: { vi: 'Vật tư hoàn thiện & nhận diện', en: 'Finishing & brand identity' },
      description: { vi: 'Bảng hiệu hắt sáng, chữ nổi, đèn lồng giấy, rèm noren, vách shoji và tranh trang trí.', en: 'Halo-lit signage, raised lettering, paper lanterns, noren curtains, shoji partitions and decorative art.' },
      href: '/bang-hieu/bang-hieu-mat-tien',
    },
    {
      title: { vi: 'Dụng cụ & vận hành', en: 'Operating items' },
      description: { vi: 'Bát đĩa gốm, khay sushi, đũa, khăn, menu, hộp bento và túi mang đi in logo.', en: 'Ceramic tableware, sushi trays, chopsticks, towels, menus, bento boxes and logo-printed takeaway bags.' },
      href: '/san-xuat-cung-ung/an-pham-bao-bi/menu',
    },
  ],
  materials: [
    { name: { vi: 'Gỗ óc chó', en: 'Walnut wood' }, color: '#51382A' },
    { name: { vi: 'Gỗ sồi', en: 'Oak wood' }, color: '#B98B57' },
    { name: { vi: 'Giấy shoji', en: 'Shoji paper' }, color: '#EFE9DD' },
    { name: { vi: 'Đỏ sơn', en: 'Lacquer red' }, color: '#B83328' },
    { name: { vi: 'Đá đen', en: 'Black stone' }, color: '#252525' },
  ],
  relatedConcepts: [
    { title: { vi: 'Nhà hàng Nhật Bản', en: 'Japanese Restaurant' }, href: '/cung-ung-setup/nha-hang-am-thuc/nha-hang-nhat-ban' },
    { title: { vi: 'Spa & Beauty', en: 'Spa & Beauty' }, href: '/giai-phap-tron-goi/spa-beauty' },
    { title: { vi: 'Shop & Retail', en: 'Shop & Retail' }, href: '/giai-phap-tron-goi/shop-retail' },
  ],
  faqs: [
    {
      question: { vi: 'Tôi chưa có bản vẽ hay ý tưởng rõ ràng, có bắt đầu được không?', en: 'Can I start without a finished layout or a clear concept?' },
      answer: { vi: 'Được. Anh chị có thể mô tả mong muốn và gửi vài hình ảnh mẫu để Hamburg Connect cùng xác định hạng mục phù hợp.', en: 'Yes. Share your priorities and a few sample photos so Hamburg Connect can help define suitable items.' },
    },
    {
      question: { vi: 'Tôi có thể chỉ chọn một vài hạng mục không?', en: 'Can I select only a few items rather than a full setup?' },
      answer: { vi: 'Được. Anh chị có thể chọn từng nhóm hàng hoặc phối hợp nhiều hạng mục trong cùng một lô.', en: 'Yes. You can select individual item groups or combine several items in one shipment.' },
    },
    {
      question: { vi: 'Hamburg Connect có lắp đặt tại nước ngoài không?', en: 'Does Hamburg Connect install items overseas?' },
      answer: { vi: 'Hamburg Connect tập trung vào cung ứng và logistics quốc tế; hàng được chuẩn bị thông số và hướng dẫn để anh chị phối hợp đơn vị chuyên môn tại địa phương.', en: 'Hamburg Connect focuses on supply and international logistics; items are prepared with specifications and guidance for local specialists.' },
    },
  ],
};

export const SHIPPING_LANDING_CONTENT = {
  taxMethods: [
    {
      title: { vi: 'Chuyển phát nhanh', en: 'Express delivery' },
      description: { vi: 'Thuế nhập khẩu không bao gồm. Khi hàng đến nơi, hãng gửi thông báo thuế để anh chị tự thanh toán hoặc ủy thác thanh toán hộ.', en: 'Import tax is not included. When goods arrive, the carrier sends a tax notice for direct payment or authorised handling.' },
    },
    {
      title: { vi: 'Đường hàng không', en: 'Air freight' },
      description: { vi: 'Có gói bao trọn thuế phí (DDP), gồm thủ tục và giao tận nơi theo phương án đã thống nhất.', en: 'An all-inclusive duty-and-tax package (DDP) is available, including the agreed process and final delivery.' },
    },
    {
      title: { vi: 'Đường biển', en: 'Sea freight' },
      description: { vi: 'Thuế phí theo lựa chọn: Hamburg Connect có thể hỗ trợ booking/thủ tục hoặc triển khai phương án trọn gói theo báo giá.', en: 'Duty and tax are according to the selected option: Hamburg Connect can support booking/customs processes or provide an all-inclusive quoted option.' },
    },
  ],
};

export function getHomeHeroFallback(locale: BriefLocale) {
  return {
    ...HOME_HERO_FALLBACK,
    title: HOME_HERO_FALLBACK.title[locale],
    description: HOME_HERO_FALLBACK.description[locale],
    capabilityLine: HOME_HERO_FALLBACK.capabilityLine[locale],
    scriptAccent: HOME_HERO_FALLBACK.scriptAccent[locale],
  };
}

export function getJapaneseRestaurantConcept(locale: BriefLocale) {
  return {
    ...JAPANESE_RESTAURANT_CONCEPT,
    locale,
  };
}

export function getShippingLandingContent(locale: BriefLocale) {
  return {
    ...SHIPPING_LANDING_CONTENT,
    locale,
  };
}
