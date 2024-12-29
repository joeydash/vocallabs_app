import { createGraphQLClient } from '../../graphql/client';

const DELETE_QUEUE_ITEMS = `
  mutation DeleteQueueItems($ids: [uuid!]!) {
    delete_vocallabs_call_queue(where: {id: {_in: $ids}}) {
      affected_rows
    }
  }
`;

export const deleteQueueItems = async (ids: string[], authToken: string) => {
  const client = createGraphQLClient(authToken);
  
  const variables = {
    ids
  };

  const data = await client.request(DELETE_QUEUE_ITEMS, variables);
  return data.delete_vocallabs_call_queue.affected_rows;
};
