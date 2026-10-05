import { Building2, Clock3, FileText, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { LeadForm } from '@/components/site/lead-form';
import { SITE_CONFIG, ZALO_URL } from '@/lib/constants';
import { legacyCrumbs } from '@/lib/breadcrumbs';
import type { LegacyEntry } from '@/lib/legacy-types';
import { toTelHref } from '@/lib/site';
import { PageHero } from './page-hero';

function InfoRow({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4 py-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon className="h-5 w-5" aria-hidden="true" /></span>
      <div className="min-w-0 text-[0.9375rem]"><p className="text-sm text-muted">{label}</p><div className="mt-0.5 font-semibold text-ink">{children}</div></div>
    </li>
  );
}

/** /lien-he: verified company details from the live page + the quote form. */
export function ContactTemplate({ item }: { item: LegacyEntry }) {
  return (
    <>
      <PageHero
        crumbs={legacyCrumbs(item)}
        eyebrow="Liên hệ & báo giá"
        title="Liên hệ Vận tải Phương Vy"
        summary={`Gọi hotline, nhắn Zalo hoặc gửi yêu cầu bên dưới — nhân viên kinh doanh phản hồi trong giờ làm việc ${SITE_CONFIG.businessHours}, tất cả các ngày trong tuần.`}
        formHref="#bao-gia"
      />
      <section className="container-x grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold">{SITE_CONFIG.companyName}</h2>
          <ul className="mt-4 divide-y divide-line">
            <InfoRow icon={Building2} label="Trụ sở chính">{SITE_CONFIG.address}</InfoRow>
            <InfoRow icon={MapPin} label="Hệ thống bãi xe">
              <ul className="space-y-1.5 font-normal text-ink">
                {SITE_CONFIG.yards.map((yard) => <li key={yard.region}><span className="font-semibold">{yard.region}:</span> {yard.address}</li>)}
              </ul>
            </InfoRow>
            <InfoRow icon={Phone} label="Phòng kinh doanh">
              <ul className="space-y-1.5">
                {SITE_CONFIG.salesContacts.map((contact) => (
                  <li key={contact.name}><span className="font-normal text-muted">{contact.name}: </span>
                    {contact.phones.map((phone, index) => <span key={phone}>{index > 0 && ' – '}<a href={toTelHref(phone)} data-track="click_call" className="hover:text-brand-600">{phone}</a></span>)}
                  </li>
                ))}
                <li><span className="font-normal text-muted">Điện thoại bàn: </span><a href={toTelHref(SITE_CONFIG.landline)} className="hover:text-brand-600">{SITE_CONFIG.landline}</a></li>
              </ul>
            </InfoRow>
            <InfoRow icon={Mail} label="Email">
              {SITE_CONFIG.emails.map((email) => <a key={email} href={`mailto:${email}`} className="block break-all hover:text-brand-600">{email}</a>)}
            </InfoRow>
            <InfoRow icon={Clock3} label="Giờ làm việc">{SITE_CONFIG.businessHours}, tất cả các ngày (kể cả ngày lễ)</InfoRow>
            <InfoRow icon={FileText} label="Mã số thuế">{SITE_CONFIG.taxId}</InfoRow>
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="btn btn-primary"><Phone className="h-4 w-4" aria-hidden="true" />Gọi hotline</a>
            <a href={ZALO_URL} target="_blank" rel="noopener" data-track="click_zalo" className="btn btn-zalo"><MessageCircle className="h-4 w-4" aria-hidden="true" />Nhắn Zalo</a>
          </div>
        </div>
        <div id="bao-gia" className="min-w-0 scroll-mt-24">
          <div className="card p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Gửi yêu cầu báo giá</h2>
            <p className="mt-2 text-muted">Điền thông tin theo mẫu, Phương Vy sẽ liên hệ lại trong thời gian sớm nhất.</p>
            <div className="mt-6"><LeadForm page="/lien-he/" /></div>
          </div>
        </div>
      </section>
      <section aria-label="Bản đồ trụ sở" className="container-x pb-16">
        <div className="overflow-hidden rounded-2xl border border-line shadow-[var(--shadow-card)]">
          <iframe src={SITE_CONFIG.mapEmbed} title={`Bản đồ: ${SITE_CONFIG.address}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="block h-[360px] w-full md:h-[440px]" />
        </div>
      </section>
    </>
  );
}
