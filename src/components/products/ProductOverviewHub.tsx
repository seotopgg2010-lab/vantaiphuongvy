import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Signpost, CreditCard, FileText, BookOpen, Tag, Briefcase, Package, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/shared/ProductCard';
import { PRODUCT_GROUPS } from '@/lib/product-groups';
import { localizedPath } from '@/lib/site';
import { richTextSummary } from '@/lib/rich-text';

export interface ProductItem {
  id?: string;
  slug: string;
  name: string;
  category_slug: string;
  category_id?: string;
  short_description?: string;
  description?: string;
  images: string[];
  specs?: Record<string, unknown>;
}
export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image_url?: string;
}
const icons = [Signpost, CreditCard, FileText, BookOpen, Tag, Briefcase, Package, Sparkles];

export default function ProductOverviewHub({ products, categories, searchQuery = '', lang = 'vi' }: {
  products: ProductItem[]; categories: CategoryItem[]; searchQuery?: string; lang?: string;
}) {
  const english = lang.toLowerCase().startsWith('en');
  const query = searchQuery.trim().toLocaleLowerCase();
  const filtered = query ? products.filter(product =>
    [product.name, product.short_description, product.description].some(text => text?.toLocaleLowerCase().includes(query))) : products;

  return (
    <div className="space-y-16">
      <section className="rounded-2xl border border-stone-200 bg-[#FAF8F1] p-4 sm:p-8">
        <h2 className="mb-3 text-center">{english ? 'Explore product groups' : 'Anh/chị đang quan tâm sản phẩm nào?'}</h2>
        <p className="mb-8 text-center text-stone-600">{english ? 'Open a group to see its products.' : 'Bấm vào nhóm để mở các sản phẩm tương ứng.'}</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {PRODUCT_GROUPS.map((group, index) => {
            const Icon = icons[index];
            return (
              <Link key={group.id} href={localizedPath(lang, `/san-xuat-cung-ung/${group.category}?nhom=${group.id}`)}
                className="group flex flex-col items-center rounded-2xl border border-stone-200 bg-white p-4 text-center shadow-sm transition hover:border-[#E21D25] hover:shadow-md sm:p-6">
                <Icon className="mb-3 h-8 w-8 text-[#E21D25]" aria-hidden="true" />
                <h3>{english ? group.en : group.title}</h3>
                {!english && <p className="mt-2 text-stone-600">{group.subtitle}</p>}
                <ArrowRight className="mt-4 h-4 w-4 text-[#CB120F]" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>
      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2>{query ? (english ? `Search: “${searchQuery}”` : `Tìm kiếm: “${searchQuery}”`) : (english ? 'All products' : 'Tất cả sản phẩm')}</h2>
          {query && <Link href={localizedPath(lang, '/san-xuat-cung-ung')} className="text-[#CB120F] underline">{english ? 'Clear search' : 'Xóa tìm kiếm'}</Link>}
        </div>
        {query && <p className="mb-6 text-stone-600">{english ? `${filtered.length} matching products` : `Tìm thấy ${filtered.length} sản phẩm phù hợp`}</p>}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map(product => <ProductCard key={product.slug} product={product} lang={lang} />)}
        </div>
        {filtered.length === 0 && <p className="rounded-xl bg-white p-8">{english ? 'No products match this search. Try a different keyword.' : 'Chưa tìm thấy sản phẩm phù hợp. Anh/chị thử từ khóa khác hoặc chọn nhóm sản phẩm bên trên.'}</p>}
      </section>
      <section>
        <h2 className="mb-8 text-center">{english ? 'Production & supply capabilities' : 'Năng lực sản xuất & cung ứng'}</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {categories.map(category => (
            <Link key={category.id} href={localizedPath(lang, `/san-xuat-cung-ung/${category.slug}`)} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
              {category.image_url && <div className="relative aspect-[4/3]"><Image src={category.image_url} alt={category.name} fill sizes="(max-width: 768px) 100vw, 20vw" className="object-cover" /></div>}
              <div className="p-4"><h3>{category.name}</h3><p className="mt-3 text-stone-600">{richTextSummary(category.description)}</p></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
