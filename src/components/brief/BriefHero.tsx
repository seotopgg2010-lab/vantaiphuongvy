import type { ReactNode } from 'react';
import { getImageProps } from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { BriefLocale } from '@/lib/brief/routes';
import { getBriefRoutePath } from '@/lib/brief/routes';

type HeroAction = {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
};

type HeroBenefit = {
  title: string;
  description: string;
  icon: ReactNode;
};

interface BriefHeroProps {
  lang: BriefLocale;
  eyebrow?: string;
  title: ReactNode;
  description: string;
  capabilityLine?: string;
  scriptAccent?: string;
  desktopImage: string;
  mobileImage?: string;
  imageAlt: string;
  imageStatus?: 'reference' | 'temporary';
  actions: HeroAction[];
  benefits?: HeroBenefit[];
}

export function BriefHero({
  lang,
  eyebrow,
  title,
  description,
  capabilityLine,
  scriptAccent,
  desktopImage,
  mobileImage,
  imageAlt,
  imageStatus = 'reference',
  actions,
  benefits = [],
}: BriefHeroProps) {
  void imageStatus;
  const commonImage = { alt: imageAlt, sizes: '100vw', quality: 85, loading: 'eager' as const, fetchPriority: 'high' as const };
  const { props: desktopProps } = getImageProps({ ...commonImage, src: desktopImage, width: 1983, height: 793 });
  const { props: mobileProps } = getImageProps({ ...commonImage, src: mobileImage || desktopImage, width: 1122, height: 1402 });
  const localizedActions = actions.map((action) => ({
    ...action,
    href: action.href.startsWith('#')
      ? action.href
      : getBriefRoutePath(lang, action.href),
  }));

  return (
    <section className="brief-hero overflow-hidden bg-brief-ivory">
      <div className="relative overflow-hidden bg-brief-ivory">
        <picture>
          <source media="(min-width: 640px)" srcSet={desktopProps.srcSet} />
          {/* getImageProps keeps Next optimization while picture selects one eager hero. */}
          <img {...mobileProps} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-brief-ivory/90 via-brief-ivory/30 to-transparent sm:from-brief-ivory/65 sm:via-transparent" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex min-h-[39rem] max-w-7xl items-start px-5 pb-64 pt-12 sm:min-h-[30rem] sm:items-center sm:px-6 sm:py-16 lg:min-h-[clamp(30rem,38vw,40rem)] lg:px-8">
          <div className="max-w-xl lg:max-w-[43%]">
            {eyebrow && <p className="mb-4 text-xs font-semibold tracking-[0.08em] text-brief-soft-ink">{eyebrow}</p>}
            <h1 className="brief-display-heading text-[2.25rem] leading-[1.08] text-brief-ink sm:text-5xl lg:text-[clamp(2.5rem,3.6vw,3.25rem)]">{title}</h1>
            <p className="mt-5 max-w-lg text-[0.95rem] leading-7 text-brief-ink sm:text-base">{description}</p>
            {capabilityLine && <p className="mt-5 text-xs font-semibold tracking-[0.04em] text-brief-soft-ink sm:text-sm">{capabilityLine}</p>}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {localizedActions.map((action) => (
                <Link
                  key={`${action.label}-${action.href}`}
                  href={action.href}
                  className={action.variant === 'primary'
                    ? 'brief-button-primary rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                    : 'brief-button-secondary rounded-full bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brief-red active:scale-[0.97]'}
                >
                  <span>{action.label}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {scriptAccent && <p className="brief-script-accent absolute bottom-10 right-5 z-10 max-w-[19rem] text-right text-white drop-shadow-lg sm:bottom-12 sm:right-8">{scriptAccent}</p>}
        <svg className="absolute inset-x-0 bottom-0 h-7 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 32 Q720 0 1440 16 L1440 40 L0 40Z" fill="#FFFFFF" /><path d="M0 32 Q720 0 1440 16" fill="none" stroke="#D4A437" strokeWidth="1" /></svg>
      </div>

      {benefits.length > 0 && (
        <div className="border-y border-brief-neutral bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-3 divide-brief-gold/30 px-4 sm:divide-x sm:px-6 lg:grid-cols-4 lg:px-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-center gap-3 py-5 sm:px-5 lg:px-6">
                <span className="text-brief-gold" aria-hidden="true">{benefit.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-brief-ink sm:text-sm">{benefit.title}</p>
                  <p className="mt-1 text-xs leading-5 text-brief-soft-ink">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
