import React from 'react';
import { Cog, LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  icon?: string;
}

const icons: Record<string, LucideIcon> = {
  settings: Cog
};

export function PageHeader({ title, icon }: PageHeaderProps) {
  const Icon = icon ? icons[icon] : null;

  return (
    <div className="flex items-center space-x-3">
      {Icon && <Icon className="w-8 h-8 text-primary-500 dark:text-primary-400" />}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
    </div>
  );
}
