import React, { useState, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { Contact, ContactGroup } from '../../types/contact';
import { CountrySelect } from '../shared/CountrySelect';
import { GroupSearchInput } from './groups/GroupSearchInput';
import { cn } from '../../utils/cn';

interface CreateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; phone: string; groupId?: string }) => Promise<void>;
  initialData?: Contact | null;
  defaultGroupId?: string;
  requireGroup?: boolean;
}

export function CreateContactModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  defaultGroupId,
  requireGroup = true
}: CreateContactModalProps) {
  const [formData, setFormData] = useState({ 
    name: initialData?.name || '', 
    phone: initialData?.phone ? initialData.phone.replace(/^\d{1,3}/, '') : '',
    groupId: initialData?.prospect_group?.id || defaultGroupId || ''
  });
  const [countryCode, setCountryCode] = useState('91');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        phone: initialData.phone.replace(/^\d{1,3}/, ''),
        groupId: initialData.prospect_group?.id || defaultGroupId || ''
      });
      const match = initialData.phone.match(/^(\d{1,3})/);
      if (match) {
        setCountryCode(match[1]);
      }
    } else {
      setFormData({ 
        name: '', 
        phone: '',
        groupId: defaultGroupId || ''
      });
      setCountryCode('91');
    }
  }, [initialData, defaultGroupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        phone: `${countryCode}${formData.phone}`,
        groupId: formData.groupId || undefined
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGroup = (group: ContactGroup) => {
    setFormData(prev => ({ ...prev, groupId: group.id }));
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    const name = formData.name || '';
    const phone = formData.phone || '';
    const groupId = formData.groupId || '';

    const isNameValid = name.trim().length > 0;
    const isPhoneValid = phone.replace(/\D/g, '').length >= 10;
    const isGroupValid = !requireGroup || defaultGroupId ? true : groupId.trim().length > 0;

    return isNameValid && isPhoneValid && isGroupValid;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Contact" : "Add New Contact"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name <span className="text-red-500">*</span>
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
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 grid grid-cols-3 gap-2">
            <CountrySelect
              value={countryCode}
              onChange={setCountryCode}
            />
            <div className="col-span-2">
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                className={cn(
                  "block w-full rounded-md shadow-sm sm:text-sm",
                  "border-gray-300 dark:border-gray-600",
                  "focus:ring-primary-500 focus:border-primary-500",
                  "dark:bg-gray-700 dark:text-white"
                )}
                placeholder="9182517283"
                required
                pattern="[0-9]+"
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter the phone number without country code (e.g., 9182517283)
          </p>
        </div>

        {/* Show group selection only when not in a specific group context */}
        {!defaultGroupId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Group {requireGroup && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-1 relative">
              <GroupSearchInput
                value={formData.groupId}
                onChange={(value) => setFormData(prev => ({ ...prev, groupId: value }))}
                onSelectGroup={handleSelectGroup}
              />
            </div>
          </div>
        )}

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
            disabled={loading || !isFormValid()}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md",
              "text-white bg-primary-600",
              "border border-transparent",
              "hover:bg-primary-700",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors duration-200"
            )}
          >
            {loading ? 'Saving...' : initialData ? 'Update Contact' : 'Add Contact'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
