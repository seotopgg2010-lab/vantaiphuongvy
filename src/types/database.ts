export type ProductType = 'flat_print' | 'sticker_decal' | 'packaging' | 'print_set' | 'other';

export type JsonObject = Record<string, unknown>;

export type Category = {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductSpecs = {
  audience?: string;
  options?: string[];
  materials?: string[];
  sizes?: string[];
  finishes?: string[];
  applications?: string[];
};

export type Product = {
  id: string;
  category_id: string | null;
  category_slug?: string | null;
  category_name?: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  shipping_description: string | null;
  description: string | null;
  product_type: ProductType;
  specs: JsonObject | null;
  images: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Per-product industry card links (for product detail page)
  industry_links?: {
    nail_spa?: boolean;
    restaurant_fnb?: boolean;
    retail_shop?: boolean;
    wedding_event?: boolean;
  } | null;
  related_project_ids?: string[] | null;
};

export type Solution = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  features?: string[] | null;
  hero_image_url: string | null;
  images: string[] | null;
  linked_product_ids: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  business_type: string | null;
  client_requirement: string | null;
  concept: string | null;
  scope: string | null;
  description: string | null;
  production_process?: string | null;
  packaging_details?: string | null;
  shipping_details?: string | null;
  result?: string | null;
  related_solution_ids?: string[] | null;
  images: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
};

export type BlogPost = {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category_name?: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  is_published: boolean;
  published_at: string | null;
  author: string | null;
  created_at: string;
  updated_at: string;
};

export type ShippingRouteContent = {
  related_product_slugs?: string[];
  goods?: string[];
  air?: string;
  sea?: string;
  packing?: string;
  process?: string[];
  price_notes?: string;
  time_notes?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
};

export type ShippingRoute = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  description: string | null;
  service_types: JsonObject | null;
  transit_info: string | null;
  hero_image_url: string | null;
  images: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type HeroBanner = {
  id: string;
  title: string | null;
  subtitle: string | null;
  title_vi?: string | null;
  title_en?: string | null;
  subtitle_vi?: string | null;
  subtitle_en?: string | null;
  image_url: string;
  mobile_image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  business_type: string | null;
  country_state: string | null;
  needs: string | null;
  message: string | null;
  attachment_urls: string[] | null;
  destination_country: string | null;
  destination_city: string | null;
  current_status: string | null;
  investment_level: string | null;
  area_sqm: string | null;
  delivery_time: string | null;
  preferred_contact: string | null;
  privacy_consent_at: string | null;
  source_page: string | null;
  reference_code: string | null;
  locale: 'vi' | 'en' | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  is_read: boolean;
  created_at: string;
};

export type PageSectionType = 'rich_text' | 'hero' | 'features' | 'gallery' | 'cta' | 'html';

export type PageSection = {
  id: string;
  page_key: string;
  section_key: string;
  locale: 'vi' | 'en';
  section_type: PageSectionType;
  content: JsonObject;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Page = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSetting = {
  id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
};

export type NavigationItem = {
  id: string;
  parent_id: string | null;
  label: string;
  label_vi?: string | null;
  label_en?: string | null;
  url: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type CategoryWithChildren = Category & {
  children?: CategoryWithChildren[];
};

export type ProductWithCategory = Product & {
  category?: Category | null;
};

export type BlogPostWithCategory = BlogPost & {
  category?: BlogCategory | null;
};
