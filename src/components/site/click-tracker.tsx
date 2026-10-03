'use client';

import { useEffect } from 'react';

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

/**
 * Global delegated listener: any element with `data-track="event_name"` sends a
 * GA4 event (only when GA is loaded, i.e. after analytics consent).
 */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
      if (!target || typeof window.gtag !== 'function') return;
      window.gtag('event', target.dataset.track, {
        page_path: window.location.pathname,
        link_url: target.getAttribute('href') ?? undefined,
      });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
