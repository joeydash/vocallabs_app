import React from 'react';
import { cn } from '../../../utils/cn';

interface QueueStatusBadgeProps {
  status: string;
}

export function QueueStatusBadge({ status }: QueueStatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
      case 'completed':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          text: 'text-green-700 dark:text-green-400',
          dot: 'bg-green-500',
          border: 'border-green-200 dark:border-green-800'
        };
      case 'pending':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          text: 'text-amber-700 dark:text-amber-400',
          dot: 'bg-amber-500',
          border: 'border-amber-200 dark:border-amber-800'
        };
      case 'ongoing':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          text: 'text-blue-700 dark:text-blue-400',
          dot: 'bg-blue-500',
          border: 'border-blue-200 dark:border-blue-800'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          text: 'text-gray-700 dark:text-gray-400',
          dot: 'bg-gray-500',
          border: 'border-gray-200 dark:border-gray-800'
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
      styles.bg,
      styles.text,
      styles.border
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", styles.dot)} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
