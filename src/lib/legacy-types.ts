/**
 * Shape of the build-time cleaned legacy corpus (src/legacy-content/legacy-clean.json).
 * Produced by scripts/build-legacy.ts from the immutable WordPress export.
 */
export type LegacyTemplate = 'home' | 'route-hub' | 'route' | 'cargo' | 'truck-hub' | 'truck' | 'post' | 'policy' | 'page';
export type LegacyRegion = 'bac' | 'trung' | 'nam' | 'tay-nguyen' | 'quoc-te' | 'loai-hang';

export type TocEntry = { id: string; text: string; level: 2 | 3 };
export type FaqEntry = { question: string; answer: string };
/** Post author, taken from the WordPress "Về tác giả" box. */
export type LegacyAuthor = { name: string; bio?: string };

export type LegacyEntry = {
  id: number;
  kind: 'page' | 'post';
  path: string;
  slug: string;
  template: LegacyTemplate;
  /** Original WordPress title (H1). */
  title: string;
  /** Short human label, e.g. "Đà Nẵng" for a route page. */
  label: string;
  region?: LegacyRegion;
  /** Sanitized, restyled article HTML (trusted build artifact). */
  html: string;
  toc: TocEntry[];
  faq: FaqEntry[];
  /** Clean first-paragraph summary (never contains rating widgets). */
  summary: string;
  /** Local image path under /wp-content/uploads, if any. */
  image?: string;
  imageAlt?: string;
  facts: { transit?: string; priceFrom?: string };
  date?: string;
  modified?: string;
  readingMinutes: number;
  seo: { title?: string; description?: string; robots?: string };
  author?: LegacyAuthor;
};
