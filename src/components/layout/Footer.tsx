import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactBrandIcon } from '@/components/ui/contact-brand-icon';
import { SITE_CONFIG } from '@/lib/constants';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { localizedPath, toTelHref } from '@/lib/site';

type FooterProps = {
  lang: string;
  dict: Dictionary;
};

type FooterLink = readonly [label: string, href: string];

const linkClass = 'transition hover:text-brief-gold';

function FooterLinkColumn({ title, links, lang }: { title: string; links: FooterLink[]; lang: string }) {
  return (
    <div>
      <h3 className="border-b border-brief-gold/30 pb-3 text-sm font-bold text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-brief-warm-gray">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={localizedPath(lang, href)} className={linkClass}>{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ lang }: FooterProps) {
  const english = lang.toLowerCase().startsWith('en');
  const phoneNumbers = SITE_CONFIG.hotlines;
  const email = SITE_CONFIG.email;
  const services: FooterLink[] = [
    [english ? 'Freight transport' : 'Vận chuyển hàng hóa', '/van-chuyen-hang-hoa'],
    [english ? 'Truck rental' : 'Thuê xe tải', '/thue-xe-tai'],
    [english ? 'Transport routes' : 'Các tuyến vận chuyển', '/van-chuyen-hang-hoa'],
    [english ? 'About Phuong Vy' : 'Giới thiệu Phương Vy', '/gioi-thieu'],
  ];
  const support: FooterLink[] = [
    [english ? 'Guides' : 'Cẩm nang', '/blog'],
    [english ? 'Frequently asked questions' : 'Câu hỏi thường gặp', '/faq'],
    [english ? 'Recruitment' : 'Tuyển dụng', '/tuyen-dung'],
    [english ? 'Contact' : 'Liên hệ', '/lien-he'],
  ];
  const policies: FooterLink[] = [
    [english ? 'Privacy policy' : 'Chính sách bảo mật', '/chinh-sach-bao-mat'],
    [english ? 'Payment methods' : 'Phương thức thanh toán', '/phuong-thuc-thanh-toan'],
    [english ? 'Shipping policy' : 'Vận chuyển & giao hàng', '/chinh-sach-van-chuyen-va-giao-hang'],
    [english ? 'Letter from us' : 'Thư ngỏ', '/thu-ngo'],
  ];

  return (
    <footer className="border-t border-brief-gold bg-brief-dark text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto grid max-w-7xl gap-9 px-5 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.2fr_.8fr_.8fr_.8fr_1fr] lg:px-8">
        <div>
          <Link href={localizedPath(lang, '/')} className="inline-flex rounded-lg bg-white p-3">
            <Image src="https://vantaiphuongvy.com/wp-content/uploads/2018/07/logo-van-tai-phuong-vy-2.png" alt="Vận tải Phương Vy" width={220} height={65} className="h-12 w-auto object-contain" />
          </Link>
          <p className="mt-4 max-w-xs leading-6 text-brief-warm-gray">Vận chuyển hàng hóa Bắc Nam, chành xe liên tỉnh và cho thuê xe tải.</p>
          <p className="mt-3 flex max-w-xs gap-2 text-sm leading-6 text-brief-warm-gray"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brief-gold" aria-hidden="true" />{SITE_CONFIG.address}</p>
          <div className="mt-5">
            <Link href={localizedPath(lang, '/lien-he')} className="inline-flex min-h-11 items-center border border-brief-gold px-4 text-sm font-bold text-brief-gold transition hover:bg-brief-gold hover:text-brief-dark">
              {english ? 'Request a quote' : 'Yêu cầu báo giá'}
            </Link>
          </div>
        </div>

        <FooterLinkColumn title={english ? 'Services' : 'Dịch vụ'} links={services} lang={lang} />
        <FooterLinkColumn title={english ? 'Support' : 'Hỗ trợ'} links={support} lang={lang} />
        <FooterLinkColumn title={english ? 'Policies' : 'Chính sách'} links={policies} lang={lang} />

        <div>
          <h3 className="border-b border-brief-gold/30 pb-3 text-sm text-white">{english ? 'Contact' : 'Liên hệ'}</h3>
          <ul className="mt-4 space-y-4 text-brief-warm-gray">
            <li>
              <span className="block text-xs font-semibold uppercase tracking-wide text-brief-warm-gray">Tư vấn · {SITE_CONFIG.businessHours}</span>
              <div className="mt-1 space-y-1.5">
                {phoneNumbers.map((phone) => (
                  <a key={phone} href={toTelHref(phone)} className={`flex gap-2 ${linkClass}`}>
                    <Phone className="h-4 w-4 shrink-0 text-brief-gold" aria-hidden="true" />{phone}
                  </a>
                ))}
              </div>
            </li>
            <li>
              <a href={`mailto:${email}`} className={`flex gap-2 break-all ${linkClass}`}>
                <Mail className="h-4 w-4 shrink-0 text-brief-gold" aria-hidden="true" />{email}
              </a>
            </li>
          </ul>
          <div className="mt-5 flex gap-3">
            <a href={`https://zalo.me/${SITE_CONFIG.zalo}`} target="_blank" rel="noopener noreferrer" aria-label="Zalo" className={`flex items-center gap-1 ${linkClass}`}>
              <ContactBrandIcon brand="zalo" className="h-8 w-8" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-brief-gold/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-5 text-xs text-brief-warm-gray sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Công ty TNHH Dịch vụ Vận tải Phương Vy. {english ? 'All rights reserved.' : 'Mọi quyền được bảo lưu.'}</p>
          <div className="flex items-center gap-3">
            <Link href={localizedPath(lang, '/chinh-sach-bao-mat')} className={linkClass}>
              {english ? 'Privacy policy' : 'Chính sách bảo mật'}
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/sitemap.xml" className={linkClass}>
              Sitemap
            </Link>
          </div>
          <a
            href="#top"
            aria-label={english ? 'Scroll to top' : 'Lên đầu trang'}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brief-red text-white font-bold shadow-md transition hover:bg-brief-red-hover hover:scale-110 active:scale-95"
          >
            ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
