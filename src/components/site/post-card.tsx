import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { withSlash } from '@/lib/navigation';

export type PostSummary = {
  path: string;
  title: string;
  summary: string;
  image?: string;
  imageAlt?: string;
  date?: string;
  readingMinutes: number;
};

export function formatDateVi(date?: string) {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' });
}

export function PostCard({ post, priority = false }: { post: PostSummary; priority?: boolean }) {
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <Link href={withSlash(post.path)} className="relative block aspect-[16/9] overflow-hidden bg-surface" tabIndex={-1} aria-hidden="true">
        <Image
          src={post.image || SITE_CONFIG.defaultImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-4 text-xs text-subtle">
          {post.date && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /><time dateTime={post.date}>{formatDateVi(post.date)}</time></span>}
          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{post.readingMinutes} phút đọc</span>
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug">
          <Link href={withSlash(post.path)} className="transition hover:text-brand-600">{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{post.summary}</p>
      </div>
    </article>
  );
}
