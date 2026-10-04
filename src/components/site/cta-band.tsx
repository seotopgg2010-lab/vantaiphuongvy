import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';
import { SITE_CONFIG, ZALO_URL } from '@/lib/constants';
import { toTelHref } from '@/lib/site';

/** Full-width closing call-to-action band. */
export function CtaBand({
  title = 'Cần gửi hàng hoặc thuê xe tải hôm nay?',
  text = `Gọi ${SITE_CONFIG.hotline} hoặc nhắn Zalo — nhân viên Phương Vy báo giá ngay trong giờ làm việc (${SITE_CONFIG.businessHours}, cả ngày lễ).`,
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section aria-labelledby="cta-band-title" className="bg-brand-grid">
      <div className="container-x flex flex-col gap-8 py-10 md:py-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow eyebrow-light">Báo giá miễn phí</p>
          <h2 id="cta-band-title" className="h-section mt-3 text-white">{title}</h2>
          <p className="mt-3 text-on-brand">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="btn btn-lg btn-accent">
            <Phone className="h-5 w-5" aria-hidden="true" />{SITE_CONFIG.hotline}
          </a>
          <a href={ZALO_URL} target="_blank" rel="noopener" data-track="click_zalo" className="btn btn-lg bg-white text-[#0055d4] hover:bg-brand-50">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />Nhắn Zalo
          </a>
          <Link href="/lien-he/#bao-gia" className="btn btn-lg btn-ghost-light">Gửi yêu cầu</Link>
        </div>
      </div>
    </section>
  );
}
