'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

export interface FileUploadProps {
  id?: string;
  name?: string;
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  supportedFormatsLabel?: string;
  dropLabel?: string;
  selectedFilesLabel?: string;
  removeFileLabel?: string;
  onFilesSelected: (files: File[]) => void;
  error?: string;
  className?: string;
  'aria-describedby'?: string;
}

export const FileUpload = ({
  id,
  name,
  label,
  accept,
  multiple = false,
  maxSize,
  supportedFormatsLabel,
  dropLabel = 'Kéo thả file hoặc bấm để chọn',
  selectedFilesLabel = 'Tệp đã chọn',
  removeFileLabel = 'Xóa tệp',
  onFilesSelected,
  error,
  className = '',
  'aria-describedby': ariaDescribedBy,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((files: File[]) => {
    if (!maxSize) return true;

    const oversizeFile = files.find((file) => file.size > maxSize);
    if (!oversizeFile) return true;

    setLocalError(`File ${oversizeFile.name} vượt quá dung lượng cho phép (${Math.round(maxSize / 1024 / 1024)}MB).`);
    return false;
  }, [maxSize]);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    if (!validateFiles(fileArray)) return;

    const newFiles = multiple ? [...selectedFiles, ...fileArray] : fileArray.slice(0, 1);
    setLocalError(null);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  }, [multiple, onFilesSelected, selectedFiles, validateFiles]);

  const handleDrag = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(event.type === 'dragenter' || event.type === 'dragover');
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    processFiles(event.dataTransfer.files);
  }, [processFiles]);

  const removeFile = (indexToRemove: number) => {
    const newFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);

    // The browser input cannot be reconciled from React state. Clearing it
    // prevents a visually removed file from being included in FormData.
    if (inputRef.current) inputRef.current.value = '';
  };

  const descriptionId = error || localError ? `${id}-error` : ariaDescribedBy;

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      {label && <label htmlFor={id} className="text-sm font-medium text-brief-ink">{label}</label>}

      <div
        className={`relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          error || localError
            ? 'border-red-500 bg-red-50'
            : isDragging
              ? 'border-brief-red bg-brief-ivory'
              : 'border-brief-neutral bg-white hover:border-brief-red hover:bg-brief-ivory focus-within:border-brief-red focus-within:ring-2 focus-within:ring-brief-red/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          accept={accept}
          multiple={multiple}
          onChange={(event) => processFiles(event.target.files)}
          aria-describedby={descriptionId}
          aria-invalid={Boolean(error || localError)}
        />
        <Upload className={`mb-3 h-8 w-8 ${isDragging ? 'text-brief-red' : 'text-brief-soft-ink'}`} aria-hidden="true" />
        <p className="text-sm font-medium text-brief-ink">{dropLabel}</p>
        {supportedFormatsLabel && <p className="mt-1 text-xs text-brief-soft-ink">{supportedFormatsLabel}</p>}
      </div>

      {(error || localError) && <p id={`${id}-error`} className="text-sm text-red-600" role="alert">{error || localError}</p>}

      {selectedFiles.length > 0 && (
        <ul className="flex flex-col gap-2" aria-label={selectedFilesLabel}>
          {selectedFiles.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center justify-between rounded border border-brief-neutral bg-white p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-brief-ink">{file.name}</p>
                <p className="text-xs text-brief-soft-ink">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                aria-label={`${removeFileLabel} ${file.name}`}
                className="ml-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-brief-soft-ink transition hover:bg-red-50 hover:text-brief-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brief-red active:scale-95"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
