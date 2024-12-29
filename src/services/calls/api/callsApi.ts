import { createGraphQLClient } from '../../graphql/client';
import { handleApiError } from '../../../utils/api';
import { CREATE_CALL } from '../mutations/createCall';

interface MakeCallParams {
  number: string;
  agent_id: string;
  client_id: string;
  authToken: string;
}

export class CallsApi {
  async makeCall({ number, agent_id, client_id, authToken }: MakeCallParams): Promise<string> {
    try {
      const client = createGraphQLClient(authToken);
      
      const { vocallabsCallSingle } = await client.request(CREATE_CALL, {
        agent_id,
        client_id,
        number
      });

      if (!vocallabsCallSingle?.call_id) {
        throw new Error('Failed to create call - no call ID returned');
      }

      return vocallabsCallSingle.call_id;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const callsApi = new CallsApi();
