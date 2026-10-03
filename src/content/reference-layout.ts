import type { ElementType } from 'react';
import {
  BadgeCheck,
  Box,
  CircleDollarSign,
  Globe2,
  Layers,
  Lightbulb,
  PackageCheck,
  Palette,
  PenTool,
  Printer,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';

export type ReferenceLocale = 'vi' | 'en';
export type ReferencePageKey = 'shipping' | 'signage' | 'printing' | 'supply' | 'projects' | 'menu';

type LocalizedText = Record<ReferenceLocale, string>;

export type ReferenceBenefit = {
  title: LocalizedText;
  description: LocalizedText;
  icon: ElementType;
};

export type ReferenceCard = {
  title: LocalizedText;
  description: LocalizedText;
  bullets?: Record<ReferenceLocale, string[]>;
  href: string;
  image: string;
};

export type ReferenceProcessStep = {
  title: LocalizedText;
  description: LocalizedText;
  icon: ElementType;
};

export type ReferenceFeatureCard = {
  title: LocalizedText;
  description: LocalizedText;
  image?: string;
};

export type ReferenceProjectItem = {
  title: LocalizedText;
  subtitle: LocalizedText;
  image: string;
  href?: string;
};

export type ReferenceFeaturedProjects = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  viewAllLabel?: LocalizedText;
  viewAllHref?: string;
  projects: ReferenceProjectItem[];
};

export type ReferencePageContent = {
  title: LocalizedText;
  breadcrumbTitle?: LocalizedText;
  description: LocalizedText;
  heroImage: string;
  referenceHeroImage?: string;
  heroAlt: LocalizedText;
  scriptAccent?: LocalizedText;
  primaryAction: { label: LocalizedText; href: string };
  secondaryAction: { label: LocalizedText; href: string };
  benefits: ReferenceBenefit[];
  intro: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    subtitle?: LocalizedText;
    description: LocalizedText;
    images: string[];
  };
  cards: ReferenceCard[];
  cardsTitle: LocalizedText;
  cardsEyebrow: LocalizedText;
  cardsViewAllLabel?: LocalizedText;
  cardsBeforeChildren?: boolean;
  hideIntro?: boolean;
  hideCards?: boolean;
  hideProcess?: boolean;
  ctaStyle?: 'truck' | 'menu' | 'badges';
  productDetails?: {
    title: LocalizedText;
    cards: ReferenceFeatureCard[];
  };
  process: ReferenceProcessStep[];
  processTitle: LocalizedText;
  processEyebrow: LocalizedText;
  processDescription?: LocalizedText;
  featuredProjects?: ReferenceFeaturedProjects;
  cta: { title: LocalizedText; description: LocalizedText; image: string };
};

const STANDARD_PROCESS: ReferenceProcessStep[] = [
  { title: { vi: 'Tiếp nhận nhu cầu', en: 'Receive your needs' }, description: { vi: 'Tư vấn giải pháp phù hợp thời gian và ngân sách.', en: 'Advise a suitable approach for your timeline and budget.' }, icon: Lightbulb },
  { title: { vi: 'Báo giá & xác nhận', en: 'Quote and confirm' }, description: { vi: 'Báo giá chi tiết, minh bạch.', en: 'Detailed and transparent quotation.' }, icon: CircleDollarSign },
  { title: { vi: 'Đóng gói & lấy hàng', en: 'Pack and collect' }, description: { vi: 'Hỗ trợ đóng gói, lấy hàng tại xưởng hoặc tận nơi.', en: 'Pack and collect from workshop or door-to-door.' }, icon: PackageCheck },
  { title: { vi: 'Vận chuyển & thông quan', en: 'Ship and clear customs' }, description: { vi: 'Theo dõi hành trình liên tục.', en: 'Continuous tracking throughout the journey.' }, icon: Box },
  { title: { vi: 'Giao hàng tận nơi', en: 'Final delivery' }, description: { vi: 'Đến đúng địa chỉ theo yêu cầu.', en: 'Delivered to the exact address requested.' }, icon: Truck },
];

const REFERENCE_PAGES: Record<ReferencePageKey, ReferencePageContent> = {
  shipping: {
    title: { vi: 'Vận chuyển quốc tế\nViệt Nam - CHLB Đức', en: 'International shipping\nVietnam - Germany' },
    breadcrumbTitle: { vi: 'Vận chuyển quốc tế', en: 'International shipping' },
    description: { vi: 'Dịch vụ vận chuyển hàng hóa chuyên tuyến Việt Nam - Đức bằng đường hàng không và đường biển. An toàn, nhanh chóng, đúng hẹn.', en: 'Dedicated freight shipping route Vietnam - Germany by air and sea. Safe, fast, and on-time.' },
    heroImage: '/images/hero/hero_showcase.jpg',
    referenceHeroImage: '/images/reference/harbor-morning_tam.webp',
    heroAlt: { vi: 'Vận chuyển quốc tế Việt Nam - Đức', en: 'International shipping Vietnam - Germany' },
    scriptAccent: { vi: 'Nhanh chóng · Chuẩn xác · An tâm tuyệt đối', en: 'Fast · Precise · Absolute peace of mind' },
    primaryAction: { label: { vi: 'Liên hệ tư vấn', en: 'Contact us' }, href: '/lien-he?nhu-cau=van-chuyen' },
    secondaryAction: { label: { vi: 'Xem bảng giá', en: 'View pricing' }, href: '#bang-gia' },
    benefits: [
      { title: { vi: 'Chuyên tuyến Việt - Đức', en: 'Dedicated Vietnam - Germany' }, description: { vi: 'Hàng không & đường biển hàng tuần', en: 'Weekly air and sea freight' }, icon: Globe2 },
      { title: { vi: 'Đa dạng phương thức', en: 'Diverse shipping modes' }, description: { vi: 'DDP, LCL, FCL, Chuyển phát nhanh', en: 'DDP, LCL, FCL, Express courier' }, icon: PackageCheck },
      { title: { vi: 'Thủ tục trọn gói DDP', en: 'Turnkey DDP customs' }, description: { vi: 'Bao trọn thuế phí, giao tận nơi', en: 'All-inclusive duties, door delivery' }, icon: ShieldCheck },
      { title: { vi: 'Theo dõi hành trình 24/7', en: '24/7 shipment tracking' }, description: { vi: 'Cập nhật liên tục, hỗ trợ song ngữ', en: 'Continuous tracking, bilingual support' }, icon: BadgeCheck },
    ],
    hideIntro: true,
    intro: {
      eyebrow: { vi: 'Dịch vụ vận chuyển quốc tế', en: 'International shipping' },
      title: { vi: 'Kết nối Việt Nam đến toàn cầu', en: 'Connecting Vietnam to the world' },
      description: { vi: 'Giải pháp vận chuyển linh hoạt, an toàn và tối ưu chi phí.', en: 'Flexible, secure and practical shipping support.' },
      images: ['/images/hero/hero_showcase.jpg', '/images/section_provided_1.jpg', '/images/section_provided_4.jpg'],
    },
    cardsBeforeChildren: true,
    cardsTitle: { vi: 'Giải pháp linh hoạt cho mọi nhu cầu', en: 'Flexible solutions for every need' },
    cardsEyebrow: { vi: 'Dịch vụ vận chuyển quốc tế', en: 'International shipping services' },
    cardsViewAllLabel: { vi: 'Xem tất cả dịch vụ', en: 'View all services' },
    cards: [
      { title: { vi: 'Bao trọn thuế phí (DDP)', en: 'DDP (tax inclusive)' }, description: { vi: 'Giải pháp trọn gói, giao hàng tận nơi, bao gồm thuế, phí và thủ tục hải quan.', en: 'All-inclusive delivery including taxes, fees and customs.' }, href: '/van-chuyen-quoc-te/bao-tron-thue-phi-ddp', image: '/images/delivery/doorstep_delivery.jpg' },
      { title: { vi: 'Đường biển nguyên container (FCL)', en: 'Full Container (FCL)' }, description: { vi: 'Phù hợp cho đơn hàng số lượng lớn với chi phí cạnh tranh và thời gian linh hoạt.', en: 'Ideal for large orders with competitive rates and flexible timelines.' }, href: '/van-chuyen-quoc-te/gui-hang-di-chau-au', image: '/images/reference/card1-vanchuyen.jpg' },
      { title: { vi: 'Đường biển hàng lẻ (LCL)', en: 'LCL Sea Freight' }, description: { vi: 'Giải pháp tiết kiệm chi phí cho đơn hàng vừa và nhỏ, lịch tàu đa dạng.', en: 'Cost-effective option for small to medium shipments.' }, href: '/van-chuyen-quoc-te/gui-hang-di-uc', image: '/images/shipping/lcl_sea_freight.jpg' },
      { title: { vi: 'Đường hàng không (Air Freight)', en: 'Air Freight' }, description: { vi: 'Nhanh chóng, an toàn, phù hợp hàng gấp và hàng giá trị cao.', en: 'Fast and secure, suitable for urgent and high-value cargo.' }, href: '/van-chuyen-quoc-te/gui-hang-di-my', image: '/images/shipping/air_freight_cargo.jpg' },
    ],
    process: STANDARD_PROCESS,
    processTitle: { vi: 'Đơn giản · Rõ ràng · Hiệu quả', en: 'Simple · Clear · Effective' },
    processEyebrow: { vi: 'Quy trình vận chuyển', en: 'Shipping process' },
    ctaStyle: 'truck',
    cta: { title: { vi: 'Sẵn sàng đưa hàng của anh chị đến bất cứ đâu trên thế giới?', en: 'Ready to send your goods anywhere in the world?' }, description: { vi: 'Chia sẻ thông tin lô hàng để nhận tư vấn theo nhu cầu thực tế.', en: 'Share shipment details for advice based on your needs.' }, image: '/images/reference/truck-clean.png' },
  },
  signage: {
    title: { vi: 'Bảng hiệu mặt tiền', en: 'Storefront signage' },
    breadcrumbTitle: { vi: 'Bảng hiệu', en: 'Signage' },
    description: { vi: 'Thiết kế và sản xuất bảng hiệu theo yêu cầu, đồng hành từ ý tưởng đến khi giao tận nơi.', en: 'Custom signage design and production, supporting you from concept through delivery.' },
    heroImage: '/images/section_provided_3.jpg',
    referenceHeroImage: '/images/reference/storefront-morning_tam.webp',
    heroAlt: { vi: 'Bảng hiệu mặt tiền', en: 'Storefront signage' },
    scriptAccent: { vi: 'Mặt tiền ấn tượng, thương hiệu bừng sáng', en: 'Impressive storefront, shining brand' },
    primaryAction: { label: { vi: 'Liên hệ tư vấn', en: 'Contact us' }, href: '/lien-he?nhu-cau=tim-nguon-san-xuat' },
    secondaryAction: { label: { vi: 'Xem dịch vụ', en: 'View services' }, href: '#dich-vu' },
    benefits: [
      {
        title: { vi: 'Thiết kế theo yêu cầu', en: 'Custom design' },
        description: { vi: 'Phù hợp phong cách và ngành nghề', en: 'Tailored to your style and industry' },
        icon: Lightbulb,
      },
      {
        title: { vi: 'Đa dạng chất liệu', en: 'Diverse materials' },
        description: { vi: 'Mica, Alu, Inox, Hộp đèn, LED...', en: 'Mica, Alu, Inox, Lightbox, LED...' },
        icon: Box,
      },
      {
        title: { vi: 'Sản xuất tại Việt Nam', en: 'Made in Vietnam' },
        description: { vi: 'Theo sát chất lượng tại xưởng đối tác', en: 'Quality monitoring at partner workshops' },
        icon: ShieldCheck,
      },
      {
        title: { vi: 'Đóng gói & vận chuyển quốc tế', en: 'International packing & shipping' },
        description: { vi: 'Giao tận nơi theo yêu cầu', en: 'Door-to-door delivery on request' },
        icon: Truck,
      },
    ],
    intro: {
      eyebrow: { vi: 'Giải pháp bảng hiệu', en: 'Signage solutions' },
      title: { vi: 'Tạo dấu ấn thương hiệu ở bất cứ đâu', en: 'Make your brand stand out anywhere' },
      description: {
        vi: 'Một bảng hiệu đẹp không chỉ giúp khách hàng dễ nhận biết, mà còn mang câu chuyện thương hiệu của anh chị tới cộng đồng. Hamburg Connect kết nối bạn với các xưởng sản xuất uy tín tại Việt Nam, từ thiết kế, sản xuất đến đóng gói và vận chuyển quốc tế.',
        en: 'A great storefront sign helps customers easily recognise you and shares your brand story with the community. Hamburg Connect connects you with trusted workshops in Vietnam, from design and manufacturing to packing and international shipping.',
      },
      images: ['/images/reference/storefront-morning_tam.webp', '/images/img_brand_1.jpg', '/images/img_brand_2.jpg'],
    },
    cardsEyebrow: { vi: 'Sản phẩm & giải pháp', en: 'Products & solutions' },
    cardsTitle: { vi: 'Đa dạng bảng hiệu theo nhu cầu', en: 'Diverse signage for every need' },
    cardsViewAllLabel: { vi: 'Xem tất cả sản phẩm', en: 'View all products' },
    cards: [
      {
        title: { vi: 'Bảng hiệu mặt tiền', en: 'Storefront signage' },
        description: { vi: 'Alu, Mica, Inox, LED · Chữ nổi, hộp đèn · Thiết kế theo mặt bằng', en: 'Alu, Acrylic, Inox, LED · Raised lettering, light boxes · Custom frontage design' },
        bullets: {
          vi: ['Alu, Mica, Inox, LED', 'Chữ nổi, hộp đèn', 'Thiết kế theo mặt bằng'],
          en: ['Alu, Acrylic, Inox, LED', 'Raised lettering, light boxes', 'Custom frontage design'],
        },
        href: '/bang-hieu/bang-hieu-mat-tien',
        image: '/images/reference/storefront-morning_tam.webp',
      },
      {
        title: { vi: 'Hộp đèn', en: 'Light boxes' },
        description: { vi: 'Hộp đèn tròn, hộp đèn vuông · Hộp đèn siêu mỏng · In UV sắc nét', en: 'Round & square light boxes · Ultra-thin light boxes · Sharp UV printing' },
        bullets: {
          vi: ['Hộp đèn tròn, hộp đèn vuông', 'Hộp đèn siêu mỏng', 'In UV sắc nét'],
          en: ['Round & square light boxes', 'Ultra-thin light boxes', 'Sharp UV printing'],
        },
        href: '/bang-hieu/bang-hieu-mat-tien',
        image: '/images/img_brand_1.jpg',
      },
      {
        title: { vi: 'Biển vẫy', en: 'Blade signs' },
        description: { vi: 'Biển vẫy tròn, vuông · Gọn nhẹ, dễ lắp đặt · Phù hợp nhiều ngành', en: 'Round & square blade signs · Compact, easy to install · Suitable for many industries' },
        bullets: {
          vi: ['Biển vẫy tròn, vuông', 'Gọn nhẹ, dễ lắp đặt', 'Phù hợp nhiều ngành'],
          en: ['Round & square blade signs', 'Compact, easy to install', 'Suitable for many industries'],
        },
        href: '/bang-hieu/bang-hieu-mat-tien',
        image: '/images/img_brand_2.jpg',
      },
      {
        title: { vi: 'Chữ nổi', en: 'Raised lettering' },
        description: { vi: 'Mica, Inox, Alu · Nhiều kiểu chữ, màu sắc · Sang trọng, bền đẹp', en: 'Acrylic, Inox, Alu · Various fonts & colours · Elegant and durable' },
        bullets: {
          vi: ['Mica, Inox, Alu', 'Nhiều kiểu chữ, màu sắc', 'Sang trọng, bền đẹp'],
          en: ['Acrylic, Inox, Alu', 'Various fonts & colours', 'Elegant and durable'],
        },
        href: '/bang-hieu/bang-hieu-mat-tien',
        image: '/images/img_brand_3.jpg',
      },
      {
        title: { vi: 'Biển chỉ dẫn', en: 'Directional signs' },
        description: { vi: 'Biển trong nhà, ngoài trời · Chất liệu đa dạng · Thiết kế theo yêu cầu', en: 'Indoor & outdoor signs · Diverse materials · Custom design on request' },
        bullets: {
          vi: ['Biển trong nhà, ngoài trời', 'Chất liệu đa dạng', 'Thiết kế theo yêu cầu'],
          en: ['Indoor & outdoor signs', 'Diverse materials', 'Custom design on request'],
        },
        href: '/bang-hieu/bang-hieu-mat-tien',
        image: '/images/img_brand_4.jpg',
      },
    ],
    processEyebrow: { vi: 'Quy trình thực hiện', en: 'Working process' },
    processTitle: { vi: 'Đơn giản · Rõ ràng · Đồng hành cùng bạn', en: 'Simple · Clear · By your side' },
    processDescription: { vi: 'Từ ý tưởng đến khi bảng hiệu được giao tận nơi.', en: 'From idea to storefront delivery.' },
    process: [
      {
        title: { vi: 'Tiếp nhận nhu cầu', en: 'Receive requirements' },
        description: { vi: 'Tư vấn ý tưởng, phong cách phù hợp', en: 'Consult on ideas and suitable style' },
        icon: Lightbulb,
      },
      {
        title: { vi: 'Thiết kế & báo giá', en: 'Design & quotation' },
        description: { vi: 'Lên ý tưởng, gửi mẫu và báo giá chi tiết', en: 'Ideate, send samples and detailed quote' },
        icon: CircleDollarSign,
      },
      {
        title: { vi: 'Sản xuất tại xưởng', en: 'Workshop production' },
        description: { vi: 'Theo sát chất lượng, đảm bảo đúng tiến độ', en: 'Monitor quality closely, ensure schedule' },
        icon: ShieldCheck,
      },
      {
        title: { vi: 'Đóng gói & vận chuyển', en: 'Packaging & shipping' },
        description: { vi: 'Đóng gói cẩn thận, hỗ trợ thủ tục cần thiết', en: 'Careful packaging, assist needed procedures' },
        icon: Box,
      },
      {
        title: { vi: 'Giao tận nơi', en: 'Door-to-door delivery' },
        description: { vi: 'Vận chuyển quốc tế theo yêu cầu', en: 'International shipping on request' },
        icon: Truck,
      },
    ],
    featuredProjects: {
      eyebrow: { vi: 'Dự án tiêu biểu', en: 'Featured projects' },
      title: { vi: 'Một số dự án bảng hiệu đã thực hiện', en: 'Featured signage projects completed' },
      viewAllLabel: { vi: 'Xem tất cả dự án', en: 'View all projects' },
      viewAllHref: '/du-an',
      projects: [
        {
          title: { vi: 'Nhà hàng Việt Nam', en: 'Vietnamese Restaurant' },
          subtitle: { vi: 'Hamburg, Germany', en: 'Hamburg, Germany' },
          image: '/images/projects/proj_01.jpg',
          href: '/du-an',
        },
        {
          title: { vi: 'Nail & Spa', en: 'Nail & Spa' },
          subtitle: { vi: 'Texas, USA', en: 'Texas, USA' },
          image: '/images/projects/proj_02.jpg',
          href: '/du-an',
        },
        {
          title: { vi: 'Café & Trà sữa', en: 'Café & Tea' },
          subtitle: { vi: 'Sydney, Australia', en: 'Sydney, Australia' },
          image: '/images/projects/proj_03.jpg',
          href: '/du-an',
        },
        {
          title: { vi: 'Nhà hàng Nhật Bản', en: 'Japanese Restaurant' },
          subtitle: { vi: 'Osaka, Japan', en: 'Osaka, Japan' },
          image: '/images/projects/proj_11.jpg',
          href: '/du-an',
        },
        {
          title: { vi: 'Cửa hàng bán lẻ', en: 'Retail Store' },
          subtitle: { vi: 'Berlin, Germany', en: 'Berlin, Germany' },
          image: '/images/projects/proj_06.jpg',
          href: '/du-an',
        },
      ],
    },
    cta: {
      title: { vi: 'Bạn đang cần bảng hiệu cho cửa hàng tại nước ngoài?', en: 'Looking for storefront signage for your overseas store?' },
      description: { vi: 'Chúng tôi sẵn sàng tư vấn giải pháp phù hợp và đồng hành cùng bạn từ Việt Nam.', en: 'We are ready to advise suitable solutions and accompany you from Vietnam.' },
      image: '/images/reference/storefront-morning_tam.webp',
    },
  },
  printing: {
    title: { vi: 'In ấn & Bao bì', en: 'Printing & Packaging' },
    breadcrumbTitle: { vi: 'In ấn & Bao bì', en: 'Printing & packaging' },
    description: { vi: 'Giải pháp in ấn chuyên nghiệp, thiết kế sáng tạo và bao bì đa dạng cho doanh nghiệp trong và ngoài nước.', en: 'Professional printing, creative design and diverse packaging solutions for businesses in Vietnam and abroad.' },
    heroImage: '/images/products/prod_bao_bi.jpg',
    referenceHeroImage: '/images/reference/print-packaging_tam.webp',
    heroAlt: { vi: 'In ấn và bao bì chuyên nghiệp', en: 'Professional printing and packaging' },
    scriptAccent: { vi: 'Mỗi chi tiết nhỏ, một dấu ấn lớn', en: 'Every small detail, a big impression' },
    primaryAction: { label: { vi: 'Liên hệ tư vấn', en: 'Contact us' }, href: '/lien-he?nhu-cau=tim-nguon-san-xuat' },
    secondaryAction: { label: { vi: 'Xem dịch vụ', en: 'View services' }, href: '#dich-vu' },
    benefits: [
      {
        title: { vi: 'Thiết kế theo yêu cầu', en: 'Custom design' },
        description: { vi: 'Đúng ngành, đúng phong cách', en: 'Tailored to your industry & style' },
        icon: Palette,
      },
      {
        title: { vi: 'In ấn đa chất liệu', en: 'Multi-material printing' },
        description: { vi: 'Giấy, decal, bạt, nhựa, vải, v.v.', en: 'Paper, decal, canvas, plastic, fabric, etc.' },
        icon: Printer,
      },
      {
        title: { vi: 'Bao bì đa dạng', en: 'Diverse packaging' },
        description: { vi: 'Bao bì giấy, túi, hộp, tem nhãn', en: 'Paper packaging, bags, boxes, labels' },
        icon: Box,
      },
      {
        title: { vi: 'Đóng gói & vận chuyển quốc tế', en: 'International packing & shipping' },
        description: { vi: 'Giao tận nơi theo yêu cầu', en: 'Door-to-door delivery on request' },
        icon: Globe2,
      },
    ],
    intro: {
      eyebrow: { vi: 'Giải pháp in ấn & bao bì', en: 'Printing & packaging solutions' },
      title: { vi: 'Nâng tầm thương hiệu qua từng chi tiết', en: 'Elevate your brand through each detail' },
      description: {
        vi: 'Chúng tôi cung cấp giải pháp in ấn và bao bì toàn diện cho doanh nghiệp, từ thiết kế, in ấn đến gia công hoàn thiện, giúp bạn xây dựng hình ảnh chuyên nghiệp và tạo dấu ấn với khách hàng trong và ngoài nước.',
        en: 'We provide comprehensive printing and packaging solutions for businesses, from design and printing to finished processing, helping you build a professional brand image and make a lasting impression on customers.',
      },
      images: ['/images/products/prod_bao_bi.jpg', '/images/products/prod_menu.jpg', '/images/products/prod_the_phieu.jpg'],
    },
    cardsEyebrow: { vi: 'Sản phẩm & giải pháp', en: 'Products & solutions' },
    cardsTitle: { vi: 'Đa dạng in ấn theo nhu cầu', en: 'Diverse printing for every need' },
    cardsViewAllLabel: { vi: 'Xem tất cả sản phẩm', en: 'View all products' },
    cards: [
      {
        title: { vi: 'In menu & catalogue', en: 'Menu & catalogue printing' },
        description: { vi: 'Menu nhà hàng · Catalogue sản phẩm · Brochure giới thiệu · Tờ rơi quảng cáo', en: 'Restaurant menus · Product catalogues · Brochures · Advertising flyers' },
        bullets: {
          vi: ['Menu nhà hàng', 'Catalogue sản phẩm', 'Brochure giới thiệu', 'Tờ rơi quảng cáo'],
          en: ['Restaurant menus', 'Product catalogues', 'Brochures', 'Advertising flyers'],
        },
        href: '/san-xuat-cung-ung/an-pham-bao-bi/menu',
        image: '/images/products/prod_menu.jpg',
      },
      {
        title: { vi: 'Danh thiếp & ấn phẩm văn phòng', en: 'Business cards & office stationery' },
        description: { vi: 'Danh thiếp · Tiêu đề thư · Phong bì · Bìa hồ sơ', en: 'Business cards · Letterheads · Envelopes · Folders' },
        bullets: {
          vi: ['Danh thiếp', 'Tiêu đề thư', 'Phong bì', 'Bìa hồ sơ'],
          en: ['Business cards', 'Letterheads', 'Envelopes', 'Folders'],
        },
        href: '/san-xuat-cung-ung/an-pham-bao-bi/business-card',
        image: '/images/products/prod_the_phieu.jpg',
      },
      {
        title: { vi: 'Tem nhãn & decal', en: 'Labels & decals' },
        description: { vi: 'Tem nhãn sản phẩm · Decal dán kính · Sticker logo · Tem niêm phong', en: 'Product labels · Window decals · Logo stickers · Security seals' },
        bullets: {
          vi: ['Tem nhãn sản phẩm', 'Decal dán kính', 'Sticker logo', 'Tem niêm phong'],
          en: ['Product labels', 'Window decals', 'Logo stickers', 'Security seals'],
        },
        href: '/san-xuat-cung-ung/an-pham-bao-bi/sticker-label',
        image: '/images/products/prod_sticker_decal.jpg',
      },
      {
        title: { vi: 'Bao bì đóng gói', en: 'Packaging & boxes' },
        description: { vi: 'Hộp giấy, túi giấy · Hộp cứng cao cấp · Bao bì thực phẩm · Bao bì ngành nail - spa', en: 'Paper bags & boxes · Luxury rigid boxes · Food packaging · Nail & spa packaging' },
        bullets: {
          vi: ['Hộp giấy, túi giấy', 'Hộp cứng cao cấp', 'Bao bì thực phẩm', 'Bao bì ngành nail - spa'],
          en: ['Paper bags & boxes', 'Luxury rigid boxes', 'Food packaging', 'Nail & spa packaging'],
        },
        href: '/san-xuat-cung-ung/an-pham-bao-bi/packaging',
        image: '/images/products/prod_bao_bi.jpg',
      },
      {
        title: { vi: 'In bạt & vật liệu quảng cáo', en: 'Banners & advertising media' },
        description: { vi: 'Bạt Hiflex, PP, Canvas · Standee, backdrop · Poster, banner · Decal dán tường', en: 'Hiflex, PP, Canvas · Standees, backdrops · Posters, banners · Wall decals' },
        bullets: {
          vi: ['Bạt Hiflex, PP, Canvas', 'Standee, backdrop', 'Poster, banner', 'Decal dán tường'],
          en: ['Hiflex, PP, Canvas', 'Standees, backdrops', 'Posters, banners', 'Wall decals'],
        },
        href: '/san-xuat-cung-ung/an-pham-bao-bi/poster',
        image: '/images/products/prod_flyer_poster.jpg',
      },
    ],
    processEyebrow: { vi: 'Quy trình thực hiện', en: 'Working process' },
    processTitle: { vi: 'Đơn giản · Rõ ràng · Đồng hành cùng bạn', en: 'Simple · Clear · By your side' },
    processDescription: { vi: 'Từ ý tưởng đến khi sản phẩm được giao tận nơi.', en: 'From idea to final delivery.' },
    process: [
      {
        title: { vi: 'Tiếp nhận nhu cầu', en: 'Receive requirements' },
        description: { vi: 'Tư vấn ý tưởng, chọn chất liệu phù hợp', en: 'Consult on ideas, choose suitable materials' },
        icon: Lightbulb,
      },
      {
        title: { vi: 'Thiết kế & báo giá', en: 'Design & quotation' },
        description: { vi: 'Lên ý tưởng, gửi mẫu và báo giá chi tiết', en: 'Ideate, send samples and detailed quote' },
        icon: CircleDollarSign,
      },
      {
        title: { vi: 'In ấn & gia công', en: 'Printing & finishing' },
        description: { vi: 'Sản xuất theo đúng thiết kế, kiểm tra chất lượng', en: 'Manufacture to design, inspect quality' },
        icon: Printer,
      },
      {
        title: { vi: 'Đóng gói & vận chuyển', en: 'Packaging & shipping' },
        description: { vi: 'Đóng gói cẩn thận, hỗ trợ thủ tục cần thiết', en: 'Careful packaging, assist needed procedures' },
        icon: Box,
      },
      {
        title: { vi: 'Giao hàng tận nơi', en: 'Final delivery' },
        description: { vi: 'Vận chuyển quốc tế theo yêu cầu', en: 'International shipping on request' },
        icon: Truck,
      },
    ],
    featuredProjects: {
      eyebrow: { vi: 'Dự án tiêu biểu', en: 'Featured projects' },
      title: { vi: 'Một số dự án in ấn & bao bì đã thực hiện', en: 'Featured print & packaging projects completed' },
      viewAllLabel: { vi: 'Xem tất cả dự án', en: 'View all projects' },
      viewAllHref: '/du-an',
      projects: [
        {
          title: { vi: 'Nhà hàng Việt Nam', en: 'Vietnamese Restaurant' },
          subtitle: { vi: 'Hamburg, Germany', en: 'Hamburg, Germany' },
          image: '/images/products/prod_menu.jpg',
          href: '/du-an',
        },
        {
          title: { vi: 'Nail & Spa', en: 'Nail & Spa' },
          subtitle: { vi: 'Texas, USA', en: 'Texas, USA' },
          image: '/images/products/prod_the_phieu.jpg',
          href: '/du-an',
        },
        {
          title: { vi: 'Café & Trà sữa', en: 'Café & Tea' },
          subtitle: { vi: 'Sydney, Australia', en: 'Sydney, Australia' },
          image: '/images/products/prod_sticker_decal.jpg',
          href: '/du-an',
        },
        {
          title: { vi: 'Cửa hàng thời trang', en: 'Fashion Boutique' },
          subtitle: { vi: 'Toronto, Canada', en: 'Toronto, Canada' },
          image: '/images/products/prod_bao_bi.jpg',
          href: '/du-an',
        },
        {
          title: { vi: 'Sự kiện & Khai trương', en: 'Events & Openings' },
          subtitle: { vi: 'Paris, France', en: 'Paris, France' },
          image: '/images/solutions/sol_wedding_event.jpg',
          href: '/du-an',
        },
      ],
    },
    cta: {
      title: { vi: 'Bạn đang cần in ấn & bao bì cho cửa hàng tại nước ngoài?', en: 'Need printing & packaging for your overseas store?' },
      description: { vi: 'Chúng tôi sẵn sàng tư vấn giải pháp phù hợp và đồng hành cùng bạn từ Việt Nam.', en: 'We are ready to provide suitable solutions and partner with you from Vietnam.' },
      image: '/images/reference/print-packaging_tam.webp',
    },
  },
  supply: {
    title: { vi: 'Cung ứng & Setup theo ngành', en: 'Supply & Setup by industry' },
    breadcrumbTitle: { vi: 'Cung ứng & Setup theo ngành', en: 'Supply & setup by industry' },
    description: { vi: 'Giải pháp trọn gói về thiết kế, sản xuất, in ấn, vật tư và vận chuyển cho các ngành kinh doanh tại Việt Nam và nước ngoài.', en: 'Turnkey design, production, printing, supply and shipping solutions for businesses in Vietnam and abroad.' },
    heroImage: '/images/solutions/sol_restaurant_fnb.jpg',
    referenceHeroImage: '/images/reference/05-cungung-hero-visual.jpg',
    heroAlt: { vi: 'Cung ứng và setup trọn gói', en: 'Turnkey supply and setup' },
    scriptAccent: { vi: 'Giải pháp đồng bộ, sẵn sàng khai trương', en: 'Synchronized solutions, ready to open' },
    primaryAction: { label: { vi: 'Liên hệ tư vấn', en: 'Contact us' }, href: '/lien-he?nhu-cau=du-an-tron-goi' },
    secondaryAction: { label: { vi: 'Xem dịch vụ', en: 'View services' }, href: '#dich-vu' },
    benefits: [
      {
        title: { vi: 'Giải pháp theo từng ngành', en: 'Industry-specific solutions' },
        description: { vi: 'Phù hợp nhu cầu thực tế', en: 'Tailored to practical needs' },
        icon: Lightbulb,
      },
      {
        title: { vi: 'Sản phẩm đa dạng', en: 'Diverse products' },
        description: { vi: 'Vật tư, thiết bị, in ấn, bao bì, trang trí', en: 'Supplies, equipment, print, packaging, decor' },
        icon: PackageCheck,
      },
      {
        title: { vi: 'Sản xuất tại Việt Nam', en: 'Made in Vietnam' },
        description: { vi: 'Chủ động chất lượng & tiến độ', en: 'Direct control over quality & schedule' },
        icon: Box,
      },
      {
        title: { vi: 'Đóng gói & vận chuyển quốc tế', en: 'International packing & shipping' },
        description: { vi: 'Giao tận nơi theo yêu cầu', en: 'Door-to-door delivery on request' },
        icon: Truck,
      },
    ],
    intro: {
      eyebrow: { vi: 'Giải pháp cho doanh nghiệp của anh chị', en: 'Solutions for your business' },
      title: { vi: 'Cung ứng sản phẩm, hỗ trợ set up theo nhu cầu từng ngành', en: 'Supply products and setup support tailored to each industry' },
      description: {
        vi: 'Hamburg Connect đồng hành cùng khách hàng trong việc tìm nguồn, sản xuất và cung ứng các sản phẩm và vật tư phục vụ cho hoạt động kinh doanh. Chúng tôi giúp bạn tiết kiệm thời gian, chi phí và dễ dàng triển khai tại Việt Nam cũng như khi vận chuyển đi nước ngoài.',
        en: 'Hamburg Connect partners with customers to source, produce, and supply products and materials for business operations. We help you save time and costs, enabling easy implementation in Vietnam and smooth international shipping.',
      },
      images: ['/images/solutions/sol_restaurant_fnb.jpg', '/images/solutions/sol_nail_spa.jpg', '/images/products/prod_menu.jpg'],
    },
    cardsTitle: { vi: 'Đa dạng giải pháp theo từng lĩnh vực', en: 'Diverse solutions by industry' },
    cardsEyebrow: { vi: 'Các ngành nghề tiêu biểu', en: 'Representative industries' },
    cardsViewAllLabel: { vi: 'Xem tất cả ngành hàng', en: 'View all industries' },
    cards: [
      {
        title: { vi: 'Nail - Beauty', en: 'Nail - Beauty' },
        description: {
          vi: 'Bàn ghế, thiết bị · Vật tư tiêu hao · In ấn thương hiệu · Trang trí không gian',
          en: 'Furniture & equipment · Consumables · Brand printing · Space decor',
        },
        bullets: {
          vi: ['Bàn ghế, thiết bị', 'Vật tư tiêu hao', 'In ấn thương hiệu', 'Trang trí không gian'],
          en: ['Furniture & equipment', 'Consumables', 'Brand printing', 'Space decor'],
        },
        href: '/giai-phap-tron-goi/nail-salon',
        image: '/images/industries/ind_nail_beauty.jpg',
      },
      {
        title: { vi: 'Nhà hàng - Ẩm thực', en: 'Restaurants - Food' },
        description: {
          vi: 'Bếp, thiết bị · Đồ dùng & vật tư · Menu, bao bì, đồng phục · Trang trí & bảng hiệu',
          en: 'Kitchen & equipment · Utensils & supplies · Menus, packaging & uniforms · Decor & signage',
        },
        bullets: {
          vi: ['Bếp, thiết bị', 'Đồ dùng & vật tư', 'Menu, bao bì, đồng phục', 'Trang trí & bảng hiệu'],
          en: ['Kitchen & equipment', 'Utensils & supplies', 'Menus, packaging & uniforms', 'Decor & signage'],
        },
        href: '/cung-ung-setup/nha-hang-am-thuc/nha-hang-nhat-ban',
        image: '/images/industries/ind_nha_hang.jpg',
      },
      {
        title: { vi: 'Take away - Kiosk', en: 'Takeaway - Kiosk' },
        description: {
          vi: 'Quầy kệ, tủ trưng bày · Ly, hộp, bao bì · Menu, decal, poster · Vật tư vận hành',
          en: 'Counters & displays · Cups, boxes & packaging · Menus, decals & posters · Operating supplies',
        },
        bullets: {
          vi: ['Quầy kệ, tủ trưng bày', 'Ly, hộp, bao bì', 'Menu, decal, poster', 'Vật tư vận hành'],
          en: ['Counters & displays', 'Cups, boxes & packaging', 'Menus, decals & posters', 'Operating supplies'],
        },
        href: '/giai-phap-tron-goi/shop-retail',
        image: '/images/industries/ind_kiosk.jpg',
      },
      {
        title: { vi: 'Cưới hỏi - Sự kiện', en: 'Weddings - Events' },
        description: {
          vi: 'Trang trí, backdrop · In ấn theo chủ đề · Bàn ghế, phụ kiện · Vật tư tổ chức sự kiện',
          en: 'Decor & backdrops · Themed printing · Tables, chairs & accessories · Event supplies',
        },
        bullets: {
          vi: ['Trang trí, backdrop', 'In ấn theo chủ đề', 'Bàn ghế, phụ kiện', 'Vật tư tổ chức sự kiện'],
          en: ['Decor & backdrops', 'Themed printing', 'Tables, chairs & accessories', 'Event supplies'],
        },
        href: '/giai-phap-tron-goi/wedding-event',
        image: '/images/industries/ind_su_kien.jpg',
      },
      {
        title: { vi: 'Quà tặng doanh nghiệp', en: 'Corporate gifts' },
        description: {
          vi: 'Quà tặng, set quà · Hộp giấy, túi giấy · In logo, thiệp, nhãn · Sản xuất theo yêu cầu',
          en: 'Gifts & gift sets · Paper boxes & bags · Logo printing, cards & labels · Custom production',
        },
        bullets: {
          vi: ['Quà tặng, set quà', 'Hộp giấy, túi giấy', 'In logo, thiệp, nhãn', 'Sản xuất theo yêu cầu'],
          en: ['Gifts & gift sets', 'Paper boxes & bags', 'Logo printing, cards & labels', 'Custom production'],
        },
        href: '/san-xuat-cung-ung/an-pham-bao-bi/packaging',
        image: '/images/industries/ind_qua_tang.jpg',
      },
    ],
    processEyebrow: { vi: 'Quy trình cung ứng & hỗ trợ setup', en: 'Supply and setup process' },
    processTitle: { vi: 'Đơn giản · Rõ ràng · Hiệu quả', en: 'Simple · Clear · Effective' },
    processDescription: { vi: 'Từ ý tưởng đến khi sản phẩm được giao tận nơi.', en: 'From idea to final delivery.' },
    process: [
      {
        title: { vi: 'Tiếp nhận nhu cầu', en: 'Receive requirements' },
        description: { vi: 'Tư vấn giải pháp phù hợp từng ngành', en: 'Consult on solutions suited to each industry' },
        icon: Lightbulb,
      },
      {
        title: { vi: 'Báo giá & đề xuất', en: 'Quote & proposal' },
        description: { vi: 'Lên phương án sản phẩm và chi tiết chi phí', en: 'Product plan and detailed cost estimate' },
        icon: CircleDollarSign,
      },
      {
        title: { vi: 'Sản xuất & chuẩn bị', en: 'Production & preparation' },
        description: { vi: 'Sản xuất, in ấn, kiểm tra chất lượng', en: 'Manufacture, print, inspect quality' },
        icon: Box,
      },
      {
        title: { vi: 'Đóng gói & vận chuyển', en: 'Packaging & shipping' },
        description: { vi: 'Đóng gói cẩn thận, hỗ trợ thủ tục cần thiết', en: 'Careful packaging, assist needed procedures' },
        icon: ShieldCheck,
      },
      {
        title: { vi: 'Giao hàng tận nơi', en: 'Final delivery' },
        description: { vi: 'Vận chuyển quốc tế theo yêu cầu', en: 'International shipping on request' },
        icon: Truck,
      },
    ],
    featuredProjects: {
      eyebrow: { vi: 'Một số dự án tiêu biểu', en: 'Featured projects' },
      title: { vi: 'Không gian kinh doanh được đồng hành từ những chi tiết nhỏ', en: 'Business spaces built with care for every detail' },
      viewAllLabel: { vi: 'Xem tất cả dự án', en: 'View all projects' },
      viewAllHref: '/du-an',
      projects: [
        {
          title: { vi: 'Nail Salon', en: 'Nail Salon' },
          subtitle: { vi: 'Hamburg, Germany', en: 'Hamburg, Germany' },
          image: '/images/projects/proj_02.jpg',
          href: '/du-an',
        },
        {
          title: { vi: 'Nhà hàng Việt Nam', en: 'Vietnamese Restaurant' },
          subtitle: { vi: 'Texas, USA', en: 'Texas, USA' },
          image: '/images/projects/proj_01.jpg',
          href: '/du-an',
        },
        {
          title: { vi: 'Café & Trà sữa', en: 'Café & Tea' },
          subtitle: { vi: 'Sydney, Australia', en: 'Sydney, Australia' },
          image: '/images/projects/proj_03.jpg',
          href: '/du-an',
        },
        {
          title: { vi: 'Cửa hàng thời trang', en: 'Fashion Boutique' },
          subtitle: { vi: 'Toronto, Canada', en: 'Toronto, Canada' },
          image: '/images/projects/proj_04.jpg',
          href: '/du-an',
        },
        {
          title: { vi: 'Sự kiện & Khai trương', en: 'Events & Openings' },
          subtitle: { vi: 'Paris, France', en: 'Paris, France' },
          image: '/images/projects/proj_07.jpg',
          href: '/du-an',
        },
      ],
    },
    cta: {
      title: { vi: 'Bạn đang tìm giải pháp cung ứng và setup cho ngành của mình?', en: 'Looking for supply and setup solutions for your industry?' },
      description: { vi: 'Chúng tôi sẵn sàng tư vấn và đồng hành cùng bạn từ Việt Nam đến bất cứ đâu trên thế giới.', en: 'We are ready to advise and accompany you from Vietnam to anywhere in the world.' },
      image: '/images/reference/05-cungung-hero-visual.jpg',
    },
  },
  projects: {
    title: { vi: 'Dự án thực tế\ntừ ý tưởng đến hiện thực', en: 'Real Projects\nfrom idea to reality' },
    breadcrumbTitle: { vi: 'Dự án', en: 'Projects' },
    description: { vi: 'Khám phá các công trình và dự án chúng tôi đã đồng hành cùng cộng đồng kinh doanh người Việt tại Đức và châu Âu.', en: 'Explore completed projects delivered alongside Vietnamese business owners across Germany and Europe.' },
    heroImage: '/images/solutions/sol_restaurant_fnb.jpg',
    referenceHeroImage: '/images/reference/storefront-morning_tam.webp',
    heroAlt: { vi: 'Dự án thực tế Hamburg Connect', en: 'Hamburg Connect real projects' },
    scriptAccent: { vi: 'Mỗi công trình là một câu chuyện thành công', en: 'Every project is a success story' },
    primaryAction: { label: { vi: 'Liên hệ tư vấn', en: 'Contact us' }, href: '/lien-he?nhu-cau=du-an-tron-goi' },
    secondaryAction: { label: { vi: '', en: '' }, href: '' },
    benefits: [
      { title: { vi: 'Đa dạng ngành hàng', en: 'Diverse industries' }, description: { vi: 'Nhiều lĩnh vực, nhiều mô hình', en: 'Multiple sectors and models' }, icon: Globe2 },
      { title: { vi: 'Giải pháp trọn gói', en: 'End-to-end solutions' }, description: { vi: 'Từ thiết kế đến vận chuyển', en: 'From design to shipping' }, icon: PackageCheck },
      { title: { vi: 'Kinh nghiệm quốc tế', en: 'International experience' }, description: { vi: 'Phù hợp tiêu chuẩn từng thị trường', en: 'Meeting standards for each market' }, icon: ShieldCheck },
      { title: { vi: 'Đồng hành tận tâm', en: 'Dedicated support' }, description: { vi: 'Hỗ trợ trong suốt quá trình', en: 'Support throughout the journey' }, icon: BadgeCheck },
    ],
    hideIntro: true,
    intro: {
      eyebrow: { vi: 'Các dự án tiêu biểu', en: 'Featured projects' },
      title: { vi: 'Những công trình đã đồng hành cùng khách hàng', en: 'Projects delivered with customers' },
      description: { vi: 'Hamburg Connect tự hào đồng hành cùng các chủ doanh nghiệp người Việt tạo dựng không gian kinh doanh ấn tượng tại Đức.', en: 'Hamburg Connect proudly partners with Vietnamese business owners to build impressive commercial spaces in Germany.' },
      images: ['/images/solutions/sol_restaurant_fnb.jpg', '/images/solutions/sol_nail_spa.jpg', '/images/solutions/sol_retail.jpg'],
    },
    hideCards: true,
    cardsTitle: { vi: 'Không gian theo từng ngành', en: 'Spaces by industry' },
    cardsEyebrow: { vi: 'Các dự án tiêu biểu', en: 'Featured projects' },
    cards: [],
    process: [
      {
        title: { vi: 'Tiếp nhận nhu cầu', en: 'Receive requirements' },
        description: { vi: 'Tư vấn giải pháp phù hợp từng dự án', en: 'Consult on solutions suited to each project' },
        icon: Lightbulb,
      },
      {
        title: { vi: 'Thiết kế & báo giá', en: 'Design & quotation' },
        description: { vi: 'Lên ý tưởng, thiết kế, báo giá chi tiết', en: 'Ideate, design, and detailed quote' },
        icon: CircleDollarSign,
      },
      {
        title: { vi: 'Sản xuất & kiểm tra', en: 'Production & inspection' },
        description: { vi: 'Sản xuất theo tiêu chuẩn, kiểm tra chất lượng', en: 'Manufacture to standards, quality inspection' },
        icon: ShieldCheck,
      },
      {
        title: { vi: 'Đóng gói & vận chuyển', en: 'Packaging & shipping' },
        description: { vi: 'Đóng gói cẩn thận, hỗ trợ thủ tục cần thiết', en: 'Careful packaging, assist needed procedures' },
        icon: Box,
      },
      {
        title: { vi: 'Giao hàng & bàn giao', en: 'Delivery & handover' },
        description: { vi: 'Vận chuyển quốc tế theo yêu cầu', en: 'International shipping on request' },
        icon: Truck,
      },
    ],
    processTitle: { vi: 'Rõ ràng · Chuyên nghiệp · Hiệu quả', en: 'Clear · Professional · Effective' },
    processEyebrow: { vi: 'Quy trình thực hiện dự án', en: 'Project process' },
    processDescription: { vi: 'Từ ý tưởng đến khi hoàn thiện và vận chuyển đến nơi.', en: 'From idea to completion and delivery.' },
    ctaStyle: 'badges',
    cta: {
      title: { vi: 'Cùng Hamburg Connect đưa thương hiệu của anh chị vươn xa', en: 'Take your brand further with Hamburg Connect' },
      description: { vi: 'Chúng tôi sẵn sàng tư vấn và đồng hành cùng bạn từ Việt Nam đến bất cứ đâu trên thế giới.', en: 'We are ready to advise and accompany you from Vietnam to anywhere in the world.' },
      image: '/images/reference/storefront-morning_tam.webp',
    },
  },
  menu: {
    title: { vi: 'Menu nhà hàng\nẤn tượng từ từng chi tiết', en: 'Restaurant menus\nImpressive in every detail' },
    breadcrumbTitle: { vi: 'Menu nhà hàng', en: 'Restaurant menus' },
    description: { vi: 'Thiết kế và in ấn menu chuyên nghiệp cho nhà hàng, quán ăn, café tại Đức. Đa dạng phong cách, chất liệu chống nước, bền đẹp theo thời gian.', en: 'Professional menu design and printing for restaurants, dining and cafés in Germany. Diverse styles, waterproof and durable materials.' },
    heroImage: '/images/products/prod_menu.jpg',
    referenceHeroImage: '/images/reference/restaurant-menu_tam.webp',
    heroAlt: { vi: 'Menu nhà hàng chuyên nghiệp', en: 'Professional restaurant menu' },
    scriptAccent: { vi: 'Hương vị bắt đầu từ ánh nhìn đầu tiên', en: 'Flavor begins with the very first glance' },
    primaryAction: { label: { vi: 'Liên hệ', en: 'Contact us' }, href: '/lien-he?nhu-cau=tim-nguon-san-xuat' },
    secondaryAction: { label: { vi: 'Xem catalogue', en: 'View catalogue' }, href: '#dich-vu' },
    benefits: [
      {
        title: { vi: 'Thiết kế theo yêu cầu', en: 'Custom design' },
        description: { vi: 'Đúng phong cách thương hiệu', en: 'True to your brand style' },
        icon: PenTool,
      },
      {
        title: { vi: 'Chất liệu đa dạng', en: 'Diverse materials' },
        description: { vi: 'Giấy, da, nhựa, bìa cứng...', en: 'Paper, leather, plastic, hardcover...' },
        icon: Layers,
      },
      {
        title: { vi: 'Gia công chuyên nghiệp', en: 'Professional finishing' },
        description: { vi: 'Ép kim, bế, cán màng, đóng gáy...', en: 'Foil stamping, die-cutting, laminating, binding...' },
        icon: Sparkles,
      },
      {
        title: { vi: 'Đóng gói & vận chuyển quốc tế', en: 'Packaging & global shipping' },
        description: { vi: 'Giao hàng đến nhiều quốc gia', en: 'Delivery to multiple countries' },
        icon: Truck,
      },
    ],
    intro: {
      eyebrow: { vi: '', en: '' },
      title: { vi: 'Menu dạng quyển', en: 'Bound menus' },
      subtitle: { vi: 'Sang trọng, bền đẹp, dễ sử dụng', en: 'Elegant, durable and easy to use' },
      description: {
        vi: 'Menu dạng quyển phù hợp với nhiều mô hình nhà hàng, từ ẩm thực Việt, Á đến Âu. Chúng tôi cung cấp nhiều chất liệu, kiểu dáng và phương án gia công để tạo nên những cuốn menu ấn tượng và bền đẹp.',
        en: 'Bound menus suit diverse restaurant concepts, from Vietnamese and Asian to Western dining. We offer a wide range of materials, styles and finishing options to craft impressive and durable menus.',
      },
      images: ['/images/products/prod_menu.jpg', '/images/products/menu_hardcover.jpg', '/images/products/prod_the_phieu.jpg'],
    },
    cardsTitle: { vi: 'Mẫu menu nhà hàng nổi bật', en: 'Featured restaurant menu formats' },
    cardsEyebrow: { vi: 'Sản phẩm liên quan', en: 'Related products' },
    cards: [
      {
        title: { vi: 'Menu da cao cấp', en: 'Premium leather menu' },
        description: { vi: 'Bìa da, ép kim logo, gáy may', en: 'Leather cover, foil stamped logo, stitched spine' },
        href: '/san-xuat-cung-ung/an-pham-bao-bi/menu',
        image: '/images/products/prod_menu.jpg',
      },
      {
        title: { vi: 'Menu bìa cứng', en: 'Hardcover menu' },
        description: { vi: 'In phủ UV, cán màng, bền màu', en: 'UV coated, laminated, durable colour' },
        href: '/san-xuat-cung-ung/an-pham-bao-bi/menu',
        image: '/images/products/menu_hardcover.jpg',
      },
      {
        title: { vi: 'Menu gáy lò xo', en: 'Wire-bound menu' },
        description: { vi: 'Lật trang dễ dàng, phù hợp quán ăn, café, trà sữa', en: 'Easy page turning, suitable for diners, cafés, milk tea shops' },
        href: '/san-xuat-cung-ung/an-pham-bao-bi/menu',
        image: '/images/products/menu_spiral.jpg',
      },
      {
        title: { vi: 'Menu nhựa chống nước', en: 'Water-resistant menu' },
        description: { vi: 'Bền, dễ vệ sinh, phù hợp quán ăn nhanh, take away', en: 'Durable, easy to clean, suitable for fast food and takeaway' },
        href: '/san-xuat-cung-ung/an-pham-bao-bi/menu',
        image: '/images/products/menu_waterproof.jpg',
      },
    ],
    productDetails: {
      title: { vi: 'Chi tiết sản phẩm', en: 'Product details' },
      cards: [
        {
          title: { vi: 'Chất liệu đa dạng', en: 'Diverse materials' },
          description: { vi: 'Da, giấy mỹ thuật, nhựa, bìa cứng...', en: 'Leather, art paper, plastic, hardcover...' },
          image: '/images/products/prod_menu.jpg',
        },
        {
          title: { vi: 'Gia công tinh xảo', en: 'Exquisite craftsmanship' },
          description: { vi: 'Ép kim, dập nổi, UV, cán màng...', en: 'Foil stamping, embossing, UV coating, laminating...' },
          image: '/images/products/prod_the_phieu.jpg',
        },
        {
          title: { vi: 'Nội dung linh hoạt', en: 'Flexible content' },
          description: { vi: 'Thiết kế theo phong cách riêng', en: 'Custom layout to match your style' },
          image: '/images/products/menu_waterproof.jpg',
        },
        {
          title: { vi: 'Nhiều kiểu gáy', en: 'Multiple binding styles' },
          description: { vi: 'May chỉ, lò xo, bìa ốc, dán gáy...', en: 'Thread sewn, spiral wire, screw post, glue bound...' },
          image: '/images/products/menu_spiral.jpg',
        },
        {
          title: { vi: 'Đóng gói an toàn', en: 'Secure packaging' },
          description: { vi: 'Đảm bảo sản phẩm khi vận chuyển', en: 'Ensures product safety during transport' },
          image: '/images/products/prod_bao_bi.jpg',
        },
      ],
    },
    process: [
      {
        title: { vi: 'Tiếp nhận nhu cầu', en: 'Receive your needs' },
        description: { vi: 'Tư vấn quy cách, chất liệu và số lượng phù hợp nhà hàng.', en: 'Advise on format, materials and quantity suited to your restaurant.' },
        icon: Lightbulb,
      },
      {
        title: { vi: 'Thiết kế & duyệt mẫu', en: 'Design & proof approval' },
        description: { vi: 'Lên bố cục, kiểm tra nội dung và xác nhận bản in trước khi sản xuất.', en: 'Format layout, review content and approve proofs before production.' },
        icon: PenTool,
      },
      {
        title: { vi: 'In ấn & gia công', en: 'Printing & finishing' },
        description: { vi: 'Ép kim, dập nổi, cán màng và đóng gáy tỉ mỉ theo tiêu chuẩn.', en: 'Foil stamping, embossing, laminating and careful binding.' },
        icon: Sparkles,
      },
      {
        title: { vi: 'Đóng gói an toàn', en: 'Secure packaging' },
        description: { vi: 'Kiểm tra chất lượng từng cuốn, đóng gói chống sốc khi vận chuyển.', en: 'Quality inspection of each menu and protective packaging for transit.' },
        icon: PackageCheck,
      },
      {
        title: { vi: 'Giao hàng tận nơi', en: 'Doorstep delivery' },
        description: { vi: 'Vận chuyển nhanh chóng đến đúng địa chỉ nhà hàng của anh chị.', en: 'Prompt delivery right to your restaurant door.' },
        icon: Truck,
      },
    ],
    processTitle: { vi: 'Từ ý tưởng đến khi sản phẩm được giao tận nơi', en: 'From idea to final delivery' },
    processEyebrow: { vi: 'Quy trình thực hiện', en: 'Working process' },
    hideProcess: true,
    ctaStyle: 'menu',
    cta: {
      title: { vi: 'Tạo dấu ấn riêng cho nhà hàng của anh chị', en: 'Create a distinct mark for your restaurant' },
      description: { vi: 'Chúng tôi đồng hành từ thiết kế, in ấn đến đóng gói và vận chuyển đến tận nơi cho nhà hàng của anh chị.', en: 'We accompany you from design, printing to packaging and doorstep delivery for your restaurant.' },
      image: '/images/reference/restaurant-menu_tam.webp',
    },
  },
};

export function getReferencePageContent(page: ReferencePageKey): ReferencePageContent {
  return REFERENCE_PAGES[page];
}
