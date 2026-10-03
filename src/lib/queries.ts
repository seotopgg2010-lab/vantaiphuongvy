import 'server-only';
import { unstable_cache } from 'next/cache';
import { createPublicClient } from '@/lib/supabase/public';
import { STATIC_CATEGORIES, STATIC_PRODUCTS, STATIC_SOLUTIONS, shippingRoutes, projects, blogPosts, blogCategories } from './data';
import { Category, Product, Solution, ShippingRoute, Project, BlogPost, BlogCategory, HeroBanner, NavigationItem, PageSection } from '@/types/database';
import { isProjectIndexable, isArticleIndexable } from './content-readiness';

// Static content intentionally omits database metadata. Cast it only at this
// boundary so callers still receive the same public query contracts.
const staticCategories = STATIC_CATEGORIES as unknown as Category[];
const staticProducts = STATIC_PRODUCTS as unknown as Product[];
const staticSolutions = STATIC_SOLUTIONS as unknown as Solution[];
const staticShippingRoutes = shippingRoutes as unknown as ShippingRoute[];
const staticProjects = projects as unknown as Project[];
const staticBlogPosts = blogPosts as unknown as BlogPost[];
const staticBlogCategories = blogCategories as unknown as BlogCategory[];

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!url && !!key && (url.startsWith('http://') || url.startsWith('https://'));
}

// Use admin client for public queries - it doesn't require cookies
// so it works in generateStaticParams and static rendering contexts.
function getPublicClient() {
  return createPublicClient();
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getCachedHeroBanners = unstable_cache(
  async () => {
    const { data, error } = await getPublicClient()
      .from('hero_banners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  ['hamburg-hero-banners'],
  { revalidate: 3600, tags: ['cms:hero-banners'] },
);

const getCachedNavigationItems = unstable_cache(
  async () => {
    const { data, error } = await getPublicClient()
      .from('navigation_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  ['hamburg-navigation-items'],
  { revalidate: 3600, tags: ['cms:navigation'] },
);

const getCachedSiteSettings = unstable_cache(
  async () => {
    const { data, error } = await getPublicClient().from('site_settings').select('key, value');
    if (error) throw error;
    return data || [];
  },
  ['hamburg-site-settings'],
  { revalidate: 3600, tags: ['cms:site-settings'] },
);


async function isCmsTableEmpty(supabase: ReturnType<typeof createPublicClient>, table: string): Promise<boolean> {
  const { count, error } = await supabase.from(table).select('id', { count: 'exact', head: true });
  return !error && (count ?? 0) === 0;
}

export async function getPageSections(pageKey: string, locale: 'vi' | 'en' = 'vi'): Promise<PageSection[]> {
  if (!isSupabaseConfigured()) return [];
  const getCachedPageSections = unstable_cache(
    async () => {
      const { data, error } = await getPublicClient()
        .from('page_sections')
        .select('*')
        .eq('page_key', pageKey)
        .eq('locale', locale)
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data || []) as PageSection[];
    },
    [`hamburg-page-sections-${pageKey}-${locale}`],
    { revalidate: 3600, tags: [`cms:page:${pageKey}:${locale}`] },
  );
  try {
    return await getCachedPageSections();
  } catch (error) {
    console.error('Failed to fetch page sections:', error);
    return [];
  }
}


export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return staticCategories;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
      
    if (error) throw error;
    if (data && data.length > 0) return data;
    return (await isCmsTableEmpty(supabase, 'categories')) ? staticCategories : [];
  } catch (error) {
    console.error('Failed to fetch categories from Supabase, falling back to static data:', error);
    return staticCategories;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isSupabaseConfigured()) return staticCategories.find(c => c.slug === slug) || null;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
      
    if (!error && data) return data;
    if (await isCmsTableEmpty(supabase, 'categories')) {
      return staticCategories.find(c => c.slug === slug) || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch category from Supabase, falling back to static data:', error);
    return staticCategories.find(c => c.slug === slug) || null;
  }
}

// ========================
// Products
// ========================

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return staticProducts.find(p => p.slug === slug) || null;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('slug', 'voucher')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
      
    if (!error && data) return data;
    if (await isCmsTableEmpty(supabase, 'products')) {
      return staticProducts.find(p => p.slug === slug) || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch product from Supabase, falling back to static data:', error);
    return staticProducts.find(p => p.slug === slug) || null;
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  if (!isSupabaseConfigured()) return staticProducts.filter(p => p.category_id === categoryId || p.category_slug === categoryId);
  // Static fallback categories use readable IDs (for example `cat-an-pham`),
  // while the Supabase column is UUID. Avoid sending an invalid UUID to PostgREST.
  if (!UUID_PATTERN.test(categoryId)) {
    return staticProducts.filter(p => p.category_id === categoryId || p.category_slug === categoryId);
  }
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('slug', 'voucher')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
      
    if (error) throw error;
    if (data && data.length > 0) return data;
    return (await isCmsTableEmpty(supabase, 'products'))
      ? staticProducts.filter(p => p.category_id === categoryId || p.category_slug === categoryId)
      : [];
  } catch (error) {
    console.error('Failed to fetch products from Supabase, falling back to static data:', error);
    return staticProducts.filter(p => p.category_id === categoryId || p.category_slug === categoryId);
  }
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids || ids.length === 0) return [];
  if (!isSupabaseConfigured()) return staticProducts.filter(p => ids.includes(p.id));
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('slug', 'voucher')
      .eq('is_active', true)
      .in('id', ids);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch products by ids from Supabase:', error);
    return staticProducts.filter(p => ids.includes(p.id));
  }
}

export async function getProjectsByIds(ids: string[]): Promise<Project[]> {
  if (!ids || ids.length === 0) return [];
  if (!isSupabaseConfigured()) return staticProjects.filter((project) => ids.includes(project.id) && isProjectIndexable(project));

  const validIds = ids.filter((id) => UUID_PATTERN.test(id));
  if (validIds.length === 0) return [];

  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .in('id', validIds)
      .eq('is_active', true);

    if (error) throw error;
    return (data || []).filter(isProjectIndexable);
  } catch (error) {
    console.error('Failed to fetch approved projects by ids:', error);
    return staticProjects.filter((project) => ids.includes(project.id) && isProjectIndexable(project));
  }
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  if (!isSupabaseConfigured()) return staticProducts.filter(p => p.is_featured).slice(0, limit);
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('slug', 'voucher')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true })
      .limit(limit);
      
    if (error) throw error;
    if (data && data.length > 0) return data;
    return (await isCmsTableEmpty(supabase, 'products'))
      ? staticProducts.filter(p => p.is_featured).slice(0, limit)
      : [];
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return staticProducts.filter(p => p.is_featured).slice(0, limit);
  }
}

export async function getAllActiveProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return staticProducts;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('slug', 'voucher')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) return data;
    return (await isCmsTableEmpty(supabase, 'products')) ? staticProducts : [];
  } catch (error) {
    console.error('Failed to fetch all active products:', error);
    return staticProducts;
  }
}

// ========================
// Solutions
// ========================

export async function getSolutions(): Promise<Solution[]> {
  if (!isSupabaseConfigured()) return staticSolutions;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('solutions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
      
    if (error) throw error;
    if (data && data.length > 0) return data;
    return (await isCmsTableEmpty(supabase, 'solutions')) ? staticSolutions : [];
  } catch (error) {
    console.error('Failed to fetch solutions from Supabase, falling back to static data:', error);
    return staticSolutions;
  }
}

export async function getSolutionBySlug(slug: string): Promise<Solution | null> {
  if (!isSupabaseConfigured()) return staticSolutions.find(s => s.slug === slug) || null;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('solutions')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
      
    if (!error && data) return data;
    if (await isCmsTableEmpty(supabase, 'solutions')) {
      return staticSolutions.find(s => s.slug === slug) || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch solution from Supabase, falling back to static data:', error);
    return staticSolutions.find(s => s.slug === slug) || null;
  }
}

// ========================
// Shipping Routes (NEW - was reading from static data.ts only)
// ========================

export async function getShippingRoutes(): Promise<ShippingRoute[]> {
  if (!isSupabaseConfigured()) return staticShippingRoutes;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('shipping_routes')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
      
    if (error) throw error;
    if (data && data.length > 0) return data;
    return (await isCmsTableEmpty(supabase, 'shipping_routes')) ? staticShippingRoutes : [];
  } catch (error) {
    console.error('Failed to fetch shipping routes from Supabase, falling back to static data:', error);
    return staticShippingRoutes;
  }
}

export async function getShippingRouteBySlug(slug: string): Promise<ShippingRoute | null> {
  if (!isSupabaseConfigured()) return staticShippingRoutes.find(r => r.slug === slug) || null;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('shipping_routes')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
      
    if (!error && data) return data;
    if (await isCmsTableEmpty(supabase, 'shipping_routes')) {
      return staticShippingRoutes.find(r => r.slug === slug) || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch shipping route from Supabase, falling back to static data:', error);
    return staticShippingRoutes.find(r => r.slug === slug) || null;
  }
}

// ========================
// Projects (NEW - was reading from static data.ts only)
// ========================

const MISSING_PROJECT_PUBLICATION_COLUMN = '42703';

function isMissingProjectPublicationColumn(error: unknown): boolean {
  return Boolean(
    error
    && typeof error === 'object'
    && 'code' in error
    && (error as { code?: string }).code === MISSING_PROJECT_PUBLICATION_COLUMN,
  );
}

function publicProjects(projects: Project[]): Project[] {
  return projects.filter(isProjectIndexable);
}

function publicBlogPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(isArticleIndexable);
}

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return publicProjects(staticProjects);
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      if (isMissingProjectPublicationColumn(error)) return [];
      throw error;
    }
    return publicProjects(data || []);
  } catch (error) {
    console.error('Failed to fetch approved projects:', error);
    return publicProjects(staticProjects);
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) return publicProjects(staticProjects).find((project) => project.slug === slug) || null;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('is_published', true)
      .single();

    if (error) {
      if (isMissingProjectPublicationColumn(error)) return null;
      throw error;
    }
    if (data && isProjectIndexable(data)) return data;
    return null;
  } catch (error) {
    console.error('Failed to fetch approved project by slug:', error);
    return publicProjects(staticProjects).find((project) => project.slug === slug) || null;
  }
}

export async function getFeaturedProjects(limit: number = 3): Promise<Project[]> {
  if (!isSupabaseConfigured()) return publicProjects(staticProjects).filter((project) => project.is_featured).slice(0, limit);
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      if (isMissingProjectPublicationColumn(error)) return [];
      throw error;
    }
    return publicProjects(data || []).slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch approved featured projects:', error);
    return publicProjects(staticProjects).filter((project) => project.is_featured).slice(0, limit);
  }
}

// ========================
// Blog (NEW - was reading from static data.ts only)
// ========================

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return publicBlogPosts(staticBlogPosts);
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
      
    if (error) throw error;
    if (data && data.length > 0) return publicBlogPosts(data);
    return [];
  } catch (error) {
    console.error('Failed to fetch approved blog posts:', error);
    return publicBlogPosts(staticBlogPosts);
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) return publicBlogPosts(staticBlogPosts).find((post) => post.slug === slug) || null;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
      
    if (error) throw error;
    if (!data || !isArticleIndexable(data)) return null;
    return data;
  } catch (error) {
    console.error('Failed to fetch approved blog post by slug:', error);
    return publicBlogPosts(staticBlogPosts).find((post) => post.slug === slug) || null;
  }
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  if (!isSupabaseConfigured()) return staticBlogCategories;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('sort_order', { ascending: true });
      
    if (error) throw error;
    if (data && data.length > 0) return data;
    return (await isCmsTableEmpty(supabase, 'blog_categories')) ? staticBlogCategories : [];
  } catch (error) {
    console.error('Failed to fetch blog categories from Supabase, falling back to static data:', error);
    return staticBlogCategories;
  }
}

export async function getBlogPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    const cat = staticBlogCategories.find(c => c.slug === categorySlug);
    if (!cat) return [];
    return staticBlogPosts.filter(p => p.category_id === cat.id);
  }
  try {
    const supabase = getPublicClient();
    // First get the category
    const { data: cat } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    
    if (!cat) return [];
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category_id', cat.id)
      .eq('is_published', true)
      .order('published_at', { ascending: false });
      
    if (error) throw error;
    return publicBlogPosts(data || []);
  } catch (error) {
    console.error('Failed to fetch approved blog posts by category:', error);
    const cat = staticBlogCategories.find((category) => category.slug === categorySlug);
    if (!cat) return [];
    return publicBlogPosts(staticBlogPosts.filter((post) => post.category_id === cat.id));
  }
}

export async function getLatestBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return publicBlogPosts(staticBlogPosts).slice(0, limit);
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return publicBlogPosts(data || []).slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch approved latest blog posts:', error);
    return publicBlogPosts(staticBlogPosts).slice(0, limit);
  }
}

// ========================
// Hero Banners (NEW)
// ========================

export async function getHeroBanners(): Promise<HeroBanner[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const data = await getCachedHeroBanners();
    return data;
  } catch (error) {
    console.error('Failed to fetch hero banners:', error);
    return [];
  }
}

// ========================
// Navigation
// ========================

export async function getNavigationItems(lang = 'vi'): Promise<NavigationItem[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const data = await getCachedNavigationItems();
    return (data || []).map((item) => ({
      ...item,
      label: lang.toLowerCase().startsWith('en')
        ? item.label_en || item.label
        : item.label_vi || item.label,
    }));
  } catch (error) {
    console.error('Failed to fetch navigation items from Supabase:', error);
    return [];
  }
}

// ========================
// Site Settings (NEW)
// ========================

const PUBLIC_SITE_SETTING_KEYS = new Set([
  'company_name',
  'email',
  'phone',
  'hotline_germany',
  'address',
  'facebook_url',
  'zalo_link',
]);

export async function getSiteSettings(): Promise<Record<string, string>> {
  const defaults: Record<string, string> = {
    company_name: 'Hamburg Connect',
    email: 'contact@hamburgconnect.com',
    phone: '(+84) 086 261 3313',
    hotline_germany: '(+49) 0174 9652 483',
    address: 'Weinligstrasse 23, 21073 Hamburg, Germany',
  };
  
  if (!isSupabaseConfigured()) return defaults;
  try {
      const data = await getCachedSiteSettings();
    if (data && data.length > 0) {
      const settings: Record<string, string> = { ...defaults };
      data.forEach((item: { key: string; value: string | null }) => {
        if (item.value && PUBLIC_SITE_SETTING_KEYS.has(item.key)) settings[item.key] = item.value;
      });
      return settings;
    }
    return defaults;
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return defaults;
  }
}

