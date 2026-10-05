import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { CtaBand } from '@/components/site/cta-band';
import { JsonLd } from '@/components/site/json-ld';
import { PostCard } from '@/components/site/post-card';
import { legacyPosts } from '@/lib/legacy-content';
import { BLOG_PAGE } from '@/lib/marketing';
import { withSlash } from '@/lib/navigation';
import { canonicalUrl, generateBreadcrumbJsonLd, pageMetadata, WEBSITE_ID } from '@/lib/seo';

const { title: TITLE, heading: HEADING, description: DESCRIPTION } = BLOG_PAGE;

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: '/blog', image: legacyPosts[0]?.image });

export default function BlogIndex() {
  const [featured, ...rest] = legacyPosts;
  const url = canonicalUrl('/blog');
  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbJsonLd([{ name: 'Trang chủ', url: canonicalUrl('/') }, { name: HEADING, url }]),
          {
            '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${url}#webpage`, url, name: TITLE, description: DESCRIPTION, inLanguage: 'vi-VN', isPartOf: { '@id': WEBSITE_ID },
            mainEntity: { '@type': 'ItemList', itemListElement: legacyPosts.map((post, index) => ({ '@type': 'ListItem', position: index + 1, url: canonicalUrl(post.path), name: post.title })) },
          },
        ]}
      />
      <header className="border-b border-line bg-surface">
        <div className="container-x py-10 md:py-14">
          <Breadcrumbs items={[{ name: 'Trang chủ', href: '/' }, { name: HEADING }]} />
          <p className="eyebrow mt-6">Kiến thức vận tải</p>
          <h1 className="h-display mt-3">{HEADING}</h1>
          <p className="lead mt-4 max-w-2xl">{DESCRIPTION}</p>
        </div>
      </header>
      <section className="container-x py-12 md:py-16" aria-label="Danh sách bài viết">
        {featured && (
          <div className="mb-10 grid gap-6 lg:grid-cols-2">
            <PostCard post={featured} priority />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {rest.slice(0, 2).map((post) => <PostCard key={post.path} post={post} />)}
            </div>
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(2).map((post) => <PostCard key={withSlash(post.path)} post={post} />)}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
