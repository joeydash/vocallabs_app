import React from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
  rightContent?: React.ReactNode;
}

export function ModalHeader({ title, icon, onClose, rightContent }: ModalHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between bg-white dark:bg-gray-800 border-b dark:border-gray-700 z-10">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {rightContent}
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
