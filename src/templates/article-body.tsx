import { ChevronDown, ListTree } from 'lucide-react';
import { QuoteCard } from '@/components/site/quote-card';
import { TocNav } from '@/components/site/toc-nav';
import type { TocEntry } from '@/lib/legacy-types';

/**
 * Two-column long-form layout: sanitized legacy HTML (trusted build artifact
 * from scripts/build-legacy.ts) + sticky sidebar with quote card and TOC.
 */
export function ArticleBody({
  html,
  toc,
  quoteHeading,
  quoteContext,
  children,
}: {
  html: string;
  toc: TocEntry[];
  quoteHeading?: string;
  quoteContext?: string;
  children?: React.ReactNode;
}) {
  const h2Toc = toc.filter((entry) => entry.level === 2);
  const showToc = h2Toc.length >= 3;
  return (
    <div className="container-x grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_21.5rem]">
      <div className="min-w-0">
        {showToc && (
          <details className="group mb-8 rounded-2xl border border-line bg-surface lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2"><ListTree className="h-5 w-5 text-brand-600" aria-hidden="true" />Mục lục bài viết</span>
              <ChevronDown className="h-5 w-5 text-subtle transition group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ol className="space-y-1 border-t border-line px-5 py-4 text-[0.9375rem]">
              {h2Toc.map((entry, index) => (
                <li key={entry.id}><a href={`#${entry.id}`} className="flex gap-3 py-1 text-muted hover:text-brand-600"><span className="w-5 shrink-0 font-semibold text-subtle">{index + 1}.</span>{entry.text}</a></li>
              ))}
            </ol>
          </details>
        )}
        <div className="prose-pv max-w-[46rem]" dangerouslySetInnerHTML={{ __html: html }} />
        {children}
      </div>
      <aside className="hidden lg:block" aria-label="Thông tin hỗ trợ">
        <div className="sticky top-24 space-y-8">
          <QuoteCard heading={quoteHeading} context={quoteContext} />
          {showToc && <TocNav entries={toc} />}
        </div>
      </aside>
    </div>
  );
}
