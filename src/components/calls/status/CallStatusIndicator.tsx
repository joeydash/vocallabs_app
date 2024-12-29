import React from 'react';
import { cn } from '../../../utils/cn';
import { Phone, PhoneOff, PhoneCall, PhoneMissed } from 'lucide-react';

interface CallStatusIndicatorProps {
  status: string;
  className?: string;
}

export function CallStatusIndicator({ status, className }: CallStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'in-progress':
        return {
          icon: PhoneCall,
          label: 'In Progress',
          color: 'text-amber-500 dark:text-amber-400',
          bgColor: 'bg-amber-100 dark:bg-amber-900/30',
          pulseColor: 'bg-amber-500 dark:bg-amber-400',
          animate: true
        };
      case 'done':
      case 'completed':
        return {
          icon: Phone,
          label: 'Completed',
          color: 'text-green-500 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          pulseColor: 'bg-green-500 dark:bg-green-400'
        };
      case 'pending':
        return {
          icon: Phone,
          label: 'Pending',
          color: 'text-blue-500 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          pulseColor: 'bg-blue-500 dark:bg-blue-400',
          animate: true
        };
      case 'failed':
        return {
          icon: PhoneMissed,
          label: 'Failed',
          color: 'text-red-500 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          pulseColor: 'bg-red-500 dark:bg-red-400'
        };
      default:
        return {
          icon: PhoneOff,
          label: 'Unknown',
          color: 'text-gray-500 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          pulseColor: 'bg-gray-500 dark:bg-gray-400'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn(
        "relative p-2 rounded-full",
        config.bgColor
      )}>
        <Icon className={cn("w-4 h-4", config.color)} />
        {config.animate && (
          <span className="absolute top-0 right-0 -mr-1 -mt-1">
            <span className={cn(
              "animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75",
              config.pulseColor
            )} />
            <span className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              config.pulseColor
            )} />
          </span>
        )}
      </div>
      <span className={cn(
        "text-sm font-medium",
        config.color
      )}>
        {config.label}
      </span>
    </div>
  );
}
