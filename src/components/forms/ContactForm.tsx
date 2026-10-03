'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ArrowRight, CheckCircle2, MapPin, Package, Phone, Scale, Truck } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

type QuoteForm = {
  pickup: string;
  delivery: string;
  cargo: string;
  weight: string;
  phone: string;
};

const initialForm: QuoteForm = { pickup: '', delivery: '', cargo: '', weight: '', phone: '' };

export function ContactForm({ lang }: { dict?: unknown; lang: string }) {
  const english = lang.toLowerCase().startsWith('en');
  const [form, setForm] = useState<QuoteForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof QuoteForm) => (event: ChangeEvent<HTMLInputElement>) => {
    setSubmitted(false);
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-[#b8dfc8] bg-[#f1fbf4] p-6" role="status">
        <CheckCircle2 className="h-8 w-8 text-[#16834b]" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-bold text-brief-ink">{english ? 'Your request is ready' : 'Thông tin báo giá đã sẵn sàng'}</h3>
        <p className="mt-2 text-sm leading-6 text-brief-soft-ink">{english ? 'Please call or message Zalo so our coordinator can confirm the route and quote.' : 'Vui lòng gọi hoặc nhắn Zalo để điều phối viên xác nhận tuyến và báo giá chính xác.'}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a href="tel:0933871139" className="brief-button-primary rounded-md"><Phone className="h-4 w-4" aria-hidden="true" />0933 871 139</a>
          <a href={`https://zalo.me/${SITE_CONFIG.zalo}`} className="brief-button-secondary rounded-md" target="_blank" rel="noreferrer">Zalo {SITE_CONFIG.zalo}</a>
        </div>
        <button type="button" onClick={() => { setForm(initialForm); setSubmitted(false); }} className="mt-5 text-sm font-bold text-brief-red hover:underline">{english ? 'Submit another request' : 'Gửi yêu cầu khác'}</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label={english ? 'Request a quote' : 'Yêu cầu báo giá'}>
      <div>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-brief-red">01 · Tuyến vận chuyển</p>
        <h3 className="mt-2 text-xl font-bold text-brief-ink">{english ? 'Where should we pick up and deliver?' : 'Bạn cần gửi hàng từ đâu đến đâu?'}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-brief-ink"><span className="mb-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-brief-red" aria-hidden="true" />{english ? 'Pickup location' : 'Điểm nhận hàng'}<span aria-hidden="true" className="text-brief-red">*</span></span><input required value={form.pickup} onChange={update('pickup')} placeholder="Ví dụ: Quận 12, TP.HCM" className="w-full rounded-lg border border-brief-neutral px-4 py-3 font-normal text-brief-ink outline-none transition focus:border-brief-red focus:ring-2 focus:ring-brief-red/20" /></label>
          <label className="block text-sm font-semibold text-brief-ink"><span className="mb-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-brief-red" aria-hidden="true" />{english ? 'Delivery location' : 'Điểm giao hàng'}<span aria-hidden="true" className="text-brief-red">*</span></span><input required value={form.delivery} onChange={update('delivery')} placeholder="Ví dụ: Hà Nội" className="w-full rounded-lg border border-brief-neutral px-4 py-3 font-normal text-brief-ink outline-none transition focus:border-brief-red focus:ring-2 focus:ring-brief-red/20" /></label>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-brief-red">02 · Thông tin hàng</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-brief-ink"><span className="mb-2 flex items-center gap-2"><Package className="h-4 w-4 text-brief-red" aria-hidden="true" />{english ? 'Cargo type' : 'Loại hàng'}<span aria-hidden="true" className="text-brief-red">*</span></span><input required value={form.cargo} onChange={update('cargo')} placeholder="Ví dụ: Máy móc, xe máy..." className="w-full rounded-lg border border-brief-neutral px-4 py-3 font-normal text-brief-ink outline-none transition focus:border-brief-red focus:ring-2 focus:ring-brief-red/20" /></label>
          <label className="block text-sm font-semibold text-brief-ink"><span className="mb-2 flex items-center gap-2"><Scale className="h-4 w-4 text-brief-red" aria-hidden="true" />{english ? 'Weight / dimensions' : 'Khối lượng / kích thước'}</span><input value={form.weight} onChange={update('weight')} placeholder="Ví dụ: 200 kg, 2 kiện" className="w-full rounded-lg border border-brief-neutral px-4 py-3 font-normal text-brief-ink outline-none transition focus:border-brief-red focus:ring-2 focus:ring-brief-red/20" /></label>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-brief-red">03 · Liên hệ</p>
        <label className="mt-4 block text-sm font-semibold text-brief-ink"><span className="mb-2 flex items-center gap-2"><Phone className="h-4 w-4 text-brief-red" aria-hidden="true" />{english ? 'Your phone number' : 'Số điện thoại nhận tư vấn'}<span aria-hidden="true" className="text-brief-red">*</span></span><input required type="tel" inputMode="tel" value={form.phone} onChange={update('phone')} placeholder="Ví dụ: 09xx xxx xxx" className="w-full rounded-lg border border-brief-neutral px-4 py-3 font-normal text-brief-ink outline-none transition focus:border-brief-red focus:ring-2 focus:ring-brief-red/20" /></label>
      </div>
      <button type="submit" className="brief-button-primary min-h-12 w-full rounded-md sm:w-auto"><Truck className="h-4 w-4" aria-hidden="true" />{english ? 'Prepare my quote request' : 'Gửi thông tin nhận báo giá'}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
      <p className="text-xs leading-5 text-brief-soft-ink">{english ? 'No payment is required. Our team will confirm the route before quoting.' : 'Chưa phát sinh thanh toán. Phương Vy sẽ xác nhận tuyến và thông tin hàng trước khi báo giá.'}</p>
    </form>
  );
}
