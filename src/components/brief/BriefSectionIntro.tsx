import type { ReactNode } from 'react';

export function BriefSectionIntro({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
}) {
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : '';
  const textColor = tone === 'dark' ? 'text-white' : 'text-brief-ink';
  const mutedColor = tone === 'dark' ? 'text-brief-warm-gray' : 'text-brief-soft-ink';
  return (
    <div className={`flex max-w-3xl flex-col ${alignment}`}>
      {eyebrow ? <p className={`brief-eyebrow ${tone === 'dark' ? 'text-brief-gold' : ''}`}>{eyebrow}</p> : null}
      <h2 className={`brief-display-heading mt-2 text-3xl leading-tight ${textColor} sm:text-4xl`}>{title}</h2>
      {description && <p className={`mt-4 max-w-2xl text-[0.95rem] leading-7 ${mutedColor}`}>{description}</p>}
    </div>
  );
}
