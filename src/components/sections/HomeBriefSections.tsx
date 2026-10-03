import type { ElementType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Factory,
  Handshake,
  Plane,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { BriefSectionIntro } from '@/components/brief';
import { localizedPath } from '@/lib/site';
import { ReferenceContactBanner } from '@/components/brief/reference-contact-banner';

type HomeLocale = 'vi' | 'en';

type IndustryCard = {
  title: Record<HomeLocale, string>;
  href: string;
  image: string;
};

const INDUSTRIES: IndustryCard[] = [
  { title: { vi: 'Tiệm Nail & Spa', en: 'Nail & Spa' }, href: '/giai-phap-tron-goi/nail-salon', image: '/images/industries/ind_nail_beauty.jpg' },
  { title: { vi: 'Nhà hàng & Quán ăn', en: 'Restaurants & Dining' }, href: '/cung-ung-setup/nha-hang-am-thuc/nha-hang-nhat-ban', image: '/images/industries/ind_nha_hang.jpg' },
  { title: { vi: 'Kiosk & Take-away', en: 'Kiosk & Takeaway' }, href: '/giai-phap-tron-goi/shop-retail', image: '/images/industries/ind_kiosk.jpg' },
  { title: { vi: 'Sự kiện & Hội chợ', en: 'Events & Trade fairs' }, href: '/giai-phap-tron-goi/wedding-event', image: '/images/industries/ind_su_kien.jpg' },
  { title: { vi: 'Quán Café & Trà sữa', en: 'Café & Bubble tea' }, href: '/san-xuat-cung-ung', image: '/images/projects/proj_03.jpg' },
  { title: { vi: 'Quà tặng & Ấn phẩm', en: 'Gifts & Publications' }, href: '/san-xuat-cung-ung', image: '/images/projects/proj_12.jpg' },
];

const MARKETS = [
  { title: { vi: 'Đức & châu Âu', en: 'Germany & Europe' }, href: '/van-chuyen-quoc-te/gui-hang-di-chau-au', image: '/images/reference/harbor-morning_tam.webp', badge: { vi: 'Tuyến chính', en: 'Key route' } },
  { title: { vi: 'Mỹ & Canada', en: 'United States & Canada' }, href: '/van-chuyen-quoc-te/gui-hang-di-my', image: '/images/reference/market-america_tam.webp' },
  { title: { vi: 'Úc', en: 'Australia' }, href: '/van-chuyen-quoc-te/gui-hang-di-uc', image: '/images/reference/market-australia_tam.webp' },
  { title: { vi: 'Các nước khác', en: 'Other destinations' }, href: '/van-chuyen-quoc-te', image: '/images/hero/hero_showcase.jpg' },
];

const NEEDS: Array<{
  icon: ElementType;
  question: Record<HomeLocale, string>;
  answer: Record<HomeLocale, string>;
  href: string;
}> = [
  {
    icon: Plane,
    question: { vi: 'Anh chị chỉ cần vận chuyển?', en: 'Only need shipping?' },
    answer: { vi: 'Chúng tôi tập trung vào phương án logistics phù hợp với hàng hóa và điểm đến.', en: 'We focus on a logistics option suited to the goods and destination.' },
    href: '/lien-he?nhu-cau=van-chuyen',
  },
  {
    icon: Search,
    question: { vi: 'Anh chị cần tìm nguồn hàng tại Việt Nam?', en: 'Need sourcing in Vietnam?' },
    answer: { vi: 'Hamburg Connect kết nối với các đối tác sản xuất và cung ứng phù hợp.', en: 'Hamburg Connect connects suitable production and supply partners.' },
    href: '/lien-he?nhu-cau=tim-nguon-san-xuat',
  },
  {
    icon: Factory,
    question: { vi: 'Anh chị cần sản xuất theo yêu cầu?', en: 'Need made-to-order production?' },
    answer: { vi: 'Chúng tôi phối hợp với đơn vị phù hợp về thiết kế, vật liệu, quy cách và số lượng.', en: 'We coordinate capable partners for design, materials, specifications and quantities.' },
    href: '/lien-he?nhu-cau=tim-nguon-san-xuat',
  },
  {
    icon: ShoppingBag,
    question: { vi: 'Anh chị cần mua hàng rồi vận chuyển?', en: 'Need purchasing and shipping?' },
    answer: { vi: 'Chúng tôi có thể hỗ trợ kết nối nguồn, phối hợp mua hàng và tổ chức hành trình logistics.', en: 'We can support sourcing, purchase coordination and logistics planning.' },
    href: '/lien-he?nhu-cau=tu-van',
  },
  {
    icon: Handshake,
    question: { vi: 'Anh chị có một dự án gồm nhiều hạng mục?', en: 'Have a multi-item project?' },
    answer: { vi: 'Chúng tôi có thể kết nối nhiều nhóm nguồn lực và phối hợp các bước cần thiết trong cùng một hành trình.', en: 'We can connect multiple resource groups and coordinate the necessary steps in one journey.' },
    href: '/lien-he?nhu-cau=du-an-tron-goi',
  },
];

function localeFor(lang: string): HomeLocale {
  return lang.toLowerCase().startsWith('en') ? 'en' : 'vi';
}

export function HomeAboutSection({ lang }: { lang: string }) {
  const locale = localeFor(lang);

  return (
    <section className="bg-brief-ivory py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <p className="brief-eyebrow text-brief-gold font-medium normal-case tracking-normal text-sm">
            {locale === 'en' ? 'About us' : 'VỀ CHÚNG TÔI'}
          </p>
          <h2 className="brief-display-heading mt-1 text-3xl font-bold leading-tight text-brief-ink sm:text-4xl">
            {locale === 'en' ? 'Your trusted bridge from Vietnam to Germany' : 'Cầu nối tin cậy từ Việt Nam đến Đức'}
          </h2>
          <p className="mt-4 text-sm leading-7 text-brief-soft-ink sm:text-base">
            {locale === 'en'
              ? 'Hamburg Connect was born from a deep understanding of the unique challenges faced by the Vietnamese business community in Germany. From language barriers and high manufacturing costs in Europe to finding reliable, high-quality suppliers back home.'
              : 'Hamburg Connect sinh ra từ sự thấu hiểu sâu sắc những khó khăn của cộng đồng kinh doanh người Việt tại Đức. Từ rào cản ngôn ngữ, chi phí sản xuất đắt đỏ tại châu Âu cho đến việc tìm kiếm nguồn cung chất lượng cao từ quê nhà.'}
          </p>
          <p className="mt-4 text-sm leading-7 text-brief-soft-ink sm:text-base">
            {locale === 'en'
              ? 'We deliver complete turnkey solutions: from design consultation, European-standard manufacturing in Vietnam, to all-inclusive DDP shipping to your door. You focus on your business — let us take care of the rest.'
              : 'Chúng tôi mang đến giải pháp trọn gói: từ tư vấn thiết kế, sản xuất tại Việt Nam theo tiêu chuẩn châu Âu, cho đến vận chuyển DDP giao tận nơi. Anh chị chỉ cần tập trung kinh doanh, mọi việc còn lại hãy để chúng tôi đồng hành.'}
          </p>
          <div className="mt-7">
            <Link
              href={localizedPath(lang, '/gioi-thieu')}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brief-red transition hover:text-brief-red-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brief-red active:scale-[0.97]"
            >
              <span>{locale === 'en' ? 'Learn more' : 'Tìm hiểu thêm'}</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-7">
          <div className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl border border-brief-neutral/70 shadow-xs">
            <Image
              src="/images/about/halong_conical.jpg"
              alt={locale === 'en' ? 'Vietnam resources' : 'Nguồn lực Việt Nam'}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition duration-500 hover:scale-105"
              preload
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-brief-neutral/70 shadow-xs">
              <Image
                src="/images/industries/ind_nail_beauty.jpg"
                alt="Nail & Beauty setup"
                fill
                sizes="(max-width: 1024px) 33vw, 18vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-brief-neutral/70 shadow-xs">
              <Image
                src="/images/reference/storefront-morning_tam.webp"
                alt="Storefront signage"
                fill
                sizes="(max-width: 1024px) 33vw, 18vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-brief-neutral/70 shadow-xs">
              <Image
                src="/images/reference/card4-cungung.jpg"
                alt="Restaurant dining setup"
                fill
                sizes="(max-width: 1024px) 33vw, 18vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeProcessSection({ lang }: { lang: string }) {
  const en = localeFor(lang) === 'en';
  const steps = [
    { number: '01', title: en ? 'Receive & Consult' : 'Tiếp nhận & tư vấn', description: en ? 'Listen to needs, inspect premises, and propose the optimal strategy.' : 'Lắng nghe nhu cầu, khảo sát thực tế và tư vấn phương án tối ưu nhất.' },
    { number: '02', title: en ? 'Quotation & Contract' : 'Báo giá & ký kết', description: en ? 'Transparent pricing, firm commitment to zero hidden costs.' : 'Minh bạch mọi chi phí, cam kết không phát sinh chi phí ẩn.' },
    { number: '03', title: en ? 'Manufacture & Consolidate' : 'Sản xuất & gom hàng', description: en ? 'High-quality workshop fabrication, rigorous quality inspection in Vietnam.' : 'Gia công tại xưởng chất lượng cao, kiểm tra nghiêm ngặt tại Việt Nam.' },
    { number: '04', title: en ? 'Shipping & Customs' : 'Vận chuyển & thông quan', description: en ? 'Export-standard packaging, handling all two-way customs clearance.' : 'Đóng gói chuẩn xuất khẩu, xử lý toàn bộ thủ tục hải quan 2 đầu.' },
    { number: '05', title: en ? 'Door-to-door Delivery' : 'Giao hàng tận nơi', description: en ? 'Delivered directly to stores and workshops in Germany and EU.' : 'Giao trực tiếp đến cửa hàng, nhà xưởng tại Đức và các nước EU.' },
    { number: '06', title: en ? 'Support & Warranty' : 'Hỗ trợ & bảo hành', description: en ? 'Post-delivery accompaniment, technical support and long-term warranty.' : 'Đồng hành sau bàn giao, hỗ trợ kỹ thuật và bảo hành dài hạn.' },
  ];

  return (
    <section className="bg-brief-dark py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="brief-eyebrow text-brief-gold font-medium normal-case tracking-normal text-sm">
              {en ? 'Working Process' : 'QUY TRÌNH HỢP TÁC'}
            </p>
            <h2 className="brief-display-heading mt-1 text-3xl font-bold leading-tight text-white sm:text-4xl">
              {en ? '6 simple steps to begin' : '6 bước đơn giản để bắt đầu'}
            </h2>
            <p className="mt-3 text-sm text-brief-warm-gray">
              {en
                ? 'A clear, transparent journey from initial consultation to handover and ongoing support in Germany.'
                : 'Quy trình rõ ràng, minh bạch từ lúc tiếp nhận yêu cầu đến khi bàn giao và hỗ trợ tại Đức.'}
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs transition hover:border-brief-gold/50 hover:bg-white/10">
                  <span className="text-xl font-bold text-brief-gold">{step.number}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-brief-warm-gray">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href={localizedPath(lang, '/van-chuyen-quoc-te')}
                className="brief-button-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                <span>{en ? 'Learn about process' : 'Tìm hiểu quy trình'}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-brief-gold/30 shadow-2xl lg:col-span-5">
            <Image
              src="/images/process/worker_port_terminal.jpg"
              alt={en ? 'Hamburg Connect logistics process' : 'Quy trình logistics Hamburg Connect'}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brief-dark/70 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-xs uppercase tracking-widest text-brief-gold">{en ? 'Quality Assurance' : 'ĐẢM BẢO CHẤT LƯỢNG'}</p>
              <p className="mt-1 text-base font-semibold">{en ? 'Monitored at every milestone' : 'Theo dõi sát sao từng chặng vận chuyển'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeIndustriesSection({ lang }: { lang: string }) {
  const locale = localeFor(lang);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <p className="brief-eyebrow text-brief-gold font-medium normal-case tracking-normal text-sm">
              {locale === 'en' ? 'Industry Solutions' : 'GIẢI PHÁP THEO NGÀNH'}
            </p>
            <h2 className="brief-display-heading mt-1 text-3xl font-bold leading-tight text-brief-ink sm:text-4xl">
              {locale === 'en' ? 'Featured Industries' : 'Ngành hàng tiêu biểu'}
            </h2>
          </div>
          <Link
            href={localizedPath(lang, '/cung-ung-setup')}
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brief-red transition hover:text-brief-red-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brief-red"
          >
            <span>{locale === 'en' ? 'View all products' : 'Xem tất cả sản phẩm'}</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {INDUSTRIES.map((card) => (
            <Link
              key={card.title[locale]}
              href={localizedPath(lang, card.href)}
              className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brief-red"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-brief-neutral/80 bg-brief-champagne/30 transition duration-200 group-hover:border-brief-gold group-hover:shadow-md">
                <Image
                  src={card.image}
                  alt={card.title[locale]}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-2.5 text-center text-xs font-semibold text-brief-ink transition-colors group-hover:text-brief-red sm:text-sm">
                {card.title[locale]}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeQuoteStrip({ lang }: { lang: string }) {
  const locale = localeFor(lang);
  return (
    <section className="relative overflow-hidden bg-brief-dark py-20 sm:py-28">
      <Image src="/images/about/halong_conical.jpg" alt={locale === 'en' ? 'Vietnam landscape' : 'Phong cảnh Việt Nam'} fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-brief-dark/35" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="brief-display-heading text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
          {locale === 'en' ? 'Vietnam has many wonderful things. We believe those values deserve to travel farther.' : 'Việt Nam có rất nhiều điều tốt đẹp. Và chúng tôi tin rằng, những giá trị ấy xứng đáng được đến xa hơn.'}
        </p>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-brief-champagne">
          {locale === 'en' ? 'From Vietnam to the world' : 'Từ Việt Nam đến thế giới'}
        </p>
      </div>
    </section>
  );
}

export function HomeMarketsSection({ lang }: { lang: string }) {
  const locale = localeFor(lang);
  return (
    <section className="bg-brief-champagne py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {MARKETS.map((card) => (
            <Link
              key={card.title[locale]}
              href={localizedPath(lang, card.href)}
              className="group relative min-h-64 overflow-hidden rounded-xl border border-brief-neutral bg-brief-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brief-red"
            >
              <Image
                src={card.image}
                alt={card.title[locale]}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brief-dark/90 via-brief-dark/15 to-transparent" aria-hidden="true" />
              {card.badge && (
                <span className="absolute right-3 top-3 rounded-full bg-brief-red px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-white">
                  {card.badge[locale]}
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5 text-lg font-semibold text-white">
                <span>{card.title[locale]}</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeNeedsSection({ lang }: { lang: string }) {
  const locale = localeFor(lang);
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BriefSectionIntro
          eyebrow={locale === 'en' ? 'Flexible scope' : 'Phạm vi nhu cầu'}
          title={locale === 'en' ? 'Solutions shaped around what you need' : 'Giải pháp theo phạm vi nhu cầu'}
          description={locale === 'en' ? 'Hamburg Connect does not apply one fixed model to every customer.' : 'Hamburg Connect không áp dụng một mô hình cố định cho mọi khách hàng.'}
          align="center"
        />
        <div className="mx-auto mt-9 grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-5">
          {NEEDS.map((need) => {
            const Icon = need.icon;
            return (
              <Link key={need.question.vi} href={localizedPath(lang, need.href)} className="group flex min-h-56 flex-col border border-brief-neutral bg-brief-ivory p-5 transition hover:border-brief-red hover:bg-white hover:shadow-[0_14px_30px_rgb(32_32_32_/_10%)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brief-red active:scale-[0.99]">
                <Icon className="h-5 w-5 text-brief-red" aria-hidden="true" />
                <h3 className="brief-display-heading mt-5 text-xl leading-tight text-brief-ink">{need.question[locale]}</h3>
                <p className="mt-3 text-sm leading-6 text-brief-soft-ink">{need.answer[locale]}</p>
                <ArrowRight className="mt-auto h-4 w-4 text-brief-red transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomeReviewsSection({ lang }: { lang: string }) {
  const en = localeFor(lang) === 'en';
  const reviews = [
    { name: 'Sky N.', translated: true, quote: en ? 'I am very satisfied with this shipping company. I sent goods from Vietnam to the USA and everything went smoothly. The company was professional and kept me informed about my shipment… The careful packaging stood out.' : 'Tôi rất hài lòng với dịch vụ của công ty vận chuyển này. Tôi đã gửi hàng từ Việt Nam sang Mỹ và mọi việc đều suôn sẻ. Công ty rất chuyên nghiệp và luôn cập nhật cho tôi tình trạng đơn hàng… Đặc biệt là khâu đóng gói cẩn thận, kỹ lưỡng.' },
    { name: 'Hoàng H.', translated: false, quote: en ? 'I received the goods safely. The staff were friendly and helpful. The goods were packed in a sturdy wooden crate and arrived intact. Next time I will order more decorations and a logo set for my shop… hehe.' : 'Tôi đã nhận hàng an toàn. Nhân viên rất thân thiện và nhiệt tình. Hàng được đóng trong thùng gỗ chắc chắn nên đến nơi nguyên vẹn. Lần sau tôi sẽ đặt thêm đồ trang trí và bộ logo cho tiệm… hehe.' },
    { name: 'Hanh T.', translated: true, quote: en ? 'A friend recommended this company for shipping from Vietnam to the USA. The goods were handled professionally, packaged very carefully and quickly. They arrived fast and in perfect condition… Highly recommended.' : 'Bạn tôi giới thiệu nơi này để gửi hàng từ Việt Nam sang Mỹ. Hàng được xử lý rất chuyên nghiệp, đóng gói cực kỳ cẩn thận và rất nhanh. Hàng đến nhanh và trong tình trạng hoàn hảo… Rất đáng giới thiệu.' },
  ];
  return (
    <section className="bg-brief-champagne py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <p className="brief-eyebrow text-center">Google Maps</p>
        <h2 className="brief-display-heading mt-2 text-center text-3xl text-brief-ink">{en ? 'What customers say' : 'Khách hàng nói gì'}</h2>
        <div className="mt-9 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 lg:grid lg:grid-cols-3">
          {reviews.map(review => (
            <figure key={review.name} className="min-w-[85%] snap-start rounded-xl border border-brief-gold/25 bg-white p-7 shadow-sm sm:min-w-[45%] lg:min-w-0">
              <p className="text-brief-red" aria-label={en ? '5 stars' : '5 sao'}>★★★★★</p>
              <blockquote className="mt-4 text-sm leading-7 text-brief-soft-ink">“{review.quote}”</blockquote>
              <figcaption className="mt-5 font-semibold text-brief-ink">{review.name}{review.translated && <span className="mt-1 block text-xs font-normal text-brief-soft-ink">{en ? 'Translated from German' : 'Dịch từ tiếng Đức'}</span>}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCTABottom({ lang }: { lang: string }) {
  const en = localeFor(lang) === 'en';
  return (
    <ReferenceContactBanner
      lang={lang}
      logistics
      title={en ? 'Ready to elevate your business in Germany?' : 'Sẵn sàng nâng tầm thương hiệu của bạn tại Đức?'}
      description={en ? 'Contact us today for free consultation and a detailed quotation within 24 hours.' : 'Liên hệ với chúng tôi hôm nay để nhận tư vấn miễn phí và báo giá chi tiết trong 24h.'}
      image="/images/reference/coastal-delivery_tam.webp"
    />
  );
}
