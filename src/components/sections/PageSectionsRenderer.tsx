import Image from 'next/image';
import { renderRichText } from '@/lib/rich-text';

import Link from 'next/link';
import type { PageSection, JsonObject } from '@/types/database';

type SectionValue = string | string[] | undefined;

function text(content: JsonObject, key: string, fallback = ''): string {
  const value = content[key] as SectionValue;
  return typeof value === 'string' ? value : fallback;
}

function strings(content: JsonObject, key: string): string[] {
  const value = content[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function safeHref(value: string): string {
  return /^(https?:\/\/|mailto:|tel:|\/(?!\/))/i.test(value.trim()) ? value.trim() : '#';
}

function SafeImage({ src, alt }: { src: string; alt: string }) {
  if (!src) return null;
  return <Image src={src} alt={alt} width={1200} height={900} unoptimized className="h-full w-full object-cover" />;
}

function RichText({ html }: { html: string }) {
  return <div className="prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: renderRichText(html) }} />;
}

function renderSection(section: PageSection) {
  const content = section.content || {};
  const title = text(content, 'title');
  const description = text(content, 'description', text(content, 'subtitle'));
  const image = text(content, 'image', text(content, 'image_url'));
  const ctaText = text(content, 'cta_text', text(content, 'button_text'));
  const ctaLink = safeHref(text(content, 'cta_link', text(content, 'button_link')));

  switch (section.section_type) {
    case 'html':
    case 'rich_text': {
      const html = text(content, 'html', text(content, 'body', text(content, 'content')));
      return <section key={section.id} className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8"><RichText html={html} /></section>;
    }
    case 'hero':
      return (
        <section key={section.id} className="relative isolate overflow-hidden bg-brief-dark text-white">
          {image && <div className="absolute inset-0 -z-10 opacity-45"><SafeImage src={image} alt={text(content, 'image_alt', title)} /></div>}
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
            {title && <h2 className="brief-display-heading max-w-3xl text-white">{title}</h2>}
            {description && <p className="mt-5 max-w-2xl text-lg text-white/80">{description}</p>}
            {ctaText && <Link href={ctaLink} className="mt-8 inline-flex rounded-full bg-brief-gold px-6 py-3 font-semibold text-brief-dark">{ctaText}</Link>}
          </div>
        </section>
      );
    case 'features': {
      const items = strings(content, 'items');
      return <section key={section.id} className="bg-brief-ivory py-16"><div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">{title && <h2 className="brief-display-heading text-brief-ink">{title}</h2>}{description && <p className="mt-4 max-w-2xl text-brief-muted">{description}</p>}<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <div key={item} className="rounded-2xl border border-brief-neutral bg-white p-6"><p className="font-medium text-brief-ink">{item}</p></div>)}</div></div></section>;
    }
    case 'gallery': {
      const images = strings(content, 'images');
      return <section key={section.id} className="bg-white py-16"><div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">{title && <h2 className="brief-display-heading text-brief-ink">{title}</h2>}<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.map((src) => <div key={src} className="aspect-[4/3] overflow-hidden rounded-2xl"><SafeImage src={src} alt={title || 'Gallery image'} /></div>)}</div></div></section>;
    }
    case 'cta':
      return <section key={section.id} className="bg-brief-champagne py-16"><div className="mx-auto max-w-4xl px-5 text-center sm:px-6">{title && <h2 className="brief-display-heading text-brief-ink">{title}</h2>}{description && <p className="mx-auto mt-4 max-w-2xl text-brief-muted">{description}</p>}{ctaText && <Link href={ctaLink} className="mt-7 inline-flex rounded-full bg-brief-dark px-6 py-3 font-semibold text-white">{ctaText}</Link>}</div></section>;
    default:
      return null;
  }
}

export function PageSectionsRenderer({ sections }: { sections: PageSection[] }) {
  return <>{sections.map(renderSection)}</>;
}
