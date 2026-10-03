'use client';

import React, { Suspense } from 'react';
import { ContactForm } from '@/components/forms/ContactForm';
import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import type { Dictionary } from '@/app/[lang]/dictionaries';

export function ContactFormSection({ dict, lang }: { dict: Dictionary; lang: string }) {
  return (
    <section className="bg-brief-ivory py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-8 max-w-3xl"><p className="brief-eyebrow">Báo giá vận chuyển</p><h1 className="mt-3 text-3xl font-bold text-brief-ink sm:text-4xl">Gửi thông tin chuyến hàng</h1><p className="mt-3 leading-7 text-brief-soft-ink">Điền các thông tin cơ bản bên dưới. Điều phối viên sẽ xác nhận lại tuyến, phương án giao nhận và chi phí phù hợp.</p></div>
        <div className="overflow-hidden rounded-2xl border border-brief-neutral bg-white shadow-xl lg:grid lg:grid-cols-[.82fr_1.18fr]">
          <aside className="bg-brief-dark p-7 text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-brief-gold">Tư vấn trực tiếp</p>
            <h2 className="mt-3 text-2xl font-bold">Cần báo giá gấp?</h2>
            <p className="mt-3 text-sm leading-6 text-sky-100">Gọi hoặc nhắn Zalo trong giờ tư vấn để được hỗ trợ nhanh hơn.</p>
            <div className="mt-8 space-y-5 text-sm">
              <a href="tel:0933871139" className="flex items-center gap-4 rounded-lg border border-white/15 p-3 transition hover:border-brief-gold hover:bg-white/5"><Phone className="h-5 w-5 shrink-0 text-brief-gold" aria-hidden="true" /><span><span className="block text-xs text-sky-200">Hotline chính</span><strong className="text-lg">{SITE_CONFIG.hotline}</strong></span></a>
              <a href={`https://zalo.me/${SITE_CONFIG.zalo}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-lg border border-white/15 p-3 transition hover:border-brief-gold hover:bg-white/5"><MessageCircle className="h-5 w-5 shrink-0 text-brief-gold" aria-hidden="true" /><span><span className="block text-xs text-sky-200">Zalo tư vấn</span><strong>{SITE_CONFIG.zalo}</strong></span></a>
              <div className="flex items-start gap-4"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-brief-gold" aria-hidden="true" /><span><span className="block text-xs text-sky-200">Giờ tư vấn</span><strong>{SITE_CONFIG.businessHours}</strong></span></div>
              <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-start gap-4"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-brief-gold" aria-hidden="true" /><span><span className="block text-xs text-sky-200">Email</span><strong className="break-all">{SITE_CONFIG.email}</strong></span></a>
              <div className="flex items-start gap-4"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brief-gold" aria-hidden="true" /><span><span className="block text-xs text-sky-200">Văn phòng</span><strong className="leading-6">{SITE_CONFIG.address}</strong></span></div>
            </div>
            <div className="mt-8 border-t border-white/15 pt-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-brief-gold">Chuẩn bị trước khi gửi</p><ol className="mt-3 space-y-2 text-sm leading-6 text-sky-100"><li>01. Điểm nhận và điểm giao.</li><li>02. Loại hàng, số kiện hoặc trọng lượng.</li><li>03. Số điện thoại để xác nhận nhanh.</li></ol></div>
          </aside>
          <div className="p-6 sm:p-10"><Suspense fallback={<div className="min-h-96" aria-busy="true" />}><ContactForm dict={dict} lang={lang} /></Suspense></div>
        </div>
      </div>
    </section>
  );
}
