import { markdownResponse, renderLlmsFull } from '@/lib/markdown-twins';

export const dynamic = 'force-static';

export function GET() {
  return markdownResponse(renderLlmsFull(), 'text/plain; charset=utf-8');
}
