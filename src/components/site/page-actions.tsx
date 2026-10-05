'use client';

import { useRef, useState } from 'react';
import { Check, ChevronDown, Copy, FileText, Link2, Share2, Sparkles } from 'lucide-react';

/** Provider prefill URLs are undocumented and change without notice — recheck before relying on them. */
const AI_TARGETS = [
  { label: 'ChatGPT', href: (prompt: string) => `https://chatgpt.com/?hints=search&prompt=${encodeURIComponent(prompt)}` },
  { label: 'Claude', href: (prompt: string) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}` },
  { label: 'Perplexity', href: (prompt: string) => `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}` },
];

const BUTTON = 'inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3.5 text-sm font-semibold text-ink transition hover:border-brand-600 hover:text-brand-600';
const MENU_ITEM = 'flex min-h-10 w-full items-center gap-2.5 rounded-md px-3 text-left text-sm font-medium text-ink hover:bg-brand-50 hover:text-brand-700';

/** Fallback for non-secure contexts and frames without clipboard permission (still inside the click). */
function copyWithSelection(text: string): boolean {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
  document.body.append(area);
  area.select();
  try { return document.execCommand('copy'); } catch { return false; } finally { area.remove(); }
}

/**
 * Share / copy / ask-AI actions for an article. Only the public canonical URL
 * and the public markdown twin ever leave the page.
 */
export function PageActions({ url, markdownUrl, title }: { url: string; markdownUrl: string; title: string }) {
  const [status, setStatus] = useState({ text: '', ok: true });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prompt = `Đọc ${markdownUrl} và trả lời câu hỏi của tôi về bài viết “${title}”.`;

  const announce = (text: string, ok = true) => {
    setStatus({ text, ok });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus({ text: '', ok: true }), 2500);
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url); announce('Đã sao chép liên kết'); }
    catch {
      if (copyWithSelection(url)) announce('Đã sao chép liên kết');
      else announce('Không sao chép được — hãy chép địa chỉ trên thanh trình duyệt', false);
    }
  };

  // The clipboard write starts inside the click (Safari rejects writes after the gesture ends).
  const copyMarkdown = async () => {
    // Same-origin path, so copying also works on preview/staging hosts.
    const text = fetch(new URL(markdownUrl).pathname).then((response) => (response.ok ? response.text() : Promise.reject(new Error(String(response.status)))));
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ 'text/plain': text.then((value) => new Blob([value], { type: 'text/plain' })) })]);
      } else {
        await navigator.clipboard.writeText(await text);
      }
      announce('Đã sao chép nội dung bài viết (Markdown)');
    } catch { announce('Không sao chép được nội dung', false); }
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch { /* dismissed by the user */ }
      return;
    }
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative flex flex-wrap items-center gap-2">
      <button type="button" onClick={share} className={BUTTON}><Share2 className="h-4 w-4" aria-hidden="true" />Chia sẻ</button>
      <button type="button" onClick={copyLink} className={BUTTON}><Link2 className="h-4 w-4" aria-hidden="true" />Sao chép liên kết</button>
      <details className="group relative">
        <summary className={`${BUTTON} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
          <Sparkles className="h-4 w-4" aria-hidden="true" />Hỏi AI về bài viết<ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="absolute left-0 z-20 mt-2 w-72 max-w-[calc(100vw-2.5rem)] rounded-xl border border-line bg-white p-1.5 shadow-[var(--shadow-lift)]">
          {AI_TARGETS.map((target) => (
            <a key={target.label} href={target.href(prompt)} target="_blank" rel="noopener noreferrer" className={MENU_ITEM}>
              <Sparkles className="h-4 w-4 text-brand-600" aria-hidden="true" />Mở trong {target.label}<span className="sr-only"> (tab mới)</span>
            </a>
          ))}
          <button type="button" onClick={copyMarkdown} className={MENU_ITEM}><Copy className="h-4 w-4 text-brand-600" aria-hidden="true" />Sao chép nội dung (Markdown)</button>
          <a href={markdownUrl} className={MENU_ITEM}><FileText className="h-4 w-4 text-brand-600" aria-hidden="true" />Xem bản Markdown</a>
        </div>
      </details>
      <p role="status" aria-live="polite" className={`pointer-events-none absolute left-0 top-full mt-2 inline-flex items-center gap-1.5 rounded-lg bg-navy-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[var(--shadow-card)] transition-opacity ${status.text ? 'opacity-100' : 'opacity-0'}`}>
        {status.text && status.ok && <Check className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />}{status.text}
      </p>
    </div>
  );
}
