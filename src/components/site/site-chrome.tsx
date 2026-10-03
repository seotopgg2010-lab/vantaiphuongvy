import { TopBar } from '@/components/site/top-bar';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { MobileActionBar } from '@/components/site/mobile-action-bar';
import { ClickTracker } from '@/components/site/click-tracker';
import { getSiteNavigation } from '@/lib/navigation';

/** Public website chrome. The internal /admin lives outside this route group. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const nav = getSiteNavigation();
  return (
    <>
      <TopBar />
      <SiteHeader nav={nav} />
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>{children}</main>
      <SiteFooter nav={nav} />
      <MobileActionBar />
      <ClickTracker />
    </>
  );
}
