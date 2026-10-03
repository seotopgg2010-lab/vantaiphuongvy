import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Gift, MessageCircle, Phone, Search } from 'lucide-react';
import { FaqList } from '@/components/site/faq-list';
import { CommitmentGrid, PressGrid, ProcessSteps, StatsStrip, Testimonials } from '@/components/site/marketing';
import { PostCard } from '@/components/site/post-card';
import { RouteExplorer } from '@/components/site/route-explorer';
import { SectionHeading } from '@/components/site/section-heading';
import { SITE_CONFIG, ZALO_URL } from '@/lib/constants';
import { getLegacyByPath, legacyPosts } from '@/lib/legacy-content';
import { HERO_IMAGE, OFFER, SERVICES } from '@/lib/marketing';
import { getExplorerRegions } from '@/lib/navigation';
import { legacyMetadata } from '@/lib/seo';
import { toTelHref } from '@/lib/site';
import { LeadSection } from '@/templates/sections';

const POPULAR = [
  ['Hà Nội', '/van-chuyen-hang-hoa/ha-noi/'],
  ['Đà Nẵng', '/van-chuyen-hang-hoa/da-nang/'],
  ['Huế', '/van-chuyen-hang-hoa/hue/'],
  ['Nha Trang', '/van-chuyen-hang-hoa/nha-trang/'],
  ['Hải Phòng', '/van-chuyen-hang-hoa/hai-phong/'],
  ['Cần Thơ', '/van-chuyen-hang-hoa/can-tho/'],
  ['Phú Quốc', '/van-chuyen-hang-hoa/chanh-xe-phu-quoc/'],
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const home = getLegacyByPath('/');
  return home ? legacyMetadata(home) : {};
}

export default function HomePage() {
  const faq = (getLegacyByPath('/faq')?.faq || []).slice(0, 6);
  const posts = legacyPosts.slice(0, 3);

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <Image src={HERO_IMAGE.src} alt={HERO_IMAGE.alt} fill priority sizes="100vw" className="-z-20 object-cover object-center opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-navy-950 to-transparent" aria-hidden="true" />
        <div className="container-x grid gap-10 pb-28 pt-14 md:pt-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-14 lg:pb-36 lg:pt-24">
          <div>
            <p className="eyebrow eyebrow-light">{SITE_CONFIG.slogan}</p>
            <h1 className="h-display mt-4 text-white">Vận chuyển hàng hóa Bắc Nam &amp; cho thuê xe tải toàn quốc</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-sky-100/85">
              Hơn 10 năm chành xe từ TP.HCM đi các tỉnh và ngược lại. Nhận hàng tận nơi, xe chạy hàng ngày, giá cước rõ ràng — có hóa đơn và bảo hiểm hàng hóa.
            </p>
            <ul className="mt-6 grid gap-2 text-[0.9375rem] text-sky-50 sm:grid-cols-2">
              {['Miễn phí bốc dỡ & lưu kho', 'Giao hàng tận nơi', 'Xe tải 0,5 – 30 tấn', 'Làm việc cả ngày lễ'].map((point) => (
                <li key={point} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />{point}</li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={toTelHref(SITE_CONFIG.hotline)} data-track="click_call" className="btn btn-lg btn-accent"><Phone className="h-5 w-5" aria-hidden="true" />Gọi {SITE_CONFIG.hotline}</a>
              <a href={ZALO_URL} target="_blank" rel="noopener" data-track="click_zalo" className="btn btn-lg btn-ghost-light"><MessageCircle className="h-5 w-5" aria-hidden="true" />Nhắn Zalo báo giá</a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-md sm:p-7">
            <p className="text-lg font-bold text-white">Tra cứu tuyến vận chuyển</p>
            <p className="mt-1 text-sm text-sky-100/75">Nhập tỉnh/thành phố cần gửi hàng đến</p>
            <form action="/tim-kiem/" method="get" role="search" className="mt-5 flex gap-2">
              <label htmlFor="hero-search" className="sr-only">Tỉnh, thành phố</label>
              <input id="hero-search" name="q" type="search" required maxLength={120} placeholder="VD: Đà Nẵng, Hà Nội…" className="field min-w-0 flex-1 border-transparent" />
              <button type="submit" className="btn btn-accent shrink-0 px-4" aria-label="Tìm tuyến"><Search className="h-5 w-5" aria-hidden="true" /></button>
            </form>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-sky-100/60">Tuyến được gửi nhiều</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {POPULAR.map(([label, href]) => (
                <li key={href}><Link href={href} className="inline-flex rounded-full border border-white/20 px-3 py-1.5 text-sm font-medium text-white transition hover:border-accent-400 hover:bg-accent-500 hover:text-navy-950">{label}</Link></li>
              ))}
            </ul>
            <Link href="/van-chuyen-hang-hoa/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-400 hover:underline">Xem tất cả tuyến <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <div className="container-x relative z-10 -mt-16 lg:-mt-20">
        <div className="rounded-2xl bg-white shadow-[var(--shadow-lift)]"><StatsStrip /></div>
      </div>

      {/* ---------- services ---------- */}
      <section aria-labelledby="services" className="container-x py-16 md:py-24">
        <SectionHeading id="services" eyebrow="Dịch vụ" title="Dịch vụ Vận tải Phương Vy đang cung cấp" lead="Nhận gửi hàng đi toàn quốc mọi loại hàng hóa pháp luật cho phép — không giới hạn số lượng, kích thước, trọng lượng." />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {SERVICES.map((service) => (
            <Link key={service.href} href={service.href} className="card card-hover group flex flex-col overflow-hidden">
              <span className="relative block aspect-[16/7] overflow-hidden bg-surface">
                <Image src={service.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
              </span>
              <span className="flex flex-1 flex-col p-6 sm:p-7">
                <span className="text-xl font-bold text-ink sm:text-2xl">{service.title}</span>
                <span className="mt-2 flex-1 text-muted">{service.text}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand-600">{service.cta}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" /></span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- routes ---------- */}
      <section aria-labelledby="routes" className="border-y border-line bg-surface">
        <div className="container-x py-16 md:py-24">
          <SectionHeading id="routes" eyebrow="Tuyến vận chuyển" title="Gửi hàng từ TP.HCM đi các tỉnh" lead="Chọn khu vực hoặc gõ tên tỉnh để xem bảng giá, thời gian vận chuyển và lịch xe của từng tuyến." action={{ label: 'Trang tuyến vận chuyển', href: '/van-chuyen-hang-hoa/' }} />
          <div className="mt-10"><RouteExplorer regions={getExplorerRegions()} compact defaultRegion="bac" /></div>
        </div>
      </section>

      {/* ---------- why us ---------- */}
      <section aria-labelledby="why-us" className="container-x py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <SectionHeading id="why-us" eyebrow="Vì sao chọn Phương Vy" title="Đối tác vận chuyển doanh nghiệp tin dùng hơn 10 năm" />
            <p className="lead mt-5">{SITE_CONFIG.companyName} hoạt động trong lĩnh vực chành xe – vận chuyển hàng hóa hơn 10 năm, với đội ngũ nhân viên và đội xe tải hùng hậu, cam kết giao hàng đúng hẹn và tiết kiệm chi phí cho khách hàng.</p>
            <div className="relative mt-8 aspect-square max-w-md overflow-hidden rounded-2xl shadow-[var(--shadow-lift)]">
              <Image src={SITE_CONFIG.defaultImage} alt="Công ty vận tải Phương Vy" fill sizes="(min-width: 1024px) 28rem, 100vw" className="object-cover" />
            </div>
          </div>
          <CommitmentGrid />
        </div>
      </section>

      {/* ---------- process ---------- */}
      <section aria-labelledby="process" className="bg-grid-navy">
        <div className="container-x py-16 md:py-24">
          <SectionHeading id="process" tone="light" eyebrow="Quy trình" title="Gửi hàng chỉ với 4 bước" lead="Thủ tục đơn giản, không rườm rà — gọi điện hoặc nhắn Zalo là có xe đến nhận." />
          <div className="mt-12"><ProcessSteps /></div>
        </div>
      </section>

      {/* ---------- offer ---------- */}
      <section aria-labelledby="offer" className="container-x py-16 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-accent-500 p-8 text-navy-950 sm:p-12">
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

      {/* ---------- press ---------- */}
      <section aria-labelledby="press" className="border-y border-line bg-surface">
        <div className="container-x py-16 md:py-24">
          <SectionHeading id="press" eyebrow="Báo chí" title="Báo chí nói về Vận tải Phương Vy" align="center" />
          <div className="mt-10"><PressGrid /></div>
        </div>
      </section>

      {/* ---------- testimonials ---------- */}
      <section aria-labelledby="testimonials" className="container-x py-16 md:py-24">
        <SectionHeading id="testimonials" eyebrow="Khách hàng" title="Khách hàng nói gì về Phương Vy" />
        <div className="mt-10"><Testimonials /></div>
      </section>

      {/* ---------- faq ---------- */}
      {faq.length > 0 && (
        <section aria-labelledby="home-faq" className="border-t border-line">
          <div className="container-x grid gap-10 py-16 md:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <SectionHeading id="home-faq" eyebrow="Hỏi đáp" title="Câu hỏi thường gặp" lead="Những thắc mắc phổ biến khi gửi hàng và thuê xe tải tại Phương Vy." action={{ label: 'Xem tất cả câu hỏi', href: '/faq/' }} />
            <FaqList items={faq} />
          </div>
        </section>
      )}

      {/* ---------- blog ---------- */}
      <section aria-labelledby="home-blog" className="border-t border-line bg-surface">
        <div className="container-x py-16 md:py-24">
          <SectionHeading id="home-blog" eyebrow="Cẩm nang vận tải" title="Tin tức & kinh nghiệm gửi hàng" action={{ label: 'Xem tất cả bài viết', href: '/blog/' }} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <PostCard key={post.path} post={post} />)}
          </div>
        </div>
      </section>

      <LeadSection title="Nhận bảng báo giá vận chuyển mới nhất" page="/" />
    </>
  );
}
