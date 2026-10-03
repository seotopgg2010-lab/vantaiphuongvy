import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { legacyPosts, oldImageUrl } from '@/lib/legacy-content';
import { canonicalUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/rich-text';

export async function generateMetadata(): Promise<Metadata> {
  const canonical = canonicalUrl('/blog');
  return {
    title: 'Cẩm nang vận tải | Vận tải Phương Vy',
    description: 'Cẩm nang và bài viết thực tế về vận chuyển hàng hóa, xe tải và luật giao thông.',
    alternates: { canonical },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const canonical = canonicalUrl('/blog');
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonical}#collectionpage`,
    name: 'Cẩm nang vận tải | Vận tải Phương Vy',
    description: 'Cẩm nang và bài viết thực tế về vận chuyển hàng hóa, xe tải và luật giao thông.',
    url: canonical,
    inLanguage: 'vi-VN',
    isPartOf: { '@id': 'https://vantaiphuongvy.com/#website' },
  };
  return (
    <div className="min-h-screen bg-brief-ivory">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionSchema) }} />
      <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <Breadcrumb items={[{ label: 'Cẩm nang' }]} lang={lang} />

        <div className="mb-12 mt-8 rounded-2xl bg-brief-dark px-6 py-10 text-white sm:px-10">
          <p className="text-sm font-bold uppercase tracking-[.14em] text-brief-gold">Vận tải Phương Vy</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Cẩm nang vận tải
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-sky-50">
            Bài viết thực tế về vận chuyển hàng hóa, xe tải và quy định vận tải.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {legacyPosts.map((post) => {
            const image = oldImageUrl(post.image);
            return (
              <Link
                key={post.slug}
                href={post.path}
                className="group flex flex-col overflow-hidden rounded-2xl border border-brief-neutral bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eaf8fe]">
                  {image ? (
                    <Image
                      src={image}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-brief-soft-ink">Vận tải Phương Vy</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1175bc]">
                    {post.date ? new Date(post.date).toLocaleDateString('vi-VN') : ''}
                  </p>
                  <h2 className="mt-2 line-clamp-3 text-lg font-bold leading-snug text-brief-ink group-hover:text-brief-red">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-brief-soft-ink">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <section aria-labelledby="blog-service-cta" className="mt-10 rounded-2xl border border-brief-gold/40 bg-brief-champagne p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-brief-red">Bạn cần vận chuyển hàng?</p>
            <h2 id="blog-service-cta" className="mt-2 text-2xl font-bold text-brief-dark">Tra tuyến phù hợp hoặc gửi yêu cầu báo giá</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-brief-soft-ink">Xem trang dịch vụ theo tỉnh thành, loại hàng hoặc liên hệ khi cần tư vấn trực tiếp.</p>
          </div>
          <div className="mt-5 flex shrink-0 flex-col gap-3 sm:mt-0 sm:flex-row">
            <Link href="/van-chuyen-hang-hoa" className="brief-button-secondary rounded-md">Xem dịch vụ</Link>
            <Link href="/lien-he" className="brief-button-primary rounded-md">Yêu cầu báo giá</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
