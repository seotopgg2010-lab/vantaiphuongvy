'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { MediaPicker } from './MediaPicker';
import { videoEmbedUrl } from '@/lib/media-url';
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Quote, Undo, Redo, Image as ImageIcon, Link as LinkIcon, Code, Eye, Code2, Video } from 'lucide-react';

const VideoNode = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  addAttributes() { return { src: { default: '' }, title: { default: '' } }; },
  parseHTML() { return [{ tag: 'video' }]; },
  renderHTML({ HTMLAttributes }) { return ['video', { ...HTMLAttributes, controls: true, class: 'my-4 max-h-[480px] w-full rounded-lg bg-black' }]; },
});

const EditorImage = Image.extend({
  parseHTML() {
    return [{ tag: 'figure[data-editor-image]', getAttrs: (element) => {
      const image = element.querySelector('img');
      return image ? { src: image.getAttribute('src'), alt: image.getAttribute('alt'), width: image.getAttribute('width'), style: image.getAttribute('style'), 'data-caption': element.querySelector('figcaption')?.textContent || null } : false;
    } }, { tag: 'img[src]' }];
  },
  renderHTML({ HTMLAttributes }) {
    const { 'data-caption': caption, ...attributes } = HTMLAttributes;
    return caption ? ['figure', { 'data-editor-image': '' }, ['img', attributes], ['figcaption', {}, caption]] : ['img', attributes];
  },
  addAttributes() {
    return { ...this.parent?.(), width: { default: null }, height: { default: null },
      style: { default: null }, 'data-caption': { default: null } };
  },
});
const EmbedNode = Node.create({
  name: 'videoEmbed', group: 'block', atom: true,
  addAttributes() { return { src: { default: '' }, title: { default: 'Video' } }; },
  parseHTML() { return [{ tag: 'iframe', getAttrs: (element) => videoEmbedUrl(element.getAttribute('src') || '') ? {} : false }]; },
  renderHTML({ HTMLAttributes }) {
    return ['iframe', { ...HTMLAttributes, src: videoEmbedUrl(HTMLAttributes.src) || '', loading: 'lazy', allowfullscreen: 'true', style: 'width: 100%; aspect-ratio: 16 / 9; border: 0' }];
  },
});

interface RichTextEditorProps {
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps { onClick: () => void; active?: boolean; disabled?: boolean; children: ReactNode; title: string; }

function ToolbarButton({ onClick, active = false, disabled = false, children, title }: ToolbarButtonProps) {
  return <button type="button" disabled={disabled} aria-pressed={active} onClick={onClick} aria-label={title} title={title} className={`min-h-9 min-w-9 rounded p-1.5 transition-colors hover:bg-gray-200 disabled:opacity-40 ${active ? 'bg-[#2B7935]/10 text-[#2B7935]' : 'text-gray-600'}`}>{children}</button>;
}

export function RichTextEditor({ name, defaultValue = '', value, onChange, placeholder }: RichTextEditorProps) {
  const [sourceMode, setSourceMode] = useState(false);
  const [source, setSource] = useState(value ?? defaultValue);
  const [mediaOpen, setMediaOpen] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [StarterKit.configure({ link: false }), EditorImage, VideoNode, EmbedNode, Link.configure({ openOnClick: false })],
    content: value ?? defaultValue,
    onUpdate: ({ editor: updatedEditor }) => onChange?.(updatedEditor.getHTML()),
    editorProps: { attributes: { role: 'textbox', 'aria-multiline': 'true', 'aria-label': placeholder || 'Nội dung', class: 'prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none', 'data-placeholder': placeholder ?? '' } },
  });

  useEffect(() => {
    if (!editor || sourceMode || value === undefined || editor.getHTML() === value) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value, sourceMode]);

  if (!editor) return null;
  const addLink = () => { const url = window.prompt('URL liên kết:'); if (url) editor.chain().focus().setLink({ href: url }).run(); };

  return <div className="overflow-hidden rounded-lg border border-gray-300 focus-within:border-[#2B7935] focus-within:ring-2 focus-within:ring-[#2B7935]">
    <div className="flex flex-wrap gap-0.5 border-b border-gray-200 bg-gray-50 p-2">
    <fieldset disabled={sourceMode} className="contents">
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Đậm"><Bold className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Nghiêng"><Italic className="h-4 w-4" /></ToolbarButton>
      <span className="mx-1 h-6 w-px self-center bg-gray-300" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Tiêu đề 2"><Heading2 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Tiêu đề 3"><Heading3 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Danh sách"><List className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Danh sách đánh số"><ListOrdered className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Trích dẫn"><Quote className="h-4 w-4" /></ToolbarButton>
      <span className="mx-1 h-6 w-px self-center bg-gray-300" />
      <ToolbarButton onClick={() => setMediaOpen(true)} title="Chọn ảnh/video"><ImageIcon className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => setMediaOpen(true)} title="Chọn video"><Video className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Chèn liên kết"><LinkIcon className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block"><Code className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} title="Hoàn tác"><Undo className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} title="Làm lại"><Redo className="h-4 w-4" /></ToolbarButton>
      </fieldset>
      <ToolbarButton onClick={() => { if (sourceMode) editor.commands.setContent(source, { emitUpdate: true }); else setSource(editor.getHTML()); setSourceMode(!sourceMode); }} active={sourceMode} title={sourceMode ? 'Trình soạn thảo trực quan' : 'Chỉnh sửa HTML'}>{sourceMode ? <Eye className="h-4 w-4" /> : <Code2 className="h-4 w-4" />}</ToolbarButton>
      <span className="ml-auto self-center px-2 text-xs text-gray-500" aria-live="polite">{editor.getText().length} ký tự</span>
    </div>
    {!sourceMode && editor.isActive('image') && <div className="flex flex-wrap items-center gap-2 border-b bg-gray-50 p-3">
      <label className="text-sm">Độ rộng <select aria-label="Độ rộng ảnh" value={editor.getAttributes('image').width || '100%'} onChange={(event) => editor.chain().focus().updateAttributes('image', { width: event.target.value }).run()} className="rounded border p-2">{['25%', '50%', '75%', '100%'].map((width) => <option key={width}>{width}</option>)}</select></label>
      {(['Trái', 'Giữa', 'Phải'] as const).map((label, index) => <button key={label} type="button" className="rounded border px-3 py-2 text-sm" onClick={() => editor.chain().focus().updateAttributes('image', { style: ['display: block; margin-left: 0; margin-right: auto', 'display: block; margin-left: auto; margin-right: auto', 'display: block; margin-left: auto; margin-right: 0'][index] }).run()}>{label}</button>)}
      <button type="button" className="rounded border px-3 py-2 text-sm" onClick={() => { const caption = window.prompt('Chú thích ảnh:', editor.getAttributes('image')['data-caption'] || ''); if (caption !== null) editor.chain().focus().updateAttributes('image', { 'data-caption': caption }).run(); }}>Chú thích</button>
    </div>}
    {mediaOpen && <MediaPicker editor={editor} onClose={() => setMediaOpen(false)} />}
    {sourceMode ? <textarea aria-label="Mã HTML nội dung" value={source} onChange={(event) => { setSource(event.target.value); onChange?.(event.target.value); }} className="min-h-[260px] w-full resize-y bg-slate-950 p-4 font-mono text-sm text-emerald-100 focus:outline-none" spellCheck={false} /> : <EditorContent editor={editor} />}
    {name && <input type="hidden" name={name} value={sourceMode ? source : editor.getHTML()} />}
  </div>;
}
