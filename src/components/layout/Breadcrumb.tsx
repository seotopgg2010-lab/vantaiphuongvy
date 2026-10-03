import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { localizedPath } from '@/lib/site';
import { serializeJsonLd } from '@/lib/rich-text';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  lang?: string;
}

export default function Breadcrumb({ items, lang = 'vi' }: BreadcrumbProps) {
  const isEnglish = lang?.toLowerCase().startsWith('en');
  const hasHomeItem = items.length > 0 && (items[0].label === 'Trang chủ' || items[0].label === 'Home');
  const fullItems = hasHomeItem
    ? items
    : [{ label: isEnglish ? 'Home' : 'Trang chủ', href: localizedPath(lang, '/') }, ...items];

  // Generate JSON-LD Schema
  const schemaList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `${SITE_CONFIG.url}${item.href}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaList) }}
      />
      <nav aria-label="Breadcrumb" className="w-full bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap text-sm text-brand-text">
            {fullItems.map((item, index) => {
              const isLast = index === fullItems.length - 1;

              return (
                <li key={index} className="flex items-center">
                  {isLast ? (
                    <span className="font-semibold text-brand-green" aria-current="page">
                      {item.label}
                    </span>
                  ) : (
                    <>
                      <Link
                        href={item.href || '#'}
                        className="hover:underline hover:text-brand-green transition-colors"
                      >
                        {item.label}
                      </Link>
                      <ChevronRight className="h-4 w-4 mx-1 text-gray-400 shrink-0" aria-hidden="true" />
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
