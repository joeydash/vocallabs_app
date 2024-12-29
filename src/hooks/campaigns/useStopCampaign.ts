import { useState } from 'react';
import { useAuth } from '../../services/auth';
import { stopCampaign } from '../../services/campaigns/mutations/stopCampaign';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

export function useStopCampaign() {
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();

  const handleStopCampaign = async (campaignId: string) => {
    if (!authToken) {
      showErrorToast('Authentication required');
      return false;
    }

    try {
      setLoading(true);
      const affectedRows = await stopCampaign(campaignId, authToken);
      
      if (affectedRows > 0) {
        showSuccessToast(`Campaign stopped with ${affectedRows} calls paused`);
        return true;
      } else {
        showErrorToast('No pending calls to stop');
        return false;
      }
    } catch (err) {
      showErrorToast('Failed to stop campaign');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { stopCampaign: handleStopCampaign, loading };
}
