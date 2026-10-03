import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BriefProcessTimeline, BriefSectionIntro } from '@/components/brief';
import type { ReferenceLocale, ReferencePageContent } from '@/content/reference-layout';
import { localizedPath } from '@/lib/site';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { getBriefFaqs } from '@/content/brief-faqs';
import { ReferenceContactBanner } from '@/components/brief/reference-contact-banner';

function localized(locale: ReferenceLocale, value: Record<ReferenceLocale, string>) {
  return value[locale];
}

type ReferenceLandingProps = {
  content: ReferencePageContent;
  lang: string;
  locale: ReferenceLocale;
  children?: React.ReactNode;
  faqGroup?: 'signage' | 'printing' | 'supply';
};

function heroTitle(locale: ReferenceLocale, title: Record<ReferenceLocale, string>) {
  const text = localized(locale, title);
  if (text.includes('\n')) {
    const lines = text.split('\n');
    return (
      <>
        <span className="block">{lines[0]}</span>
        <span className="block text-brief-red italic">{lines[1]}</span>
      </>
    );
  }
  const vietnamIndex = text.indexOf('Việt Nam');

  if (vietnamIndex === -1) return text;

  return (
    <>
      {text.slice(0, vietnamIndex)}
      <span className="text-brief-red italic">Việt Nam</span>
      {text.slice(vietnamIndex + 'Việt Nam'.length)}
    </>
  );
}

function ReferenceCardsSection({ content, lang, locale }: Omit<ReferenceLandingProps, 'children'>) {
  const cards = content.cards;

  if (content.hideCards || !cards?.length) return null;

  const viewAllLabel = content.cardsViewAllLabel
    ? localized(locale, content.cardsViewAllLabel)
    : locale === 'en'
      ? 'View all services'
      : 'Xem tất cả dịch vụ';

  return (
    <section id="dich-vu" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <BriefSectionIntro
            eyebrow={content.cardsEyebrow ? localized(locale, content.cardsEyebrow) : undefined}
            title={content.cardsTitle ? localized(locale, content.cardsTitle) : ''}
          />
          <Link
            href={localizedPath(lang, content.primaryAction.href)}
            className="text-sm font-semibold text-brief-red hover:text-brief-red-hover"
          >
            {viewAllLabel}{' '}
            <ArrowRight className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className={`mt-9 grid gap-4 sm:grid-cols-2 ${cards.length >= 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
          {cards.map((card) => (
            <Link
              key={card.title.vi}
              href={localizedPath(lang, card.href)}
              className="group flex flex-col overflow-hidden rounded-sm border border-brief-neutral bg-white shadow-sm transition duration-150 hover:-translate-y-1 hover:border-brief-gold hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brief-red active:scale-[0.99]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-brief-champagne">
                <Image
                  src={card.image}
                  alt={localized(locale, card.title)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="brief-display-heading text-lg text-brief-ink">{localized(locale, card.title)}</h3>
                {card.bullets ? (
                  <ul className="mt-3 space-y-1.5 text-xs leading-5 text-brief-soft-ink">
                    {(card.bullets[locale] || []).map((bullet) => (
                      <li key={bullet} className="flex items-start gap-1.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brief-gold" aria-hidden="true" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 min-h-12 text-sm leading-6 text-brief-soft-ink">{localized(locale, card.description)}</p>
                )}
                <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-brief-red">
                  {locale === 'en' ? 'View details' : 'Xem chi tiết'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReferenceLanding({ content, lang, locale, children, faqGroup }: ReferenceLandingProps) {
  const processSteps = (content.process || []).map((step, index) => ({
    number: String(index + 1).padStart(2, '0'),
    title: localized(locale, step.title),
    description: localized(locale, step.description),
    icon: step.icon,
  }));

  return (
    <div id="top" className="bg-brief-ivory">
      <section className="relative isolate overflow-hidden bg-brief-champagne">
        <div className="absolute inset-0">
          <Image src={content.referenceHeroImage || content.heroImage} alt={localized(locale, content.heroAlt)} fill preload sizes="100vw" className="object-cover object-[65%_center]" />
          <div className="absolute inset-0 bg-gradient-to-r from-brief-ivory/95 via-brief-ivory/90 to-brief-ivory/85 sm:via-brief-ivory/35 sm:to-transparent" aria-hidden="true" />
        </div>
        <div className="relative mx-auto flex min-h-[28rem] max-w-7xl items-center px-4 py-14 sm:min-h-[26rem] sm:px-6 lg:min-h-[clamp(26rem,34vw,35rem)] lg:px-8">
          <div className="max-w-xl text-brief-ink lg:max-w-[43%]">
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-brief-soft-ink">
              <Link href={localizedPath(lang, '/')} className="hover:text-brief-red">{locale === 'en' ? 'Home' : 'Trang chủ'}</Link>
              <span className="mx-1.5" aria-hidden="true">&gt;</span>
              <span className="text-brief-red">
                {content.breadcrumbTitle ? localized(locale, content.breadcrumbTitle) : localized(locale, content.title).split('\n')[0]}
              </span>
            </nav>
            <h1 className="brief-display-heading mt-3 text-4xl leading-[1.06] sm:text-5xl lg:text-6xl">
              {heroTitle(locale, content.title)}
            </h1>
            <p className="mt-5 max-w-lg text-[0.98rem] leading-7 text-brief-soft-ink">{localized(locale, content.description)}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={localizedPath(lang, content.primaryAction.href)} className="brief-button-primary rounded-full">
                {localized(locale, content.primaryAction.label)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              {content.secondaryAction.href && <a href={content.secondaryAction.href} className="brief-button-secondary rounded-full bg-white/90 lg:bg-white">
                {localized(locale, content.secondaryAction.label)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>}
            </div>
          </div>
        </div>
        {content.scriptAccent && (
          <p className="brief-script-accent relative z-10 px-4 pb-10 text-right text-brief-soft-ink sm:absolute sm:bottom-12 sm:right-8 sm:max-w-[20rem] sm:p-0 sm:text-white sm:drop-shadow-md">
            {localized(locale, content.scriptAccent)}
          </p>
        )}
        <svg className="absolute inset-x-0 bottom-0 h-7 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 32 Q720 0 1440 16 L1440 40 L0 40Z" fill="#FFFFFF" />
          <path d="M0 32 Q720 0 1440 16" fill="none" stroke="#D4A437" strokeWidth="1" />
        </svg>
      </section>

      <section className="border-y border-brief-neutral bg-white">
        <div className="mx-auto grid max-w-7xl divide-y divide-brief-neutral px-4 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-6 lg:grid-cols-4 lg:px-8">
          {content.benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title.vi} className="flex items-center gap-3 py-5 sm:px-5">
                <Icon className="h-7 w-7 shrink-0 text-brief-gold" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-brief-ink">{localized(locale, benefit.title)}</p>
                  <p className="mt-1 text-xs leading-5 text-brief-soft-ink">{localized(locale, benefit.description)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {!content.hideIntro && content.intro && (
        <section className="bg-brief-ivory py-10 sm:py-14">
          <div className="mx-auto grid max-w-7xl gap-7 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:px-8">
            <div>
              <BriefSectionIntro
                eyebrow={localized(locale, content.intro.eyebrow)}
                title={
                  content.intro.subtitle ? (
                    <>
                      <span className="block">{localized(locale, content.intro.title)}</span>
                      <span className="mt-1.5 block text-xl font-normal italic text-brief-red sm:text-2xl">
                        {localized(locale, content.intro.subtitle)}
                      </span>
                    </>
                  ) : (
                    localized(locale, content.intro.title)
                  )
                }
                description={localized(locale, content.intro.description)}
              />
              <Link href={localizedPath(lang, content.primaryAction.href)} className="brief-button-primary mt-7 inline-flex rounded-full">
                {localized(locale, content.primaryAction.label)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {content.intro.images.map((image, index) => (
                <div
                  key={image}
                  className={`relative overflow-hidden rounded-xl border border-brief-gold/30 bg-brief-champagne shadow-sm ${
                    index === 0 ? 'col-span-2 aspect-[16/8] sm:col-span-1 sm:row-span-2 sm:aspect-auto sm:h-full min-h-[220px]' : 'aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${localized(locale, content.intro.title)} ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 32vw"
                    className="object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {content.cardsBeforeChildren && <ReferenceCardsSection content={content} lang={lang} locale={locale} />}

      {children}

      {!content.cardsBeforeChildren && <ReferenceCardsSection content={content} lang={lang} locale={locale} />}

      {!content.hideProcess && content.process && content.process.length > 0 && (
        <BriefProcessTimeline
          eyebrow={localized(locale, content.processEyebrow)}
          title={localized(locale, content.processTitle)}
          description={
            content.processDescription
              ? localized(locale, content.processDescription)
              : locale === 'en'
                ? 'A clear sequence from the first conversation to delivery.'
                : 'Một hành trình rõ ràng từ lúc trao đổi đến khi giao hàng.'
          }
          steps={processSteps}
          dark
        />
      )}

      {content.productDetails && (
        <section className="border-t border-brief-neutral bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="brief-display-heading text-2xl text-brief-ink sm:text-3xl">
              {localized(locale, content.productDetails.title)}
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {content.productDetails.cards.map((card) => (
                <div
                  key={card.title.vi}
                  className="group flex flex-col overflow-hidden rounded-sm border border-brief-neutral bg-white p-4 shadow-sm transition hover:border-brief-gold hover:shadow-md"
                >
                  {card.image && (
                    <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-sm bg-brief-champagne">
                      <Image
                        src={card.image}
                        alt={localized(locale, card.title)}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="brief-display-heading text-base font-bold text-brief-ink">
                    {localized(locale, card.title)}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-brief-soft-ink">
                    {localized(locale, card.description)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {content.featuredProjects && (
        <section className="border-t border-brief-neutral bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <BriefSectionIntro
                eyebrow={content.featuredProjects.eyebrow ? localized(locale, content.featuredProjects.eyebrow) : (locale === 'en' ? 'Featured projects' : 'Các dự án tiêu biểu')}
                title={content.featuredProjects.title ? localized(locale, content.featuredProjects.title) : (locale === 'en' ? 'Projects delivered with customers' : 'Những công trình đã đồng hành cùng khách hàng')}
              />
              <Link
                href={localizedPath(lang, content.featuredProjects.viewAllHref || '/du-an')}
                className="text-sm font-semibold text-brief-red hover:text-brief-red-hover"
              >
                {content.featuredProjects.viewAllLabel
                  ? localized(locale, content.featuredProjects.viewAllLabel)
                  : locale === 'en'
                    ? 'View all projects'
                    : 'Xem tất cả dự án'}{' '}
                <ArrowRight className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {content.featuredProjects.projects.map((project, idx) => (
                <Link
                  key={idx}
                  href={localizedPath(lang, project.href || '/du-an')}
                  className="group flex flex-col overflow-hidden rounded-sm border border-brief-neutral bg-white shadow-sm transition duration-150 hover:-translate-y-1 hover:border-brief-gold hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brief-red"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-brief-champagne">
                    <Image
                      src={project.image}
                      alt={localized(locale, project.title)}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-3.5">
                    <h3 className="brief-display-heading text-sm font-bold text-brief-ink transition group-hover:text-brief-red">
                      {localized(locale, project.title)}
                    </h3>
                    {project.subtitle && (
                      <p className="mt-1 text-xs text-brief-soft-ink">
                        {localized(locale, project.subtitle)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqGroup && <section className="bg-brief-ivory py-12 sm:py-16"><div className="mx-auto max-w-4xl px-5"><h2 className="brief-display-heading mb-6">{locale === 'en' ? 'Frequently asked questions' : 'Câu hỏi thường gặp'}</h2><FAQAccordion items={getBriefFaqs(lang)[faqGroup]} /></div></section>}

      <ReferenceContactBanner
        lang={lang}
        title={localized(locale, content.cta.title)}
        description={localized(locale, content.cta.description)}
        image={content.ctaStyle === 'truck' ? '/images/reference/coastal-delivery_tam.webp' : content.cta.image}
        href={content.primaryAction.href}
        logistics={content.ctaStyle === 'truck'}
      />
    </div>
  );
}
