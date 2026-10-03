'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { deleteFaq } from './actions';
import { useParams } from 'next/navigation';
import { Pencil, Trash2, Plus } from 'lucide-react';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Faq {
  id: string;
  question: string;
  category: string;
  sort_order: number;
  is_active: boolean;
}

export default function FaqsPage() {
  const params = useParams();
  const lang = params.lang as string;
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('id, question, category, sort_order, is_active')
      .order('sort_order', { ascending: true });

    if (error) {
      alert('Error fetching FAQs: ' + error.message);
    } else {
      setFaqs(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchFaqs(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchFaqs]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    
    const result = await deleteFaq(id);
    if (result.success) {
      alert('FAQ deleted successfully');
      fetchFaqs();
    } else {
      alert('Error deleting FAQ: ' + result.error);
    }
  };

  const columns = [
    {
      header: 'Question',
      accessor: (faq: Faq) => (
        <div className="font-medium text-gray-900 truncate max-w-xs" title={faq.question}>
          {faq.question}
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (faq: Faq) => faq.category || '-',
    },
    {
      header: 'Sort Order',
      accessor: (faq: Faq) => faq.sort_order,
    },
    {
      header: 'Status',
      accessor: (faq: Faq) => <StatusBadge isActive={faq.is_active} />,
    },
    {
      header: 'Actions',
      accessor: (faq: Faq) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/${lang}/admin/faqs/${faq.id}`}
            className="text-gray-500 hover:text-[#2B7935] transition-colors"
          >
            <Pencil className="w-5 h-5" />
          </Link>
          <button
            onClick={() => handleDelete(faq.id)}
            className="text-gray-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-gray-500 mt-1">Manage frequently asked questions</p>
        </div>
        <Link
          href={`/${lang}/admin/faqs/new`}
          className="flex items-center gap-2 px-4 py-2 bg-[#2B7935] text-white rounded-lg hover:bg-[#22602a] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add FAQ
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <AdminTable
          columns={columns}
          data={faqs}
          loading={loading}
          emptyMessage="No FAQs found"
        />
      </div>
    </div>
  );
}
