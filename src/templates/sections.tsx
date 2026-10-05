import Link from 'next/link';
import { ArrowRight, Clock3, Mail, MapPin, Phone, Truck } from 'lucide-react';
import { LeadForm } from '@/components/site/lead-form';
import { PostCard } from '@/components/site/post-card';
import { SectionHeading } from '@/components/site/section-heading';
import { SITE_CONFIG } from '@/lib/constants';
import type { LegacyEntry } from '@/lib/legacy-types';
import { withSlash } from '@/lib/navigation';
import { toTelHref } from '@/lib/site';

/** Inline quote form section (anchor target "#bao-gia"). */
export function LeadSection({ title, lead, defaultTo, page }: { title: string; lead?: string; defaultTo?: string; page: string }) {
  return (
    <section id="bao-gia" aria-labelledby="bao-gia-title" className="scroll-mt-24 bg-surface">
      <div className="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="min-w-0">
          <p className="eyebrow">Báo giá miễn phí</p>
          <h2 id="bao-gia-title" className="h-section mt-3">{title}</h2>
          <p className="lead mt-4">{lead || 'Để lại thông tin, nhân viên kinh doanh sẽ gọi lại báo giá chi tiết. Cần gấp? Gọi ngay hotline.'}</p>
          <ul className="mt-8 space-y-4 text-[0.9375rem]">
            {SITE_CONFIG.salesContacts.map((contact) => (
              <li key={contact.name} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-[var(--shadow-card)]"><Phone className="h-5 w-5" aria-hidden="true" /></span>
                <span><span className="block text-sm text-muted">Kinh doanh · {contact.name}</span>
                  {contact.phones.map((phone, index) => (
                    <span key={phone}>{index > 0 && <span className="text-subtle"> – </span>}<a href={toTelHref(phone)} data-track="click_call" className="font-bold text-ink hover:text-brand-600">{phone}</a></span>
                  ))}
                </span>
              </li>
            ))}
            <li className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-[var(--shadow-card)]"><Mail className="h-5 w-5" aria-hidden="true" /></span>
              <span className="min-w-0"><span className="block text-sm text-muted">Email</span><a href={`mailto:${SITE_CONFIG.email}`} className="break-all font-bold text-ink hover:text-brand-600">{SITE_CONFIG.email}</a></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-[var(--shadow-card)]"><Clock3 className="h-5 w-5" aria-hidden="true" /></span>
              <span><span className="block text-sm text-muted">Giờ làm việc</span><span className="font-bold text-ink">{SITE_CONFIG.businessHours}, tất cả các ngày</span></span>
            </li>
          </ul>
        </div>
        <div className="card min-w-0 p-6 sm:p-8">
          <LeadForm defaultTo={defaultTo} page={page} />
        </div>
      </div>
    </section>
  );
}

const ALL_ROUTES = { label: 'Xem tất cả tuyến', href: '/van-chuyen-hang-hoa/' };

export function RelatedRoutes({ items, title = 'Các tuyến vận chuyển khác', eyebrow = 'Tuyến liên quan', action = ALL_ROUTES }: { items: LegacyEntry[]; title?: string; eyebrow?: string; action?: { label: string; href: string } | null }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="related-routes" className="container-x py-10 md:py-14">
      <SectionHeading id="related-routes" eyebrow={eyebrow} title={title} action={action ?? undefined} />
      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const isRoute = item.template === 'route';
          const Icon = isRoute ? MapPin : Truck;
          return (
            <li key={item.path}>
              <Link href={withSlash(item.path)} className="group flex h-full items-center gap-3 rounded-xl border border-line bg-white p-4 transition hover:border-brand-500 hover:shadow-[var(--shadow-card)]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-muted">{isRoute ? 'Tuyến' : item.template === 'truck' ? 'Thuê xe tải' : 'Dịch vụ'}</span>
                  <span className="line-clamp-2 font-semibold text-ink">{item.label}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-subtle transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function RelatedPosts({ posts, title = 'Cẩm nang vận tải' }: { posts: LegacyEntry[]; title?: string }) {
  if (!posts.length) return null;
  return (
    <section aria-labelledby="related-posts" className="border-t border-line bg-white">
      <div className="container-x py-10 md:py-14">
        <SectionHeading id="related-posts" eyebrow="Kiến thức" title={title} action={{ label: 'Xem tất cả bài viết', href: '/blog/' }} />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => <PostCard key={post.path} post={post} />)}
        </div>
      </div>
    </section>
  );
}
