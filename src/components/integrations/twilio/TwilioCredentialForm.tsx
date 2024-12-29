import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { TwilioCredentialInput } from '../../../services/integrations/types/twilioTypes';

interface TwilioCredentialFormProps {
  initialData?: TwilioCredentialInput;
  onSubmit: (data: TwilioCredentialInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function TwilioCredentialForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  loading 
}: TwilioCredentialFormProps) {
  const [formData, setFormData] = useState<TwilioCredentialInput>(
    initialData || { name: '', auth_id: '', auth_token: '' }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Credential Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={cn(
            "mt-1 block w-full rounded-md shadow-sm sm:text-sm",
            "border-gray-300 dark:border-gray-600",
            "focus:ring-primary-500 focus:border-primary-500",
            "dark:bg-gray-700 dark:text-white"
          )}
          placeholder="e.g., Production API Key"
          required
        />
      </div>

      <div>
        <label htmlFor="auth_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Account SID
        </label>
        <input
          type="text"
          id="auth_id"
          value={formData.auth_id}
          onChange={(e) => setFormData(prev => ({ ...prev, auth_id: e.target.value }))}
          className={cn(
            "mt-1 block w-full rounded-md shadow-sm sm:text-sm",
            "border-gray-300 dark:border-gray-600",
            "focus:ring-primary-500 focus:border-primary-500",
            "dark:bg-gray-700 dark:text-white"
          )}
          placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          required
        />
      </div>

      <div>
        <label htmlFor="auth_token" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Auth Token
        </label>
        <input
          type="password"
          id="auth_token"
          value={formData.auth_token}
          onChange={(e) => setFormData(prev => ({ ...prev, auth_token: e.target.value }))}
          className={cn(
            "mt-1 block w-full rounded-md shadow-sm sm:text-sm",
            "border-gray-300 dark:border-gray-600",
            "focus:ring-primary-500 focus:border-primary-500",
            "dark:bg-gray-700 dark:text-white"
          )}
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md",
            "text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300",
            "border border-gray-300 dark:border-gray-600",
            "hover:bg-gray-50 dark:hover:bg-gray-600",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          )}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md",
            "text-white bg-primary-600",
            "border border-transparent",
            "hover:bg-primary-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Credentials'
          )}
        </button>
      </div>
    </form>
  );
}
