import { Star } from 'lucide-react';
import { ratingScore } from '@/lib/legacy-render';
import type { LegacyRating } from '@/lib/legacy-types';

const STARS = [0, 1, 2, 3, 4];

/**
 * Visitor rating carried over from the WordPress kk Star Ratings widget (read-only there too),
 * shown where that widget sat. The page's CreativeWorkSeries markup repeats these numbers.
 */
export function RatingSummary({ rating, tone = 'dark' }: { rating: LegacyRating; tone?: 'dark' | 'light' }) {
  const light = tone === 'light';
  return (
    <p className={`inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm ${light ? 'text-on-brand' : 'text-muted'}`}>
      <span className="relative inline-flex" aria-hidden="true">
        <span className={`flex gap-0.5 ${light ? 'text-white/25' : 'text-line'}`}>{STARS.map((star) => <Star key={star} className="h-4 w-4 fill-current" />)}</span>
        <span className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-accent-400" style={{ width: `${(rating.score / rating.best) * 100}%` }}>
          {STARS.map((star) => <Star key={star} className="h-4 w-4 shrink-0 fill-current" />)}
        </span>
      </span>
      <span>
        <span className="sr-only">Đánh giá </span>
        <strong className={light ? 'text-white' : 'text-ink'}>{ratingScore(rating)}</strong> ({rating.count} bình chọn)
      </span>
    </p>
  );
}
