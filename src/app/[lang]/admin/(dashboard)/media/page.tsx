'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import { Upload, Trash2, Copy, Check, ImageIcon, Loader2 } from 'lucide-react';
import { getErrorMessage } from '@/lib/errors';
import { MEDIA_ACCEPT, validateMediaFile } from '@/lib/media-validation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

interface MediaFile {
  id?: string | null;
  name: string;
  created_at: string | null;
  type: 'image' | 'video';
  size?: number;
  mimeType?: string;
  publicUrl: string;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    if (!supabaseUrl || !supabaseKey) {
      setError('Thiếu cấu hình Supabase. Vui lòng kiểm tra các biến môi trường.');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const allFiles = [];
      for (const folder of ['', 'editor']) {
        for (let offset = 0; ; offset += 100) {
          const { data, error } = await supabase.storage.from('media').list(folder, { limit: 100, offset });
          if (error) throw error;
          allFiles.push(...(data || []).filter((file) => file.id).map((file) => ({ ...file, name: folder ? `${folder}/${file.name}` : file.name })));
          if (!data || data.length < 100) break;
        }
      }
      const validFiles = allFiles;
      const filesWithUrls = validFiles.map(file => {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(file.name);
        const mimeType = file.metadata?.mimetype || '';
        return { ...file, publicUrl, type: mimeType.startsWith('video/') ? 'video' as const : 'image' as const, mimeType, size: file.metadata?.size };
      });
      
      // Sắp xếp mới nhất lên đầu (dựa vào created_at nếu có)
      filesWithUrls.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
      
      setFiles(filesWithUrls);
    } catch (err: unknown) {
      console.error('Error fetching media files:', err);
      setError('Không thể tải danh sách media. ' + getErrorMessage(err, ''));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchFiles(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchFiles]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setUploading(true);
    setError(null);
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        const validationError = validateMediaFile(file);
        if (validationError) throw new Error(validationError);
        const fileExt = file.type.split('/')[1].replace('jpeg', 'jpg');
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, file);
          
        if (uploadError) {
          throw uploadError;
        }
      }
      
      // Refresh list after upload
      await fetchFiles();
    } catch (err: unknown) {
      console.error('Error uploading file:', err);
      setError('Lỗi khi tải lên file: ' + getErrorMessage(err, ''));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (uploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploading(true);
      setError(null);
      
      try {
        const droppedFiles = Array.from(e.dataTransfer.files);
        
        for (const file of droppedFiles) {
          const validationError = validateMediaFile(file);
          if (validationError) throw new Error(validationError);
          const fileExt = file.type.split('/')[1].replace('jpeg', 'jpg');
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(fileName, file);
            
          if (uploadError) throw uploadError;
        }
        
        await fetchFiles();
      } catch (err: unknown) {
        setError('Lỗi khi tải lên file kéo thả: ' + getErrorMessage(err, ''));
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa file này không?')) return;
    
    try {
      const { error } = await supabase.storage.from('media').remove([fileName]);
      if (error) throw error;
      
      setFiles((current) => current.filter(f => f.name !== fileName));
    } catch (err: unknown) {
      console.error('Error deleting file:', err);
      setError('Lỗi khi xóa file: ' + getErrorMessage(err, ''));
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch { setError('Không thể sao chép URL. Vui lòng cho phép truy cập clipboard.'); }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-100px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1F2522]">Thư viện Media</h1>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      {/* Upload Dropzone */}
      <div 
        className="mb-8 border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Tải ảnh hoặc video lên"
        aria-disabled={uploading}
        onKeyDown={(event) => { if (!uploading && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); fileInputRef.current?.click(); } }}
        onClick={() => { if (!uploading) fileInputRef.current?.click(); }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept={MEDIA_ACCEPT}
          onChange={handleUpload}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-[#2B7935] mb-4" />
            <p className="text-lg font-medium">Đang tải lên...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Upload className="w-12 h-12 mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-1">Kéo thả ảnh hoặc video vào đây</p>
            <p className="text-sm text-gray-400">hoặc click để chọn file (tối đa 50MB)</p>
          </div>
        )}
      </div>
      
      {/* Image Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#2B7935]" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-20 text-gray-400 border border-gray-100 rounded-xl bg-gray-50">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Chưa có hình ảnh nào trong thư viện</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((file) => (
            <div key={file.id || file.name} className="group border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-gray-100">
                {file.type === 'video' ? <video src={file.publicUrl} controls preload="metadata" className="h-full w-full object-cover" /> : <Image
                  src={file.publicUrl} 
                  alt={file.name} 
                  fill 
                  className="object-cover"
                />}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-gray-600 truncate mb-3" title={file.name}>
                  {file.name}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCopyUrl(file.publicUrl)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors"
                  >
                    {copied === file.publicUrl ? (
                      <><Check className="w-3.5 h-3.5 text-green-600" /> <span className="text-green-600">Đã copy</span></>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy URL</>
                    )}
                  </button>
                  <button 
                    onClick={() => handleDelete(file.name)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
                    title="Xóa ảnh"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
