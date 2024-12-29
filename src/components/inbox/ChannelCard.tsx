import React from 'react';
import { cn } from '../../utils/cn';

interface ChannelCardProps {
  name: string;
  icon: string;
  onClick: () => void;
}

export function ChannelCard({ name, icon, onClick }: ChannelCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800",
        "rounded-xl border border-gray-200 dark:border-gray-700",
        "transition-all duration-200",
        "hover:shadow-lg hover:scale-105",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      )}
    >
      <img src={icon} alt={name} className="w-16 h-16 mb-4" />
      <span className="text-lg font-medium text-gray-900 dark:text-white">
        {name}
      </span>
    </button>
  );
}
