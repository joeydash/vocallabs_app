import React from 'react';
import { cn } from '../../../utils/cn';

interface FilterActionsProps {
  onClear: () => void;
  onCancel: () => void;
  onApply: () => void;
  loading?: boolean;
}

export function FilterActions({ onClear, onCancel, onApply, loading }: FilterActionsProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-between pt-6 border-t dark:border-gray-700 gap-3">
      <button
        type="button"
        onClick={onClear}
        className={cn(
          "w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md",
          "text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300",
          "border border-gray-300 dark:border-gray-600",
          "hover:bg-gray-50 dark:hover:bg-gray-600",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        )}
      >
        Clear All
      </button>
      <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className={cn(
            "w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md",
            "text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300",
            "border border-gray-300 dark:border-gray-600",
            "hover:bg-gray-50 dark:hover:bg-gray-600",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          )}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onApply}
          disabled={loading}
          className={cn(
            "w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md",
            "text-white bg-primary-600",
            "hover:bg-primary-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
