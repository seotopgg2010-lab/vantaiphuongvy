'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface ImageGalleryProps {
  images: { src: string; alt: string }[];
  columns?: 2 | 3 | 4;
}

export const ImageGallery = ({ images, columns = 3 }: ImageGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [lightboxOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, goToPrevious, goToNext]);

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className={`grid gap-4 ${gridCols[columns]}`}>
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
            onClick={() => openLightbox(idx)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={32} />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 z-50 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={48} />
          </button>

          <div className="relative w-full max-w-5xl aspect-video md:aspect-auto md:h-[85vh]">
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <button
            onClick={goToNext}
            className="absolute right-4 z-50 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={48} />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};
