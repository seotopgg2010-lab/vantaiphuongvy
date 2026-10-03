'use client';

import { useActionState, useEffect, useId, useRef } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { submitLead, type LeadFormState } from '@/actions/lead';
import { LEAD_SERVICES } from '@/lib/lead-validation';

const initialState: LeadFormState = { status: 'idle' };

function Field({ id, label, error, required, children }: { id: string; label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}{required && <span className="text-[#d64545]" aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-[#c23b3b]">{error}</p>}
    </div>
  );
}

/** Quote-request form (progressively enhanced server action). */
export function LeadForm({ defaultTo = '', page = '' }: { defaultTo?: string; page?: string }) {
  const [state, formAction, pending] = useActionState(submitLead, initialState);
  const startedRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const v = state.values || {};
  const e = state.errors || {};

  useEffect(() => {
    if (startedRef.current) startedRef.current.value = String(Date.now());
  }, [state]);

  if (state.status === 'success') {
    return (
      <div role="status" className="flex flex-col items-center rounded-2xl border border-success/30 bg-[#effaf4] px-6 py-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
        <p className="mt-4 text-lg font-bold text-ink">Đã nhận yêu cầu báo giá</p>
        <p className="mt-2 max-w-md text-muted">{state.message}</p>
      </div>
    );
  }

  const describedBy = (name: string) => (e[name as keyof typeof e] ? `${id(name)}-error` : undefined);

  return (
    <form action={formAction} noValidate className="space-y-4">
      {state.status === 'error' && state.message && (
        <p role="alert" className="rounded-xl border border-[#f1c4c4] bg-[#fdf2f2] px-4 py-3 text-sm font-medium text-[#a12f2f]">{state.message}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={id('name')} label="Họ và tên" error={e.name} required>
          <input id={id('name')} name="name" autoComplete="name" required defaultValue={v.name} aria-invalid={Boolean(e.name)} aria-describedby={describedBy('name')} className="field" placeholder="Nguyễn Văn A" />
        </Field>
        <Field id={id('phone')} label="Số điện thoại" error={e.phone} required>
          <input id={id('phone')} name="phone" type="tel" inputMode="tel" autoComplete="tel" required defaultValue={v.phone} aria-invalid={Boolean(e.phone)} aria-describedby={describedBy('phone')} className="field" placeholder="09xx xxx xxx" />
        </Field>
      </div>
      <Field id={id('service')} label="Dịch vụ cần báo giá" error={e.service}>
        <select id={id('service')} name="service" defaultValue={v.service || LEAD_SERVICES[0]} className="field">
          {LEAD_SERVICES.map((service) => <option key={service}>{service}</option>)}
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={id('from')} label="Điểm nhận hàng">
          <input id={id('from')} name="from" defaultValue={v.from ?? 'TP.HCM'} className="field" placeholder="VD: Quận 12, TP.HCM" />
        </Field>
        <Field id={id('to')} label="Điểm giao hàng">
          <input id={id('to')} name="to" defaultValue={v.to ?? defaultTo} className="field" placeholder="VD: Đà Nẵng" />
        </Field>
      </div>
      <Field id={id('cargo')} label="Loại hàng & khối lượng ước tính">
        <input id={id('cargo')} name="cargo" defaultValue={v.cargo} className="field" placeholder="VD: 2 tấn hàng tạp hóa, 10 kiện" />
      </Field>
      <Field id={id('note')} label="Ghi chú thêm">
        <textarea id={id('note')} name="note" rows={3} defaultValue={v.note} className="field min-h-24 resize-y" placeholder="Thời gian cần giao, yêu cầu bốc xếp, xuất hóa đơn…" />
      </Field>
      <input type="hidden" name="page" value={page} />
      <input ref={startedRef} type="hidden" name="startedAt" defaultValue="0" />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id('website')}>Website</label>
        <input id={id('website')} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" disabled={pending} data-track="submit_lead" className="btn btn-lg btn-primary w-full disabled:cursor-wait disabled:opacity-70">
        {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Send className="h-5 w-5" aria-hidden="true" />}
        {pending ? 'Đang gửi…' : 'Gửi yêu cầu báo giá'}
      </button>
      <p className="text-center text-xs text-subtle">Thông tin chỉ dùng để liên hệ báo giá, không chia sẻ cho bên thứ ba.</p>
    </form>
  );
}
