import React from 'react';
import { Phone } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface PlivoCardProps {
  onClick: () => void;
}

export function PlivoCard({ onClick }: PlivoCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col text-left",
        "p-6 bg-white dark:bg-gray-800 rounded-xl",
        "border border-gray-200 dark:border-gray-700",
        "transition-all duration-200",
        "hover:shadow-lg hover:scale-[1.02]",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      )}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Plivo
        </h3>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enable voice calling functionality by connecting your Plivo account
      </p>
    </button>
  );
}