import React from 'react';
import { cn } from '../../../utils/cn';

interface ColumnMappingDropdownProps {
  label: string;
  headers: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  required?: boolean;
}

export function ColumnMappingDropdown({
  label,
  headers,
  value,
  onChange,
  required = false
}: ColumnMappingDropdownProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className={cn(
          "mt-1 block w-full rounded-md shadow-sm sm:text-sm",
          "border-gray-300 dark:border-gray-600",
          "focus:ring-primary-500 focus:border-primary-500",
          "dark:bg-gray-700 dark:text-white"
        )}
      >
        <option value="">Select Column</option>
        {headers.map((header) => (
          <option key={header} value={header}>
            {header}
          </option>
        ))}
      </select>
    </div>
  );
}
