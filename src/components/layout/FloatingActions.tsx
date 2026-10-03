'use client';

import { useState, useEffect } from 'react';
import { Phone, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_CONFIG } from '@/lib/constants';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { toTelHref } from '@/lib/site';
import { ContactBrandIcon } from '@/components/ui/contact-brand-icon';

export function FloatingActions({ dict }: { dict: Dictionary; settings?: Record<string, string> }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
      <div className="contact-actions fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 gap-2 border-t border-brief-neutral bg-white/95 p-3 shadow-[0_-6px_24px_rgba(13,43,62,.12)] backdrop-blur-md lg:inset-x-auto lg:bottom-6 lg:right-6 lg:flex lg:flex-col lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
      <a
        href={`https://zalo.me/${SITE_CONFIG.zalo}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.floating.chatZalo}
        className="group relative flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#0068FF] text-sm font-bold text-white shadow-lg transition duration-150 hover:bg-[#0057D6] active:scale-[0.97] lg:h-12 lg:w-12 lg:gap-0"
      >
        <span className="lg:hidden">Zalo</span>

        <ContactBrandIcon brand="zalo" className="h-7 w-7 lg:h-8 lg:w-8" />
        <span className="absolute right-full mr-3 hidden rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-200 pointer-events-none group-hover:opacity-100 lg:block">
          {dict.floating.zaloTooltip}
        </span>
      </a>

      <a href={toTelHref(SITE_CONFIG.hotline)} aria-label={dict.floating.callHotline} className="group relative flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#1175BC] text-sm font-bold text-white shadow-lg transition duration-150 hover:bg-[#0B5D96] active:scale-[0.97] lg:h-12 lg:w-12 lg:gap-0">
        <Phone className="h-5 w-5" aria-hidden="true" />
        <span className="lg:hidden">Gọi ngay</span>
        <span className="absolute right-full mr-3 hidden rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-200 pointer-events-none group-hover:opacity-100 lg:block">
          {dict.floating.hotlineTooltip}
        </span>
      </a>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            aria-label={dict.floating.scrollTop}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-brief-red bg-white text-brief-red shadow-md transition-all duration-150 hover:bg-brief-red hover:text-white hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brief-red active:scale-[0.97]"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
