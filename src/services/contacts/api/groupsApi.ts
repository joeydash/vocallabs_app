import { createGraphQLClient } from '../../graphql/client';
import { 
  GET_CONTACT_GROUPS,
  CREATE_CONTACT_GROUP,
  UPDATE_CONTACT_GROUP,
  DELETE_CONTACT_GROUP 
} from '../queries/groupQueries';
import { ContactGroup } from '../../../types/contact';
import { handleApiError } from '../../../utils/api';

export class ContactGroupsApi {
  async getGroups(clientId: string, authToken: string): Promise<ContactGroup[]> {
    try {
      const client = createGraphQLClient(authToken);
      const data = await client.request(GET_CONTACT_GROUPS, { clientId });
      return data.vocallabs_prospect_groups;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async createGroup(name: string, clientId: string, authToken: string): Promise<ContactGroup> {
    try {
      const client = createGraphQLClient(authToken);
      const data = await client.request(CREATE_CONTACT_GROUP, { name, clientId });
      return data.insert_vocallabs_prospect_groups_one;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateGroup(id: string, name: string, authToken: string): Promise<ContactGroup> {
    try {
      const client = createGraphQLClient(authToken);
      const data = await client.request(UPDATE_CONTACT_GROUP, { id, name });
      return data.update_vocallabs_prospect_groups_by_pk;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async deleteGroup(id: string, authToken: string): Promise<void> {
    try {
      const client = createGraphQLClient(authToken);
      await client.request(DELETE_CONTACT_GROUP, { id });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const groupsApi = new ContactGroupsApi();
