import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { localizedPath } from '@/lib/site';

export function ShippingSection({ lang, dict }: { lang: string; dict: Dictionary }) {
  return (
    <section className="py-20 bg-[#1e5826] text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <div className="eyebrow inline-block px-4 py-1.5 rounded-full bg-white/10 text-[#F1D478] uppercase tracking-wider mb-3">
            {dict.shipping.sectionLabel}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{dict.shipping.sectionTitle}</h2>
          <div className="h-1 w-20 bg-[#DDBB56] mx-auto mb-4 rounded-full" />
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            {dict.shipping.sectionDesc}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* USA - Featured Big Card */}
          <Link 
            href={localizedPath(lang, '/van-chuyen-quoc-te/gui-hang-di-my')}
            className="md:col-span-3 lg:col-span-1 group block relative bg-[#2B2B2B] rounded-2xl p-8 hover:bg-[#202020] transition-all duration-300 border border-[#DDBB56]/30 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-5xl">🇺🇸</span>
              <span className="text-xs font-bold uppercase tracking-wider bg-[#CB120F] text-white px-3 py-1 rounded-full shadow">
                Tuyến chính
              </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-3 text-[#F1D478]">Gửi hàng đi Mỹ (USA)</h3>
            
            <p className="text-sm text-white/90 mb-6 leading-relaxed">
              Vận chuyển đường biển (LCL / FCL) &amp; Đường hàng không hỏa tốc. Bao thuế nhập khẩu 100%, giao tận cửa (Door-to-door) toàn bộ 50 bang.
            </p>

            <ul className="space-y-2 text-xs text-white/80 mb-8 border-t border-white/10 pt-4">
              <li className="flex items-center gap-2">✓ Chuyên bảng hiệu, bàn ghế tiệm nail</li>
              <li className="flex items-center gap-2">✓ Đóng kiện gỗ tiêu chuẩn ISPM 15</li>
              <li className="flex items-center gap-2">✓ Bảo hiểm hàng hóa đầy đủ</li>
            </ul>

            <div className="text-[#F1D478] text-xs font-bold uppercase tracking-wider flex items-center group-hover:translate-x-2 transition-transform">
              <span>{dict.shipping.viewShipping}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>
          
          <div className="md:col-span-3 lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Canada */}
            <Link 
              href={localizedPath(lang, '/van-chuyen-quoc-te/gui-hang-di-canada')}
              className="group block bg-white/5 rounded-2xl p-6 hover:bg-[#2B2B2B] transition-all duration-300 border border-white/10 hover:border-[#DDBB56] hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-4">🇨🇦</div>
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[#F1D478] transition-colors">
                  Gửi hàng đi Canada
                </h3>
                <p className="text-xs text-white/70 mb-4 leading-relaxed">
                  Phục vụ các bang Ontario, British Columbia, Alberta. Hỗ trợ thông quan và giao hàng trọn gói.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#F1D478] uppercase tracking-wider flex items-center group-hover:translate-x-1 transition-transform">
                Chi tiết →
              </span>
            </Link>
            
            {/* Europe */}
            <Link 
              href={localizedPath(lang, '/van-chuyen-quoc-te/gui-hang-di-chau-au')}
              className="group block bg-white/5 rounded-2xl p-6 hover:bg-[#2B2B2B] transition-all duration-300 border border-white/10 hover:border-[#DDBB56] hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-4">🇪🇺</div>
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[#F1D478] transition-colors">
                  Gửi hàng đi Châu Âu
                </h3>
                <p className="text-xs text-white/70 mb-4 leading-relaxed">
                  Trọng tâm Đức &amp; Pháp. Có văn phòng và đầu mối tiếp nhận trực tiếp tại Hamburg, Đức.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#F1D478] uppercase tracking-wider flex items-center group-hover:translate-x-1 transition-transform">
                Chi tiết →
              </span>
            </Link>
            
            {/* Australia */}
            <Link 
              href={localizedPath(lang, '/van-chuyen-quoc-te/gui-hang-di-uc')}
              className="group block bg-white/5 rounded-2xl p-6 hover:bg-[#2B2B2B] transition-all duration-300 border border-white/10 hover:border-[#DDBB56] hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-4">🇦🇺</div>
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[#F1D478] transition-colors">
                  Gửi hàng đi Úc
                </h3>
                <p className="text-xs text-white/70 mb-4 leading-relaxed">
                  Tuyến Sydney, Melbourne, Brisbane. Đóng gói bảo vệ tối đa, thủ tục hải quan nhanh gọn.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#F1D478] uppercase tracking-wider flex items-center group-hover:translate-x-1 transition-transform">
                Chi tiết →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
