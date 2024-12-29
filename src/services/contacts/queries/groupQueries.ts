export const GET_CONTACT_GROUPS = `
  query GetContactGroups($clientId: uuid!) {
    vocallabs_prospect_groups(
      where: { client_id: { _eq: $clientId } }
    ) {
      id
      name
      created_at
      updated_at
      prospectsByProspectGroupId_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const CREATE_CONTACT_GROUP = `
  mutation CreateContactGroup($name: String!, $clientId: uuid!) {
    insert_vocallabs_prospect_groups_one(
      object: { 
        name: $name,
        client_id: $clientId
      }
    ) {
      id
      name
      created_at
      updated_at
      prospectsByProspectGroupId_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const UPDATE_CONTACT_GROUP = `
  mutation UpdateContactGroup($id: uuid!, $name: String!) {
    update_vocallabs_prospect_groups_by_pk(
      pk_columns: { id: $id },
      _set: { name: $name }
    ) {
      id
      name
      created_at
      updated_at
      prospectsByProspectGroupId_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const DELETE_CONTACT_GROUP = `
  mutation DeleteContactGroup($id: uuid!) {
    delete_vocallabs_prospect_groups_by_pk(id: $id) {
      id
    }
  }
`;
