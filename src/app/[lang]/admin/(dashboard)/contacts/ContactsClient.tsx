'use client';

import { useState, useTransition } from 'react';
import { AdminTable, type Column } from '@/components/admin/AdminTable';
import type { ContactSubmission } from '@/types/database';
import { deleteAdminContact, updateAdminContactReadState } from './actions';

type ContactsClientProps = {
  initialItems: ContactSubmission[];
  attachmentLinks: Record<string, string>;
};

export function ContactsClient({ initialItems, attachmentLinks }: ContactsClientProps) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const toggleRead = (item: ContactSubmission) => {
    setError('');
    startTransition(async () => {
      const result = await updateAdminContactReadState(item.id, !item.is_read);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setItems((currentItems) => currentItems.map((currentItem) => (
        currentItem.id === item.id ? { ...currentItem, is_read: !item.is_read } : currentItem
      )));
    });
  };

  const deleteContact = (item: ContactSubmission) => {
    if (!window.confirm(`Xóa liên hệ từ "${item.name}"?`)) return;

    setError('');
    startTransition(async () => {
      const result = await deleteAdminContact(item.id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setItems((currentItems) => currentItems.filter((currentItem) => currentItem.id !== item.id));
    });
  };

  const columns: Column<ContactSubmission>[] = [
    { header: 'Tên', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Số điện thoại', accessor: 'phone' },
    { header: 'Loại hình', accessor: 'business_type' },
    { header: 'Nhu cầu', accessor: 'needs' },
    { header: 'Mã yêu cầu', accessor: 'reference_code' },
    {
      header: 'Tệp đính kèm',
      accessor: (item) => item.attachment_urls?.length ? (
        <div className="flex flex-col gap-1">
          {item.attachment_urls.map((path) => attachmentLinks[path] ? (
            <a key={path} href={attachmentLinks[path]} target="_blank" rel="noopener noreferrer" className="max-w-40 truncate text-brief-red underline" title={path}>
              Xem tệp
            </a>
          ) : <span key={path} className="text-xs text-brief-soft-ink">Không có liên kết</span>)}
        </div>
      ) : '-',
    },
    {
      header: 'Trạng thái',
      accessor: (item) => (
        <button
          type="button"
          disabled={isPending}
          onClick={() => toggleRead(item)}
          className={`rounded-full px-2 py-1 text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brief-red disabled:cursor-not-allowed disabled:opacity-50 ${item.is_read ? 'bg-stone-100 text-stone-800' : 'bg-brief-champagne text-brief-ink'}`}
        >
          {item.is_read ? 'Đã đọc' : 'Chưa đọc'}
        </button>
      ),
    },
    { header: 'Ngày gửi', accessor: (item) => new Date(item.created_at).toLocaleDateString('vi-VN') },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brief-ink">Yêu cầu liên hệ</h1>
      {error && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      <AdminTable
        columns={columns}
        data={items}
        onDelete={deleteContact}
        keyField="id"
      />
    </div>
  );
}
