import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AgentSelect } from '../shared/AgentSelect';
import { cn } from '../../utils/cn';

interface CreateCampaignFormProps {
  onSubmit: (data: { name: string; agentId: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function CreateCampaignForm({ onSubmit, onCancel, loading }: CreateCampaignFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    agentId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Campaign Name <span className="text-red-500">*</span>
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
          placeholder="Enter campaign name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Agent <span className="text-red-500">*</span>
        </label>
        <AgentSelect
          value={formData.agentId}
          onChange={(value) => setFormData(prev => ({ ...prev, agentId: value }))}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !formData.name.trim() || !formData.agentId}
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
              Creating...
            </>
          ) : (
            'Create Campaign'
          )}
        </button>
      </div>
    </form>
  );
}
