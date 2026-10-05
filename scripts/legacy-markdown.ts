/**
 * HTML -> GitHub-flavoured Markdown for the cleaned legacy corpus.
 *
 * Input is the sanitized `html` produced by build-legacy.ts, so only its
 * allow-list is handled: h2–h4, p, br, inline emphasis, a, img, ul/ol/li,
 * blockquote, figure/figcaption, aside.callout, div.table-scroll, tables, hr.
 * Internal links and images stay site-relative; the markdown twin renderer
 * makes them absolute for the current origin.
 */
import * as cheerio from 'cheerio';
import type { AnyNode, Element, Text } from 'domhandler';

type Ctx = { table?: boolean };

const BLOCK = new Set(['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'blockquote', 'figure', 'aside', 'div', 'table', 'hr']);

const isTag = (node: AnyNode): node is Element => node.type === 'tag';
const tags = (el: Element, ...names: string[]) => el.children.filter(isTag).filter((child) => names.includes(child.tagName));

function escapeText(value: string, ctx: Ctx): string {
  const escaped = value.replace(/([\\`*_[\]<])/g, '\\$1');
  return ctx.table ? escaped.replace(/\|/g, '\\|') : escaped;
}

/** Collapse whitespace per line and drop stray hard breaks at the edges. */
function tidy(value: string): string {
  return value.split('\n').map((line) => line.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n').replace(/^\\\n|\\$/g, '').trim();
}

/** Wrap inline content, keeping surrounding spaces outside the markers ("**a** b", not "**a **b"). */
function wrap(content: string, marker: string): string {
  const trimmed = content.trim();
  if (!trimmed) return content ? ' ' : '';
  return `${/^\s/.test(content) ? ' ' : ''}${marker}${trimmed}${marker}${/\s$/.test(content) ? ' ' : ''}`;
}

function image(el: Element): string {
  const src = el.attribs.src;
  return src ? `![${escapeText((el.attribs.alt || '').trim(), {})}](${src})` : '';
}

function inline(nodes: AnyNode[], ctx: Ctx): string {
  let out = '';
  for (const node of nodes) {
    if (node.type === 'text') { out += escapeText((node as Text).data.replace(/\s+/g, ' '), ctx); continue; }
    if (!isTag(node)) continue;
    const inner = () => inline(node.children, ctx);
    switch (node.tagName) {
      case 'strong': case 'b': out += wrap(inner(), '**'); break;
      case 'em': case 'i': out += wrap(inner(), '*'); break;
      case 's': out += wrap(inner(), '~~'); break;
      case 'br': out += ctx.table ? ' ' : '\\\n'; break;
      case 'img': out += image(node); break;
      case 'a': {
        const href = node.attribs.href;
        const text = inner().trim();
        out += href && !href.startsWith('#') ? `[${text || href}](${href})` : text;
        break;
      }
      case 'li': out += ` ${inner().trim()};`; break; // lists inside table cells are flattened
      default: out += inner();
    }
  }
  return out;
}

function list(el: Element): string {
  const ordered = el.tagName === 'ol';
  const start = ordered ? Number(el.attribs.start) || 1 : 1;
  return tags(el, 'li').map((li, index) => {
    const marker = ordered ? `${start + index}.` : '-';
    const pad = ' '.repeat(marker.length + 1);
    const text: string[] = [];
    const nested: string[] = [];
    let run: AnyNode[] = [];
    const flush = () => { const value = tidy(inline(run, {})); if (value) text.push(value); run = []; };
    for (const child of li.children) {
      if (isTag(child) && (child.tagName === 'ul' || child.tagName === 'ol')) { flush(); nested.push(list(child)); }
      else if (isTag(child) && child.tagName === 'p') { flush(); run = child.children; flush(); }
      else run.push(child);
    }
    flush();
    const body = [text.join(' ').replace(/\n/g, `\n${pad}`), ...nested.map((block) => block.replace(/^/gm, pad))].filter(Boolean).join('\n');
    return `${marker} ${body}`;
  }).join('\n');
}

function table(el: Element): string {
  const rows: string[][] = [];
  const walk = (node: Element) => {
    for (const child of node.children.filter(isTag)) {
      if (child.tagName !== 'tr') { walk(child); continue; }
      rows.push(tags(child, 'th', 'td').flatMap((cell) => {
        const span = Math.max(1, Math.min(10, Number(cell.attribs.colspan) || 1));
        return [tidy(inline(cell.children, { table: true })).replace(/\n/g, ' ') || ' ', ...Array<string>(span - 1).fill(' ')];
      }));
    }
  };
  walk(el);
  const filled = rows.filter((row) => row.length);
  if (!filled.length) return '';
  const width = Math.max(...filled.map((row) => row.length));
  const line = (row: string[]) => `| ${[...row, ...Array<string>(width - row.length).fill(' ')].join(' | ')} |`;
  return [line(filled[0]), `|${' --- |'.repeat(width)}`, ...filled.slice(1).map(line)].join('\n');
}

function blocks(nodes: AnyNode[]): string[] {
  const out: string[] = [];
  let run: AnyNode[] = [];
  const flush = () => { const value = tidy(inline(run, {})); if (value) out.push(value); run = []; };
  for (const node of nodes) {
    if (!isTag(node) || !BLOCK.has(node.tagName)) { run.push(node); continue; }
    flush();
    switch (node.tagName) {
      case 'p': run = node.children; flush(); break;
      case 'h2': case 'h3': case 'h4': {
        const value = tidy(inline(node.children, {})).replace(/\\?\n/g, ' ');
        if (value) out.push(`${'#'.repeat(Number(node.tagName[1]))} ${value}`);
        break;
      }
      case 'ul': case 'ol': out.push(list(node)); break;
      case 'hr': out.push('---'); break;
      case 'table': out.push(table(node)); break;
      case 'blockquote': case 'aside': {
        const inner = blocks(node.children).join('\n\n');
        if (inner) out.push(inner.replace(/^/gm, '> ').replace(/^> $/gm, '>'));
        break;
      }
      case 'figure': {
        const caption = tags(node, 'figcaption')[0];
        const text = caption ? tidy(inline(caption.children, {})) : '';
        out.push([...tags(node, 'img').map(image), text && `*${text}*`].filter(Boolean).join('\n'));
        break;
      }
      default: out.push(...blocks(node.children)); // div.table-scroll and stray wrappers
    }
  }
  flush();
  return out.filter(Boolean);
}

export function htmlToMarkdown(html: string): string {
  const $ = cheerio.load(html, null, false);
  return `${blocks($.root().contents().toArray()).join('\n\n')}\n`;
}
