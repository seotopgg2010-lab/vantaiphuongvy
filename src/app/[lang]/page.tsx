import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, MapPin, Phone, Truck } from 'lucide-react';
import { legacyPosts, oldImageUrl } from '@/lib/legacy-content';
import { SITE_CONFIG } from '@/lib/constants';
import { canonicalUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/rich-text';

const SITE = 'https://vantaiphuongvy.com';
const HERO_IMAGE = `${SITE}/wp-content/uploads/2025/10/slide-vantaiphuongvy-homepage-1.png`;
const FLEET_IMAGE = `${SITE}/wp-content/uploads/2018/08/cac-loai-xe-cho-hang-tai-phuong-vy.jpg`;

const services = [
  { title: 'Vận chuyển hàng hóa Bắc Nam', body: 'Nhận hàng theo tuyến, tư vấn phương án phù hợp với từng loại hàng và điểm giao nhận.', href: '/van-chuyen-hang-hoa' },
  { title: 'Chành xe liên tỉnh', body: 'Kết nối các tuyến tỉnh thành, hỗ trợ gửi hàng lẻ và hàng số lượng lớn.', href: '/van-chuyen-hang-hoa/ha-noi' },
  { title: 'Cho thuê xe tải', body: 'Thuê xe theo nhu cầu tại TP.HCM, Hà Nội và Đà Nẵng.', href: '/thue-xe-tai' },
];

const PRESS_NAMES = ['24h.com.vn', 'CafeF', 'Hà Nội Mới', 'Tiền Phong', 'VTC News', 'Người Đưa Tin', 'Báo Đà Nẵng', 'Báo Quảng Ninh'];
const routeShortcuts = [
  { label: 'Tìm theo tỉnh thành', detail: 'Hà Nội, Đà Nẵng, Cần Thơ và các tuyến liên tỉnh', href: '/van-chuyen-hang-hoa', icon: MapPin },
  { label: 'Gửi theo loại hàng', detail: 'Xe máy, máy móc, hàng siêu trường và dầu nhớt', href: '/van-chuyen-hang-hoa/xe-may', icon: Truck },
  { label: 'Thuê xe theo khu vực', detail: 'Xe tải chở hàng tại TP.HCM, Hà Nội, Đà Nẵng', href: '/thue-xe-tai', icon: Phone },
];
const routes = [
  ['TP. Hồ Chí Minh', '/van-chuyen-hang-hoa/tphcm'],
  ['Hà Nội', '/van-chuyen-hang-hoa/ha-noi'],
  ['Đà Nẵng', '/van-chuyen-hang-hoa/da-nang'],
  ['Cần Thơ', '/van-chuyen-hang-hoa/can-tho'],
  ['Hải Phòng', '/van-chuyen-hang-hoa/hai-phong'],
  ['Nha Trang', '/van-chuyen-hang-hoa/nha-trang'],
];

export default function Home() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl()}#webpage`,
    name: 'Vận tải Phương Vy | Vận chuyển hàng hóa Bắc Nam',
    url: canonicalUrl(),
    description: SITE_CONFIG.description,
    inLanguage: 'vi-VN',
    isPartOf: { '@id': `${SITE}/#website` },
    about: { '@id': `${SITE}/#organization` },
  };

  return (
    <article className="bg-white text-brief-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <section className="relative isolate overflow-hidden bg-[#0d2b3e]">
        <Image src={HERO_IMAGE} alt="Xe vận tải Phương Vy" width={1920} height={663} priority className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,43,62,.97),rgba(13,43,62,.8),rgba(13,43,62,.35))]" />
        <div className="mx-auto grid min-h-[35rem] max-w-7xl content-center gap-10 px-5 py-18 sm:px-6 lg:min-h-[39rem] lg:grid-cols-[minmax(0,1fr)_21rem] lg:px-8">
          <div className="max-w-3xl py-10">
            <p className="mb-5 inline-flex items-center gap-2 border-l-2 border-[#e8c22e] pl-3 text-sm font-bold uppercase tracking-[.12em] text-[#e8c22e]">Chất lượng, nhanh chóng, uy tín là niềm tin!</p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Vận chuyển hàng hóa Bắc Nam, đúng hẹn và an tâm</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-sky-50">Phương Vy đồng hành cùng khách hàng trong nhu cầu gửi hàng, thuê xe tải và vận chuyển liên tỉnh. Tư vấn nhanh để chọn đúng tuyến và phương án giao nhận.</p>
            <dl className="mt-7 grid max-w-xl grid-cols-2 gap-3 text-sky-50 sm:grid-cols-3">
              <div className="border-l-2 border-[#e8c22e] pl-3"><dt className="text-xs uppercase tracking-wide text-sky-200">Hotline chính</dt><dd className="mt-1 font-bold text-white">0933 871 139</dd></div>
              <div className="border-l-2 border-[#e8c22e] pl-3"><dt className="text-xs uppercase tracking-wide text-sky-200">Giờ tư vấn</dt><dd className="mt-1 font-bold text-white">8h00–21h00</dd></div>
              <div className="border-l-2 border-[#e8c22e] pl-3"><dt className="text-xs uppercase tracking-wide text-sky-200">Phạm vi</dt><dd className="mt-1 font-bold text-white">Toàn quốc</dd></div>
            </dl>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="tel:0933871139" className="brief-button-primary rounded-md px-6 text-base"><Phone className="h-5 w-5" aria-hidden="true" />Gọi tư vấn: 0933 871 139</a>
              <Link href="/van-chuyen-hang-hoa" className="brief-button-secondary rounded-md border-white bg-white px-6 text-base text-[#0d2b3e] hover:border-[#e8c22e] hover:bg-[#e8c22e] hover:text-[#0d2b3e]">Xem tuyến vận chuyển <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link>
            </div>
          </div>
          <aside className="self-end border-t-4 border-[#e8c22e] bg-white p-6 shadow-2xl lg:mb-10" aria-label="Yêu cầu báo giá">
            <p className="text-sm font-bold uppercase tracking-[.12em] text-[#1175bc]">Cần gửi hàng?</p>
            <h2 className="mt-2 text-2xl font-bold text-[#0d2b3e]">Bắt đầu từ tuyến của bạn</h2>
            <p className="mt-3 text-sm leading-6 text-brief-soft-ink">Cho chúng tôi biết nơi nhận, nơi giao và loại hàng để được tư vấn.</p>
            <div className="mt-5 space-y-2 border-y border-brief-neutral py-4 text-sm text-brief-soft-ink">
              <p><strong className="text-[#0d2b3e]">1.</strong> Nhận thông tin tuyến và loại hàng</p>
              <p><strong className="text-[#0d2b3e]">2.</strong> Đề xuất phương án giao nhận</p>
              <p><strong className="text-[#0d2b3e]">3.</strong> Báo giá và điều phối xe</p>
            </div>
            <Link href="/lien-he" className="mt-5 flex w-full items-center justify-between border border-[#1175bc] px-4 py-3 text-sm font-bold text-[#1175bc] transition hover:bg-[#1175bc] hover:text-white">Yêu cầu báo giá <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </aside>
        </div>
      </section>

      <section className="relative z-10 -mt-8 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-xl border border-brief-neutral bg-white shadow-[0_18px_45px_rgba(13,43,62,.12)] md:grid-cols-3">
          {routeShortcuts.map(({ label, detail, href, icon: Icon }) => <Link key={label} href={href} className="group flex min-h-28 items-start gap-4 border-b border-brief-neutral p-5 transition hover:bg-brief-champagne md:border-b-0 md:border-r last:border-0"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brief-champagne text-brief-red transition group-hover:bg-brief-red group-hover:text-white"><Icon className="h-5 w-5" aria-hidden="true" /></span><span><strong className="block text-base text-brief-ink">{label}</strong><span className="mt-1 block text-sm leading-5 text-brief-soft-ink">{detail}</span><span className="mt-2 block text-xs font-bold uppercase tracking-wide text-brief-red">Xem lựa chọn →</span></span></Link>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-4 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="flex flex-col gap-3 border-l-4 border-brief-gold bg-brief-champagne px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><p className="text-sm font-bold text-brief-ink">Cần báo giá nhanh?</p><p className="text-sm text-brief-soft-ink">Chuẩn bị điểm nhận, điểm giao, loại hàng và khối lượng để được tư vấn sát hơn.</p></div><Link href="/lien-he" className="shrink-0 text-sm font-bold text-brief-red hover:underline">Gửi thông tin báo giá →</Link></div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-22"><div className="max-w-2xl"><p className="brief-eyebrow">Dịch vụ vận tải</p><h2 className="mt-3">Giải pháp phù hợp với hành trình hàng hóa</h2><p className="mt-4 text-brief-soft-ink">Tập trung vào nhu cầu thực tế: gửi hàng theo tuyến, điều xe theo yêu cầu và cập nhật thông tin rõ ràng trước khi vận chuyển.</p></div>
        <div className="mt-10 grid gap-px overflow-hidden border border-brief-neutral bg-brief-neutral md:grid-cols-3">
          {services.map((service, index) => <Link key={service.href} href={service.href} className="group relative bg-white p-7 transition hover:bg-[#eaf8fe]">
            <span className="absolute right-6 top-6 text-sm font-black text-brief-neutral">0{index + 1}</span>
            <Truck className="h-8 w-8 text-[#1175bc]" aria-hidden="true" /><h3 className="mt-6 text-xl font-bold">{service.title}</h3><p className="mt-3 text-sm leading-6 text-brief-soft-ink">{service.body}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1175bc]">Tìm hiểu thêm <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" /></span>
          </Link>)}
        </div>
      </section>

      <section className="bg-[#eaf8fe]"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-22"><div className="relative min-h-72 overflow-hidden"><Image src={FLEET_IMAGE} alt="Các loại xe chở hàng của Phương Vy" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /></div><div className="self-center"><p className="brief-eyebrow">Tuyến vận chuyển</p><h2 className="mt-3">Tìm điểm đến của bạn</h2><p className="mt-4 text-brief-soft-ink">Khám phá các trang tuyến có sẵn để xem thông tin vận chuyển theo địa phương.</p><ul className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">{routes.map(([name, href]) => <li key={href}><Link href={href} className="flex items-center gap-3 border-b border-[#b7d7e7] py-3 font-semibold text-[#0d2b3e] transition hover:border-[#1175bc] hover:text-[#1175bc]"><MapPin className="h-4 w-4 text-[#1175bc]" aria-hidden="true" />{name}</Link></li>)}</ul><Link href="/van-chuyen-hang-hoa" className="brief-button-primary mt-8 rounded-md">Xem tất cả tuyến <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-22"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="brief-eyebrow">Cam kết phục vụ</p><h2 className="mt-3">Chất lượng, nhanh chóng, uy tín là niềm tin</h2><p className="mt-4 text-brief-soft-ink">Tập trung vào những điều quan trọng trong mỗi chuyến hàng: đúng hẹn, đúng nơi nhận và giao, an toàn và tối ưu chi phí.</p></div><div className="grid gap-5 sm:grid-cols-2">{[
        ['Nhanh chóng', 'Giao hàng đúng hẹn, đúng thời gian đã cam kết.'],
        ['Chính xác', 'Theo dõi thông tin giao nhận rõ ràng, đúng địa điểm.'],
        ['Chuyên nghiệp', 'Đội ngũ tư vấn, điều phối và vận chuyển giàu kinh nghiệm.'],
        ['An toàn', 'Chú trọng đóng gói, bốc xếp và bảo quản hàng hóa.'],
        ['Tiện lợi', 'Quy trình giao nhận đơn giản, hỗ trợ tư vấn nhanh.'],
        ['Tiết kiệm', 'Tư vấn phương án vận chuyển phù hợp với từng nhu cầu.'],
      ].map(([title, body]) => <div key={title} className="flex gap-3 border-t border-brief-neutral pt-5"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#1175bc]" aria-hidden="true" /><div><h3 className="font-bold leading-6">{title}</h3><p className="mt-1 text-sm leading-6 text-brief-soft-ink">{body}</p></div></div>)}</div></div></section>

      <section className="bg-[#0d2b3e] text-white"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-[#e8c22e]">Tư vấn nhanh · báo giá rõ ràng</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Gọi đúng tuyến — báo giá nhanh hơn</h2><p className="mt-3 max-w-xl text-sm leading-6 text-sky-100">Gửi điểm nhận, điểm giao và loại hàng qua hotline hoặc biểu mẫu liên hệ để được hỗ trợ.</p></div><div className="flex flex-col gap-3 sm:flex-row"><a href="tel:0933871139" className="brief-button-primary rounded-md bg-[#1175bc] px-5">0933 871 139</a><a href="tel:0702006839" className="brief-button-secondary rounded-md border-white bg-transparent px-5 text-white hover:bg-white hover:text-[#0d2b3e]">0702 00 6839</a><Link href="/lien-he" className="brief-button-secondary rounded-md border-[#e8c22e] bg-transparent px-5 text-white hover:bg-[#e8c22e] hover:text-[#0d2b3e]">Yêu cầu báo giá</Link></div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-22"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="brief-eyebrow">Cập nhật thông tin</p><h2 className="mt-3">Tin tức &amp; cẩm nang vận tải</h2></div><Link href="/blog" className="font-bold text-[#1175bc] hover:underline">Xem tất cả <span aria-hidden="true">→</span></Link></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{legacyPosts.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 4).map((post) => { const image = oldImageUrl(post.image); return <Link key={post.slug} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-xl border border-brief-neutral bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">{image ? <div className="relative aspect-[4/3] overflow-hidden bg-[#eaf8fe]"><Image src={image} alt={post.title} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /></div> : <div className="flex aspect-[4/3] items-center justify-center bg-[#eaf8fe] text-sm text-brief-soft-ink">Vận tải Phương Vy</div>}<div className="p-5"><p className="text-xs font-semibold uppercase tracking-wide text-[#1175bc]">{post.date ? new Date(post.date).toLocaleDateString('vi-VN') : 'Cẩm nang'}</p><h3 className="mt-2 line-clamp-3 text-lg font-bold leading-snug group-hover:text-[#1175bc]">{post.title}</h3></div></Link>; })}</div></section>

      <section className="border-y border-brief-neutral bg-[#f7fbfd]"><div className="mx-auto max-w-7xl px-5 py-10 text-center sm:px-6 lg:px-8"><p className="text-sm font-semibold text-brief-soft-ink">Báo chí nói về Vận tải Phương Vy</p><div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-[#0d2b3e]">{PRESS_NAMES.map((name) => <span key={name}>{name}</span>)}</div></div></section>


    </article>
  );
}
