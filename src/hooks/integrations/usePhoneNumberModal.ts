import { useState } from 'react';

interface PhoneNumberModalState {
  isOpen: boolean;
  tokenId: string | null;
  service: 'plivo' | 'twilio' | null;
}

export function usePhoneNumberModal() {
  const [phoneNumberModal, setPhoneNumberModal] = useState<PhoneNumberModalState>({
    isOpen: false,
    tokenId: null,
    service: null
  });

  const handleManagePhoneNumbers = (tokenId: string, service: 'plivo' | 'twilio') => {
    setPhoneNumberModal({
      isOpen: true,
      tokenId,
      service
    });
  };

  const closePhoneNumberModal = () => {
    setPhoneNumberModal({
      isOpen: false,
      tokenId: null,
      service: null
    });
  };

  return {
    phoneNumberModal,
    handleManagePhoneNumbers,
    closePhoneNumberModal
  };
}
