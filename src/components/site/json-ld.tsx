import { serializeJsonLd } from '@/lib/rich-text';

/** Renders one or more JSON-LD blocks safely (escapes `<` etc.). */
export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }} />
      ))}
    </>
  );
}
