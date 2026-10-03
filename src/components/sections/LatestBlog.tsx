import Link from 'next/link';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Button } from '@/components/ui/Button';
import { BlogCard } from '@/components/shared/BlogCard';
import { BlogPost } from '@/types/database';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { localizedPath } from '@/lib/site';

const fallbackPosts: BlogPost[] = [];

interface LatestBlogProps {
  dict: Dictionary;
  posts?: BlogPost[];
  lang: string;
}

export function LatestBlog({ dict, posts, lang }: LatestBlogProps) {
  const displayPosts = posts && posts.length > 0 ? posts : fallbackPosts;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <SectionHeading 
            title={dict.latestBlog.sectionTitle}
            subtitle={dict.latestBlog.sectionLabel}
          />
          <Link href={localizedPath(lang, '/blog')} className="hidden md:block">
            <Button variant="secondary" className="border-brief-red text-brief-red hover:bg-brief-red hover:text-white font-semibold">
              {dict.latestBlog.viewAllPosts} →
            </Button>
          </Link>
        </div>
        
        {displayPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayPosts.map((post) => (
              <div key={post.id || post.slug} className="h-full">
                <BlogCard post={post} lang={lang} />
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-brief-neutral bg-brief-ivory p-8 text-center text-brief-soft-ink">
            {lang.toLowerCase().startsWith('en') ? 'Guides will be published after editorial approval.' : 'Cẩm nang sẽ được cập nhật sau khi duyệt nội dung.'}
          </p>
        )}
        
        <div className="mt-10 text-center md:hidden">
          <Link href={localizedPath(lang, '/blog')}>
            <Button variant="secondary" className="border-brief-red text-brief-red hover:bg-brief-red hover:text-white w-full">
              {dict.latestBlog.viewAllPosts} →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
