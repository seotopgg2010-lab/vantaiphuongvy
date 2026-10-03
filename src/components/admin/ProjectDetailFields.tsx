'use client';

import { RichTextEditor } from './RichTextEditor';
import type { Project } from '@/types/database';

export function ProjectDetailFields({ project }: { project?: Project }) {
  return <fieldset className="space-y-5 rounded-lg border p-4"><legend className="px-2 font-semibold">Hồ sơ thực hiện & hình ảnh</legend>
    <p className="text-sm text-gray-600">Chỉ được lập chỉ mục khi có đủ các phần hồ sơ và tối thiểu 8 ảnh khác nhau. Không dùng ảnh minh họa làm bằng chứng dự án.</p>
    {([['production_process', 'Quy trình sản xuất'], ['packaging_details', 'Đóng gói'], ['shipping_details', 'Vận chuyển'], ['result', 'Kết quả']] as const).map(([name, label]) => <div key={name}><h3 className="mb-2 text-sm font-medium">{label}</h3><RichTextEditor name={name} defaultValue={project?.[name] || ''} placeholder={label} /></div>)}
    <label className="block text-sm font-medium">Ảnh dự án — mỗi dòng một URL<textarea name="images" defaultValue={project?.images?.join('\n') || ''} rows={8} className="mt-2 w-full rounded-lg border p-3" placeholder="/images/project/photo-1.webp" /><span className="mt-1 block text-xs font-normal text-gray-500">Sao chép URL từ Thư viện Media. Chấp nhận đường dẫn nội bộ hoặc URL HTTPS; tối đa 50 ảnh.</span></label>
  </fieldset>;
}
