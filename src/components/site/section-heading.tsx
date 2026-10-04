import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/** Consistent section header: eyebrow + title + optional lead + optional "see all" link. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  align = 'left',
  tone = 'dark',
  id,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: { label: string; href: string };
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  id?: string;
}) {
  const centered = align === 'center';
  return (
    <div className={`flex flex-col gap-4 ${centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
      <div className={centered ? 'max-w-2xl' : 'max-w-3xl'}>
        {eyebrow && <p className={`eyebrow ${tone === 'light' ? 'eyebrow-light' : ''}`}>{eyebrow}</p>}
        <h2 id={id} className={`h-section mt-2.5 ${tone === 'light' ? 'text-white' : ''}`}>{title}</h2>
        {lead && <p className={`lead mt-3 ${tone === 'light' ? 'text-on-brand' : ''}`}>{lead}</p>}
      </div>
      {action && (
        <Link href={action.href} className={`group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold ${tone === 'light' ? 'text-white' : 'text-brand-600'} hover:underline`}>
          {action.label}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
