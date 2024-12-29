import { useState } from 'react';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';

const ADD_CONTACTS_TO_CAMPAIGN = `
  mutation AddContactsToCampaign($campaign_id: uuid!, $client_id: uuid!, $prospect_group_id: uuid!) {
    vocallabsAddContactsToCampaign(request: {
      campaign_id: $campaign_id,
      client_id: $client_id,
      prospect_group_id: $prospect_group_id
    }) {
      affected_rows
    }
  }
`;

export function useAddContactsToCampaign() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, authToken } = useAuth();

  const addContacts = async (campaignId: string, groupId: string) => {
    if (!user?.id || !authToken) return;

    try {
      setLoading(true);
      setError(null);
      const client = createGraphQLClient(authToken);
      
      await client.request(ADD_CONTACTS_TO_CAMPAIGN, {
        campaign_id: campaignId,
        client_id: user.id,
        prospect_group_id: groupId
      });

      return true;
    } catch (err) {
      setError('Failed to add contacts to campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addContacts, loading, error };
}
