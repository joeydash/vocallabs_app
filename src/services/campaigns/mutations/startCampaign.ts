import { createGraphQLClient } from '../../graphql/client';

const START_CAMPAIGN = `
  mutation StartCampaign($campaign_id: uuid!) {
    update_vocallabs_call_queue(
      where: {
        _and: [
          { campaign_id: { _eq: $campaign_id } },
          { status: { _in: ["Added", "Paused"] } }
        ]
      },
      _set: { status: "Pending" }
    ) {
      affected_rows
    }
  }
`;

export const startCampaign = async (campaignId: string, authToken: string) => {
  const client = createGraphQLClient(authToken);
  
  const variables = {
    campaign_id: campaignId
  };

  const data = await client.request(START_CAMPAIGN, variables);
  return data.update_vocallabs_call_queue.affected_rows;
};
