'use client';

import { useState } from 'react';
import Image from 'next/image';

type GalleryImage = {
  src: string;
  alt: string;
  status: 'reference' | 'temporary';
};

export function BriefProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || images[0];

  if (!activeImage) return null;

  return (
    <section aria-label={`Thư viện ảnh ${productName}`}>
      <div className="relative aspect-[4/3] overflow-hidden border border-brief-gold/70 bg-brief-champagne shadow-sm">
        <Image src={activeImage.src} alt={activeImage.alt} fill priority sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((image, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Xem ${image.alt}`}
              aria-pressed={isActive}
              className={`relative aspect-[4/3] overflow-hidden border-2 transition ${isActive ? 'border-brief-red' : 'border-brief-neutral hover:border-brief-gold'}`}
            >
              <Image src={image.src} alt="" fill sizes="160px" className="object-cover" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
