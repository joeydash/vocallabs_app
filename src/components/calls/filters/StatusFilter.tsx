import React from 'react';
import { RotateCw } from 'lucide-react';
import { StatusTag } from '../../shared/StatusTag';

interface StatusFilterProps {
  selectedStatuses: string[];
  availableStatuses: Array<{ call_status: string }>;
  onChange: (statuses: string[]) => void;
}

export function StatusFilter({ selectedStatuses, availableStatuses, onChange }: StatusFilterProps) {
  const toggleStatus = (status: string) => {
    const isSelected = selectedStatuses.includes(status);
    const newStatuses = isSelected
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    onChange(newStatuses);
  };

  // Get unique statuses to avoid duplicates
  const uniqueStatuses = Array.from(new Set(availableStatuses.map(s => s.call_status)));

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <RotateCw className="w-5 h-5 text-gray-400" />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Call Status
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        {uniqueStatuses.map((status) => (
          <StatusTag
            key={status} // Using status as key since it's unique
            status={status}
            selected={selectedStatuses.includes(status)}
            onClick={() => toggleStatus(status)}
          />
        ))}
      </div>
    </div>
  );
}
