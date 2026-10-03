import Image from 'next/image';
import { BadgeCheck, Clock3, ExternalLink, Gauge, PiggyBank, Quote, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { COMMITMENTS, PRESS, PROCESS_STEPS, STATS, TESTIMONIALS } from '@/lib/marketing';

const COMMITMENT_ICONS = { fast: Clock3, exact: Target, pro: BadgeCheck, safe: ShieldCheck, easy: Sparkles, save: PiggyBank } as const;

export function StatsStrip({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl lg:grid-cols-4 ${dark ? 'bg-white/10' : 'border border-line bg-line'}`}>
      {STATS.map((stat) => (
        <div key={stat.label} className={`flex flex-col gap-1 p-5 sm:p-6 ${dark ? 'bg-navy-900/60 backdrop-blur' : 'bg-white'}`}>
          <dt className={`order-2 text-sm ${dark ? 'text-sky-100/75' : 'text-muted'}`}>{stat.label}</dt>
          <dd className={`order-1 text-2xl font-extrabold tracking-tight sm:text-3xl ${dark ? 'text-white' : 'text-navy-900'}`}>{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CommitmentGrid() {
  return (
    <ul className="grid content-start gap-4 sm:grid-cols-2">
      {COMMITMENTS.map((item) => {
        const Icon = COMMITMENT_ICONS[item.key];
        return (
          <li key={item.key} className="card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon className="h-5 w-5" aria-hidden="true" /></span>
            <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
            <p className="mt-2 text-[0.9375rem] leading-7 text-muted">{item.text}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function ProcessSteps() {
  return (
    <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {PROCESS_STEPS.map((step, index) => (
        <li key={step.title} className="relative">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-500 text-lg font-extrabold text-navy-950">{index + 1}</span>
            {index < PROCESS_STEPS.length - 1 && <span className="hidden h-px flex-1 bg-white/20 lg:block" aria-hidden="true" />}
          </div>
          <h3 className="mt-5 text-lg font-bold text-white">{step.title}</h3>
          <p className="mt-2 text-[0.9375rem] leading-7 text-sky-100/75">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function PressGrid({ limit }: { limit?: number }) {
  const items = limit ? PRESS.slice(0, limit) : PRESS;
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.outlet}>
          <a href={item.href} target="_blank" rel="noopener" className="card card-hover group block overflow-hidden" aria-label={`Bài viết trên ${item.outlet} về Vận tải Phương Vy (mở tab mới)`}>
            <span className="relative block aspect-[23/10] bg-surface">
              <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw" className="object-cover object-top" />
            </span>
            <span className="flex items-center justify-between gap-2 px-3.5 py-3 text-sm font-semibold text-ink">
              {item.outlet}
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-subtle transition group-hover:text-brand-600" aria-hidden="true" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Testimonials() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {TESTIMONIALS.map((item) => (
        <li key={item.name} className="card flex flex-col p-6">
          <Quote className="h-7 w-7 text-brand-400" aria-hidden="true" />
          <blockquote className="mt-3 flex-1 text-[0.9375rem] leading-7 text-ink">“{item.quote}”</blockquote>
          <p className="mt-5 border-t border-line pt-4 text-sm"><span className="font-bold text-ink">{item.name}</span><span className="text-muted"> · {item.role}</span></p>
        </li>
      ))}
    </ul>
  );
}

export function TrustBadges() {
  return (
    <ul className="flex flex-wrap gap-2">
      {[
        { icon: ShieldCheck, text: 'Có hóa đơn & bảo hiểm hàng hóa' },
        { icon: Gauge, text: 'Xe chạy hàng ngày' },
        { icon: BadgeCheck, text: 'Hơn 10 năm kinh nghiệm' },
      ].map(({ icon: Icon, text }) => (
        <li key={text} className="chip"><Icon className="h-4 w-4 text-success" aria-hidden="true" />{text}</li>
      ))}
    </ul>
  );
}
