import React, { useState } from 'react';
import { useAuth } from '../../services/auth';
import { Wallet } from 'lucide-react';
import { cn } from '../../utils/cn';
import { AddMoneyModal } from '../wallet/AddMoneyModal';

interface WalletMenuProps {
  balance: number;
}

export function WalletMenu({ balance }: WalletMenuProps) {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const { user } = useAuth();

  // Convert paisa to rupees
  const rupees = balance / 100;
  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);

  return (
    <>
      <button
        onClick={() => setShowAddMoney(true)}
        className={cn(
          "flex items-center px-3 py-1.5 rounded-lg",
          "bg-primary-50 dark:bg-primary-900/30",
          "border border-primary-200 dark:border-primary-800",
          "transition-colors duration-200",
          "hover:bg-primary-100 dark:hover:bg-primary-900/50"
        )}
      >
        <Wallet className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-2" />
        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
          {formattedBalance}
        </span>
      </button>

      <AddMoneyModal 
        isOpen={showAddMoney} 
        onClose={() => setShowAddMoney(false)} 
      />
    </>
  );
}
