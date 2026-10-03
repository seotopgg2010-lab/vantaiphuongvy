import Link from 'next/link';
import { getShippingLandingContent } from '@/content/brief-demo';
import { HomeMarketsSection } from './HomeBriefSections';
import { getBriefFaqs } from '@/content/brief-faqs';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { localizedPath } from '@/lib/site';

export function ShippingBriefDetails({ lang }: { lang: string }) {
  const locale = lang.startsWith('en') ? 'en' : 'vi';
  const en = locale === 'en';
  const shipping = getShippingLandingContent(locale);
  return <>
    <section className="bg-brief-champagne py-12 sm:py-16" id="thue-phi"><div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <p className="brief-eyebrow">{en ? 'Clear costs' : 'Chi phí minh bạch'}</p><h2 className="brief-display-heading mt-2">{en ? 'Import duties by shipping method' : 'Thuế nhập khẩu theo từng hình thức'}</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{shipping.taxMethods.map(method => <div key={method.title.vi} className="rounded-lg border border-brief-gold/30 bg-white p-6"><h3 className="brief-display-heading">{method.title[locale]}</h3><p className="mt-4 text-brief-soft-ink">{method.description[locale]}</p></div>)}</div>
      <Link href={localizedPath(lang, '/van-chuyen-quoc-te/bao-tron-thue-phi-ddp')} className="mt-6 inline-block font-semibold text-brief-red">{en ? 'Explore DDP delivery' : 'Tìm hiểu Bao trọn thuế phí (DDP)'} →</Link>
    </div></section>
    <HomeMarketsSection lang={lang} />
    <section className="bg-white py-12 sm:py-16" id="thoi-gian"><div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <p className="brief-eyebrow">{en ? 'Planning your shipment' : 'Lên kế hoạch gửi hàng'}</p><h2 className="brief-display-heading mt-2">{en ? 'Indicative transit times' : 'Thời gian vận chuyển tham khảo'}</h2>
      <div className="mt-8 overflow-x-auto"><table className="w-full min-w-[36rem] border-collapse text-left text-sm"><thead className="bg-brief-champagne"><tr>{(en ? ['Destination', 'Express', 'Air freight', 'Sea freight'] : ['Điểm đến', 'Chuyển phát nhanh', 'Đường hàng không', 'Đường biển']).map(x => <th key={x} scope="col" className="border border-brief-neutral px-5 py-4">{x}</th>)}</tr></thead><tbody>{[
        [en ? 'Germany & Europe' : 'Đức & châu Âu', '4–6', '8–12', '45–55'],
        [en ? 'United States & Canada' : 'Mỹ & Canada', '3–5', '7–14', '35–45'],
        [en ? 'Australia' : 'Úc', '3–5', '7–12', '25–35'],
      ].map(([destination, ...times]) => <tr key={destination}><th scope="row" className="border border-brief-neutral px-5 py-4 font-medium">{destination}</th>{times.map((time, i) => <td key={i} className="border border-brief-neutral px-5 py-4">{time} {en ? 'days' : 'ngày'}</td>)}</tr>)}</tbody></table></div>
      <p className="mt-4 text-sm text-brief-soft-ink">{en ? 'Indicative times vary by route and shipment. LCL consolidation may add 1–2 weeks.' : 'Thời gian tham khảo thay đổi theo tuyến và lô hàng. Hàng lẻ ghép container có thể thêm 1–2 tuần.'}</p>
      <h3 className="brief-display-heading mt-10">{en ? 'Shipping partners' : 'Hãng vận chuyển đối tác'}</h3><p className="mt-4 flex flex-wrap gap-x-7 gap-y-3 font-semibold text-brief-soft-ink">DHL · UPS · FedEx · DPD · Hermes · GLS · DB Schenker</p>
    </div></section>
    <section id="hang-hoa" className="bg-brief-ivory py-12 sm:py-16"><div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div><p className="brief-eyebrow">{en ? 'Shipment preparation' : 'Chuẩn bị lô hàng'}</p><h2 className="brief-display-heading mt-2">{en ? 'Collection & packaging' : 'Lấy hàng & đóng gói'}</h2><p className="mt-5 text-brief-soft-ink">{en ? 'Doorstep collection or receipt at our Ho Chi Minh City office. Bubble wrap, protective cartons, labels and vacuum packing for textiles. ISPM 15 treated wooden crates for signage and interiors.' : 'Lấy hàng tận nơi hoặc nhận tại văn phòng TP.HCM. Bọc xốp bong bóng, thùng carton 3–5 lớp, dán nhãn, mã vận đơn; hút chân không đồ vải; kiện gỗ hun trùng ISPM 15 cho bảng hiệu, nội thất, máy móc.'}</p></div>
      <div><h2 className="brief-display-heading">{en ? 'Restricted & prohibited goods' : 'Hàng cấm & hạn chế'}</h2><p className="mt-5 text-brief-soft-ink">{en ? 'Each destination has its own restrictions. Europe restricts dairy, meat and fresh plants; the USA restricts meat products; Australia applies strict biosecurity checks. Share a packing list so requirements can be checked before packaging.' : 'Mỗi thị trường có quy định riêng: châu Âu hạn chế sữa, thịt và thực vật tươi; Mỹ hạn chế thịt và sản phẩm từ thịt; Úc kiểm dịch nghiêm ngặt trứng, hạt giống, đồ gỗ chưa xử lý. Anh chị gửi thông tin hàng để Hamburg Connect kiểm tra trước khi đóng gói.'}</p></div>
    </div></section>
    <section id="bang-gia" className="bg-white py-12"><div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8"><h2 className="brief-display-heading">{en ? 'Indicative pricing' : 'Bảng giá tham khảo'}</h2><p className="mt-4 max-w-3xl text-brief-soft-ink">{en ? 'Share the goods, weight, dimensions and destination for a quote that specifies shipping, duties and applicable surcharges.' : 'Anh chị gửi loại hàng, trọng lượng, kích thước và điểm đến để nhận báo giá rõ hình thức vận chuyển, thuế phí và phụ phí áp dụng.'}</p><Link href={localizedPath(lang, '/lien-he?nhu-cau=van-chuyen')} className="brief-button-primary mt-5 rounded-full">{en ? 'Contact us' : 'Liên hệ'}</Link></div></section>
    {<section className="bg-brief-ivory py-12"><div className="mx-auto max-w-4xl px-5"><h2 className="brief-display-heading mb-6">{en ? 'Frequently asked questions' : 'Câu hỏi thường gặp'}</h2><FAQAccordion items={getBriefFaqs(lang).shipping} /><Link href={localizedPath(lang, '/cau-hoi-thuong-gap')} className="mt-6 inline-block font-semibold text-brief-red">{en ? 'View more questions' : 'Xem thêm câu hỏi thường gặp'} →</Link></div></section>}
  </>;
}
