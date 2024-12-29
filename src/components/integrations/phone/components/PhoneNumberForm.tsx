import React, { useState } from 'react';
import { Phone, Plus, Loader2 } from 'lucide-react';
import { cn } from '../../../../utils/cn';

interface PhoneNumberFormProps {
  onSubmit: (phone: string) => Promise<void>;
}

export function PhoneNumberForm({ onSubmit }: PhoneNumberFormProps) {
  const [phone, setPhone] = useState('');
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || adding) return;

    try {
      setAdding(true);
      await onSubmit(phone.trim());
      setPhone('');
    } finally {
      setAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Add New Phone Number
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={cn(
                "block w-full pl-10 sm:text-sm rounded-md",
                "border-gray-300 dark:border-gray-600",
                "focus:ring-primary-500 focus:border-primary-500",
                "dark:bg-gray-700 dark:text-white"
              )}
              placeholder="+1234567890"
            />
          </div>
          <button
            type="submit"
            disabled={adding || !phone.trim()}
            className={cn(
              "ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md",
              "text-white bg-primary-600",
              "border border-transparent",
              "hover:bg-primary-700",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {adding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
