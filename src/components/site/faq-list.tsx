import { Plus } from 'lucide-react';
import type { FaqEntry } from '@/lib/legacy-types';

/** Zero-JS accordion built on <details>. */
export function FaqList({ items }: { items: FaqEntry[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {items.map((item, index) => (
        <details key={item.question} className="group" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-left font-semibold text-ink transition hover:bg-surface sm:px-6 [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition group-open:rotate-45"><Plus className="h-4 w-4" aria-hidden="true" /></span>
          </summary>
          <p className="px-5 pb-5 text-[0.9375rem] leading-7 text-muted sm:px-6">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
