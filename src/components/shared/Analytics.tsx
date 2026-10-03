'use client';

import { useState, useSyncExternalStore } from 'react';
import Script from 'next/script';

const CONSENT_STORAGE_KEY = 'phuongvy-analytics-consent';

type AnalyticsConsent = 'accepted' | 'declined' | null;

function getStoredConsent(): AnalyticsConsent {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'accepted' || value === 'declined' ? value : null;
  } catch {
    return null;
  }
}

function subscribeToConsent(onStoreChange: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) onStoreChange();
  };

  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}

export function hasAnalyticsConsent(): boolean {
  return typeof window !== 'undefined' && getStoredConsent() === 'accepted';
}

export function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const storedConsent = useSyncExternalStore(subscribeToConsent, getStoredConsent, () => null);
  const [chosenConsent, setChosenConsent] = useState<AnalyticsConsent | undefined>(undefined);
  const consent = chosenConsent ?? storedConsent;

  if (!measurementId || process.env.NODE_ENV !== 'production') return null;

  const chooseConsent = (value: Exclude<AnalyticsConsent, null>) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch {
      // Persisting optional analytics consent must not affect the page.
    }
    setChosenConsent(value);
  };

  if (consent === null) {
    return (
      <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-xl border border-brief-neutral bg-white p-4 shadow-xl" aria-label="Tùy chọn cookie">
        <p className="text-sm leading-6 text-brief-soft-ink">Vận tải Phương Vy chỉ dùng cookie phân tích khi bạn đồng ý. Cookie cần thiết vẫn hoạt động để bảo mật và vận hành biểu mẫu.</p>
        <div className="mt-3 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={() => chooseConsent('declined')} className="brief-button-secondary text-sm">
            Từ chối
          </button>
          <button type="button" onClick={() => chooseConsent('accepted')} className="brief-button-primary text-sm">
            Đồng ý phân tích
          </button>
        </div>
      </aside>
    );
  }

  if (consent !== 'accepted') return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  );
}
