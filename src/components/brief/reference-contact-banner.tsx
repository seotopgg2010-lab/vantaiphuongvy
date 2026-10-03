import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Globe, Handshake, Lightbulb, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { localizedPath } from '@/lib/site';

type ReferenceContactBannerProps = {
  lang: string;
  title: string;
  description?: string;
  image?: string;
  href?: string;
  logistics?: boolean;
};

export function ReferenceContactBanner({
  lang,
  title,
  description,
  image = '/images/reference/coastal-delivery_tam.webp',
  href = '/lien-he',
  logistics = false,
}: ReferenceContactBannerProps) {
  const english = lang.toLowerCase().startsWith('en');

  const logisticsBadges = [
    { icon: Truck, title: english ? 'DDP door-to-door delivery' : 'Giao hàng DDP tận nơi', desc: english ? 'All taxes & customs included' : 'Bao trọn thuế phí 2 đầu' },
    { icon: ShieldCheck, title: english ? 'On-time guarantee' : 'Cam kết đúng tiến độ', desc: english ? 'Strict timeline tracking' : 'Theo dõi sát sao từng chặng' },
    { icon: PackageCheck, title: english ? '100% cargo insurance' : 'Bảo hiểm hàng hóa 100%', desc: english ? 'Safe and fully insured' : 'An tâm tối đa khi vận chuyển' },
    { icon: Globe, title: english ? '24/7 bilingual support' : 'Hỗ trợ 24/7 song ngữ', desc: english ? 'Vietnamese & German' : 'Đức - Việt luôn sẵn sàng' },
  ];

  const standardBadges = [
    { icon: Lightbulb, title: english ? 'Dedicated advice' : 'Tư vấn tận tâm', desc: english ? 'Solutions tailored to needs' : 'Phương án tối ưu ngân sách' },
    { icon: ShieldCheck, title: english ? 'Guaranteed quality' : 'Chất lượng đảm bảo', desc: english ? 'Manufactured to EU standards' : 'Sản xuất theo tiêu chuẩn cao' },
    { icon: Handshake, title: english ? 'Long-term partnership' : 'Đồng hành dài hạn', desc: english ? 'Continuous technical support' : 'Hỗ trợ kỹ thuật sau bàn giao' },
  ];

  return (
    <section className="relative isolate overflow-hidden border-t border-brief-gold bg-brief-dark">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover object-center" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-brief-ivory via-brief-ivory/90 to-transparent sm:via-brief-ivory/80 lg:via-brief-ivory/40"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid min-h-80 max-w-7xl items-center gap-8 px-5 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.8fr_1fr] lg:px-8">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-brief-gold">
            {english ? 'With Hamburg Connect' : 'CÙNG HAMBURG CONNECT'}
          </p>
          <h2 className="brief-display-heading text-2xl font-bold leading-tight text-brief-ink sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-sm leading-6 text-brief-soft-ink sm:text-base">
              {description}
            </p>
          )}
          <div className="mt-6">
            <Link
              href={localizedPath(lang, href)}
              className="brief-button-primary inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold shadow-md transition hover:scale-105 active:scale-[0.98]"
            >
              <span>{english ? 'Contact now' : 'Liên hệ ngay'}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {logistics ? (
          <div className="relative mx-auto hidden h-44 w-full max-w-xs lg:block">
            <Image
              src="/images/reference/truck-clean.png"
              alt="Hamburg Connect Delivery Truck"
              fill
              className="object-contain drop-shadow-lg"
            />
          </div>
        ) : (
          <div className="hidden lg:block" aria-hidden="true" />
        )}

        <div className="rounded-2xl border border-white/10 bg-brief-dark/90 p-5 text-white shadow-xl backdrop-blur-md">
          <div className={`grid gap-4 ${logistics ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {(logistics ? logisticsBadges : standardBadges).map(({ icon: Icon, title: bTitle, desc }) => (
              <div key={bTitle} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brief-gold/15 text-brief-gold">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white sm:text-sm">{bTitle}</p>
                  <p className="mt-0.5 text-[0.72rem] text-brief-warm-gray">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
