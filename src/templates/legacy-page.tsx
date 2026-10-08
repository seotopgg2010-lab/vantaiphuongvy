import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock, Truck, UserRound } from 'lucide-react';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { CtaBand } from '@/components/site/cta-band';
import { LegacyComments } from '@/components/site/legacy-comments';
import { PageActions } from '@/components/site/page-actions';
import { RatingSummary } from '@/components/site/rating-summary';
import { formatDateVi } from '@/components/site/post-card';
import { RouteExplorer } from '@/components/site/route-explorer';
import { SectionHeading } from '@/components/site/section-heading';
import { StatsStrip } from '@/components/site/marketing';
import { UploadImage } from '@/components/site/upload-image';
import { RouteWarehouses } from '@/components/site/warehouse-list';
import { legacyCrumbs } from '@/lib/breadcrumbs';
import { relatedPosts, relatedRoutes, relatedServices, truckItems } from '@/lib/legacy-content';
import { displayTitle, heroContent } from '@/lib/legacy-render';
import type { LegacyAuthor, LegacyEntry } from '@/lib/legacy-types';
import { HERO_LEADS } from '@/lib/marketing';
import { markdownPathFor } from '@/lib/markdown-paths';
import { getExplorerRegions, withSlash } from '@/lib/navigation';
import { absoluteUrl, canonicalUrl } from '@/lib/seo';
import { ArticleBody } from './article-body';
import { ContactTemplate } from './contact-template';
import { PageHero, type HeroFact } from './page-hero';
import { LeadSection, RelatedPosts, RelatedRoutes } from './sections';

function routeFacts(item: LegacyEntry): HeroFact[] {
  const facts: HeroFact[] = [];
  if (item.facts.transit) facts.push({ icon: 'time', text: `Thời gian khoảng ${item.facts.transit}` });
  if (item.facts.priceFrom) facts.push({ icon: 'price', text: `Giá từ ${item.facts.priceFrom}` });
  facts.push({ text: 'Nhận & giao tận nơi' }, { text: 'Có hóa đơn VAT' });
  return facts;
}

function ServiceTemplate({ item }: { item: LegacyEntry }) {
  const { lead, body } = heroContent(item);
  const isRoute = item.template === 'route';
  const isTruck = item.template === 'truck';
  const eyebrow = isRoute ? `Chành xe · ${item.region === 'quoc-te' ? 'Quốc tế' : 'Tuyến TP.HCM ⇄ ' + item.label}` : isTruck ? 'Cho thuê xe tải' : 'Dịch vụ vận chuyển';
  return (
    <>
      <PageHero
        crumbs={legacyCrumbs(item)}
        eyebrow={eyebrow}
        title={displayTitle(item.title)}
        summary={lead}
        facts={isRoute || item.template === 'cargo' ? routeFacts(item) : [{ text: 'Xe 0,5 – 30 tấn' }, { text: 'Có tài xế, bốc xếp' }, { text: 'Có hóa đơn VAT' }]}
        rating={item.rating}
        image={item.image}
        imageAlt={item.imageAlt || item.title}
        formHref="#bao-gia"
      />
      <RouteWarehouses path={item.path} />
      <ArticleBody html={body} toc={item.toc} quoteHeading={isTruck ? `Báo giá ${item.label.toLowerCase()}` : `Báo giá tuyến ${item.label}`} quoteContext="Phản hồi nhanh trong giờ làm việc" />
      <LeadSection title={isTruck ? `Nhận báo giá ${item.label.toLowerCase()}` : `Nhận báo giá vận chuyển đi ${item.label}`} defaultTo={isRoute ? item.label : ''} page={withSlash(item.path)} />
      {isTruck ? <TruckLinks current={item.path} /> : item.region === 'loai-hang'
        ? <RelatedRoutes items={relatedRoutes(item)} eyebrow="Dịch vụ liên quan" title="Dịch vụ vận chuyển khác" />
        : <RelatedRoutes items={relatedRoutes(item)} />}
      <RelatedPosts posts={relatedPosts(item)} />
      <CtaBand />
    </>
  );
}

function TruckLinks({ current }: { current?: string }) {
  const items = truckItems.filter((truck) => truck.path !== current);
  return (
    <section aria-labelledby="truck-links" className="container-x py-10 md:py-14">
      <SectionHeading id="truck-links" eyebrow="Cho thuê xe tải" title="Thuê xe tải theo khu vực" action={{ label: 'Bảng giá thuê xe', href: '/thue-xe-tai/' }} />
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((truck) => (
          <li key={truck.path}>
            <Link href={withSlash(truck.path)} className="card card-hover group block h-full overflow-hidden">
              <span className="relative block aspect-[16/10] bg-surface">
                {truck.image && <UploadImage src={truck.image} alt={truck.imageAlt || truck.title} fill sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw" className="object-cover" />}
              </span>
              <span className="flex items-center justify-between gap-3 p-5">
                <span><span className="block text-lg font-bold text-ink">{truck.label}</span><span className="mt-1 block text-sm text-muted">Xe tải chở hàng nội thành & đi tỉnh</span></span>
                <ArrowRight className="h-5 w-5 shrink-0 text-subtle transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RouteHubTemplate({ item }: { item: LegacyEntry }) {
  const { lead, body } = heroContent(item);
  return (
    <>
      <PageHero crumbs={legacyCrumbs(item)} eyebrow="Chành xe Bắc – Trung – Nam" title={displayTitle(item.title)} summary={lead || item.seo.description} facts={[{ text: 'Xe chạy hàng ngày' }, { text: 'Nhận hàng tận nơi' }, { text: 'Có hóa đơn & bảo hiểm' }]} rating={item.rating} image={item.image} imageAlt={item.imageAlt || item.title} formHref="#bao-gia" />
      <section aria-labelledby="route-directory" className="container-x py-12 md:py-16">
        <SectionHeading id="route-directory" eyebrow="Danh sách tuyến" title="Chọn tỉnh, thành phố cần gửi hàng" lead="Tra cứu nhanh tuyến vận chuyển từ TP.HCM đi các tỉnh và ngược lại. Mỗi tuyến có bảng giá, thời gian và lịch xe riêng." />
        <div className="mt-8"><RouteExplorer regions={getExplorerRegions()} /></div>
      </section>
      <div className="border-y border-line bg-surface"><div className="container-x py-10"><StatsStrip /></div></div>
      <ArticleBody html={body} toc={item.toc} quoteHeading="Báo giá vận chuyển Bắc Nam" />
      <LeadSection title="Nhận bảng giá vận chuyển mới nhất" page={withSlash(item.path)} />
      <RelatedPosts posts={relatedPosts(item)} />
      <CtaBand />
    </>
  );
}

function TruckHubTemplate({ item }: { item: LegacyEntry }) {
  const { lead, body } = heroContent(item);
  return (
    <>
      <PageHero crumbs={legacyCrumbs(item)} eyebrow="Cho thuê xe tải chở hàng" title={displayTitle(item.title)} summary={lead || item.seo.description} facts={[{ text: 'Xe 0,5 – 30 tấn' }, { text: 'Thùng kín, thùng bạt' }, { text: 'Nội thành & đi tỉnh' }]} rating={item.rating} image="/wp-content/uploads/2018/08/thue-xe-tai-cong-ty-phuong-vy.jpg" imageAlt="Đội xe tải cho thuê của Vận tải Phương Vy" formHref="#bao-gia" />
      <TruckLinks />
      <ArticleBody html={body} toc={item.toc} quoteHeading="Báo giá thuê xe tải" />
      <LeadSection title="Nhận báo giá thuê xe tải" page={withSlash(item.path)} />
      <RelatedPosts posts={relatedPosts(item)} />
      <CtaBand />
    </>
  );
}

/** Who wrote the guide (from the WordPress author box), closing the article. */
function AuthorNote({ author }: { author: LegacyAuthor }) {
  return (
    <aside aria-labelledby="author-name" className="mt-12 max-w-[46rem] rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <p className="eyebrow">Về tác giả</p>
      <p id="author-name" className="mt-3 text-lg font-bold text-ink">{author.name}</p>
      {author.bio && <p className="mt-2 text-[0.9375rem] leading-7 text-muted">{author.bio}</p>}
    </aside>
  );
}

function PostTemplate({ item }: { item: LegacyEntry }) {
  const crumbs = legacyCrumbs(item);
  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="container-x py-10 md:py-14">
          <Breadcrumbs items={crumbs.map((crumb, index) => (index === crumbs.length - 1 ? { name: displayTitle(crumb.name) } : crumb))} />
          <p className="eyebrow mt-6">Cẩm nang vận tải</p>
          <h1 className="h-display mt-3 max-w-4xl">{displayTitle(item.title)}</h1>
          {HERO_LEADS[item.path] && <p className="lead mt-4 max-w-3xl">{HERO_LEADS[item.path]}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            {item.author
              ? <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-brand-600" aria-hidden="true" />Tác giả {item.author.name}</span>
              : <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-brand-600" aria-hidden="true" />Vận tải Phương Vy</span>}
            {item.date && <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" aria-hidden="true" /><time dateTime={item.date}>{formatDateVi(item.date)}</time></span>}
            {item.modified && item.modified.slice(0, 10) !== item.date?.slice(0, 10) && <span>Cập nhật <time dateTime={item.modified}>{formatDateVi(item.modified)}</time></span>}
            <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden="true" />{item.readingMinutes} phút đọc</span>
            {item.rating && <RatingSummary rating={item.rating} />}
          </div>
          <div className="mt-6"><PageActions url={canonicalUrl(item.path)} markdownUrl={absoluteUrl(markdownPathFor(item.path))} title={displayTitle(item.title)} /></div>
        </div>
      </header>
      {item.image && (
        <div className="container-x pt-10">
          <div className="relative mx-auto aspect-[16/8] max-w-5xl overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-card)]">
            <UploadImage src={item.image} alt={item.imageAlt || item.title} fill preload sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
          </div>
        </div>
      )}
      <ArticleBody html={item.html} toc={item.toc} quoteHeading="Cần vận chuyển hàng hóa?">
        {item.author && <AuthorNote author={item.author} />}
        {item.comments && <LegacyComments threads={item.comments} count={item.commentCount ?? 0} />}
      </ArticleBody>
      <RelatedRoutes items={relatedServices(item)} eyebrow="Dịch vụ liên quan" title="Dịch vụ Phương Vy cho nhu cầu này" action={null} />
      <RelatedPosts posts={relatedPosts(item)} title="Bài viết khác" />
      <CtaBand />
    </>
  );
}

function InfoTemplate({ item }: { item: LegacyEntry }) {
  const { lead, body } = heroContent(item);
  const isAbout = item.path === '/gioi-thieu' || item.path === '/thu-ngo';
  return (
    <>
      <PageHero crumbs={legacyCrumbs(item)} eyebrow={item.template === 'policy' ? 'Chính sách' : 'Vận tải Phương Vy'} title={displayTitle(item.title)} summary={lead} rating={item.rating} image={isAbout ? '/wp-content/uploads/2018/08/cong-ty-van-tai-phuong-vy.jpg' : undefined} imageAlt="Công ty vận tải Phương Vy" showActions={item.template !== 'policy'} />
      {isAbout && <div className="border-b border-line bg-surface"><div className="container-x py-10"><StatsStrip /></div></div>}
      <ArticleBody html={body} toc={item.toc} />
      <CtaBand />
    </>
  );
}

/** Picks the page template for a legacy entry. */
export function LegacyPage({ item }: { item: LegacyEntry }) {
  if (item.path === '/lien-he') return <ContactTemplate item={item} />;
  switch (item.template) {
    case 'route':
    case 'cargo':
    case 'truck':
      return <ServiceTemplate item={item} />;
    case 'route-hub':
      return <RouteHubTemplate item={item} />;
    case 'truck-hub':
      return <TruckHubTemplate item={item} />;
    case 'post':
      return <PostTemplate item={item} />;
    default:
      return <InfoTemplate item={item} />;
  }
}
