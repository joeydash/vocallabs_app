import { createGraphQLClient } from '../client';

export const getCallStatus = async (callId: string, authToken: string) => {
  const client = createGraphQLClient(authToken);
  
  const query = `
    query GetCallStatus($call_id: uuid!) {
      vocallabs_calls(where: {id: {_eq: $call_id}}) {
        call_status
      }
    }
  `;

  const data = await client.request(query, { call_id: callId });
  return data.vocallabs_calls[0]?.call_status;
};

export const getCallData = async (callId: string, authToken: string) => {
  const client = createGraphQLClient(authToken);

  const query = `
    query GetCallData($call_id: uuid!) {
      vocallabs_call_data(
        where: { 
          call_id: { _eq: $call_id },
          type: { _eq: "external" }
        }
        order_by: { created_at: desc }
      ) {
        id
        key
        value
        created_at
      }
    }
  `;

  const data = await client.request(query, { call_id: callId });
  return data.vocallabs_call_data;
};
