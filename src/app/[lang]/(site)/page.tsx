import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Gift, MessageCircle, Phone, Search } from 'lucide-react';
import { FaqList } from '@/components/site/faq-list';
import { JsonLd } from '@/components/site/json-ld';
import { CommitmentGrid, PressGrid, PressStrip, ProcessSteps, StatsStrip, Testimonials } from '@/components/site/marketing';
import { PostCard } from '@/components/site/post-card';
import { RouteExplorer } from '@/components/site/route-explorer';
import { SectionHeading } from '@/components/site/section-heading';
import { UploadImage } from '@/components/site/upload-image';
import { SITE_CONFIG, ZALO_URL } from '@/lib/constants';
import { getLegacyByPath, homeFaq, legacyPosts, relatedPosts } from '@/lib/legacy-content';
import { noBreakBrand } from '@/lib/legacy-render';
import { ABOUT, HERO, HERO_IMAGE, OFFER, POPULAR_ROUTES, SERVICES, SERVICES_LEAD } from '@/lib/marketing';
import { getExplorerRegions } from '@/lib/navigation';
import { generateLegacyJsonLd, legacyMetadata } from '@/lib/seo';
import { toTelHref } from '@/lib/site';
import { LeadSection } from '@/templates/sections';

export async function generateMetadata(): Promise<Metadata> {
  const home = getLegacyByPath('/');
  return home ? legacyMetadata(home) : {};
}

export default function HomePage() {
  const faq = homeFaq();
  const home = getLegacyByPath('/');
  // Guides that support the service pages (routes, trucks, cargo), not simply the newest three.
  const posts = home ? relatedPosts(home, 3) : legacyPosts.slice(0, 3);
  const regions = getExplorerRegions();
  const routeCount = regions.reduce((total, region) => total + region.items.length, 0);

  return (
    <>
      {home && <JsonLd data={generateLegacyJsonLd(home, [])} />}
      {/* ---------- hero ---------- */}
      <section className="relative isolate overflow-hidden bg-brand-700 text-white">
        <UploadImage src={HERO_IMAGE.src} alt={HERO_IMAGE.alt} fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-700 via-brand-700/90 to-brand-600/40" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-brand-700/90 to-transparent" aria-hidden="true" />
        <div className="container-x grid gap-8 pb-24 pt-10 md:pt-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-12 lg:pb-28 lg:pt-14">
          <div>
            <p className="eyebrow eyebrow-light">{SITE_CONFIG.slogan}</p>
            <h1 className="h-display mt-3 text-white">{HERO.title}</h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-on-brand">{HERO.lead}</p>
            <ul className="mt-5 grid gap-2 text-[0.9375rem] font-medium text-white sm:grid-cols-2">
              {HERO.points.map((point) => (
                <li key={point} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />{point}</li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="btn btn-lg btn-accent"><Phone className="h-5 w-5" aria-hidden="true" />Gọi {SITE_CONFIG.hotline}</a>
              <a href={ZALO_URL} target="_blank" rel="noopener" data-track="click_zalo" className="btn btn-lg btn-ghost-light"><MessageCircle className="h-5 w-5" aria-hidden="true" />Nhắn Zalo báo giá</a>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 text-ink shadow-[0_30px_60px_-30px_rgb(6_40_80/0.6)] sm:p-7">
            <p className="flex items-center gap-2 text-lg font-bold text-ink"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Search className="h-4 w-4" aria-hidden="true" /></span>Tra cứu tuyến vận chuyển</p>
            <p className="mt-1.5 text-sm text-muted">Nhập tỉnh/thành phố cần gửi hàng đến</p>
            <form action="/tim-kiem/" method="get" role="search" className="mt-4 flex gap-2">
              <label htmlFor="hero-search" className="sr-only">Tỉnh, thành phố</label>
              <input id="hero-search" name="q" type="search" required maxLength={120} placeholder="VD: Đà Nẵng, Hà Nội…" className="field min-w-0 flex-1 bg-surface" />
              <button type="submit" className="btn btn-primary shrink-0 px-4" aria-label="Tìm tuyến"><Search className="h-5 w-5" aria-hidden="true" /></button>
            </form>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-subtle">Tuyến được gửi nhiều</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {POPULAR_ROUTES.map(({ label, href }) => (
                <li key={href}><Link href={href} className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:border-brand-600 hover:bg-brand-600 hover:text-white">{label}</Link></li>
              ))}
            </ul>
            <Link href="/van-chuyen-hang-hoa/" className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">Xem tất cả {routeCount} tuyến <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <div className="container-x relative z-10 -mt-14 lg:-mt-16">
        <div className="rounded-2xl bg-white shadow-[var(--shadow-lift)]"><StatsStrip /></div>
        <div className="mt-4"><PressStrip /></div>
      </div>

      {/* ---------- services ---------- */}
      <section aria-labelledby="services" className="container-x py-12 md:py-16">
        <SectionHeading id="services" layout="split" eyebrow="Dịch vụ" title="Dịch vụ Vận tải Phương Vy đang cung cấp" lead={SERVICES_LEAD} />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {SERVICES.map((service) => (
            <Link key={service.href} href={service.href} className="card card-hover group flex flex-col overflow-hidden">
              <span className="relative block aspect-[16/7] overflow-hidden bg-surface">
                <UploadImage src={service.image} alt={service.imageAlt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
              </span>
              <span className="flex flex-1 flex-col p-5 sm:p-6">
                <span className="text-xl font-bold text-ink sm:text-2xl">{service.title}</span>{' '}
                <span className="mt-2 flex-1 text-muted">{service.text}</span>{' '}
                <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-brand-600">{service.cta}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" /></span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- routes ---------- */}
      <section aria-labelledby="routes" className="border-y border-line bg-surface">
        <div className="container-x py-12 md:py-16">
          <SectionHeading id="routes" layout="split" eyebrow="Tuyến vận chuyển" title="Gửi hàng từ TP.HCM đi các tỉnh" lead="Chọn khu vực hoặc gõ tên tỉnh để xem bảng giá, thời gian vận chuyển và lịch xe của từng tuyến." action={{ label: 'Trang tuyến vận chuyển', href: '/van-chuyen-hang-hoa/' }} />
          <div className="mt-8"><RouteExplorer regions={regions} compact defaultRegion="bac" /></div>
        </div>
      </section>

      {/* ---------- why us (the six reasons from the WordPress home page) ---------- */}
      <section aria-labelledby="why-us" className="container-x py-12 md:py-16">
        <SectionHeading id="why-us" align="center" eyebrow="Vì sao chọn Phương Vy" title="Tại sao nên chọn dịch vụ của Vận tải Phương Vy?" />
        <div className="mt-8"><CommitmentGrid /></div>
      </section>

      {/* ---------- process ---------- */}
      <section aria-labelledby="process" className="bg-brand-grid">
        <div className="container-x py-12 md:py-16">
          <SectionHeading id="process" tone="light" eyebrow="Quy trình" title="Gửi hàng chỉ với 4 bước" lead="Thủ tục đơn giản, không rườm rà — gọi điện hoặc nhắn Zalo là có xe đến nhận." />
          <div className="mt-8"><ProcessSteps /></div>
        </div>
      </section>

      {/* ---------- offer ---------- */}
      <section aria-labelledby="offer" className="container-x py-10 md:py-14">
        <div className="relative overflow-hidden rounded-3xl bg-accent-500 p-7 text-navy-950 sm:p-10">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-400 blur-2xl" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-navy-950 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-400"><Gift className="h-4 w-4" aria-hidden="true" />Ưu đãi</p>
              <h2 id="offer" className="h-section mt-4 text-navy-950">{OFFER.title}</h2>
              <p className="mt-3 font-medium">Áp dụng cho: {OFFER.services.join(' · ')}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {OFFER.perks.map((perk) => <li key={perk} className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-sm font-semibold"><CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />{perk}</li>)}
              </ul>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="btn btn-lg bg-navy-950 text-white hover:bg-navy-800"><Phone className="h-5 w-5" aria-hidden="true" />{SITE_CONFIG.hotline}</a>
              <Link href="#bao-gia" className="btn btn-lg border border-navy-950/20 bg-white text-navy-950 hover:bg-navy-950 hover:text-white">Nhận báo giá ưu đãi</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- about, press & customers: who Phương Vy is and what others say (about copy restored from the WordPress home page) ---------- */}
      {/* scroll-mt keeps the "Xem bài báo" jump target clear of the sticky header */}
      <section aria-labelledby="about" className="border-y border-line bg-surface [&_h2]:scroll-mt-32">
        <div className="container-x py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
            <div>
              <p className="eyebrow">Về Phương Vy</p>
              <h2 id="about" className="h-section mt-2.5"><Link href="/gioi-thieu/" className="transition hover:text-brand-600 hover:underline">{noBreakBrand(SITE_CONFIG.companyName)}</Link></h2>
              <div className="mt-4 space-y-4 text-[1.0625rem] leading-8 text-muted">
                {ABOUT.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
            {/* fills the text column's height from lg up, so the photo never floats in empty space */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-[var(--shadow-lift)] sm:aspect-[2/1] lg:aspect-auto lg:min-h-[22rem]">
              <UploadImage src={SITE_CONFIG.defaultImage} alt="Công ty vận tải Phương Vy" fill sizes="(min-width: 1280px) 34rem, (min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>

          <div className="mt-12 border-t border-line pt-12 md:mt-16 md:pt-16">
            <SectionHeading id="press" align="center" eyebrow="Báo chí" title="Báo chí nói về Vận tải Phương Vy" />
            <div className="mt-8"><PressGrid /></div>
          </div>

          <div className="mt-12 md:mt-16">
            <SectionHeading id="testimonials" align="center" eyebrow="Khách hàng" title="Khách hàng nói gì về Phương Vy" />
            <div className="mt-8"><Testimonials /></div>
          </div>
        </div>
      </section>

      {/* ---------- faq ---------- */}
      {faq.length > 0 && (
        <section aria-labelledby="home-faq">
          <div className="container-x grid gap-8 py-12 md:py-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
            <div className="lg:sticky lg:top-28 lg:self-start"><SectionHeading id="home-faq" layout="stack" eyebrow="Hỏi đáp" title="Câu hỏi thường gặp" lead="Những thắc mắc phổ biến khi gửi hàng và thuê xe tải tại Phương Vy." action={{ label: 'Xem tất cả câu hỏi', href: '/faq/' }} /></div>
            <FaqList items={faq} />
          </div>
        </section>
      )}

      {/* ---------- blog ---------- */}
      <section aria-labelledby="home-blog" className="border-t border-line bg-surface">
        <div className="container-x py-12 md:py-16">
          <SectionHeading id="home-blog" eyebrow="Cẩm nang vận tải" title="Tin tức & kinh nghiệm gửi hàng" action={{ label: 'Xem tất cả bài viết', href: '/blog/' }} />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <PostCard key={post.path} post={post} />)}
          </div>
        </div>
      </section>

      <LeadSection title="Nhận bảng báo giá vận chuyển mới nhất" page="/" />
    </>
  );
}
