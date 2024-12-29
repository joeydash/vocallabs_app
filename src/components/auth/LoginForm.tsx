import React from 'react';
import { Phone, Loader2 } from 'lucide-react';

interface LoginFormProps {
  phone: string;
  loading: boolean;
  onPhoneChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function LoginForm({ phone, loading, onPhoneChange, onSubmit }: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Enter your phone number"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Format: 9876543210 (10 digits)
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          'Send Verification Code'
        )}
      </button>
    </form>
  );
}
