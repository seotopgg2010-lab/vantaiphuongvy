'use client';

import { useCallback, useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { deleteNavItem } from './actions';
import { NavigationItem } from '@/types/database';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NavigationItemsPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const lang = params.lang;

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      alert('Error fetching navigation items');
    } else {
      setItems(data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchItems(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchItems]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const result = await deleteNavItem(id);
    if (result.success) {
      alert('Item deleted successfully');
      fetchItems();
    } else {
      alert('Error deleting item: ' + result.error);
    }
  };

  const columns = [
    { header: 'Label', accessor: 'label' as keyof NavigationItem },
    { header: 'URL', accessor: 'url' as keyof NavigationItem },
    { 
      header: 'Parent', 
      accessor: (item: NavigationItem) => {
        if (!item.parent_id) return '-';
        const parent = items.find(i => i.id === item.parent_id);
        return parent ? parent.label : item.parent_id;
      }
    },
    { header: 'Sort Order', accessor: 'sort_order' as keyof NavigationItem },
    { 
      header: 'Active', 
      accessor: (item: NavigationItem) => <StatusBadge isActive={item.is_active} />
    },
    {
      header: 'Actions',
      accessor: (item: NavigationItem) => (
        <div className="flex gap-2">
          <Link
            href={`/${lang}/admin/navigation/${item.id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(item.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Navigation Items</h1>
        <Link
          href={`/${lang}/admin/navigation/new`}
          className="bg-[#2B7935] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Add New Item
        </Link>
      </div>

      <AdminTable
        columns={columns}
        data={items}
        isLoading={isLoading}
      />
    </div>
  );
}
