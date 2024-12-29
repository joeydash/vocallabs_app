import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Wallet } from 'lucide-react';
import { useAuth } from '../../services/auth';
import { cn } from '../../utils/cn';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddMoneyModal({ isOpen, onClose }: AddMoneyModalProps) {
  const [amount, setAmount] = useState('');
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    // Convert rupees to paisa (multiply by 100)
    const amountInPaisa = Math.round(parseFloat(amount) * 100);
    
    if (isNaN(amountInPaisa) || amountInPaisa <= 0) {
      return;
    }

    // Open payment URL in new tab
    window.open(`https://subspace.money/subspace_api/payment/${user.id}/${amountInPaisa}`, '_blank');
    onClose();
    setAmount('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Money">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-full">
            <Wallet className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100">
              Add Money to Wallet
            </h3>
            <p className="text-xs text-primary-700 dark:text-primary-300">
              Minimum amount: ₹1
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount (₹)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">₹</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={cn(
                "block w-full pl-7 pr-12 sm:text-sm rounded-md",
                "border-gray-300 dark:border-gray-600",
                "focus:ring-primary-500 focus:border-primary-500",
                "dark:bg-gray-700 dark:text-white"
              )}
              placeholder="0"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">INR</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add Money
          </button>
        </div>
      </form>
    </Modal>
  );
}
