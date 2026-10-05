import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { formatDateVi } from '@/components/site/post-card';
import { SITE_CONFIG } from '@/lib/constants';
import type { CommentThread } from '@/lib/legacy-types';
import { toTelHref } from '@/lib/site';

/** Threads rendered open; older ones stay in the HTML inside a native <details> (no script needed). */
const OPEN_THREADS = 12;
/** Old "#comment-123" links (WordPress reply e-mails, bookmarks) open the collapsed list in every browser. */
const OPEN_LINKED_COMMENT = 'function o(){var h=location.hash.slice(1);if(!/^comment-\\d+$/.test(h))return;var e=document.getElementById(h),d=e&&e.closest("details");if(d&&!d.open){d.open=true;e.scrollIntoView()}}o();addEventListener("hashchange",o)';

const countComments = (threads: CommentThread[]): number => threads.reduce((sum, thread) => sum + 1 + countComments(thread.replies), 0);

function Comment({ comment }: { comment: CommentThread }) {
  return (
    <li>
      {/* Same anchor as the WordPress comment links (#comment-123). */}
      <article id={`comment-${comment.id}`} className="scroll-mt-28 space-y-2 rounded-2xl border border-line bg-white p-4 text-[0.9375rem] leading-7 text-ink sm:p-5">
        <p className="flex flex-wrap items-baseline gap-x-3 [overflow-wrap:anywhere]">
          <strong className="font-semibold">{comment.author}</strong>
          <time dateTime={comment.date} className="text-sm text-subtle">{formatDateVi(comment.date)}</time>
        </p>
        {comment.paragraphs.map((paragraph, index) => <p key={index} className="whitespace-pre-line [overflow-wrap:anywhere]">{paragraph}</p>)}
      </article>
      {comment.replies.length > 0 && (
        <ol className="mt-3 space-y-3 border-l-2 border-line pl-3 sm:pl-5">
          {comment.replies.map((reply) => <Comment key={reply.id} comment={reply} />)}
        </ol>
      )}
    </li>
  );
}

/** Comments from the WordPress post, kept as a read-only archive; new requests go to the hotline or the quote form. */
export function LegacyComments({ threads, count }: { threads: CommentThread[]; count: number }) {
  const open = threads.slice(0, OPEN_THREADS);
  const older = threads.slice(OPEN_THREADS);
  return (
    <section aria-labelledby="comments" className="mt-12 max-w-[46rem]">
      <h2 id="comments" className="scroll-mt-28 text-2xl font-bold">{count} bình luận</h2>
      <p className="mt-2 text-[0.9375rem] leading-7 text-muted">
        Bình luận của bạn đọc trên website cũ, giữ nguyên nội dung. Cần hợp tác hoặc gửi hàng, vui lòng gọi{' '}
        <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="font-semibold text-brand-600 hover:underline">{SITE_CONFIG.hotline}</a> hoặc{' '}
        <Link href="/lien-he/#bao-gia" className="font-semibold text-brand-600 hover:underline">gửi yêu cầu báo giá</Link>.
      </p>
      <ol className="mt-6 space-y-4">{open.map((thread) => <Comment key={thread.id} comment={thread} />)}</ol>
      {older.length > 0 && (
        <details className="group mt-4">
          <summary className="btn btn-outline w-full cursor-pointer list-none sm:w-auto [&::-webkit-details-marker]:hidden">
            Xem thêm {countComments(older)} bình luận cũ hơn<ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <ol className="mt-4 space-y-4">{older.map((thread) => <Comment key={thread.id} comment={thread} />)}</ol>
        </details>
      )}
      <script dangerouslySetInnerHTML={{ __html: OPEN_LINKED_COMMENT }} />
    </section>
  );
}
