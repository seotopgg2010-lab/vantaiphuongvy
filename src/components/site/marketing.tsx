import { ArrowRight, BadgeCheck, Clock3, ExternalLink, Gauge, Newspaper, PiggyBank, Quote, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { UploadImage } from '@/components/site/upload-image';
import { COMMITMENTS, PRESS, PROCESS_STEPS, STATS, TESTIMONIALS } from '@/lib/marketing';

const COMMITMENT_ICONS = { fast: Clock3, exact: Target, pro: BadgeCheck, safe: ShieldCheck, easy: Sparkles, save: PiggyBank } as const;
/** Press items shown on phones; the rest appear from `sm` up (keeps press blocks short on mobile). */
const PRESS_MOBILE_COUNT = 6;
/**
 * Phones get a swipeable row (the next card peeks in) instead of a tall stack; every card
 * stays in the HTML. From `sm` up the same list is a grid. The list is focusable so keyboard
 * users can scroll it.
 */
const SWIPE_LIST = '-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 scroll-px-5 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0';
const SWIPE_ITEM = 'w-[85%] shrink-0 snap-start sm:w-auto';

export function StatsStrip({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl lg:grid-cols-4 ${dark ? 'bg-white/10' : 'border border-line bg-line'}`}>
      {STATS.map((stat) => (
        <div key={stat.label} className={`flex flex-col gap-0.5 p-4 sm:px-6 sm:py-5 ${dark ? 'bg-white/10 backdrop-blur' : 'bg-white'}`}>
          <dt className={`order-2 text-sm ${dark ? 'text-on-brand' : 'text-muted'}`}>{stat.label}</dt>
          <dd className={`order-1 text-2xl font-extrabold tracking-tight sm:text-3xl ${dark ? 'text-white' : 'text-brand-700'}`}>{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CommitmentGrid() {
  return (
    <ul tabIndex={0} aria-label="Sáu lý do chọn Phương Vy" className={`${SWIPE_LIST} sm:grid-cols-2 sm:gap-4 lg:grid-cols-3`}>
      {COMMITMENTS.map((item) => {
        const Icon = COMMITMENT_ICONS[item.key];
        return (
          <li key={item.key} className={`card card-hover p-5 ${SWIPE_ITEM}`}>
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-[0_8px_16px_-8px_rgb(18_117_188/0.8)]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
            <h3 className="text-lg font-bold">{item.title}</h3></div>
            <p className="mt-3 text-[0.9375rem] leading-7 text-muted">{item.text}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function ProcessSteps() {
  return (
    <ol className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-5">
      {PROCESS_STEPS.map((step, index) => (
        <li key={step.title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 md:block">
          <div className="flex items-center gap-4 self-start">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-500 text-base font-extrabold text-navy-950 md:h-12 md:w-12 md:text-lg">{index + 1}</span>
            {index < PROCESS_STEPS.length - 1 && <span className="hidden h-px flex-1 bg-white/20 lg:block" aria-hidden="true" />}
          </div>
          <div>
            <h3 className="pt-1.5 text-lg font-bold text-white md:mt-4 md:pt-0">{step.title}</h3>
            <p className="mt-1.5 text-[0.9375rem] leading-7 text-on-brand md:mt-2">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PressGrid({ limit }: { limit?: number }) {
  const items = limit ? PRESS.slice(0, limit) : PRESS;
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item, index) => (
        <li key={item.outlet} className={index >= PRESS_MOBILE_COUNT ? 'max-sm:hidden' : undefined}>
          <a href={item.href} target="_blank" rel="noopener" className="card card-hover group block overflow-hidden" aria-label={`Bài viết trên ${item.outlet} về Vận tải Phương Vy (mở tab mới)`}>
            <span className="relative block aspect-[23/10] bg-surface">
              <UploadImage src={item.image} alt={`Báo ${item.outlet} viết về Vận tải Phương Vy`} fill sizes="(min-width: 1024px) 200px, (min-width: 640px) 33vw, 50vw" className="object-cover object-top" />
            </span>
            <span className="flex items-center justify-between gap-2 px-3 py-2.5 text-[0.8125rem] font-semibold text-ink">
              {item.outlet}
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-subtle transition group-hover:text-brand-600" aria-hidden="true" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Compact press social proof right under the home hero; links down to the full
 * `#press` grid. Phones list the first outlets plus a "+N báo khác" tail so the
 * strip stays within the second screen.
 */
export function PressStrip() {
  const dot = 'inline-flex items-center gap-1.5 before:h-1 before:w-1 before:rounded-full before:bg-subtle/40';
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-6">
      <p className="flex shrink-0 items-start gap-2 text-sm text-muted">
        <Newspaper className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
        <span><strong className="font-bold text-ink">{PRESS.length} báo điện tử</strong> đã đưa tin về Phương Vy</span>
      </p>
      <ul aria-label="Các báo đã đưa tin" className="flex min-w-0 flex-1 flex-wrap gap-x-3 gap-y-1 text-[0.8125rem] font-medium text-subtle">
        {PRESS.map((item, index) => (
          <li key={item.outlet} className={index >= PRESS_MOBILE_COUNT ? `${dot} max-sm:hidden` : dot}>{item.outlet}</li>
        ))}
        {PRESS.length > PRESS_MOBILE_COUNT && <li className={`${dot} sm:hidden`}>+{PRESS.length - PRESS_MOBILE_COUNT} báo khác</li>}
      </ul>
      {/* py-3/-my-3: 44px touch target without adding 24px of layout height */}
      <a href="#press" className="group -my-3 inline-flex shrink-0 items-center gap-1.5 self-start py-3 text-sm font-semibold text-brand-600 hover:underline lg:self-auto">
        Xem bài báo<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </a>
    </div>
  );
}

export function Testimonials() {
  return (
    <ul tabIndex={0} aria-label="Ý kiến khách hàng" className={`${SWIPE_LIST} sm:gap-4 md:grid-cols-3`}>
      {TESTIMONIALS.map((item) => (
        <li key={item.name} className={`card flex flex-col p-5 ${SWIPE_ITEM}`}>
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
