import React, { useState } from 'react';
import { IntegrationGrid } from '../../components/integrations/IntegrationGrid';
import { PlivoModal } from '../../components/integrations/plivo/PlivoModal';
import { TwilioModal } from '../../components/integrations/twilio/TwilioModal';
import { PhoneNumberModal } from '../../components/integrations/phone/PhoneNumberModal';
import { PageHeader } from '../../components/shared/PageHeader';
import { PricingModal } from '../../components/pricing/PricingModal';
import { usePhoneNumberModal } from '../../hooks/integrations/usePhoneNumberModal';

export function Integrations() {
  const [showPricing, setShowPricing] = useState(false);
  const [showPlivoModal, setShowPlivoModal] = useState(false);
  const [showTwilioModal, setShowTwilioModal] = useState(false);
  const { phoneNumberModal, handleManagePhoneNumbers, closePhoneNumberModal } = usePhoneNumberModal();

  const handleIntegrationClick = () => {
    setShowPricing(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Integrations" icon="settings" />

      <IntegrationGrid 
        onPlivoClick={() => setShowPlivoModal(true)}
        onTwilioClick={() => setShowTwilioModal(true)}
        onOtherClick={handleIntegrationClick}
      />

      <PricingModal 
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
      />

      <PlivoModal
        isOpen={showPlivoModal}
        onClose={() => setShowPlivoModal(false)}
        onManagePhoneNumbers={(tokenId) => handleManagePhoneNumbers(tokenId, 'plivo')}
      />

      <TwilioModal
        isOpen={showTwilioModal}
        onClose={() => setShowTwilioModal(false)}
        onManagePhoneNumbers={(tokenId) => handleManagePhoneNumbers(tokenId, 'twilio')}
      />

      {phoneNumberModal.isOpen && phoneNumberModal.tokenId && phoneNumberModal.service && (
        <PhoneNumberModal
          isOpen={phoneNumberModal.isOpen}
          onClose={closePhoneNumberModal}
          tokenId={phoneNumberModal.tokenId}
          service={phoneNumberModal.service}
        />
      )}
    </div>
  );
}
