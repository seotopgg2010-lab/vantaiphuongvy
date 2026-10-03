import { Category, Product, Project, BlogPost, BlogCategory, ShippingRoute, Solution } from '@/types/database';
import productContent from '@/content/products.json';
import { categoryGuides } from '@/content/category-guides';
import { shippingGuides } from '@/content/shipping-guides';
import { blogGuides } from '@/content/blog-guides';

type StaticShippingRoute = Pick<ShippingRoute, 'slug' | 'name'> & Partial<Omit<ShippingRoute, 'slug' | 'name'>>;
type StaticProject = Pick<Project, 'slug' | 'name' | 'images'> & Partial<Omit<Project, 'slug' | 'name' | 'images'>>;
type StaticBlogCategory = Pick<BlogCategory, 'id' | 'slug' | 'name'> & Partial<Omit<BlogCategory, 'id' | 'slug' | 'name'>>;
type StaticBlogPost = Pick<BlogPost, 'slug' | 'title'> & Partial<Omit<BlogPost, 'slug' | 'title'>>;
type StaticCategory = Pick<Category, 'id' | 'slug' | 'name'> & Partial<Omit<Category, 'id' | 'slug' | 'name'>>;
type StaticProduct = Pick<Product, 'slug' | 'name'> & Partial<Omit<Product, 'slug' | 'name'>>;
type StaticSolution = Pick<Solution, 'id' | 'slug' | 'name'> & Partial<Omit<Solution, 'id' | 'slug' | 'name'>>;

const BASE_SHIPPING_ROUTES: StaticShippingRoute[] = [
  {
    slug: 'gui-hang-di-my',
    name: 'Gửi hàng đi Mỹ',
    country: 'Mỹ',
    description: 'Dịch vụ gửi hàng đi Mỹ nhanh chóng, an toàn, tiết kiệm. Phù hợp cho nhiều loại hàng hóa.',
    transit_info: '3-5 ngày làm việc',
  },
  {
    slug: 'gui-bang-hieu-di-my',
    name: 'Gửi bảng hiệu đi Mỹ',
    country: 'Mỹ',
    description: 'Vận chuyển bảng hiệu quảng cáo an toàn, đóng gói chuẩn quốc tế tránh hư hỏng.',
    transit_info: '5-7 ngày làm việc',
  },
  {
    slug: 'gui-an-pham-in-an-di-my',
    name: 'Gửi ấn phẩm in ấn đi Mỹ',
    country: 'Mỹ',
    description: 'Vận chuyển menu, brochure, card visit với số lượng lớn, giá cước ưu đãi.',
    transit_info: '3-5 ngày làm việc',
  },
  {
    slug: 'gui-hang-di-canada',
    name: 'Gửi hàng đi Canada',
    country: 'Canada',
    description: 'Vận chuyển hàng hóa đi Canada uy tín, hỗ trợ thủ tục hải quan trọn gói.',
    transit_info: '5-7 ngày làm việc',
  },
  {
    slug: 'gui-hang-di-chau-au',
    name: 'Gửi hàng đi Châu Âu',
    country: 'Châu Âu',
    description: 'Vận chuyển chuyên tuyến đến các nước Châu Âu (Đức, Pháp, Anh...) với cước phí cạnh tranh.',
    transit_info: '7-10 ngày làm việc',
  },
  {
    slug: 'gui-hang-di-uc',
    name: 'Gửi hàng đi Úc',
    country: 'Úc',
    description: 'Dịch vụ vận chuyển đi Úc đa dạng mặt hàng, thời gian nhanh chóng.',
    transit_info: '4-6 ngày làm việc',
  },
  {
    slug: 'gui-hang-di-duc',
    name: 'Gửi hàng đi Đức',
    country: 'Đức',
    description: 'Dịch vụ vận chuyển đi Đức an toàn, nhanh chóng.',
    transit_info: '6-8 ngày làm việc',
  }
];

export const shippingRoutes: StaticShippingRoute[] = BASE_SHIPPING_ROUTES.map(route => ({ ...route, ...shippingGuides[route.slug] }));

export const projects: StaticProject[] = [];

export const blogCategories: StaticBlogCategory[] = [
  { id: '1', slug: 'van-chuyen', name: 'Vận chuyển' },
  { id: '2', slug: 'bang-hieu-in-an', name: 'Bảng hiệu & In ấn' },
  { id: '3', slug: 'nail-spa', name: 'Nail & Spa' },
  { id: '4', slug: 'restaurant-fnb', name: 'Restaurant & F&B' }
];

const BASE_BLOG_POSTS: StaticBlogPost[] = [
  {
    slug: 'kinh-nghiem-dong-goi-gui-hang-di-my',
    title: 'Kinh nghiệm đóng gói gửi hàng đi Mỹ an toàn',
    excerpt: 'Hướng dẫn chi tiết cách đóng gói các loại hàng hóa từ dễ vỡ đến cồng kềnh.',
    category_id: '1',
    category_name: 'Vận chuyển',
    published_at: '2026-09-01T00:00:00Z',
    cover_image_url: '/images/section_provided_1.jpg',
    content: '<h2>Quy cách đóng gói</h2><p>Đóng gói cẩn thận giúp giảm thiểu rủi ro hư hỏng hàng hóa.</p>'
  },
  {
    slug: 'thu-tuc-hai-quan-gui-hang-di-uc',
    title: 'Thủ tục hải quan khi gửi hàng đi Úc cần biết',
    excerpt: 'Tổng hợp các quy định và thủ tục hải quan để kiện hàng được thông quan nhanh chóng.',
    category_id: '1',
    category_name: 'Vận chuyển',
    published_at: '2026-09-05T00:00:00Z',
    cover_image_url: '/images/reference/market-australia_tam.webp',
    content: '<h2>Thủ tục cần thiết</h2><p>Khai báo hải quan chính xác giúp hàng hóa đi nhanh hơn.</p>'
  },
  {
    slug: 'xu-huong-thiet-ke-bang-hieu-2026',
    title: 'Xu hướng thiết kế bảng hiệu nổi bật năm 2026',
    excerpt: 'Cập nhật các mẫu bảng hiệu mới nhất, thu hút khách hàng cho doanh nghiệp của bạn.',
    category_id: '2',
    category_name: 'Bảng hiệu & In ấn',
    published_at: '2026-09-10T00:00:00Z',
    cover_image_url: '/images/section_provided_3.jpg',
    content: '<h2>Mẫu bảng hiệu hot</h2><p>Bảng hiệu LED neon sign đang lên ngôi.</p>'
  },
  {
    slug: 'chon-chat-lieu-in-menu-nha-hang',
    title: 'Cách chọn chất liệu in menu chống nước cho nhà hàng',
    excerpt: 'Bí quyết chọn giấy và chất liệu in ấn menu bền đẹp, dễ lau chùi.',
    category_id: '2',
    category_name: 'Bảng hiệu & In ấn',
    published_at: '2026-08-20T00:00:00Z',
    cover_image_url: '/images/products/prod_menu.jpg',
    content: '<h2>Nhựa PVC</h2><p>Menu nhựa PVC chống nước tuyệt đối.</p>'
  },
  {
    slug: 'y-tuong-trang-tri-tiem-nail',
    title: 'Ý tưởng trang trí tiệm Nail thu hút khách hàng',
    excerpt: 'Các phong cách trang trí nội thất tiệm Nail đang thịnh hành tại Mỹ.',
    category_id: '3',
    category_name: 'Nail & Spa',
    published_at: '2026-08-15T00:00:00Z',
    cover_image_url: '/images/solutions/sol_nail_spa.jpg',
    content: '<h2>Trang trí không gian</h2><p>Không gian mở và cây xanh.</p>'
  },
  {
    slug: 'chien-luoc-marketing-cho-nha-hang-viet',
    title: 'Chiến lược marketing hiệu quả cho nhà hàng Việt tại nước ngoài',
    excerpt: 'Cách thu hút khách hàng địa phương bằng nhận diện thương hiệu chuyên nghiệp.',
    category_id: '4',
    category_name: 'Restaurant & F&B',
    published_at: '2026-08-10T00:00:00Z',
    cover_image_url: '/images/solutions/sol_restaurant_fnb.jpg',
    content: '<h2>Nhận diện thương hiệu</h2><p>Đồng bộ từ bảng hiệu đến menu, đồng phục.</p>'
  }
];

export const blogPosts: StaticBlogPost[] = BASE_BLOG_POSTS.map(post => ({ ...post, ...blogGuides[post.slug] }));

const BASE_CATEGORIES: StaticCategory[] = [
  { 
    id: 'cat-noi-that',
    slug: 'noi-that-theo-concept', 
    name: 'Nội thất theo Concept', 
    parent_id: null,
    sort_order: 1,
    image_url: '/images/solutions/sol_retail.jpg',
    description: 'Sản xuất nội thất theo concept: Quầy lễ tân, bàn ghế, tủ kệ quầy bar cho tiệm Nail, Spa, Nhà hàng tại Mỹ và quốc tế.'
  },
  { 
    id: 'cat-bang-hieu',
    slug: 'bang-hieu-nhan-dien', 
    name: 'Bảng hiệu & Nhận diện', 
    parent_id: null,
    sort_order: 2,
    image_url: '/images/hero/hero_showcase.jpg',
    description: 'Bảng hiệu mặt tiền Storefront, Logo Wall vách lễ tân, Hộp đèn LED Lightbox, Decal kính và chữ nổi phát sáng cao cấp.'
  },
  { 
    id: 'cat-an-pham',
    slug: 'an-pham-bao-bi', 
    name: 'Ấn phẩm & Bao bì', 
    parent_id: null,
    sort_order: 3,
    image_url: '/images/products/packaging/bags_hero.jpg',
    description: 'Thiết kế và in ấn trọn bộ ấn phẩm kinh doanh: Business Card, Gift Card, Menu, Flyer, Sticker decal và Túi giấy bao bì đóng gói.'
  },
  { 
    id: 'cat-decor',
    slug: 'decor-trung-bay', 
    name: 'Decor & Trưng bày', 
    parent_id: null,
    sort_order: 4,
    image_url: '/images/solutions/sol_nail_spa.jpg',
    description: 'Vật phẩm trang trí không gian, POSM, kệ trưng bày sản phẩm, backdrop check-in tạo điểm nhấn thương hiệu thu hút khách hàng.'
  },
  { 
    id: 'cat-thiet-bi',
    slug: 'thiet-bi-vat-dung', 
    name: 'Thiết bị & Vật dụng', 
    parent_id: null,
    sort_order: 5,
    image_url: '/images/solutions/sol_restaurant_fnb.jpg',
    description: 'Cung ứng thiết bị, dụng cụ chuyên ngành F&B, Nail, Spa chuẩn chất lượng, đóng thùng carton/kiện gỗ gửi hàng tận nơi.'
  }
]; 
export const STATIC_CATEGORIES = BASE_CATEGORIES.map(category => ({ ...category, description: categoryGuides[category.slug] || category.description }));

const BASE_PRODUCTS: StaticProduct[] = [
  { slug: 'business-card', name: 'Business Card', category_slug: 'an-pham-bao-bi', category_id: 'cat-an-pham',
    short_description: 'Thiết kế và in business card dành cho tiệm nail, spa, nhà hàng, café, boba, tiệm bánh và doanh nghiệp tại Mỹ. Thông tin được trình bày gọn gàng, đồng bộ với hình ảnh thương hiệu và thuận tiện để khách hàng lưu lại.',
    description: `BUSINESS CARD – DANH THIẾP
Thiết kế và in business card dành cho tiệm nail, spa, nhà hàng, café, boba, tiệm bánh và doanh nghiệp tại Mỹ. Thông tin được trình bày gọn gàng, đồng bộ với hình ảnh thương hiệu và thuận tiện để khách hàng lưu lại.
Chất liệu tham khảo: Giấy Couche, Bristol, Ivory hoặc giấy mỹ thuật; có thể cán mờ, cán bóng theo nhu cầu.
Kích thước tiêu chuẩn tại Mỹ: 3.5 × 2 inch, tương đương khoảng 89 × 51 mm.`,
    seo_title: 'Business Card – Thiết Kế, In Danh Thiếp Và Gửi Đi Mỹ',
    seo_description: 'Thiết kế và in business card kích thước chuẩn Mỹ dành cho tiệm nail, spa, nhà hàng và doanh nghiệp. Hỗ trợ hoàn thiện, đóng gói và gửi từ Việt Nam.',
    images: ['/images/products/prod_the_phieu.jpg', '/images/products/prod_bo_an_pham.jpg'],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: false }
  },
  { slug: 'gift-card', name: 'Gift Card', category_slug: 'an-pham-bao-bi', category_id: 'cat-an-pham',
    short_description: 'GIFT CARD & VOUCHER',
    description: `GIFT CARD & VOUCHER
Thiết kế và in gift card, gift certificate và phiếu quà tặng dành cho tiệm nail, spa, nhà hàng, café, boba, tiệm bánh và doanh nghiệp tại Mỹ. Có thể sử dụng mệnh giá cố định, số tiền tùy chọn hoặc một dịch vụ cụ thể.
Chất liệu tham khảo: Giấy Couche, Bristol, Ivory hoặc giấy mỹ thuật; có thể cán mờ, cán bóng theo nhu cầu.
Kích thước phổ biến: Gift card 3.5 × 2 inch; voucher 4 × 6 inch, 3.5 × 8.5 inch hoặc thiết kế theo yêu cầu.`,
    seo_title: 'Gift Card & Voucher – Thiết Kế, In Và Gửi Đi Mỹ',
    seo_description: 'Thiết kế và in gift card, gift certificate, phiếu quà tặng dành cho tiệm nail, spa, nhà hàng tại Mỹ. Hỗ trợ đóng gói và gửi từ Việt Nam.',
    images: ['/images/products/prod_the_phieu.jpg', '/images/products/prod_bo_an_pham.jpg'],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: false }
  },
  { slug: 'voucher', name: 'Voucher', category_slug: 'an-pham-bao-bi', category_id: 'cat-an-pham',
    short_description: 'GIFT CARD & VOUCHER',
    description: `GIFT CARD & VOUCHER
Thiết kế và in gift card, gift certificate và phiếu quà tặng dành cho tiệm nail, spa, nhà hàng, café, boba, tiệm bánh và doanh nghiệp tại Mỹ. Có thể sử dụng mệnh giá cố định, số tiền tùy chọn hoặc một dịch vụ cụ thể.
Chất liệu tham khảo: Giấy Couche, Bristol, Ivory hoặc giấy mỹ thuật; có thể cán mờ, cán bóng theo nhu cầu.
Kích thước phổ biến: Gift card 3.5 × 2 inch; voucher 4 × 6 inch, 3.5 × 8.5 inch hoặc thiết kế theo yêu cầu.`,
    seo_title: 'Gift Card & Voucher – Thiết Kế, In Và Gửi Đi Mỹ',
    seo_description: 'Thiết kế và in gift card, gift certificate, phiếu quà tặng dành cho tiệm nail, spa, nhà hàng tại Mỹ. Hỗ trợ đóng gói và gửi từ Việt Nam.',
    images: ['/images/products/prod_the_phieu.jpg', '/images/section_provided_3.jpg'],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: false }
  },
  { slug: 'loyalty-card', name: 'Loyalty Card', category_slug: 'an-pham-bao-bi', category_id: 'cat-an-pham',
    short_description: 'LOYALTY CARD – THẺ TÍCH ĐIỂM',
    description: `LOYALTY CARD – THẺ TÍCH ĐIỂM
Thiết kế và in thẻ tích điểm dành cho tiệm nail, spa, nhà hàng, café, boba, tiệm bánh và cửa hàng tại Mỹ. Phù hợp với chương trình tích lượt mua, đóng dấu và tặng ưu đãi để khuyến khích khách quay lại.
Chất liệu tham khảo: Giấy Couche, Bristol, Ivory hoặc giấy mỹ thuật; có thể cán mờ, cán bóng theo nhu cầu.
Kích thước phổ biến: 3.5 × 2 inch hoặc dạng gấp 3.5 × 4 inch trước khi gấp.`,
    seo_title: 'Loyalty Card – Thiết Kế, In Thẻ Tích Điểm Và Gửi Đi Mỹ',
    seo_description: 'Thiết kế và in loyalty card, thẻ tích điểm dành cho tiệm nail, spa, nhà hàng, café và tiệm bánh tại Mỹ. Hỗ trợ đóng gói, gửi từ Việt Nam.',
    images: ['/images/products/prod_the_phieu.jpg', '/images/products/prod_bo_an_pham.jpg'],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: false }
  },
  { slug: 'appointment-card', name: 'Appointment Card', category_slug: 'an-pham-bao-bi', category_id: 'cat-an-pham',
    short_description: 'Thiết kế và in thẻ hẹn (Appointment Card) chuyên nghiệp cho tiệm Nail, Spa & Thẩm mỹ viện tại Mỹ. Giúp quản lý lịch hẹn chu đáo và nhắc nhớ khách hàng.',
    description: `APPOINTMENT CARD – THẺ HẸN DỊCH VỤ

Thẻ hẹn (Appointment Card) là ấn phẩm quan trọng giúp các tiệm Nail, Salon, Spa và phòng khám tại Mỹ quản lý lịch trình dịch vụ chu đáo, đồng thời là lời nhắc chuyên nghiệp giúp khách hàng không bị lỡ hẹn.

ĐẶC ĐIỂM SẢN PHẨM:
• Mặt trước: In logo thương hiệu, tên tiệm, số điện thoại hotline, địa chỉ, website hoặc mã QR quét đặt lịch online.
• Mặt sau: Bảng kẻ ô rõ ràng để ghi tên khách, ngày hẹn, giờ hẹn, tên thợ / chuyên viên phục vụ (Technician) và lưu ý đặc biệt.
• Chất liệu giấy cao cấp: Giấy Fort, Offset hoặc giấy mỹ thuật thấm mực cực tốt, không bị lem nhòe khi dùng bút bi hoặc bút mực viết tay, có thể đóng dấu mộc sắc nét.
• Kích thước chuẩn Mỹ: 3.5 × 2 inch (dạng thẻ đơn tiêu chuẩn bỏ vừa ví) hoặc 3.5 × 4 inch (dạng gấp đôi mở ra tiện ghi chú nhiều dịch vụ).
• Hoàn thiện: Cán mờ bảo vệ chống trầy xước, cấn đường gấp sắc sảo, bo góc thẩm mỹ theo yêu cầu.

Hamburg Connect hỗ trợ thiết kế đồng bộ với hệ thống Business Card, Gift Card, Loyalty Card và bảng giá Menu của tiệm, đóng gói an toàn và vận chuyển tận nơi sang Mỹ.`,
    seo_title: 'Appointment Card – Thiết Kế & In Thẻ Hẹn Tiệm Nail, Spa Gửi Đi Mỹ',
    seo_description: 'In ấn Appointment Card kích thước chuẩn Mỹ 3.5x2 in cho tiệm Nail, Spa. Dễ ghi chép, đóng dấu, giấy cao cấp, giao hàng tận nơi door-to-door.',
    images: ['/images/products/prod_the_phieu.jpg', '/images/products/prod_bo_an_pham.jpg'],
    industry_links: { nail_spa: true, restaurant_fnb: false, retail_shop: false, wedding_event: false }
  },
  { slug: 'flyer', name: 'Flyer', category_slug: 'an-pham-bao-bi', category_id: 'cat-an-pham',
    short_description: 'Thiết kế và in flyer một mặt hoặc hai mặt, phù hợp để quảng bá khai trương, ưu đãi, dịch vụ và những chương trình nổi bật của thương hiệu.',
    description: `TÊN SẢN PHẨM:
Flyer
MÔ TẢ NGẮN:
Thiết kế và in flyer một mặt hoặc hai mặt, phù hợp để quảng bá khai trương, ưu đãi, dịch vụ và những chương trình nổi bật của thương hiệu.
CHẤT LIỆU:
Giấy Couche C150–C200 gsm; có thể cán mờ, cán bóng hoặc sử dụng giấy mỹ thuật theo yêu cầu.
KÍCH THƯỚC PHỔ BIẾN:
4 × 6 inch (102 × 152 mm)
5 × 7 inch (127 × 178 mm)
5.5 × 8.5 inch (140 × 216 mm)
8.5 × 11 inch – US Letter (216 × 279 mm)
Nhận thiết kế và in theo kích thước yêu cầu`,
    seo_title: 'Flyer Quảng Cáo – Thiết Kế, In Và Gửi Đi Mỹ',
    seo_description: 'Thiết kế và in flyer một mặt, hai mặt cho tiệm nail, spa, nhà hàng và cửa hàng tại Mỹ; hỗ trợ hoàn thiện và gửi từ Việt Nam.',
    images: ['/images/products/prod_flyer_poster.jpg', '/images/products/poster/3d5ba0e6-c1a4-4e62-9807-a7fbeac260c2.png'],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: true }
  },
  { slug: 'brochure', name: 'Brochure', category_slug: 'an-pham-bao-bi', category_id: 'cat-an-pham',
    short_description: 'Brochure giúp anh/chị giới thiệu thương hiệu, dịch vụ và những thông tin quan trọng trong một ấn phẩm gọn gàng, dễ xem. Tùy theo lượng nội dung và mục đích sử dụng, anh/chị có thể lựa chọn brochure gấp đôi, gấp ba hoặc dạng cuốn.',
    description: `# Brochure gấp – Thiết kế, in và gửi đi Mỹ

Brochure giúp anh/chị giới thiệu thương hiệu, dịch vụ và những thông tin quan trọng trong một ấn phẩm gọn gàng, dễ xem. Tùy theo lượng nội dung và mục đích sử dụng, anh/chị có thể lựa chọn brochure gấp đôi, gấp ba hoặc dạng cuốn.

Hamburg Connect hỗ trợ thiết kế, in ấn, hoàn thiện và gửi brochure từ Việt Nam đến địa chỉ nhận hàng tại Mỹ.

**[Nút: Gửi yêu cầu thiết kế và in brochure]**

## Brochure gấp là gì?

Brochure là ấn phẩm dùng để giới thiệu thương hiệu, sản phẩm, dịch vụ hoặc chương trình kinh doanh. So với flyer, brochure có nhiều không gian hơn để sắp xếp nội dung thành từng phần rõ ràng.

Brochure có thể được sử dụng tại quầy lễ tân, khu vực chờ, trong ngày khai trương, tại sự kiện hoặc gửi kèm đơn hàng.

Một mẫu brochure được thiết kế phù hợp có thể giúp anh/chị:

## Các loại brochure phổ biến

### Brochure gấp đôi

Brochure gấp đôi được gấp một lần và tạo thành bốn mặt trình bày. Kiểu này phù hợp khi nội dung ở mức vừa phải, chẳng hạn như giới thiệu thương hiệu, dịch vụ nổi bật, hình ảnh và thông tin liên hệ.

Bố cục gấp đôi thoáng, rõ ràng và phù hợp với nhiều phong cách thiết kế.

### Brochure gấp ba

Brochure gấp ba gồm sáu mặt, giúp chia nội dung thành nhiều nhóm nhỏ. Mỗi mặt có thể trình bày một nội dung riêng như giới thiệu, dịch vụ, ưu đãi, hình ảnh, địa chỉ hoặc mã QR.

Đây là lựa chọn phù hợp với tiệm nail, spa, nhà hàng, quán cà phê, tiệm bánh và các mô hình kinh doanh dịch vụ.

### Brochure gấp chữ Z

Brochure gấp chữ Z cũng có sáu mặt nhưng được mở theo dạng nối tiếp. Kiểu gấp này phù hợp với nội dung cần trình bày theo từng bước, quy trình hoặc chuỗi dịch vụ.

### Brochure dạng cuốn

Brochure dạng cuốn, hay booklet, gồm nhiều trang và phù hợp khi anh/chị cần giới thiệu nhiều dịch vụ, hình ảnh hoặc thông tin chi tiết.

Tiệm nail và spa có thể dùng dạng cuốn để trình bày các nhóm dịch vụ chăm sóc. Nhà hàng có thể giới thiệu câu chuyện thương hiệu, món ăn nổi bật, dịch vụ tiệc hoặc chương trình dành cho khách hàng.

## Brochure phù hợp với những ngành nào?

Brochure có thể được thiết kế theo đặc điểm của từng mô hình kinh doanh:

* **Tiệm nail, spa và beauty salon:** giới thiệu dịch vụ, bảng giá, liệu trình và chương trình thành viên.
* **Nhà hàng, café, boba và tiệm bánh:** giới thiệu món nổi bật, dịch vụ catering, câu chuyện thương hiệu hoặc chương trình khai trương.
* **Cửa hàng bán lẻ và doanh nghiệp nhỏ:** giới thiệu sản phẩm, dịch vụ, ưu đãi và thông tin liên hệ.
* **Cưới hỏi và sự kiện:** giới thiệu gói dịch vụ, không gian, quy trình tổ chức và thông tin đặt lịch.

## Anh/chị cần chuẩn bị những gì?

Để thiết kế brochure đúng với nhu cầu sử dụng, anh/chị có thể gửi:

* Logo và màu sắc thương hiệu
* Nội dung cần trình bày
* Hình ảnh sản phẩm, dịch vụ hoặc không gian
* Thông tin liên hệ và mã QR
* Kiểu brochure mong muốn
* Số lượng dự kiến
* Địa chỉ nhận hàng tại Mỹ

Nếu nội dung chưa được sắp xếp hoàn chỉnh, Hamburg Connect có thể hỗ trợ tư vấn cách chia thông tin cho từng mặt brochure.

## Thiết kế và in brochure tại Việt Nam gửi đi Mỹ

Brochure có thể được thiết kế đồng bộ với business card, flyer, menu, gift card, loyalty card, sticker và các sản phẩm bao bì của thương hiệu.

Sau khi hoàn thiện, các sản phẩm có thể được kiểm tra, đóng gói và gửi chung đến địa chỉ của anh/chị tại Mỹ. Phương án in, chất liệu, số lượng và vận chuyển sẽ được tư vấn dựa trên nhu cầu thực tế.

Nếu anh/chị đang chuẩn bị khai trương, làm mới hình ảnh thương hiệu hoặc cần một tài liệu giới thiệu dịch vụ gọn gàng, hãy gửi logo, nội dung và số lượng dự kiến để Hamburg Connect hỗ trợ tư vấn.

**[Nút: Gửi yêu cầu]**
**[Nút phụ: Xem dịch vụ thiết kế và in ấn]**`,
    seo_title: 'Brochure Gấp – Thiết Kế, In Và Gửi Đi Mỹ',
    seo_description: 'Thiết kế và in brochure gấp đôi, gấp ba, dạng cuốn cho tiệm nail, spa, nhà hàng tại Mỹ; hỗ trợ hoàn thiện và gửi từ Việt Nam.',
    images: ["/images/products/brochure/Brochure-dang-cuon-trang-trong.png", "/images/products/brochure/Brochure-gap-3-trai-phang.png", "/images/products/brochure/Brochure-gap-chu-Z.png", "/images/products/brochure/Brochure-gap-doi.png", "/images/products/brochure/Tong-hop-cac-loai-brochure.png"],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: true }
  },
  { slug: 'poster', name: 'Poster', category_slug: 'an-pham-bao-bi', category_id: 'cat-an-pham',
    short_description: 'Thiết kế và in poster quảng cáo, khai trương, khuyến mãi hoặc giới thiệu dịch vụ, phù hợp để trưng bày tại cửa hàng, khu vực lễ tân và sự kiện.',
    description: `TÊN SẢN PHẨM:
Poster
MÔ TẢ NGẮN:
Thiết kế và in poster quảng cáo, khai trương, khuyến mãi hoặc giới thiệu dịch vụ, phù hợp để trưng bày tại cửa hàng, khu vực lễ tân và sự kiện.
CHẤT LIỆU:
Giấy Couche C150–C250 gsm hoặc chất liệu PP tổng hợp; có thể cán mờ, cán bóng và hoàn thiện theo nhu cầu sử dụng.
KÍCH THƯỚC PHỔ BIẾN:
11 × 17 inch (279 × 432 mm)
18 × 24 inch (457 × 610 mm)
24 × 36 inch (610 × 914 mm)
Nhận thiết kế và in theo kích thước yêu cầu`,
    seo_title: 'Poster Quảng Cáo – Thiết Kế, In Và Gửi Đi Mỹ',
    seo_description: 'Thiết kế và in poster quảng cáo, khai trương, khuyến mãi cho tiệm nail, spa, nhà hàng tại Mỹ; hỗ trợ hoàn thiện và gửi từ Việt Nam.',
    images: ["/images/products/poster/3d5ba0e6-c1a4-4e62-9807-a7fbeac260c2.png", "/images/products/poster/6c52bc9a-5abc-40f5-9e39-74d45f34c2b5.png", "/images/products/poster/a91467ec-6159-4ffa-a3f6-8cef49fa3508.png", "/images/products/poster/db41bc12-9b93-46c0-b000-e78d12005f78.png"],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: true }
  },
  { slug: 'menu', name: 'Menu', category_slug: 'an-pham-bao-bi', category_id: 'cat-an-pham',
    short_description: 'Thiết kế và in menu 1 tờ, menu gấp, menu dạng cuốn dành cho nhà hàng, quán ăn, café, boba, tiệm bánh, nail và spa.',
    description: `MENU IN ẤN
Thiết kế và in menu 1 tờ, menu gấp, menu dạng cuốn dành cho nhà hàng, quán ăn, café, boba, tiệm bánh, nail và spa. Bố cục được sắp xếp rõ ràng theo từng nhóm món hoặc dịch vụ, thuận tiện cho khách hàng lựa chọn.
Chất liệu tham khảo: Giấy Couche, Bristol, giấy mỹ thuật hoặc giấy chống nước; có thể cán mờ, cán bóng để tăng độ bền.
Kích thước phổ biến: 5.5 × 8.5 inch, 8.5 × 11 inch, 11 × 17 inch hoặc thiết kế theo yêu cầu.`,
    seo_title: 'Menu In Ấn – Menu 1 Tờ, Menu Gấp Và Menu Dạng Cuốn',
    seo_description: 'Thiết kế và in menu 1 tờ, menu gấp, menu dạng cuốn dành cho nhà hàng, café, boba, nail và spa tại Mỹ. Hỗ trợ đóng gói, gửi từ Việt Nam.',
    images: ['/images/products/prod_menu.jpg', '/images/products/prod_bo_an_pham.jpg'],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: false, wedding_event: false }
  },
  { slug: 'sticker-label', name: 'Sticker & Label', category_slug: 'an-pham-bao-bi', category_id: 'cat-an-pham',
    short_description: 'Thiết kế và in sticker logo, tem nhãn cuộn bế hình, decal dán ly boba trà sữa, tem niêm phong và nhãn dán bao bì chống nước tuyệt đối 100%.',
    description: `STICKER & TEM NHÃN DECAL THƯƠNG HIỆU

Sticker và tem nhãn là giải pháp nhận diện nhanh chóng, linh hoạt và chi phí tối ưu dành cho các quán trà sữa, tiệm café, nhà hàng, tiệm bánh, tiệm nail và các shop bán lẻ tại Mỹ.

CÁC LOẠI TEM NHÃN PHỔ BIẾN:
• Decal nhựa sữa (White Vinyl): Chống nước 100%, dẻo dai khó rách, chịu được nhiệt độ lạnh trong tủ đông hoặc đá viên. Chuyên dùng dán ly trà sữa, cốc cà phê, chai lọ đồ uống.
• Decal trong suốt (Clear Vinyl): Nhìn thấu xuyên qua chai lọ thủy tinh/nhựa trong, tạo vẻ đẹp tối giản và tinh tế.
• Decal giấy Kraft nâu: Phong cách mộc mạc, vintage tự nhiên, rất thích hợp cho tiệm bánh handmade, đồ hữu cơ eco-friendly.
• Decal xi bạc / nhũ vàng: Tăng tính cao cấp cho mỹ phẩm, sản phẩm quà tặng hoặc tem bảo hành, tem niêm phong hộp.

QUY CÁCH GIA CÔNG:
• Bế demi thành phẩm từng con dễ bóc dán (dạng tờ) hoặc bế cuộn tròn (Roll Labels) phục vụ máy dán tem nhãn tự động.
• Cắt laser theo mọi hình dáng tự do: hình tròn, elip, chữ nhật bo góc hoặc cắt lượn sóng viền theo hình logo.
• Mực in UV ngoài trời bền màu, kháng nước, kháng dầu mỡ, không phai màu trong quá trình sử dụng.

Hamburg Connect nhận in theo mọi kích thước và số lượng, đóng thùng chống ẩm gửi hỏa tốc sang Mỹ và Canada.`,
    seo_title: 'Sticker & Tem Nhãn Decal – In Tem Dán Ly Trà Sữa, Bao Bì Gửi Đi Mỹ',
    seo_description: 'In ấn sticker vinyl chống nước, tem dán ly trà sữa, tem nhãn bao bì sản phẩm cho nhà hàng, quán cafe, tiệm nail tại Mỹ. Giá xưởng, gửi nhanh.',
    images: ['/images/products/prod_sticker_decal.jpg'],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: false }
  },
  { slug: 'packaging', name: 'Packaging', category_slug: 'an-pham-bao-bi', category_id: 'cat-an-pham',
    short_description: 'Thiết kế và in túi giấy, hộp giấy, bao bì thực phẩm, giấy gói và các sản phẩm đóng gói đồng bộ với hình ảnh thương hiệu.',
    description: `TÊN SẢN PHẨM:
Bao bì thương hiệu
MÔ TẢ NGẮN:
Thiết kế và in túi giấy, hộp giấy, bao bì thực phẩm, giấy gói và các sản phẩm đóng gói đồng bộ với hình ảnh thương hiệu.
CHẤT LIỆU:
Giấy Kraft, Ivory, Duplex, giấy Couche, giấy mỹ thuật và giấy gói thực phẩm. Có thể cán mờ, cán bóng, ép kim hoặc hoàn thiện theo yêu cầu.
KÍCH THƯỚC:
Thiết kế theo kích thước sản phẩm thực tế. Túi giấy và hộp có thể được hoàn thiện hoặc giao dạng phẳng để thuận tiện khi đóng gói và vận chuyển.`,
    seo_title: 'Bao Bì Thương Hiệu – Thiết Kế, In Và Gửi Đi Mỹ',
    seo_description: 'Thiết kế và in túi giấy, hộp giấy, bao bì thực phẩm theo thương hiệu cho tiệm bánh, nhà hàng và cửa hàng tại Mỹ; hỗ trợ gửi từ Việt Nam.',
    images: ['/images/products/packaging/bags_hero.jpg', '/images/products/packaging/thumb_1.jpg', '/images/products/packaging/thumb_2.jpg', '/images/products/packaging/thumb_3.jpg', '/images/products/packaging/thumb_4.jpg'],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: true }
  },
  { slug: 'bo-an-pham-thuong-hieu', name: 'Bộ ấn phẩm thương hiệu', category_slug: 'an-pham-bao-bi', category_id: 'cat-an-pham',
    short_description: 'Thiết kế và in đồng bộ business card, flyer, brochure, menu, gift card, loyalty card, sticker và bao bì theo hình ảnh riêng của từng thương hiệu.',
    description: `TÊN SẢN PHẨM:
Bộ ấn phẩm thương hiệu
MÔ TẢ NGẮN:
Thiết kế và in đồng bộ business card, flyer, brochure, menu, gift card, loyalty card, sticker và bao bì theo hình ảnh riêng của từng thương hiệu.
CHẤT LIỆU:
Chất liệu được lựa chọn theo từng sản phẩm trong bộ, gồm giấy Couche, Bristol, Ivory, Kraft, giấy mỹ thuật, decal giấy hoặc decal nhựa. Có thể cán mờ, cán bóng, ép kim và hoàn thiện theo yêu cầu.
KÍCH THƯỚC:
Thiết kế theo kích thước tiêu chuẩn tại Mỹ hoặc tùy chỉnh theo nhu cầu sử dụng của từng sản phẩm.`,
    seo_title: 'Bộ Ấn Phẩm Thương Hiệu – Thiết Kế, In Và Gửi Đi Mỹ',
    seo_description: 'Thiết kế và in bộ ấn phẩm thương hiệu đồng bộ cho tiệm nail, spa, nhà hàng và cửa hàng tại Mỹ; hỗ trợ hoàn thiện và gửi từ Việt Nam.',
    images: ['/images/products/prod_bo_an_pham.jpg', '/images/section_provided_3.jpg'],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: true }
  },
  { slug: 'thiep-cuoi-an-pham-su-kien', name: 'Thiệp cưới & Sự kiện', category_slug: 'an-pham-bao-bi', category_id: 'cat-an-pham',
    short_description: 'Thiết kế và in thiệp cưới song ngữ Việt – Anh, thư mời khai trương dạ tiệc VIP, menu bàn tiệc, place card và bộ ấn phẩm sự kiện cao cấp ép kim viền xé nghệ thuật.',
    description: `THIỆP CƯỚI & ẤN PHẨM SỰ KIỆN SONG NGỮ

Thiệp cưới và thiệp mời sự kiện là lời chào đầu tiên trang trọng gửi tới quan khách. Một bộ thiệp được thiết kế tỉ mỉ sẽ thể hiện trọn vẹn chủ đề, phong cách và đẳng cấp của ngày vui hoặc sự kiện trọng đại.

BỘ ẤN PHẨM CƯỚI HỎI & SỰ KIỆN GỒM:
• Thiệp cưới chính & Phong bì đồng bộ: Thiết kế song ngữ Việt – Anh chuẩn văn phong, in trên giấy mỹ thuật cao cấp nhập khẩu.
• Thẻ RSVP & Thẻ thông tin (Details Card): Hướng dẫn địa điểm, chương trình, mã QR bản đồ Google Maps và hướng dẫn dress code.
• Ấn phẩm bàn tiệc: Menu bàn tiệc cá nhân hóa, thẻ tên khách mời (Place Cards), số bàn (Table Numbers) cắt laser sắc sảo.
• Sự kiện & Khai trương: Thư mời dạ tiệc VIP, Backdrop check-in, Standee chào mừng (Welcome Sign), Tag treo quà cảm ơn (Thank You Tags).

KỸ THUẬT GIA CÔNG TINH XẢO:
• Ép kim foil ánh kim (Vàng Gold, Vàng hồng Rose Gold, Bạc Silver) sáng bóng, sắc nét.
• Dập nổi (Embossing) hoặc dập chìm (Debossing) logo, họa tiết monogram tên cô dâu chú rể.
• Viền xé thủ công (Deckled Edge) mang phong cách cổ điển lãng mạn châu Âu.
• Đóng dấu sáp niêm phong (Wax Seal) thủ công theo con dấu logo riêng.

Hamburg Connect đóng gói cẩn thận bọc chống sốc từng góc kiện và gửi bay hỏa tốc 3–5 ngày sang Mỹ, Canada & Châu Âu.`,
    seo_title: 'Thiệp Cưới & Ấn Phẩm Sự Kiện Song Ngữ – Thiết Kế, In Và Gửi Đi Mỹ',
    seo_description: 'Thiết kế in ấn thiệp cưới song ngữ, thư mời dạ tiệc, menu bàn tiệc, thẻ tên khách mời cao cấp gửi đi Mỹ, Canada & Châu Âu.',
    images: ['/images/products/prod_thiep_su_kien.jpg'],
    industry_links: { nail_spa: false, restaurant_fnb: false, retail_shop: false, wedding_event: true }
  },
  { slug: 'bang-hieu-mat-tien', name: 'Bảng hiệu mặt tiền', category_slug: 'bang-hieu-nhan-dien', category_id: 'cat-bang-hieu',
    short_description: 'Sản xuất bảng hiệu mặt tiền Storefront chữ nổi 3D Mica hút nổi, Inox mạ vàng hắt sáng LED, bảng vẫy 2 mặt đạt chuẩn nguồn điện 110V thị trường Mỹ.',
    description: `BẢNG HIỆU MẶT TIỀN STOREFRONT CHO DOANH NGHIỆP TẠI MỸ

Bảng hiệu mặt tiền (Storefront Signage) là bộ mặt của thương hiệu, yếu tố đầu tiên thu hút ánh nhìn của khách hàng từ ngoài phố và quyết định ấn tượng chuyên nghiệp của tiệm.

CÁC HÌNH THỨC BẢNG HIỆU TIÊU BIỂU:
• Chữ nổi Mica hút nổi đèn LED: Mặt mica acrylic đúc màu cao cấp xuyên sáng rực rỡ, hông nhôm hoặc viền inox chống gỉ sét, đèn LED module siêu sáng tiết kiệm điện.
• Chữ Inox mạ vàng gương hắt sáng chân (Halo-Lit Letters): Mặt inox vàng/bạc/đen xước sang trọng, hắt ánh sáng dịu phía sau chân chữ tạo chiều sâu đẳng cấp.
• Bảng vẫy hộp đèn tròn 2 mặt: Lắp vuông góc với tường mặt tiền, giúp người đi bộ và xe cộ từ 2 hướng đường dễ dàng nhận diện từ xa.
• Nguồn điện chuẩn Mỹ: Toàn bộ bảng hiệu sử dụng bộ nguồn hạ áp chuyển đổi 110V chuẩn quy định an toàn điện lực tại Hoa Kỳ và Canada (UL recognized components).

QUY CÁCH ĐÓNG GÓI & VẬN CHUYỂN:
• Đóng kiện khung gỗ hun trùng đạt chuẩn kiểm dịch xuất khẩu, chèn xốp EPS và túi bóng khí chống sốc 100%.
• Cung cấp kèm bản vẽ rập định vị 1:1 và video hướng dẫn chi tiết giúp thợ địa phương tại Mỹ dễ dàng bắt ốc và đấu nối dây điện.`,
    seo_title: 'Bảng Hiệu Mặt Tiền Storefront – Sản Xuất Tại Việt Nam Gửi Đi Mỹ',
    seo_description: 'Chuyên sản xuất bảng hiệu chữ nổi LED storefront cho tiệm Nail, Spa, Nhà hàng tại Mỹ. Nguồn điện 110V, đóng kiện gỗ an toàn, giao tận nơi.',
    images: ['/images/hero/hero_showcase.jpg', '/images/section_provided_3.jpg'],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: false }
  },
  { slug: 'logo-wall', name: 'Logo Wall', category_slug: 'bang-hieu-nhan-dien', category_id: 'cat-bang-hieu',
    short_description: 'Logo vách lễ tân (Reception Sign) chữ nổi phát sáng cao cấp cho tiệm Nail, Spa, văn phòng và nhà hàng. Tạo điểm nhấn check-in thương hiệu ấn tượng.',
    description: `LOGO WALL – BIỂN HIỆU VÁCH LỄ TÂN & RECEPTION SIGN

Vách lễ tân (Logo Wall) là điểm chạm thị giác đầu tiên khi khách bước chân vào cửa hàng, đồng thời là phông nền hoàn hảo cho khách hàng chụp ảnh check-in và chia sẻ lên mạng xã hội (Instagram, Facebook, TikTok).

CÁC MẪU THIẾT KẾ PHỔ BIẾN:
• Logo chữ nổi Inox mạ vàng hắt sáng hào quang (Back-lit Halo): Tông màu vàng gold sang trọng, ánh sáng 3000K ấm áp mang lại cảm giác thư thái, chuẩn mực cho không gian Nail & Spa cao cấp.
• Logo chữ Mica phối Neon LED: Nổi bật, trẻ trung, bắt mắt, phù hợp với quán Boba, café, tiệm bánh và nhà hàng phong cách hiện đại.
• Bảng tấm nền vân đá cẩm thạch / Lam gỗ sóng kết hợp logo chữ nổi: Tạo sự đồng bộ tổng thể nội thất không gian tiếp khách.

LẮP ĐẶT THUẬN TIỆN TẠI MỸ:
• Mỗi bộ sản phẩm gửi đi đều kèm theo bản rập định vị kích thước 1:1 bằng giấy hoặc decal rập sẵn vị trí khoan ốc.
• Sử dụng keo dán chuyên dụng hoặc chân ren ốc tàng hình bắt cố định vào tường thạch cao / vách gỗ nhanh chóng chỉ trong 30-45 phút.
• Nguồn chuyển đổi 110V an toàn tuyệt đối.`,
    seo_title: 'Logo Wall Vách Lễ Tân – Chữ Nổi Phát Sáng Cho Nail Salon, Spa Tại Mỹ',
    seo_description: 'Sản xuất logo wall lễ tân chữ nổi Mica, Inox hắt sáng LED sang trọng cho tiệm Nail, Spa tại Mỹ. Dễ lắp đặt với bản vẽ định vị rập 1:1.',
    images: ['/images/section_provided_3.jpg', '/images/solutions/sol_nail_spa.jpg'],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: true }
  },
  { slug: 'lightbox', name: 'Lightbox', category_slug: 'bang-hieu-nhan-dien', category_id: 'cat-bang-hieu',
    short_description: 'Hộp đèn LED siêu mỏng (Ultra-thin Lightbox) bật nắp, menu board điện tử treo tường hiển thị hình ảnh món ăn, dịch vụ sắc nét, tiết kiệm điện.',
    description: `HỘP ĐÈN LED SIÊU MỎNG & MENU BOARD ĐIỆN TỬ

Hộp đèn siêu mỏng (Ultra-thin Lightbox / Slim Menu Board) là thiết bị không thể thiếu cho các nhà hàng, quán trà sữa, tiệm café, tiệm nail và thẩm mỹ viện tại Mỹ để trưng bày bảng giá, món nổi bật hoặc các liệu trình dịch vụ.

ƯU ĐIỂM VƯỢT TRỘI:
• Độ dày siêu mỏng chỉ 1.5 – 2.5 cm: Thiết kế thanh lịch, viền nhôm định hình mạ anot hoặc sơn tĩnh điện sang trọng, không chiếm diện tích không gian.
• Thay đổi nội dung dễ dàng trong 30 giây: Khung nẹp bật 4 cạnh (Snap Frame) hoặc khung hít nam châm (Magnetic Frame) giúp tháo lắp và thay tấm poster mới cực kỳ thuận tiện.
• Ánh sáng LED trải đều sắc nét: Tấm dẫn sáng quang học chuyên dụng giúp hình ảnh rực rỡ, trung thực từng chi tiết món ăn, không bị chóa hoặc tối góc.
• Tiết kiệm 80% điện năng: Sử dụng thanh LED công nghệ mới tuổi thọ trên 50,000 giờ chiếu sáng liên tục, nhiệt lượng tỏa ra rất thấp.
• Bộ nguồn 110V chuẩn thị trường Mỹ và Canada.

Sản phẩm được gia công chính xác tại xưởng Việt Nam, đóng thùng chống sốc và gửi tận nơi door-to-door.`,
    seo_title: 'Hộp Đèn LED Lightbox Siêu Mỏng – Menu Board Treo Tường Gửi Đi Mỹ',
    seo_description: 'Sản xuất hộp đèn LED siêu mỏng, menu board cho quán trà sữa, nhà hàng, tiệm nail tại Mỹ. Đổi hình ảnh dễ dàng, nguồn điện 110V an toàn.',
    images: ['/images/section_provided_3.jpg', '/images/products/prod_menu.jpg'],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: false }
  },
  { slug: 'decal-kinh', name: 'Decal kính', category_slug: 'bang-hieu-nhan-dien', category_id: 'cat-bang-hieu',
    short_description: 'Decal dán cửa kính mặt tiền (Window Graphics): Decal cát mờ hoa văn nhận diện, decal lưới chống nắng và decal chữ cắt giờ mở cửa kinh doanh.',
    description: `DECAL DÁN CỬA KÍNH MẶT TIỀN & WINDOW GRAPHICS

Cửa kính mặt tiền là diện tích quảng bá giá trị lớn của tiệm. Thiết kế decal kính hợp lý vừa giúp quảng bá tên tiệm, thông tin giờ làm việc, vừa tạo khoảng riêng tư thẩm mỹ cho khách hàng bên trong.

CÁC LOẠI DECAL KÍNH PHỔ BIẾN:
• Decal cát mờ (Frosted Window Film): Cắt hoa văn nhận diện, logo hoặc kẻ sọc ngang tinh tế. Vừa lấy ánh sáng tự nhiên vừa che bớt tầm nhìn, rất được chuộng tại các tiệm Nail, Spa và văn phòng.
• Decal lưới One-Way Vision: Bên ngoài nhìn vào thấy tranh ảnh màu sắc rực rỡ và thông điệp quảng cáo, bên trong nhìn ra vẫn thấy rõ đường phố mà không bị cản tầm mắt. Có khả năng cản tia UV và chống nóng hiệu quả.
• Decal cắt chữ vi tính (Vinyl Cut Lettering): Dán tên tiệm, số điện thoại, bảng giờ mở cửa (Store Hours), bảng chấp nhận thẻ thanh toán (Visa, Mastercard, Apple Pay).
• Bền bỉ với thời tiết: Mực in UV và keo chuyên dụng dán kính không để lại vết keo dính khi bóc thay mới, chống chịu nắng mưa và nhiệt độ khắc nghiệt.

Hamburg Connect tư vấn kích thước theo đúng khung kính thực tế của mặt bằng tại Mỹ, cuộn tròn trong ống cứng bảo vệ gửi sang tận nơi.`,
    seo_title: 'Decal Dán Kính Mặt Tiền – Decal Cát Mờ, Decal Lưới Cho Cửa Hàng Tại Mỹ',
    seo_description: 'Thiết kế in cắt decal dán kính mặt tiền cho tiệm nail, spa, shop bán lẻ tại Mỹ. Tăng tính thẩm mỹ, bảo đảm riêng tư và quảng bá thương hiệu.',
    images: ['/images/products/prod_sticker_decal.jpg', '/images/hero/hero_showcase.jpg'],
    industry_links: { nail_spa: true, restaurant_fnb: true, retail_shop: true, wedding_event: false }
  }
];
export const STATIC_SOLUTIONS: StaticSolution[] = [
  {
    id: 'sol-nail-spa',
    slug: 'nail-salon',
    name: 'Giải Pháp Trọn Gói Cho Tiệm Nail',
    short_description: 'Giải pháp tổng thể từ lên concept, thiết kế thi công bảng hiệu, in ấn đồng bộ nhận diện (Menu, Business Card, Gift Card, Loyalty Card) đến đóng kiện gỗ và vận chuyển trọn gói sang Mỹ.',
    description: `Hamburg Connect đồng hành cùng các chủ tiệm Nail tại Mỹ từ bước lên concept ý tưởng, sản xuất cung ứng nội thất quầy kệ, thi công bảng hiệu mặt tiền chữ nổi LED, in ấn đồng bộ ấn phẩm nhận diện và vận chuyển tận nơi an toàn.`,
    hero_image_url: '/images/solutions/sol_nail_spa.jpg',
    images: ['/images/solutions/sol_nail_spa.jpg', '/images/section_provided_3.jpg', '/images/products/prod_bo_an_pham.jpg'],
    features: [
      'Thiết kế concept không gian và nhận diện đồng bộ',
      'Sản xuất bảng hiệu Storefront chữ nổi 3D Mica/Inox có đèn LED',
      'In ấn trọn bộ: Menu bảng giá, Business Card, Gift Card, Voucher',
      'Đóng kiện gỗ chuyên dụng, chống sốc, vận chuyển door-to-door đến Mỹ'
    ],
    seo_title: 'Giải Pháp Trọn Gói Cho Nail Salon Tại Mỹ | Hamburg Connect',
    seo_description: 'Tư vấn, thiết kế, sản xuất và cung ứng trọn gói nội thất, bảng hiệu, ấn phẩm in ấn cho tiệm Nail tại Mỹ. Vận chuyển an toàn tận nơi.',
    sort_order: 1
  },
  {
    id: 'sol-spa-beauty',
    slug: 'spa-beauty',
    name: 'Giải Pháp Trọn Gói Spa & Beauty',
    short_description: 'Setup nhận diện không gian Spa & Thẩm mỹ viện sang trọng, đẳng cấp: Bảng hiệu nghệ thuật, menu dịch vụ, appointment card, đồng phục và bao bì mỹ phẩm.',
    description: `Tạo dựng trải nghiệm thư giãn đẳng cấp cho khách hàng với hệ thống nhận diện tinh tế, ánh sáng ấm áp, bảng hiệu logo wall và trọn bộ ấn phẩm in ấn chuẩn mực thị trường Mỹ.`,
    hero_image_url: '/images/products/prod_bo_an_pham.jpg',
    images: ['/images/products/prod_bo_an_pham.jpg', '/images/products/prod_the_phieu.jpg'],
    features: [
      'Logo Wall & Backdrop check-in tinh tế tại quầy lễ tân',
      'Menu dịch vụ bồi cứng chống nước, thiết kế trang nhã',
      'Thẻ hẹn (Appointment Card), Thẻ thành viên VIP ép kim',
      'Cung ứng khăn spa, đồng phục thêu logo và túi quà tặng'
    ],
    seo_title: 'Giải Pháp Trọn Gói Cho Spa & Beauty Tại Mỹ | Hamburg Connect',
    seo_description: 'Thiết kế thi công bảng hiệu, ấn phẩm in ấn và cung ứng vật tư nhận diện trọn gói cho Spa & Thẩm mỹ viện tại Mỹ.',
    sort_order: 2
  },
  {
    id: 'sol-restaurant-fnb',
    slug: 'restaurant-fnb',
    name: 'Giải Pháp Nhà Hàng, Café & Boba',
    short_description: 'Đồng bộ từ bảng hiệu mặt tiền, hộp đèn LED, menu da cao cấp, takeout menu, tem dán ly trà sữa, túi giấy kraft đến đồng phục nhân viên.',
    description: `Giải pháp toàn diện giúp nhà hàng và quán trà sữa Việt tại Mỹ thu hút thực khách địa phương, nâng tầm thương hiệu và tối ưu chi phí cung ứng từ Việt Nam.`,
    hero_image_url: '/images/solutions/sol_restaurant_fnb.jpg',
    images: ['/images/solutions/sol_restaurant_fnb.jpg', '/images/products/prod_menu.jpg', '/images/products/prod_sticker_decal.jpg'],
    features: [
      'Bảng hiệu mặt tiền & Hộp đèn vẫy LED siêu sáng chống nước',
      'Menu da cao cấp đóng còng, menu gấp chống bám dầu mỡ',
      'Tem dán ly trà sữa, sticker barcode, seal nắp chống tràn',
      'Túi giấy kraft mang về in logo, bao đũa, khăn ướt thương hiệu'
    ],
    seo_title: 'Giải Pháp Nhà Hàng, Café & Trà Sữa Tại Mỹ | Hamburg Connect',
    seo_description: 'Sản xuất bảng hiệu LED, in menu chống nước, tem dán ly và bao bì trọn gói cho nhà hàng, quán cafe, boba tại Mỹ.',
    sort_order: 3
  },
  {
    id: 'sol-shop-retail',
    slug: 'shop-retail',
    name: 'Giải Pháp Bán Lẻ & Doanh Nghiệp Nhỏ',
    short_description: 'Tối ưu không gian bán lẻ với quầy kệ trưng bày, bảng hiệu cửa hàng, decal kính trang trí, túi giấy in logo và hệ thống tem nhãn hàng hóa.',
    description: `Cung cấp trọn gói giải pháp trưng bày và bán lẻ cho các shop thời trang, tiệm bánh, siêu thị mini của người Việt tại nước ngoài.`,
    hero_image_url: '/images/solutions/sol_retail.jpg',
    images: ['/images/solutions/sol_retail.jpg', '/images/products/prod_bao_bi.jpg', '/images/products/prod_the_phieu.jpg'],
    features: [
      'Bảng hiệu mặt tiền, chữ mica nổi sáng chân sang trọng',
      'Decal mờ dán kính, tranh canvas và poster khuyến mãi',
      'Túi giấy quai xoắn in logo thương hiệu xuất khẩu',
      'Tem phụ, barcode nhãn mác quần áo và thẻ tích điểm'
    ],
    seo_title: 'Giải Pháp Bán Lẻ & Shop Thời Trang Tại Mỹ | Hamburg Connect',
    seo_description: 'Sản xuất kệ trưng bày, túi giấy, tem nhãn và bảng hiệu trọn gói cho cửa hàng bán lẻ tại Mỹ.',
    sort_order: 4
  },
  {
    id: 'sol-wedding-event',
    slug: 'wedding-event',
    name: 'Giải Pháp Cưới Hỏi & Sự Kiện',
    short_description: 'Trọn gói set up Wedding & Event: Thiệp cưới cao cấp, Standee, Banner, Backdrop và các ấn phẩm in ấn cho ngày trọng đại.',
    description: `Hamburg Connect hỗ trợ thiết kế, in ấn và cung ứng trọn gói ấn phẩm cho cưới hỏi và sự kiện: thiệp mời, standee, banner, backdrop check-in, phiếu quà tặng, thiệp cảm ơn và các ấn phẩm trang trí khác. Sản xuất tại Việt Nam, vận chuyển an toàn đến Mỹ, Canada, Úc và Châu Âu.`,
    hero_image_url: '/images/products/prod_thiep_su_kien.jpg',
    images: ['/images/products/prod_thiep_su_kien.jpg'],
    features: [
      'Thiệp cưới online và in ấn cao cấp, ép kim vàng/bạc',
      'Standee, Banner, Backdrop check-in cho sự kiện',
      'Phiếu sinh nhật, thiệp cảm ơn và nhãn quà đặc lệ',
      'Gói giải pháp trọn bộ Wedding & Event'
    ],
    seo_title: 'Giải Pháp Cưới Hỏi & Sự Kiện | Hamburg Connect',
    seo_description: 'Thiết kế và in ấn thiệp cưới, standee, banner, backdrop cho cưới hỏi và sự kiện. Sản xuất tại Việt Nam, gửi đi Mỹ.',
    sort_order: 5
  }
];

const authoredProducts: Record<string, { description: string; seo_title: string; seo_description: string; short_description?: string }> = productContent;
const extraMenus: StaticProduct[] = [
  { slug: 'menu-mang-di', name: 'Menu mang đi (Takeout Menu)', images: ['/images/products/prod_menu.jpg'], specs: { sizes: ['4 × 9 inch', '5.5 × 8.5 inch', '8.5 × 11 inch'], materials: ['Couche', 'Bristol', 'Giấy mỹ thuật'] } },
  { slug: 'menu-de-ban', name: 'Menu để bàn (Table Tent)', images: ['/images/products/prod_menu.jpg'], specs: { sizes: ['4 × 6 inch', '5 × 7 inch', '5 × 8 inch'], materials: ['Couche', 'Bristol', 'Giấy mỹ thuật định lượng dày'] } },
].map(product => ({ ...product, category_id: 'cat-an-pham', category_slug: 'an-pham-bao-bi', product_type: 'flat_print', is_active: true, is_featured: false, industry_links: { restaurant_fnb: true, wedding_event: true } }));

export const STATIC_PRODUCTS: StaticProduct[] = [...BASE_PRODUCTS.filter(product => product.slug !== 'voucher'), ...extraMenus].map(product => {
  const content = authoredProducts[product.slug];
  return {
    ...product,
    id: product.id || `product-${product.slug}`,
    ...(content ? { description: content.description, seo_title: content.seo_title, seo_description: content.seo_description, ...(content.short_description ? { short_description: content.short_description } : {}) } : {}),
    ...(product.slug === 'gift-card' ? { name: 'Gift Card & Voucher' } : {}),
  };
});

export const products = STATIC_PRODUCTS;
export const solutions = STATIC_SOLUTIONS;

// Adding Aliases for broken admin pages
export const productsData = STATIC_PRODUCTS;
export const projectsData = projects;
export const shippingRoutesData = shippingRoutes;
export const solutionsData = STATIC_SOLUTIONS;
export const blogPostsData = blogPosts;

