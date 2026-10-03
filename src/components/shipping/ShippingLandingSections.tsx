import Link from 'next/link';
import { Boxes, PackageCheck, Plane, ShieldCheck, Truck } from 'lucide-react';
import type { ShippingRoute } from '@/types/database';
import type { BriefLocale } from '@/lib/brief/routes';
import { getBriefRoutePath } from '@/lib/brief/routes';
import { BriefSectionIntro } from '@/components/brief';

export type ShippingRouteCardData = Pick<ShippingRoute, 'slug' | 'name' | 'country' | 'description' | 'transit_info'> & {
  image?: string | null;
};

const SHIPMENT_METHODS = [
  { title: 'Chuyển phát nhanh quốc tế', description: 'Phù hợp kiện nhỏ, tài liệu và nhu cầu cần thời gian nhanh.', icon: Plane },
  { title: 'Đường hàng không (Air Freight)', description: 'Nhận hàng từ 1 kg trở lên; có phương án bao trọn thuế phí (DDP).', icon: Truck },
  { title: 'Đường biển hàng lẻ (LCL)', description: 'Phù hợp vài kiện nội thất, bảng hiệu hoặc lô hàng bổ sung.', icon: PackageCheck },
  { title: 'Đường biển nguyên container (FCL)', description: 'Phù hợp setup tiệm, chuyển nhà hoặc lô hàng lớn.', icon: Boxes },
];

const GOODS = [
  'Hàng cá nhân & Quà tặng',
  'Hàng kinh doanh',
  'Nội ngoại thất & Thiết bị mở tiệm',
  'Hành lý & Đồ đạc chuyển nhà',
];

const SERVICES = [
  'Bao trọn thuế phí (DDP)',
  'Thủ tục xuất nhập khẩu',
  'Thông quan & kho vận châu Âu',
  'Chuyển nhà quốc tế',
];

const TIME_ROWS = [
  ['Đức & châu Âu', '4–6 ngày', '8–12 ngày', '45–55 ngày'],
  ['Mỹ & Canada', '3–5 ngày', '7–14 ngày', '35–50 ngày'],
  ['Úc', '3–5 ngày', '7–12 ngày', '25–35 ngày'],
];

export function ShippingRouteCards({ lang, routes }: { lang: BriefLocale; routes: ShippingRouteCardData[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {routes.map((route) => (
        <Link key={route.slug} href={getBriefRoutePath(lang, `/van-chuyen-quoc-te/${route.slug}`)} className="group border border-brief-neutral bg-white p-5 transition hover:-translate-y-1 hover:border-brief-red hover:shadow-[0_16px_30px_rgba(43,43,43,0.1)]">
          <p className="brief-eyebrow">{route.country || 'Tuyến vận chuyển'}</p>
          <h3 className="brief-display-heading mt-3 text-2xl text-brief-ink">{route.name}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-brief-soft-ink">{route.description || 'Thông tin tuyến đang được cập nhật.'}</p>
          <p className="mt-5 text-xs font-semibold text-brief-red">{route.transit_info || 'Liên hệ tư vấn'} →</p>
        </Link>
      ))}
    </div>
  );
}

export function ShippingMethodsAndTiming() {
  return (
    <section className="bg-brief-ivory py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BriefSectionIntro eyebrow="Hình thức vận chuyển" title="Chọn phương án phù hợp với lô hàng" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SHIPMENT_METHODS.map(({ title, description, icon: Icon }) => (
            <div key={title} className="border border-brief-neutral bg-white p-5">
              <Icon className="h-5 w-5 text-brief-red" aria-hidden="true" />
              <h3 className="brief-display-heading mt-4 text-xl text-brief-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-brief-soft-ink">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 overflow-x-auto border border-brief-neutral bg-white">
          <table className="min-w-[640px] w-full text-left text-sm">
            <caption className="p-4 text-left brief-display-heading text-xl text-brief-ink">Thời gian tham khảo</caption>
            <thead className="bg-brief-champagne text-brief-ink"><tr><th className="p-3">Tuyến</th><th className="p-3">Chuyển phát nhanh</th><th className="p-3">Hàng không DDP</th><th className="p-3">Đường biển</th></tr></thead>
            <tbody>{TIME_ROWS.map((row) => <tr key={row[0]} className="border-t border-brief-neutral">{row.map((cell) => <td key={cell} className="p-3 text-brief-soft-ink">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function ShippingGoodsAndServices({ lang }: { lang: BriefLocale }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <BriefSectionIntro eyebrow="Loại hàng" title="Áp dụng cho mọi tuyến" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">{GOODS.map((good) => <div key={good} className="border border-brief-neutral bg-brief-ivory p-4 text-sm font-semibold text-brief-ink">{good}</div>)}</div>
          </div>
          <div>
            <BriefSectionIntro eyebrow="Dịch vụ" title="Hamburg Connect có thể tham gia ở đâu" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">{SERVICES.map((service) => <Link key={service} href={getBriefRoutePath(lang, '/lien-he?nhu-cau=van-chuyen')} className="flex items-center justify-between border border-brief-neutral bg-white p-4 text-sm font-semibold text-brief-ink transition hover:border-brief-red"><span>{service}</span><span className="text-brief-red">→</span></Link>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ShippingProcessAndRestrictions({ lang }: { lang: BriefLocale }) {
  const steps = [
    ['Tư vấn', 'Gửi thông tin hàng, kích thước và nơi nhận.'],
    ['Lấy hàng', 'Tận nơi hoặc tại điểm nhận đã thống nhất.'],
    ['Đóng gói & dán nhãn', 'Đóng thùng, đóng kiện theo chuẩn xuất khẩu.'],
    ['Thông quan & vận chuyển', 'Hoàn tất thủ tục và theo dõi hành trình.'],
    ['Giao tận nơi', 'Phối hợp giao hàng tại địa chỉ nhận.'],
  ];
  return (
    <section className="bg-brief-dark py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BriefSectionIntro tone="dark" eyebrow="Quy trình gửi hàng" title="Đơn giản · Rõ ràng · An tâm" description="Anh chị gửi thông tin hàng để Hamburg Connect tư vấn hình thức, chi phí và thời gian phù hợp." />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{steps.map(([title, description], index) => <li key={title} className="border border-white/15 bg-white/5 p-5"><span className="text-brief-gold">0{index + 1}</span><h3 className="brief-display-heading mt-4 text-xl">{title}</h3><p className="mt-2 text-sm leading-6 text-brief-warm-gray">{description}</p></li>)}</ol>
        <div className="mt-10 border border-brief-gold/40 bg-white/5 p-6">
          <div className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-brief-gold" aria-hidden="true" /><div><h3 className="brief-display-heading text-xl">Hàng cấm & hạn chế</h3><p className="mt-2 text-sm leading-6 text-brief-warm-gray">Mỗi thị trường có quy định riêng. Anh chị gửi thành phần, nhãn mác và thông tin hàng để Hamburg Connect kiểm tra trước khi đóng gói.</p><Link href={getBriefRoutePath(lang, '/lien-he?nhu-cau=van-chuyen')} className="mt-4 inline-flex text-sm font-semibold text-brief-gold hover:underline">Liên hệ để kiểm tra hàng →</Link></div></div>
        </div>
      </div>
    </section>
  );
}
