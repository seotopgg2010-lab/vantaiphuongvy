'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { createBrowserClient } from '@supabase/ssr';
import { videoEmbedUrl } from '@/lib/media-url';
import { MEDIA_ACCEPT, MEDIA_MIME, validateMediaFile } from '@/lib/media-validation';

type MediaItem = { name: string; url: string; type: 'image' | 'video' };
const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export function MediaPicker({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [alt, setAlt] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const busy = useRef(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      // Storage list is not recursive: include editor uploads as well as root media.
      const files: MediaItem[] = [];
      for (const folder of ['', 'editor']) {
        for (let offset = 0; ; offset += 100) {
          const { data, error: listError } = await supabase.storage.from('media').list(folder, { limit: 100, offset, sortBy: { column: 'created_at', order: 'desc' } });
          if (listError) throw listError;
          for (const file of data || []) {
            if (!file.id || !MEDIA_MIME.test(file.metadata?.mimetype || '')) continue;
            const name = folder ? `${folder}/${file.name}` : file.name;
            const { data: publicData } = supabase.storage.from('media').getPublicUrl(name);
            files.push({ name, url: publicData.publicUrl, type: file.metadata?.mimetype?.startsWith('video/') ? 'video' : 'image' });
          }
          if (!data || data.length < 100) break;
        }
      }
      setItems(files);
    } catch { setError('Không thể tải thư viện. Kiểm tra kết nối và quyền Storage (migration 016).'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => { window.clearTimeout(timer); previous?.focus(); };
  }, [load]);

  async function upload(file?: File) {
    if (!file || busy.current) return;
    const validationError = validateMediaFile(file);
    if (validationError) { setError(validationError); return; }
    busy.current = true; setLoading(true); setError('');
    try {
      const extension = file.type.split('/')[1].replace('jpeg', 'jpg');
      const path = `editor/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      const item: MediaItem = { name: path, url: data.publicUrl, type: file.type.startsWith('video/') ? 'video' : 'image' };
      setItems((current) => [item, ...current]); setSelected(item); setUrl('');
    } catch { setError('Không thể tải file lên. Kiểm tra kết nối và quyền upload (migration 016).'); }
    finally { busy.current = false; setLoading(false); if (uploadRef.current) uploadRef.current.value = ''; }
  }
  function insert() {
    if (loading) return;
    if (url.trim()) {
      const embed = videoEmbedUrl(url.trim());
      if (!embed) { setError('Nhập URL YouTube hoặc Vimeo hợp lệ, dùng HTTPS.'); return; }
      editor.chain().focus().insertContent({ type: 'videoEmbed', attrs: { src: embed, title: alt.trim() || 'Video' } }).run();
    } else if (selected) {
      if (selected.type === 'image') editor.chain().focus().setImage({ src: selected.url, alt: alt.trim() }).run();
      else editor.chain().focus().insertContent({ type: 'video', attrs: { src: selected.url, title: alt.trim() } }).run();
    } else return;
    onClose();
  }
  const visible = items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  return <dialog ref={dialog} onCancel={onClose} aria-label="Chọn ảnh hoặc video" className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-4xl rounded-2xl p-0 shadow-2xl backdrop:bg-black/50" onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
    <div className="flex max-h-[90vh] flex-col" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void upload(event.dataTransfer.files[0]); }}>
      <header className="flex items-center justify-between border-b p-4"><div><h2 className="text-lg font-semibold">Chọn ảnh hoặc video</h2><p className="text-sm text-gray-600">Chọn từ thư viện, tải file hoặc kéo thả vào khung này (tối đa 50MB).</p></div><button type="button" onClick={onClose} className="rounded border px-3 py-2" aria-label="Đóng thư viện">Đóng</button></header>
      <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-3"><input aria-label="Tìm media theo tên" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên file…" className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm" /><input ref={uploadRef} type="file" accept={MEDIA_ACCEPT} onChange={(event) => { void upload(event.target.files?.[0]); }} className="hidden" /><button type="button" disabled={loading} onClick={() => uploadRef.current?.click()} className="rounded-lg border px-3 py-2 disabled:opacity-50">Tải file</button></div>
      {error && <p role="alert" className="m-4 rounded bg-red-50 p-3 text-sm text-red-700">{error} <button type="button" onClick={() => { void load(); }} className="underline">Thử lại</button></p>}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{loading ? <p role="status" className="p-8 text-center">Đang tải…</p> : visible.length === 0 ? <p className="p-8 text-center text-gray-600">Chưa có media phù hợp.</p> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{visible.map((item) => <button type="button" key={item.name} aria-pressed={selected?.name === item.name && !url} onClick={() => { setSelected(item); setUrl(''); }} className={`overflow-hidden rounded-xl border text-left ${selected?.name === item.name && !url ? 'ring-2 ring-[#2B7935]' : ''}`}><div className="flex aspect-video items-center justify-center bg-gray-100">{item.type === 'image' ? <Image src={item.url} alt="" width={320} height={180} unoptimized className="h-full w-full object-cover" /> : <span>Video</span>}</div><span className="block truncate p-2 text-xs">{item.name}</span></button>)}</div>}</div>
      {selected && !url && <div className="px-4 pb-3">{selected.type === 'image' ? <Image src={selected.url} alt={alt} width={640} height={360} unoptimized className="mx-auto max-h-40 max-w-full object-contain" /> : <video src={selected.url} controls preload="metadata" className="mx-auto max-h-40 max-w-full" />}</div>}
      <footer className="space-y-3 border-t bg-gray-50 p-4"><label className="block text-sm">Video YouTube / Vimeo<input type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=…" className="mt-1 w-full rounded-lg border px-3 py-2" /></label><div className="flex flex-wrap gap-3"><label className="min-w-0 flex-1 text-sm">Mô tả ảnh / tiêu đề video<input value={alt} onChange={(event) => setAlt(event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" /></label><button type="button" onClick={insert} disabled={loading || (!selected && !url.trim())} className="self-end rounded-lg bg-[#2B7935] px-4 py-2 font-medium text-white disabled:opacity-50">Chèn vào bài</button></div></footer>
    </div>
  </dialog>;
}
