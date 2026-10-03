'use client';

import { useEffect, useState } from 'react';
import { ListTree } from 'lucide-react';
import type { TocEntry } from '@/lib/legacy-types';

/** Sticky table of contents with scroll-spy (h2 only, h3 nested under the active h2). */
export function TocNav({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = entries.map((entry) => document.getElementById(entry.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;
    const observer = new IntersectionObserver((records) => {
      const visible = records.filter((record) => record.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-120px 0px -65% 0px' });
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [entries]);

  const activeIndex = entries.findIndex((entry) => entry.id === active);
  let currentH2 = -1;
  for (let i = activeIndex; i >= 0; i--) if (entries[i].level === 2) { currentH2 = i; break; }

  return (
    <nav aria-label="Mục lục" className="text-sm">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle"><ListTree className="h-4 w-4" aria-hidden="true" />Nội dung chính</p>
      <ol className="mt-3 max-h-[min(28rem,55vh)] space-y-0.5 overflow-y-auto border-l border-line pr-1 lg:max-h-[min(28rem,max(9rem,calc(100dvh_-_35rem)))]">
        {entries.map((entry, index) => {
          if (entry.level === 3) {
            let parent = -1;
            for (let i = index; i >= 0; i--) if (entries[i].level === 2) { parent = i; break; }
            if (parent !== currentH2) return null;
          }
          const isActive = entry.id === active;
          return (
            <li key={entry.id}>
              <a href={`#${entry.id}`} className={`-ml-px block border-l-2 py-1.5 leading-snug transition ${entry.level === 3 ? 'pl-6 text-[0.8125rem]' : 'pl-3.5'} ${isActive ? 'border-brand-600 font-semibold text-brand-700' : 'border-transparent text-muted hover:border-line hover:text-ink'}`}>
                {entry.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
