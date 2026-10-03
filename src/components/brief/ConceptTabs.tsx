'use client';

import { useId, useRef, useState } from 'react';
import Image from 'next/image';

type ConceptTab = {
  code: string;
  title: string;
  description: string;
  images: Array<{ src: string; alt: string; status: 'reference' | 'temporary' }>;
};

export function ConceptTabs({ tabs }: { tabs: ConceptTab[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabListId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectTab = (index: number, shouldFocus = false) => {
    setActiveIndex(index);
    if (shouldFocus) tabRefs.current[index]?.focus();
  };
  const activeTab = tabs[activeIndex];

  if (!activeTab) return null;

  return (
    <section aria-labelledby={`${tabListId}-title`}>
      <div className="flex flex-col gap-5 border-b border-brief-neutral pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="brief-eyebrow">Phong cách</p>
          <h2 id={`${tabListId}-title`} className="brief-display-heading mt-2 text-3xl text-brief-ink">Chọn phong cách phù hợp</h2>
        </div>
        <div role="tablist" aria-label="Phong cách nhà hàng Nhật Bản" className="flex flex-wrap gap-2">
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={tab.code}
                id={`${tabListId}-${tab.code}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tabListId}-${tab.code}-panel`}
                tabIndex={isActive ? 0 : -1}
                ref={(element) => { tabRefs.current[index] = element; }}
                onKeyDown={(event) => {
                  const lastIndex = tabs.length - 1;
                  const nextIndex = event.key === 'ArrowRight'
                    ? (index === lastIndex ? 0 : index + 1)
                    : event.key === 'ArrowLeft'
                      ? (index === 0 ? lastIndex : index - 1)
                      : event.key === 'Home'
                        ? 0
                        : event.key === 'End'
                          ? lastIndex
                          : null;
                  if (nextIndex === null) return;
                  event.preventDefault();
                  selectTab(nextIndex, true);
                }}
                onClick={() => selectTab(index)}
                className={isActive ? 'brief-tab-active' : 'brief-tab'}
              >
                {tab.title} <span className="opacity-70">{tab.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div id={`${tabListId}-${activeTab.code}-panel`} role="tabpanel" aria-labelledby={`${tabListId}-${activeTab.code}`} className="mt-7 grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
        <p className="text-[0.95rem] leading-7 text-brief-soft-ink">{activeTab.description}</p>
        <div className="grid grid-cols-2 gap-3">
          {activeTab.images.map((image) => (
            <figure key={image.src} className="relative aspect-[4/3] overflow-hidden border border-brief-gold/60 bg-brief-champagne">
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 1023px) 50vw, 28vw" className="object-cover" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
