import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { HomeLink } from '@/components/site/home-link';

export type Crumb = { name: string; href?: string };

export function Breadcrumbs({ items, tone = 'dark' }: { items: Crumb[]; tone?: 'dark' | 'light' }) {
  const base = tone === 'light' ? 'text-on-brand' : 'text-muted';
  const strong = tone === 'light' ? 'text-white' : 'text-ink';
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${base}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />}
            {item.href === '/' ? <HomeLink className="transition hover:underline">{item.name}</HomeLink> : item.href ? <Link href={item.href} className="transition hover:underline">{item.name}</Link> : <span aria-current="page" className={`font-medium ${strong}`}>{item.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
