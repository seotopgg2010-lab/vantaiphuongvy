'use client';

import { useCallback, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { deletePageSection, savePageSection } from '@/app/[lang]/admin/(dashboard)/pages/section-actions';
import type { PageSection } from '@/types/database';

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const emptyContent = '{\n  "title": "",\n  "description": "",\n  "html": ""\n}';

export function PageSectionEditor() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [pageKey, setPageKey] = useState('home');
  const [locale, setLocale] = useState<'vi' | 'en'>('vi');
  const [content, setContent] = useState(emptyContent);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const loadSections = useCallback(async () => {
    const { data, error } = await supabase.from('page_sections').select('*').eq('page_key', pageKey).eq('locale', locale).order('sort_order', { ascending: true });
    if (error) setStatus(`Không tải được section: ${error.message}`);
    else setSections((data || []) as PageSection[]);
  }, [pageKey, locale]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadSections(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadSections]);

  function editSection(section: PageSection) {
    setSelectedId(section.id);
    setPageKey(section.page_key);
    setLocale(section.locale);
    setContent(JSON.stringify(section.content, null, 2));
    const form = document.getElementById('page-section-form');
    const sectionKeyInput = form?.querySelector<HTMLInputElement>('[name="section_key"]');
    const sectionTypeInput = form?.querySelector<HTMLSelectElement>('[name="section_type"]');
    const sortOrderInput = form?.querySelector<HTMLInputElement>('[name="sort_order"]');
    if (sectionKeyInput) sectionKeyInput.value = section.section_key;
    if (sectionTypeInput) sectionTypeInput.value = section.section_type;
    const publishedInput = form?.querySelector<HTMLInputElement>('[name="is_published"]');
    if (publishedInput) publishedInput.checked = section.is_published;
    if (sortOrderInput) sortOrderInput.value = String(section.sort_order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setStatus('Đang lưu...');
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set('content', content);
    formData.set('id', selectedId || '');
    const result = await savePageSection(formData);
    setStatus(result.success ? 'Đã lưu section.' : `Lỗi: ${result.error}`);
    setLoading(false);
    if (result.success) { setSelectedId(null); form.reset(); setContent(emptyContent); await loadSections(); }
  }

  async function removeSection(section: PageSection) {
    if (!window.confirm('Xóa section này khỏi website?')) return;
    setStatus('Đang xóa...');
    const result = await deletePageSection(section.id);
    setStatus(result.success ? 'Đã xóa section.' : `Lỗi: ${result.error}`);
    if (result.success) await loadSections();
  }

  return <div className="space-y-4">
    <form id="page-section-form" onSubmit={submit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-lg font-semibold text-[#1F2522]">Page Builder</h2><p className="text-sm text-gray-500">Chỉnh sửa section website mà không cần sửa code.</p></div><span className="text-sm text-gray-500" aria-live="polite">{status}</span></div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <label className="text-sm">Page key<input name="page_key" value={pageKey} onChange={(e) => setPageKey(e.target.value)} required placeholder="home" className="mt-1 w-full rounded-lg border p-2.5" /></label>
        <label className="text-sm">Section key<input name="section_key" required placeholder="hero-main" className="mt-1 w-full rounded-lg border p-2.5" /></label>
        <label className="text-sm">Ngôn ngữ<select name="locale" value={locale} onChange={(e) => setLocale(e.target.value as 'vi' | 'en')} className="mt-1 w-full rounded-lg border p-2.5"><option value="vi">Tiếng Việt</option><option value="en">English</option></select></label>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <label className="text-sm">Loại section<select name="section_type" defaultValue="rich_text" className="mt-1 w-full rounded-lg border p-2.5"><option value="rich_text">Rich text</option><option value="hero">Hero</option><option value="features">Features</option><option value="gallery">Gallery</option><option value="cta">CTA</option><option value="html">HTML</option></select></label>
        <label className="text-sm">Thứ tự<input name="sort_order" type="number" defaultValue="0" className="mt-1 w-full rounded-lg border p-2.5" /></label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm"><input name="is_published" type="checkbox" defaultChecked /> Hiển thị công khai</label>
      </div>
      <label className="block text-sm">Nội dung JSON<textarea value={content} onChange={(event) => setContent(event.target.value)} required className="mt-1 min-h-56 w-full rounded-lg border bg-slate-950 p-4 font-mono text-sm text-emerald-100" spellCheck={false} /></label>
      <div className="flex gap-3"><button type="submit" disabled={loading} className="rounded-lg bg-[#2B7935] px-5 py-2.5 font-medium text-white disabled:opacity-60">{loading ? 'Đang lưu...' : selectedId ? 'Cập nhật section' : 'Lưu section'}</button>{selectedId && <button type="button" onClick={() => { setSelectedId(null); setContent(emptyContent); const form = document.getElementById('page-section-form') as HTMLFormElement | null; form?.reset(); }} className="rounded-lg border px-5 py-2.5">Hủy sửa</button>}</div>
    </form>
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h3 className="font-semibold">Section của {pageKey} / {locale}</h3>{sections.length === 0 ? <p className="mt-3 text-sm text-gray-500">Chưa có section.</p> : <div className="mt-3 divide-y">{sections.map((section) => <div key={section.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{section.section_key} <span className="text-xs text-gray-500">({section.section_type})</span></p><p className="text-xs text-gray-500">Thứ tự {section.sort_order} · {section.is_published ? 'Đang hiển thị' : 'Bản nháp'}</p></div><div className="flex gap-2"><button type="button" onClick={() => editSection(section)} className="rounded border px-3 py-1.5 text-sm">Sửa</button><button type="button" onClick={() => void removeSection(section)} className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-700">Xóa</button></div></div>)}</div>}</div>
  </div>;
}
