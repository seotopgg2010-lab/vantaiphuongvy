import type { ElementType, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

export type BriefTimelineStep = {
  number?: string;
  title: string;
  description: string;
  icon: ElementType;
};

export function BriefProcessTimeline({
  eyebrow,
  title,
  description,
  steps,
  dark = false,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  steps: BriefTimelineStep[];
  dark?: boolean;
  children?: ReactNode;
}) {
  const surface = dark ? 'bg-brief-dark text-white' : 'bg-white text-brief-ink';
  const muted = dark ? 'text-brief-warm-gray' : 'text-brief-soft-ink';

  return (
    <section className={`py-16 sm:py-20 ${surface}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className={`brief-eyebrow ${dark ? 'text-brief-gold' : 'text-brief-gold normal-case font-medium tracking-normal text-sm'}`}>{eyebrow}</p>
          <h2 className="brief-display-heading mt-1 text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
          {description && <p className={`mt-3 text-sm leading-relaxed sm:text-base ${muted}`}>{description}</p>}
        </div>
        <ol className={`mt-12 grid gap-6 sm:grid-cols-2 lg:gap-0 ${steps.length === 6 ? 'lg:grid-cols-6' : 'lg:grid-cols-5'}`}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="relative px-3 lg:px-4">
                <div className="relative h-full border-l border-brief-neutral/80 pl-4 first:border-l-0 lg:border-l-0 lg:pl-0">
                  <div className="flex items-center gap-3 lg:flex-col lg:text-center">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition duration-200 ${
                        dark
                          ? 'border-brief-gold/60 bg-brief-dark text-brief-gold'
                          : 'border-amber-300/80 bg-amber-50/70 text-amber-600 shadow-xs'
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${dark ? 'text-brief-gold' : 'text-amber-600'}`} aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="brief-display-heading mt-4 text-lg font-bold leading-snug sm:text-xl lg:text-center">
                    {step.title}
                  </h3>
                  <p className={`mt-2 text-xs sm:text-sm leading-relaxed lg:text-center ${muted}`}>
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 top-7 hidden -translate-y-1/2 translate-x-1/2 lg:flex items-center justify-center"
                  >
                    <ArrowRight className={`h-4 w-4 ${dark ? 'text-brief-gold/60' : 'text-amber-400'}`} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        {children && (
          <div className="mt-12 text-center">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
