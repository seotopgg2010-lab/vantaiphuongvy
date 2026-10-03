'use client';

import { useEffect } from 'react';
import { hasAnalyticsConsent } from './Analytics';

const LEAD_EVENT_STORAGE_KEY = 'hamburg-contact-lead-event';

export function ContactLeadConversion() {
  useEffect(() => {
    if (!hasAnalyticsConsent()) return;

    try {
      if (window.sessionStorage.getItem(LEAD_EVENT_STORAGE_KEY) !== 'confirmed') return;
      window.sessionStorage.removeItem(LEAD_EVENT_STORAGE_KEY);
      window.gtag?.('event', 'generate_lead', {
        event_category: 'Contact',
        event_label: 'Contact Form Submission',
      });
    } catch {
      // Analytics is optional; a storage failure must not affect confirmation UI.
    }
  }, []);

  return null;
}
