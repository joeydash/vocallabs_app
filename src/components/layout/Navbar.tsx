import React from 'react';
import { Menu } from 'lucide-react';
import { QuickCallButton } from './QuickCallButton';
import { BalanceDisplay } from './BalanceDisplay';

interface NavbarProps {
  onMobileMenuToggle: () => void;
}

export function Navbar({ onMobileMenuToggle }: NavbarProps) {
  return (
    <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center">
      <div className="flex-1 flex items-center">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <BalanceDisplay />
        <QuickCallButton />
      </div>
    </div>
  );
}
