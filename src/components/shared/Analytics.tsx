import Script from 'next/script';
import { TRACKING } from '@/lib/constants';
import { getSiteUrl } from '@/lib/site';

/** Only the public domain measures: local builds, previews and the vercel.app demo send nothing. */
const SITE_HOSTNAME = new URL(getSiteUrl()).hostname;

/**
 * GA4 and the Google Ads tag with the IDs the WordPress site used. Like WordPress, every visitor on
 * the public domain is measured, with no consent banner (owner decision, 2026-10-06).
 */
export function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || TRACKING.ga4;
  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <Script id="google-tag" strategy="afterInteractive">
      {`
        if (location.hostname === '${SITE_HOSTNAME}') {
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){dataLayer.push(arguments);};
          gtag('js', new Date());
          gtag('config', '${measurementId}', { page_path: location.pathname });
          gtag('config', '${TRACKING.googleAds}');
          var tag = document.createElement('script');
          tag.async = true;
          tag.src = 'https://www.googletagmanager.com/gtag/js?id=${measurementId}';
          document.head.appendChild(tag);
        }
      `}
    </Script>
  );
}
