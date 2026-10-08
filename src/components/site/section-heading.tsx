import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { noBreakBrand } from '@/lib/legacy-render';

/**
 * Consistent section header: eyebrow + title + optional lead + optional "see all" link.
 * `layout`: `row` puts the link beside the text block; `split` sets the title on the
 * left and the lead + link on the right from `lg` up, so a long lead fills the width
 * instead of leaving half the row empty; `stack` keeps everything in one column (for
 * narrow sidebars).
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  align = 'left',
  layout = 'row',
  tone = 'dark',
  id,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: { label: string; href: string };
  align?: 'left' | 'center';
  layout?: 'row' | 'split' | 'stack';
  tone?: 'dark' | 'light';
  id?: string;
}) {
  const light = tone === 'light';
  const heading = (
    <>
      {eyebrow && <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>{eyebrow}</p>}
      <h2 id={id} className={`h-section mt-2.5 ${light ? 'text-white' : ''}`}>{noBreakBrand(title)}</h2>
    </>
  );
  const leadText = (className = '') => lead && <p className={`lead ${className} ${light ? 'text-on-brand' : ''}`}>{lead}</p>;
  const centered = align === 'center';
  const row = layout === 'row' && !centered;
  const linkAlign = centered ? '' : row ? 'self-start md:self-auto' : 'self-start';
  const link = action && (
    <Link href={action.href} className={`group inline-flex shrink-0 items-center gap-1.5 ${linkAlign} text-sm font-semibold ${light ? 'text-white' : 'text-brand-600'} hover:underline`}>
      {action.label}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );

  if (layout === 'split') {
    return (
      <div className="grid gap-3 lg:grid-cols-2 lg:items-end lg:gap-12">
        <div>{heading}</div>
        {(lead || action) && (
          <div className="flex flex-col gap-4">
            {leadText()}
            {link}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${centered ? 'items-center text-center' : ''} ${row ? 'md:flex-row md:items-end md:justify-between' : ''}`}>
      <div className={centered ? 'max-w-2xl' : 'max-w-3xl'}>
        {heading}
        {leadText('mt-3')}
      </div>
      {link}
    </div>
  );
}
