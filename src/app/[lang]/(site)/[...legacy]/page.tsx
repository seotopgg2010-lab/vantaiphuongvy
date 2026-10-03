import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/site/json-ld';
import { crumbsToJsonLd, legacyCrumbs } from '@/lib/breadcrumbs';
import { getLegacyByPath, RETIRED_PATHS, routableItems } from '@/lib/legacy-content';
import { generateLegacyJsonLd, legacyMetadata } from '@/lib/seo';
import { LegacyPage } from '@/templates/legacy-page';

type Props = { params: Promise<{ lang: string; legacy: string[] }> };

/** Every legacy WordPress URL is prerendered; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return routableItems.map((item) => ({ legacy: item.path.split('/').filter(Boolean) }));
}

function resolve(segments: string[]) {
  const path = `/${segments.map((segment) => decodeURIComponent(segment)).join('/')}`;
  if (RETIRED_PATHS.has(path)) return undefined;
  return getLegacyByPath(path);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { legacy } = await params;
  const item = resolve(legacy);
  return item ? legacyMetadata(item) : {};
}

export default async function LegacyRoute({ params }: Props) {
  const { legacy } = await params;
  const item = resolve(legacy);
  if (!item) notFound();
  return (
    <>
      <JsonLd data={generateLegacyJsonLd(item, crumbsToJsonLd(legacyCrumbs(item), item.path))} />
      <LegacyPage item={item} />
    </>
  );
}
