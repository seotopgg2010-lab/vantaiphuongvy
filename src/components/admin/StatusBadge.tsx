import React from 'react';

interface StatusBadgeProps {
  active?: boolean;
  isActive?: boolean;
  status?: string | null;
  activeText?: string;
  inactiveText?: string;
}

export function StatusBadge({
  active,
  isActive,
  status,
  activeText = 'Hoạt động',
  inactiveText = 'Ẩn',
}: StatusBadgeProps) {
  const isCurrentlyActive = active ?? isActive ?? (status === 'published' || status === 'active');

  if (isCurrentlyActive) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {activeText}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {inactiveText}
    </span>
  );
}
