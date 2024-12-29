import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatusTagProps {
  status: string;
  selected?: boolean;
  onClick?: () => void;
}

export function StatusTag({ status, selected, onClick }: StatusTagProps) {
  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-700';

    switch (status.toLowerCase()) {
      case 'completed':
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'pending':
      case 'in-progress':
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'paused':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  const displayStatus = status || 'Unknown';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium",
        "border-2 transition-all duration-200",
        getStatusColor(displayStatus),
        selected && "ring-2 ring-primary-500 dark:ring-primary-400",
        "hover:opacity-80"
      )}
    >
      <span>{displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}</span>
      {selected && <Check className="w-4 h-4 ml-1" />}
    </button>
  );
}
