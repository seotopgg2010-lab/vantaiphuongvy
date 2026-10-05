import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Clock3, MessageCircle, Phone, Tag } from 'lucide-react';
import { Breadcrumbs, type Crumb } from '@/components/site/breadcrumbs';
import { SITE_CONFIG, ZALO_URL } from '@/lib/constants';
import { toTelHref } from '@/lib/site';

export type HeroFact = { icon?: 'time' | 'price' | 'check'; text: string };

const ICONS = { time: Clock3, price: Tag, check: CheckCircle2 } as const;

/**
 * Dark page hero shared by service, route, truck and info pages.
 * Legacy social images often contain baked-in text, so the image is shown as a
 * framed card next to the copy rather than as a background.
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  summary,
  facts = [],
  image,
  imageAlt = '',
  showActions = true,
  formHref = '/lien-he/#bao-gia',
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  summary?: string;
  facts?: HeroFact[];
  image?: string;
  imageAlt?: string;
  showActions?: boolean;
  /** Where the 'Gửi yêu cầu' button points; '#bao-gia' when the page has an inline form. */
  formHref?: string;
}) {
  return (
    <section className="bg-brand-grid text-white">
      <div className={`container-x grid gap-10 py-10 md:py-14 ${image ? 'lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-14' : ''}`}>
        <div className="min-w-0">
          <Breadcrumbs items={crumbs} tone="light" />
          {eyebrow && <p className="eyebrow eyebrow-light mt-6">{eyebrow}</p>}
          <h1 className="h-display mt-3 text-white">{title}</h1>
          {summary && <p className="mt-5 max-w-2xl text-base leading-7 text-on-brand sm:text-[1.0625rem] sm:leading-8">{summary}</p>}
          {facts.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {facts.map((fact) => {
                const Icon = ICONS[fact.icon || 'check'];
                return (
                  <li key={fact.text} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[0.8125rem] font-medium text-white sm:px-3.5 sm:py-1.5 sm:text-sm">
                    <Icon className="h-4 w-4 text-accent-400" aria-hidden="true" />{fact.text}
                  </li>
                );
              })}
            </ul>
          )}
          {showActions && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="btn btn-lg btn-accent"><Phone className="h-5 w-5" aria-hidden="true" />Gọi {SITE_CONFIG.hotline}</a>
              <a href={ZALO_URL} target="_blank" rel="noopener" data-track="click_zalo" className="btn btn-lg btn-ghost-light hidden sm:inline-flex"><MessageCircle className="h-5 w-5" aria-hidden="true" />Nhắn Zalo báo giá</a>
              <Link href={formHref} className="btn btn-lg btn-ghost-light hidden xl:inline-flex">Gửi yêu cầu</Link>
            </div>
          )}
        </div>
        {image && (
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-brand-400/30 via-transparent to-accent-500/20 blur-2xl" aria-hidden="true" />
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/15 bg-navy-800 shadow-2xl">
              <Image src={image} alt={imageAlt} fill preload sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
