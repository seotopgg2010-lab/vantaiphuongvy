import { markdownResponse, renderTwin, TWIN_PATHS } from '@/lib/markdown-twins';

/**
 * Markdown twins. Public URLs are `/<path>.md` (home: `/index.md`); a static rewrite
 * (src/lib/public-routing.ts) maps them here, and a direct `/md/*` request 404s.
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return TWIN_PATHS.map((path) => ({ slug: path === '/' ? [] : path.slice(1).split('/') }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const markdown = renderTwin(`/${slug.map((segment) => decodeURIComponent(segment)).join('/')}`);
  return markdown ? markdownResponse(markdown) : new Response('Not found', { status: 404 });
}
