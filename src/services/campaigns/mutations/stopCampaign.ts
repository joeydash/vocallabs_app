import { createGraphQLClient } from '../../graphql/client';

const STOP_CAMPAIGN = `
  mutation StopCampaign($campaign_id: uuid!) {
    update_vocallabs_call_queue(
      where: {
        _and: [
          { campaign_id: { _eq: $campaign_id } },
          { status: { _eq: "Pending" } }
        ]
      },
      _set: { status: "Paused" }
    ) {
      affected_rows
    }
  }
`;

export const stopCampaign = async (campaignId: string, authToken: string) => {
  const client = createGraphQLClient(authToken);
  
  const variables = {
    campaign_id: campaignId
  };

  const data = await client.request(STOP_CAMPAIGN, variables);
  return data.update_vocallabs_call_queue.affected_rows;
};
