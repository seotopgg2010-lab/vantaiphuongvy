'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { BlogCategory } from '@/types/database';

export function BlogCategorySelect({ defaultValue = '' }: { defaultValue?: string }) {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data, error } = await createClient().from('blog_categories').select('*').order('sort_order');
        if (error) throw error;
        if (active) setCategories(data || []);
      } catch {
        if (active) setError('Không tải được danh mục bài viết. Vui lòng tải lại trang để chọn danh mục.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  return (
    <div>
      <select name="category_id" aria-label="Danh mục bài viết" value={value} onChange={e => setValue(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg">
        <option value="">Không có danh mục</option>
        {value && !categories.some(category => category.id === value) && <option value={value}>Danh mục hiện tại</option>}
        {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      {loading && <p role="status">Đang tải danh mục...</p>}
      {error && <p role="alert" className="text-red-700">{error}</p>}
    </div>
  );
}
