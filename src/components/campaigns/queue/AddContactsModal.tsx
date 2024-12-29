import React, { useState } from 'react';
import { Modal } from '../../shared/Modal';
import { GroupSearchInput } from '../../contacts/groups/GroupSearchInput';
import { ContactGroup } from '../../../types/contact';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface AddContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupId: string) => Promise<void>;
  loading?: boolean;
}

export function AddContactsModal({ isOpen, onClose, onSubmit, loading }: AddContactsModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId) return;
    await onSubmit(selectedGroupId);
  };

  const handleSelectGroup = (group: ContactGroup) => {
    setSelectedGroupId(group.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Contacts to Campaign">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Contact Group
          </label>
          <div className="mt-1">
            <GroupSearchInput
              value={selectedGroupId}
              onChange={setSelectedGroupId}
              onSelectGroup={handleSelectGroup}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
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
            disabled={!selectedGroupId || loading}
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
                Adding Contacts...
              </>
            ) : (
              'Add Contacts'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
