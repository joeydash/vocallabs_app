export const CHECK_DUPLICATE_CONTACTS = `
  query CheckDuplicateContacts($phones: [String!]!, $clientId: uuid!, $groupId: uuid) {
    vocallabs_prospects(
      where: {
        _and: [
          { phone: { _in: $phones } },
          { client_id: { _eq: $clientId } },
          { prospect_group_id: { _eq: $groupId } }
        ]
      }
    ) {
      id
      name
      phone
      created_at
      updated_at
      prospect_group {
        id
        name
      }
    }
  }
`;

export const CREATE_BULK_CONTACTS = `
  mutation CreateBulkContacts($objects: [vocallabs_prospects_insert_input!]!) {
    insert_vocallabs_prospects(
      objects: $objects,
      on_conflict: {
        constraint: prospects_client_id_prospect_group_id_phone_key,
        update_columns: [name]
      }
    ) {
      affected_rows
      returning {
        id
        name
        phone
        created_at
        updated_at
        prospect_group {
          id
          name
        }
      }
    }
  }
`;

export const CREATE_CONTACT = `
  mutation CreateContact($input: vocallabs_prospects_insert_input!) {
    insert_vocallabs_prospects_one(
      object: $input,
      on_conflict: {
        constraint: prospects_client_id_prospect_group_id_phone_key,
        update_columns: [name]
      }
    ) {
      id
      name
      phone
      created_at
      updated_at
      prospect_group {
        id
        name
      }
    }
  }
`;

export const UPDATE_CONTACT = `
  mutation UpdateContact($id: uuid!, $name: String!, $phone: String!) {
    update_vocallabs_prospects_by_pk(
      pk_columns: { id: $id },
      _set: { name: $name, phone: $phone }
    ) {
      id
      name
      phone
      updated_at
      prospect_group {
        id
        name
      }
    }
  }
`;

export const DELETE_CONTACT = `
  mutation DeleteContact($id: uuid!) {
    delete_vocallabs_prospects_by_pk(id: $id) {
      id
    }
  }
`;

export const DELETE_MULTIPLE_CONTACTS = `
  mutation DeleteMultipleContacts($ids: [uuid!]!) {
    delete_vocallabs_prospects(where: {id: {_in: $ids}}) {
      affected_rows
    }
  }
`;

export const GET_CONTACT_GROUPS = `
  query GetContactGroups($clientId: uuid!) {
    vocallabs_prospect_groups(
      where: { client_id: { _eq: $clientId } }
    ) {
      id
      name
      created_at
      updated_at
      prospects_aggregate {
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
      prospects_aggregate {
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
      prospects_aggregate {
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

export const GET_ALL_CONTACTS = `
  query GetAllContacts(
    $clientId: uuid!,
    $limit: Int = 10,
    $offset: Int = 0,
    $search: String = "%"
  ) {
    vocallabs_prospects(
      where: {
        _and: [
          { client_id: { _eq: $clientId } },
          {
            _or: [
              { name: { _ilike: $search } },
              { phone: { _ilike: $search } }
            ]
          }
        ]
      }
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
    ) {
      id
      name
      phone
      updated_at
      created_at
      prospect_group {
        id
        name
      }
    }
    vocallabs_prospects_aggregate(
      where: {
        _and: [
          { client_id: { _eq: $clientId } },
          {
            _or: [
              { name: { _ilike: $search } },
              { phone: { _ilike: $search } }
            ]
          }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_CONTACTS = `
  query GetContacts(
    $groupId: uuid,
    $clientId: uuid!,
    $limit: Int = 10,
    $offset: Int = 0,
    $search: String = "%"
  ) {
    vocallabs_prospects(
      where: {
        _and: [
          { client_id: { _eq: $clientId } },
          { prospect_group_id: { _eq: $groupId } },
          {
            _or: [
              { name: { _ilike: $search } },
              { phone: { _ilike: $search } }
            ]
          }
        ]
      }
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
    ) {
      id
      name
      phone
      updated_at
      created_at
      prospect_group {
        id
        name
      }
    }
    vocallabs_prospects_aggregate(
      where: {
        _and: [
          { client_id: { _eq: $clientId } },
          { prospect_group_id: { _eq: $groupId } },
          {
            _or: [
              { name: { _ilike: $search } },
              { phone: { _ilike: $search } }
            ]
          }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const SEARCH_CONTACTS = `
  query SearchContacts($clientId: uuid!, $search: String!, $limit: Int!) {
    vocallabs_prospects(
      where: {
        _and: [
          { client_id: { _eq: $clientId } },
          {
            _or: [
              { name: { _ilike: $search } },
              { phone: { _ilike: $search } }
            ]
          }
        ]
      }
      limit: $limit
      order_by: { created_at: desc }
    ) {
      id
      name
      phone
    }
  }
`;
