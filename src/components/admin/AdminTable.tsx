import React, { ReactNode } from 'react';
import Link from 'next/link';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => string;
  onDelete?: (item: T) => void;
  keyField?: keyof T;
  loading?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function AdminTable<T>({
  columns,
  data,
  onEdit,
  onDelete,
  keyField,
  loading = false,
  isLoading = false,
  emptyMessage = 'Không có dữ liệu',
}: AdminTableProps<T>) {
  const tableLoading = loading || isLoading;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3 font-medium">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 font-medium text-right">Hành động</th>
              )}
            </tr>
          </thead>
          <tbody>
            {tableLoading ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, idx) => {
                const key = keyField ? (item[keyField] as unknown as string) : idx;
                return (
                  <tr key={key} className="border-b border-gray-100 hover:bg-gray-50/50">
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="px-6 py-4">
                        {typeof col.accessor === 'function'
                          ? col.accessor(item)
                          : (item[col.accessor] as ReactNode)}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4 text-right space-x-3">
                        {onEdit && (
                          <Link
                            href={onEdit(item)}
                            className="font-medium text-[#2B7935] hover:underline"
                          >
                            Sửa
                          </Link>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="font-medium text-[#CB120F] hover:underline"
                          >
                            Xóa
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
