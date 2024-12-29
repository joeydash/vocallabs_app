import { useState } from 'react';
import { useAuth } from '../../services/auth';
import { startCampaign } from '../../services/campaigns/mutations/startCampaign';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

export function useStartCampaign() {
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();

  const handleStartCampaign = async (campaignId: string) => {
    if (!authToken) {
      showErrorToast('Authentication required');
      return false;
    }

    try {
      setLoading(true);
      const affectedRows = await startCampaign(campaignId, authToken);
      
      if (affectedRows > 0) {
        showSuccessToast(`Campaign started with ${affectedRows} calls queued`);
        return true;
      } else {
        showErrorToast('No calls available to start');
        return false;
      }
    } catch (err) {
      showErrorToast('Failed to start campaign');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { startCampaign: handleStartCampaign, loading };
}
