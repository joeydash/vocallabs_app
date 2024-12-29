import React from 'react';
import { cn } from '../../../utils/cn';

interface CallStatusBadgeProps {
  status: string;
  className?: string;
}

export function CallStatusBadge({ status, className }: CallStatusBadgeProps) {
  const statusColors = {
    done: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  };

  const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.default;

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      statusColor,
      className
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        status === 'in-progress' || status === 'pending' ? 'animate-pulse' : ''
      )} style={{ backgroundColor: 'currentColor' }} />
      {status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ')}
    </span>
  );
}
