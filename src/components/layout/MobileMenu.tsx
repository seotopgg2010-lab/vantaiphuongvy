'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Phone } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { localizedPath, toTelHref } from '@/lib/site';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { getBriefNavigation } from '@/content/brief-navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  dict: Dictionary;
}

type MenuLink = { label: string; href?: string };

type SubCategory = {
  label: string;
  href?: string;
  items?: MenuLink[];
};

type MenuItem = {
  label: string;
  href?: string;
  items?: SubCategory[];
};

function getLocalizedLabel(label: string, dict: Dictionary) {
  const map: Record<string, string> = {
    'Vận chuyển hàng hóa': dict.mobilemenu.shipping,
    'Thuê xe tải': 'Thuê xe tải',
    'Freight transport': dict.mobilemenu.shipping,
    'Truck rental': 'Truck rental',
    'Tuyến chính': 'Tuyến chính',
    'Key routes': 'Key routes',
    'Khu vực phục vụ': 'Khu vực phục vụ',
    'Service areas': 'Service areas',
    'Giới thiệu': dict.mobilemenu.about,
    'Blog': dict.mobilemenu.blog,
    'Liên hệ': dict.mobilemenu.contact,
  };
  return map[label] || label;
}

function MenuItemComponent({
  item,
  expandedItems,
  toggleExpand,
  level,
  dict,
  lang,
}: {
  item: MenuItem | SubCategory;
  expandedItems: Record<string, boolean>;
  toggleExpand: (label: string) => void;
  level: number;
  dict: Dictionary;
  lang: string;
}) {
  const isExpanded = expandedItems[item.label] || false;
  const hasChildren = item.items && item.items.length > 0;
  const pathname = usePathname();

  const isActive = item.href ? pathname === localizedPath(lang, item.href) : false;
  const isHighlighted = isActive || (hasChildren && isExpanded);

  const paddingLeft = level === 0 ? 'px-0' : level === 1 ? 'pl-4' : 'pl-8';
  const textSize = level === 0 ? 'text-lg font-semibold' : level === 1 ? 'text-base font-medium' : 'text-sm';
  const textColor = isHighlighted ? 'text-brief-red' : (level === 0 ? 'text-brief-ink' : 'text-gray-700');

  const localizedLabel = getLocalizedLabel(item.label, dict);

  return (
    <li className="flex flex-col">
      <div className={`flex items-center justify-between py-2.5 ${paddingLeft}`}>
        {item.href ? (
          <Link
            href={localizedPath(lang, item.href)}
            className={`flex-1 hover:text-brief-red transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brief-red ${textSize} ${textColor}`}
          >
            {localizedLabel}
          </Link>
        ) : (
          <span
            className={`flex-1 cursor-pointer hover:text-brief-red transition-colors ${textSize} ${textColor}`}
            onClick={() => hasChildren && toggleExpand(item.label)}
          >
            {localizedLabel}
          </span>
        )}

        {hasChildren && (
          <button
            onClick={() => toggleExpand(item.label)}
            className="p-1.5 text-gray-400 hover:text-brief-red hover:bg-brief-ivory rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brief-red"
            aria-label={`Toggle ${localizedLabel}`}
            aria-expanded={isExpanded}
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-brief-red' : ''}`}
            />
          </button>
        )}
      </div>

      {hasChildren && (
        <AnimatePresence>
          {isExpanded && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >

                {item.items!.map((subItem, index) => (
                  <MenuItemComponent
                    key={index}
                    item={subItem}
                    expandedItems={expandedItems}
                    toggleExpand={toggleExpand}
                    level={level + 1}
                    dict={dict}
                    lang={lang}
                  />
                ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}

export function MobileMenu({ isOpen, onClose, lang, dict }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  const menuData: MenuItem[] = [...getBriefNavigation(lang), { label: 'Cẩm nang', href: '/blog' }, { label: 'Liên hệ', href: '/lien-he' }];
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key !== 'Tab') return;
      const controls = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, [tabindex="0"]') || [])
        .filter(element => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          />

          <motion.div
            initial={{ x: '-100%' }}
            ref={panelRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label={dict.mobilemenu.menuTitle}
            tabIndex={-1}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-[88%] max-w-sm bg-white z-[60] flex flex-col shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-brief-neutral bg-brief-dark p-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-brief-gold">Vận tải Phương Vy</p>
                <span className="mt-1 block text-lg font-bold text-white">{dict.mobilemenu.menuTitle}</span>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brief-gold"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-4 px-4">
              <ul className="space-y-2">
                {menuData.map((item, index) => (
                  <MenuItemComponent
                    key={`${item.label}-${item.href}-${index}`}
                    item={item}
                    expandedItems={expandedItems}
                    toggleExpand={toggleExpand}
                    level={0}
                    dict={dict}
                    lang={lang}
                  />
                ))}
              </ul>
            </div>

            <div className="space-y-4 border-t border-brief-neutral bg-brief-champagne p-4">
              <Link
                href={toTelHref(SITE_CONFIG.hotline)}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-brief-red/20 bg-white py-3 text-brief-red font-semibold transition-colors hover:bg-brief-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brief-red"
              >
                <Phone className="w-5 h-5" />
                <span>{dict.mobilemenu.hotlineLabel} {SITE_CONFIG.hotline}</span>
              </Link>
              <Link
                href={localizedPath(lang, '/lien-he')}
                className="flex w-full items-center justify-center rounded-md bg-brief-red py-3 font-bold text-white shadow-md transition-colors hover:bg-brief-red-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brief-red"
              >
                {dict.mobilemenu.sendRequest}
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
