import { markdownResponse, renderLlmsTxt } from '@/lib/markdown-twins';

export const dynamic = 'force-static';

export function GET() {
  return markdownResponse(renderLlmsTxt(), 'text/plain; charset=utf-8');
}
