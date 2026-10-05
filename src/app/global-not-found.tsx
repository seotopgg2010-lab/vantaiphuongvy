import type { Metadata } from 'next';
import './globals.css';
import { RootDocument, siteViewport } from '@/components/site/root-document';
import NotFound from './[lang]/not-found';

export const metadata: Metadata = {
  title: { absolute: 'Không tìm thấy trang | Vận Tải Phương Vy' },
  description: 'Trang bạn tìm không tồn tại hoặc đã được đổi địa chỉ. Xem dịch vụ vận chuyển hàng hóa, thuê xe tải hoặc gọi hotline Vận Tải Phương Vy.',
};

export const viewport = siteViewport;

/**
 * Unmatched URLs (unknown slugs, "/en*", stray files such as "/ads.txt") never reach the
 * [lang] root layout, so this page renders the full document around the shared 404 UI.
 */
export default function GlobalNotFound() {
  return (
    <RootDocument>
      <NotFound />
    </RootDocument>
  );
}
