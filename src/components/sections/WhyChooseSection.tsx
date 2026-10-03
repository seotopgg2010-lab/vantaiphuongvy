import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Globe,
  HeartHandshake,
  PackageCheck,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { localizedPath } from '@/lib/site';

type WhyChooseLocale = 'vi' | 'en';

const REASONS = [
  {
    icon: Award,
    title: { vi: 'Kinh nghiệm thực tế', en: 'Proven experience' },
    description: {
      vi: 'Nhiều năm trong lĩnh vực logistics quốc tế',
      en: 'Years of international logistics experience',
    },
  },
  {
    icon: Globe,
    title: { vi: 'Mạng lưới vận chuyển rộng khắp', en: 'Extensive shipping network' },
    description: {
      vi: 'Hợp tác với các hãng tàu, hãng bay uy tín',
      en: 'Partnerships with leading carriers and airlines',
    },
  },
  {
    icon: PackageCheck,
    title: { vi: 'Hỗ trợ trọn gói', en: 'End-to-end support' },
    description: {
      vi: 'Từ đóng gói, thông quan đến giao tận nơi',
      en: 'From packing and customs to final delivery',
    },
  },
  {
    icon: HeartHandshake,
    title: { vi: 'Tư vấn tận tâm', en: 'Dedicated consultation' },
    description: {
      vi: 'Giải pháp phù hợp mỗi đơn hàng',
      en: 'Tailored solutions for every shipment',
    },
  },
  {
    icon: ShieldCheck,
    title: { vi: 'Minh bạch chi phí', en: 'Transparent pricing' },
    description: {
      vi: 'Báo giá rõ ràng, không phát sinh bất ngờ',
      en: 'Clear quotes with no hidden charges',
    },
  },
  {
    icon: Truck,
    title: { vi: 'Đồng hành dài hạn', en: 'Long-term partnership' },
    description: {
      vi: 'Hỗ trợ ngay cả sau khi giao hàng',
      en: 'Support that continues after delivery',
    },
  },
] as const;

export function WhyChooseSection({ lang }: { lang: string }) {
  const locale: WhyChooseLocale = lang.toLowerCase().startsWith('en') ? 'en' : 'vi';

  return (
    <section className="bg-brief-ivory py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Left column - text */}
          <div>
            <p className="brief-eyebrow">
              {locale === 'en'
                ? 'Why choose Hamburg Connect'
                : 'Vì sao chọn Hamburg Connect'}
            </p>
            <h2 className="brief-display-heading mt-2 text-3xl leading-tight text-brief-ink sm:text-4xl">
              {locale === 'en'
                ? <>More than shipping,{' '}<span className="text-brief-red">we are a bridge</span></>
                : <>Hơn cả vận chuyển,{' '}<span className="text-brief-red">chúng tôi là cầu nối</span></>}
            </h2>
            <p className="mt-5 text-[0.95rem] leading-7 text-brief-soft-ink">
              {locale === 'en'
                ? 'We don\u2019t just move goods from Vietnam to the world. We connect you with the right resources, oversee quality and stay with you until delivery.'
                : 'Chúng tôi không chỉ đưa hàng từ Việt Nam đến thế giới, mà còn kết nối anh chị với đúng nguồn lực tại Việt Nam, theo sát chất lượng và đồng hành đến khi hàng được giao tận tay.'}
            </p>
            <Link
              href={localizedPath(lang, '/lien-he')}
              className="brief-button-primary mt-7 inline-flex rounded-full"
            >
              {locale === 'en' ? 'Contact us' : 'Liên hệ ngay'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Right column - 3x2 grid of reasons */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
            {REASONS.map((reason) => {
              const Icon = reason.icon;
              return (
                <div
                  key={reason.title.vi}
                  className="flex flex-col items-center rounded-sm border border-brief-neutral bg-white p-5 text-center transition hover:border-brief-gold hover:shadow-sm"
                >
                  <Icon className="h-7 w-7 text-brief-gold" aria-hidden="true" />
                  <h3 className="brief-display-heading mt-4 text-lg leading-tight text-brief-ink">
                    {reason.title[locale]}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-brief-soft-ink">
                    {reason.description[locale]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
