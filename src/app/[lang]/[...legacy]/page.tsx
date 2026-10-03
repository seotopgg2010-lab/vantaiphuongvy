import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock3, MapPin, Package, Phone, Truck } from 'lucide-react';
import { getLegacyByPath, legacyItems, oldImageUrl } from '@/lib/legacy-content';
import { SITE_CONFIG } from '@/lib/constants';
import { canonicalUrl, generateBreadcrumbJsonLd, ORGANIZATION_ID, WEBSITE_ID } from '@/lib/seo';
import { getRichTextHeadings, renderRichText, serializeJsonLd } from '@/lib/rich-text';
import { ContactForm } from '@/components/forms/ContactForm';

const ORGANIZATION_NAME = 'Công ty TNHH Dịch vụ Vận tải Phương Vy';

function faqSchema(content: string) {
  const questions = [...content.matchAll(/<(?:h[2-6]|strong)[^>]*>\s*([^<]{8,180}\?)\s*<\/(?:h[2-6]|strong)>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(([, question, answer]) => ({ '@type': 'Question', name: question.replace(/\s+/g, ' ').trim(), acceptedAnswer: { '@type': 'Answer', text: answer.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() } }))
    .filter((entry) => entry.acceptedAnswer.text.length > 0);
  return questions.length >= 2 ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: questions } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ legacy?: string[] }> }): Promise<Metadata> {
  const { legacy = [] } = await params;
  const item = getLegacyByPath(`/${legacy.join('/')}`);
  if (!item) return { title: 'Không tìm thấy trang' };
  const canonical = canonicalUrl(item.path);
  const image = oldImageUrl(item.image) || 'https://vantaiphuongvy.com/wp-content/uploads/2018/08/cong-ty-van-tai-phuong-vy.jpg';
  return { title: `${item.title} | Vận tải Phương Vy`, description: item.excerpt || 'Thông tin dịch vụ vận tải và chành xe Phương Vy.', alternates: { canonical }, openGraph: { type: item.kind === 'post' ? 'article' : 'website', title: item.title, description: item.excerpt, url: canonical, images: [{ url: image, alt: item.title }] }, twitter: { card: 'summary_large_image', title: item.title, description: item.excerpt, images: [image] } };
}

export default async function LegacyPage({ params }: { params: Promise<{ legacy?: string[] }> }) {
  const { legacy = [] } = await params;
  const item = getLegacyByPath(`/${legacy.join('/')}`);
  if (!item) notFound();

  const url = canonicalUrl(item.path);
  const organization = { '@id': ORGANIZATION_ID, '@type': 'Organization', name: ORGANIZATION_NAME, url: canonicalUrl() };
  const schema = item.kind === 'post'
    ? { '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${url}#blogposting`, headline: item.title, description: item.excerpt, datePublished: item.date, dateModified: item.modified || item.date, mainEntityOfPage: { '@id': `${url}#webpage` }, image: oldImageUrl(item.image), inLanguage: 'vi-VN', author: organization, publisher: organization }
    : { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#webpage`, name: item.title, description: item.excerpt, url, inLanguage: 'vi-VN', isPartOf: { '@id': WEBSITE_ID }, about: { '@id': ORGANIZATION_ID } };
  const serviceSchema = item.kind === 'page' && /^(\/van-chuyen-hang-hoa|\/thue-xe-tai)(\/|$)/.test(item.path)
    ? { '@context': 'https://schema.org', '@type': 'Service', '@id': `${url}#service`, name: item.title, description: item.excerpt, serviceType: item.path.startsWith('/thue-xe-tai') ? 'Cho thuê xe tải' : 'Vận chuyển hàng hóa', provider: { '@id': ORGANIZATION_ID }, areaServed: { '@type': 'Country', name: 'Việt Nam' }, url, inLanguage: 'vi-VN' }
    : null;
  const breadcrumb = generateBreadcrumbJsonLd([{ name: 'Trang chủ', url: canonicalUrl() }, { name: item.title, url }]);
  const pageFaqSchema = item.path === '/faq' ? faqSchema(item.content) : null;
  const isTransportPage = item.path.startsWith('/van-chuyen-hang-hoa') || item.path.startsWith('/thue-xe-tai');
  const isContactPage = item.path === '/lien-he';
  const routeName = item.title.replace(/^(Chành xe|Vận chuyển hàng hóa|Thuê xe tải)\s*/i, '').trim() || 'tuyến của bạn';
  const routeFacts = item.path.startsWith('/thue-xe-tai')
    ? [{ icon: Truck, label: 'Hình thức', value: 'Thuê xe theo chuyến' }, { icon: MapPin, label: 'Khu vực', value: routeName }, { icon: Clock3, label: 'Tư vấn', value: SITE_CONFIG.businessHours }]
    : [{ icon: MapPin, label: 'Tuyến', value: routeName }, { icon: Package, label: 'Nhận hàng', value: 'Hàng lẻ & hàng số lượng lớn' }, { icon: Clock3, label: 'Tư vấn', value: SITE_CONFIG.businessHours }];
  const relatedItems = legacyItems.filter((candidate) => candidate.path !== item.path && candidate.path !== '/home-3' && (candidate.path.startsWith('/van-chuyen-hang-hoa/') === item.path.startsWith('/van-chuyen-hang-hoa/') || candidate.kind === item.kind)).slice(0, 3);
  const serviceLinks = isTransportPage
    ? (item.path.startsWith('/thue-xe-tai')
      ? legacyItems.filter((candidate) => candidate.path.startsWith('/thue-xe-tai/') && candidate.path !== item.path).slice(0, 3)
      : legacyItems.filter((candidate) => candidate.path.startsWith('/van-chuyen-hang-hoa/') && candidate.path !== item.path && !/\/(xe-may|may-moc-thiet-bi|dau-nhot|sieu-truong-sieu-trong|duong-bien|duong-hang-khong)$/.test(candidate.path)).slice(0, 6))
    : [];
  const heroImage = oldImageUrl(item.image);
  const contentHeadings = getRichTextHeadings(item.content);

  return <article className="min-h-screen bg-brief-ivory py-8 sm:py-14">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />
    {serviceSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceSchema) }} />}
    {pageFaqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(pageFaqSchema) }} />}
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-brief-soft-ink"><Link className="font-medium text-brief-red hover:underline" href="/">Trang chủ</Link><span className="mx-2" aria-hidden="true">/</span><span aria-current="page">{item.title}</span></nav>
      <header className="relative overflow-hidden rounded-t-2xl bg-brief-dark px-6 py-10 text-white sm:px-10">{heroImage && <Image src={heroImage} alt="" width={1200} height={500} className="absolute inset-0 h-full w-full object-cover opacity-20" priority sizes="(max-width: 1024px) 100vw, 1024px" />}<div className="absolute inset-0 bg-brief-dark/70" aria-hidden="true" /><div className="relative"><p className="mb-3 text-sm font-bold uppercase tracking-[.16em] text-brief-gold">Vận tải Phương Vy · {item.kind === 'post' ? 'Cẩm nang' : 'Dịch vụ vận tải'}</p><h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">{item.title}</h1>{item.excerpt && <p className="mt-5 max-w-3xl text-lg leading-8 text-sky-50">{item.excerpt}</p>}{isTransportPage && <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/lien-he" className="brief-button-primary rounded-md">Nhận báo giá tuyến này <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link><a href="tel:0933871139" className="brief-button-secondary rounded-md border-white/40 bg-white/10 text-white hover:bg-white hover:text-brief-dark"><Phone className="h-4 w-4" aria-hidden="true" />Gọi tư vấn</a></div>}</div></header>
      {isTransportPage && <><section className="border-x border-b border-brief-neutral bg-white px-5 py-5 sm:px-10"><div className="grid gap-4 sm:grid-cols-3">{routeFacts.map(({ icon: Icon, label, value }) => <div key={label} className="flex items-start gap-3 border-b border-brief-neutral pb-4 last:border-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4 sm:last:border-0"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-brief-red" aria-hidden="true" /><span><span className="block text-xs font-bold uppercase tracking-wide text-brief-soft-ink">{label}</span><strong className="mt-1 block text-sm text-brief-ink">{value}</strong></span></div>)}</div></section><section className="border-x border-b border-brief-neutral bg-brief-ivory px-5 py-6 sm:px-10"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-brief-red">Quy trình gửi hàng</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{[['01', 'Gửi thông tin', 'Tuyến, loại hàng, khối lượng.'], ['02', 'Nhận tư vấn', 'Chọn phương án phù hợp.'], ['03', 'Điều phối', 'Xác nhận lịch nhận và giao.']].map(([number, title, detail]) => <div key={number} className="flex gap-2 text-sm"><span className="font-black text-brief-gold">{number}</span><span><strong className="block">{title}</strong><span className="text-brief-soft-ink">{detail}</span></span></div>)}</div></div><div className="flex shrink-0 flex-col gap-2 sm:flex-row"><a href="tel:0933871139" className="brief-button-primary rounded-md"><Phone className="h-4 w-4" aria-hidden="true" />Gọi tư vấn</a><Link href="/lien-he" className="brief-button-secondary rounded-md">Yêu cầu báo giá <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div></div></section></>}
      {isContactPage && <section className="mt-6 overflow-hidden rounded-2xl border border-brief-neutral bg-white shadow-xl lg:grid lg:grid-cols-[.82fr_1.18fr]"><aside className="bg-brief-dark p-7 text-white sm:p-10"><p className="text-xs font-bold uppercase tracking-[.14em] text-brief-gold">Tư vấn trực tiếp</p><h2 className="mt-3 text-2xl font-bold">Cần báo giá gấp?</h2><p className="mt-3 text-sm leading-6 text-sky-100">Gọi hoặc nhắn Zalo trong giờ tư vấn để được hỗ trợ nhanh hơn.</p><div className="mt-6 space-y-3 text-sm"><a href="tel:0933871139" className="block rounded-lg border border-white/15 p-3 font-bold transition hover:border-brief-gold">Hotline chính · {SITE_CONFIG.hotline}</a><a href={`https://zalo.me/${SITE_CONFIG.zalo}`} target="_blank" rel="noreferrer" className="block rounded-lg border border-white/15 p-3 font-bold transition hover:border-brief-gold">Zalo tư vấn · {SITE_CONFIG.zalo}</a><p className="border-t border-white/15 pt-4 text-sky-100">Giờ tư vấn: <strong className="text-white">{SITE_CONFIG.businessHours}</strong></p><p className="text-sky-100">{SITE_CONFIG.address}</p></div></aside><div className="p-6 sm:p-10"><ContactForm lang="vi" /></div></section>}
      {contentHeadings.length >= 3 && <nav aria-label="Mục lục bài viết" className="border-x border-b border-brief-neutral bg-white px-5 py-6 sm:px-10"><p className="text-xs font-bold uppercase tracking-[.14em] text-brief-red">Trong bài viết này</p><ol className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">{contentHeadings.map((heading, index) => <li key={heading.id} className="flex gap-2"><span className="font-bold text-brief-gold">{String(index + 1).padStart(2, '0')}</span><a href={`#${heading.id}`} className="font-medium text-brief-ink hover:text-brief-red hover:underline">{heading.text}</a></li>)}</ol></nav>}
      <div className="rich-content bg-white p-5 shadow-sm sm:p-10" dangerouslySetInnerHTML={{ __html: renderRichText(item.content, '/lien-he') }} />
      {serviceLinks.length > 0 && <section className="border-x border-t border-brief-neutral bg-[#f7fbfd] p-6 sm:px-10"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-brief-red">Khám phá thêm dịch vụ</p><h2 className="mt-1 text-xl font-bold text-brief-ink">Tuyến và lựa chọn liên quan</h2></div><Link href={item.path.startsWith('/thue-xe-tai') ? '/thue-xe-tai' : '/van-chuyen-hang-hoa'} className="text-sm font-bold text-brief-red hover:underline">Xem tất cả →</Link></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{serviceLinks.map((service) => <Link key={service.path} href={service.path} className="group flex min-h-20 items-center justify-between rounded-lg border border-brief-neutral bg-white p-4 text-sm font-bold text-brief-ink transition hover:border-brief-red hover:text-brief-red"><span>{service.title}</span><ArrowRight className="ml-3 h-4 w-4 shrink-0 transition group-hover:translate-x-1" aria-hidden="true" /></Link>)}</div></section>}
      {relatedItems.length > 0 && <section className="border-t border-brief-neutral bg-brief-ivory p-6 sm:px-10"><p className="text-xs font-bold uppercase tracking-[.14em] text-brief-red">Có thể bạn quan tâm</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{relatedItems.map((related) => <Link key={related.path} href={related.path} className="rounded-lg border border-brief-neutral bg-white p-4 text-sm font-bold text-brief-ink transition hover:border-brief-red hover:text-brief-red">{related.title}</Link>)}</div></section>}
      <aside className="rounded-b-2xl border-t-4 border-brief-gold bg-brief-champagne p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-10"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-brief-red">Cần báo giá tuyến này?</p><h2 className="mt-2 text-xl font-bold text-brief-dark">Gọi ngay hoặc gửi thông tin giao nhận</h2><p className="mt-1 text-sm leading-6 text-brief-soft-ink">Hotline {SITE_CONFIG.hotline} · Zalo {SITE_CONFIG.zalo}</p></div><div className="mt-5 flex shrink-0 flex-col gap-3 sm:mt-0 sm:flex-row"><a href="tel:0933871139" className="brief-button-primary rounded-md">Gọi 0933 871 139</a><Link href="/lien-he" className="brief-button-secondary rounded-md">Yêu cầu báo giá</Link></div></aside>
    </div>
  </article>;
}
