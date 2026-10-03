'use client';

import { createElement } from 'react';
import { Globe2, Settings, ShieldCheck, Users } from 'lucide-react';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { BriefHero } from '@/components/brief';
import { getHomeHeroFallback } from '@/content/brief-demo';

type HeroSectionProps = {
  lang: string;
  dict: Dictionary;
  bannerImage?: string;
  bannerMobileImage?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
};

export function HeroSection({
  lang,
}: HeroSectionProps) {
  const locale = lang.toLowerCase().startsWith('en') ? 'en' : 'vi';
  const fallback = getHomeHeroFallback(locale);
  const title = locale === 'en'
    ? <>Connecting<br /><span className="text-brief-red">Vietnam&apos;s resources</span><br />to the world</>
    : <>Kết nối<br /><span className="text-brief-red">nguồn lực Việt Nam</span><br />với thế giới</>;
  const description = fallback.description;
  const benefitIcons = [Globe2, ShieldCheck, Settings, Users];
  const benefits = fallback.benefits.map((benefit, index) => ({
    title: benefit.title[locale],
    description: benefit.description[locale],
    icon: createElement(benefitIcons[index] || Globe2, { className: 'h-5 w-5', 'aria-hidden': true }),
  }));

  return (
    <BriefHero
      lang={locale}
      eyebrow="Connecting Vietnam’s Resources to Global Businesses"
      title={title}
      description={description}
      capabilityLine={fallback.capabilityLine}
      scriptAccent={locale === 'en' ? 'Small distances, Big connections' : 'Từ Việt Nam đến những chân trời xa'}
      desktopImage={fallback.image.desktop}
      mobileImage={fallback.image.mobile}
      imageAlt={fallback.image.alt[locale]}
      actions={[
        {
          label: locale === 'en' ? 'Contact now' : 'Liên hệ ngay',
          href: '/lien-he',
          variant: 'primary',
        },
        {
          label: locale === 'en' ? 'View services' : 'Xem dịch vụ',
          href: '#dich-vu',
          variant: 'secondary',
        },
      ]}
      benefits={benefits}
    />
  );
}
