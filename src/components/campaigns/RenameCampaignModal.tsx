import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Campaign } from '../../types/campaign';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RenameCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, name: string) => Promise<void>;
  campaign: Campaign;
}

export function RenameCampaignModal({ isOpen, onClose, onSubmit, campaign }: RenameCampaignModalProps) {
  const [name, setName] = useState(campaign.name);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;

    try {
      setLoading(true);
      await onSubmit(campaign.id, name.trim());
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename Campaign">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Campaign Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
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
            disabled={loading || !name.trim()}
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
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
