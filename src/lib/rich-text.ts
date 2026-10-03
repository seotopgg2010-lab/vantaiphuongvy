import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { videoEmbedUrl } from './media-url';

function headingId(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'muc-noi-dung';
}

function uniqueHeadingId(text: string, seen: Set<string>): string {
  const base = headingId(text); let id = base; let index = 2;
  while (seen.has(id)) id = `${base}-${index++}`;
  seen.add(id); return id;
}

export function getRichTextHeadings(content: string | null | undefined): Array<{ id: string; text: string }> {
  if (!content) return [];
  const seen = new Set<string>();
  return [...content.matchAll(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gi)].map(([, raw]) => raw.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()).filter((text) => text.length >= 8).map((text) => ({ id: uniqueHeadingId(text, seen), text })).slice(0, 12);
}

export function renderRichText(content: string | null | undefined, contactPath = '/lien-he'): string {
  if (!content?.trim()) return '';
  const source = content.replace(/(?:\*\*)?\[Nút( phụ)?:\s*([^\]]+)\](?:\*\*)?/gi, (_, secondary: string, label: string) =>
    `[${label}](${secondary ? contactPath.replace(/\/lien-he$/, '/san-xuat-cung-ung/an-pham-bao-bi') : contactPath})`);
  const html = marked.parse(source, { async: false, breaks: true });
  const seenHeadingIds = new Set<string>();
  const htmlWithHeadingIds = html.replace(/<(h[2-4])([^>]*)>([\s\S]*?)<\/\1>/gi, (_, tag: string, attrs: string, text: string) => `<${tag}${attrs} id="${uniqueHeadingId(text.replace(/<[^>]+>/g, ' '), seenHeadingIds)}">${text}</${tag}>`);
  return sanitizeHtml(htmlWithHeadingIds, {
    allowedTags: ['h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'b', 'em', 'i', 's', 'u', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'figure', 'figcaption', 'video', 'source', 'iframe', 'pre', 'code', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    allowedAttributes: { a: ['href', 'title'], img: ['src', 'alt', 'width', 'height', 'style'], figure: ['data-editor-image'], video: ['src', 'title', 'controls', 'preload'], source: ['src', 'type'], iframe: ['src', 'title', 'loading', 'allowfullscreen', 'style'], th: ['colspan'], td: ['colspan'], h2: ['id'], h3: ['id'], h4: ['id'] },
    allowedStyles: { img: { display: [/^block$/], 'margin-left': [/^(auto|0)$/], 'margin-right': [/^(auto|0)$/] }, iframe: { width: [/^100%$/], 'aspect-ratio': [/^16\s*\/\s*9$/], border: [/^0$/] } },
    allowedIframeHostnames: ['www.youtube-nocookie.com', 'player.vimeo.com'],
    exclusiveFilter: (frame) => frame.tag === 'iframe' && !videoEmbedUrl(frame.attribs.src || ''),
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
    transformTags: { h1: 'h2', video: (tagName, attribs) => ({ tagName, attribs: { ...attribs, controls: '', preload: 'metadata' } }), iframe: (tagName, attribs) => ({ tagName, attribs: { ...attribs, src: videoEmbedUrl(attribs.src || '') || '', loading: 'lazy', allowfullscreen: '', style: 'width: 100%; aspect-ratio: 16 / 9; border: 0' } }) },
  });
}

/** Escape JSON-LD so CMS strings cannot close the script element. */
export function serializeJsonLd(value: unknown): string {
  const lineSeparator = String.fromCharCode(0x2028);
  const paragraphSeparator = String.fromCharCode(0x2029);

  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .split(lineSeparator).join('\\u2028')
    .split(paragraphSeparator).join('\\u2029');
}

/** Short plain-text copy for cards and metadata, independent of editor format. */
export function richTextSummary(content: string | null | undefined, maxLength = 180): string {
  const html = renderRichText(content);
  const firstParagraph = html.match(/<p>([\s\S]*?)<\/p>/)?.[1] || html;
  const text = sanitizeHtml(firstParagraph, { allowedTags: [], allowedAttributes: {} })
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1).replace(/\s+\S*$/, '')}…`;
}
