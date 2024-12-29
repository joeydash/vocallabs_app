import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface DateRangeFilterProps {
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
  onClear: () => void;
}

export function DateRangeFilter({ from, to, onChange, onClear }: DateRangeFilterProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date Range
          </label>
        </div>
        {(from || to) && (
          <button
            onClick={onClear}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Clear dates
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="from" className="sr-only">From</label>
          <input
            type="date"
            id="from"
            value={from}
            onChange={(e) => onChange({ from: e.target.value, to })}
            className={cn(
              "block w-full rounded-md sm:text-sm",
              "border-gray-300 dark:border-gray-600",
              "focus:ring-primary-500 focus:border-primary-500",
              "dark:bg-gray-700 dark:text-white"
            )}
          />
        </div>
        <div>
          <label htmlFor="to" className="sr-only">To</label>
          <input
            type="date"
            id="to"
            value={to}
            onChange={(e) => onChange({ from, to: e.target.value })}
            className={cn(
              "block w-full rounded-md sm:text-sm",
              "border-gray-300 dark:border-gray-600",
              "focus:ring-primary-500 focus:border-primary-500",
              "dark:bg-gray-700 dark:text-white"
            )}
          />
        </div>
      </div>
    </div>
  );
}
