import React from 'react';
import { Modal } from '../../shared/Modal';
import { usePhoneNumbers } from './hooks/usePhoneNumbers';
import { PhoneNumberForm } from './components/PhoneNumberForm';
import { PhoneNumberList } from './components/PhoneNumberList';

interface PhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenId: string;
  service: 'plivo' | 'twilio';
}

export function PhoneNumberModal({ isOpen, onClose, tokenId, service }: PhoneNumberModalProps) {
  const { 
    phoneNumbers, 
    loading, 
    error,
    addPhoneNumber,
    deletePhoneNumber 
  } = usePhoneNumbers(tokenId, service);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Phone Numbers">
      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <PhoneNumberForm onSubmit={addPhoneNumber} />

        <PhoneNumberList
          phoneNumbers={phoneNumbers}
          loading={loading}
          onDelete={deletePhoneNumber}
        />
      </div>
    </Modal>
  );
}
