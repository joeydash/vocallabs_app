import { gql } from 'graphql-request';

export const GET_PLIVO_CREDENTIALS = gql`
  query GetPlivoCredentials($client_id: uuid!) {
    vocallabs_client_tokens(
      where: { client_id: { _eq: $client_id }, service: { _eq: "plivo" } }
    ) {
      id
      name
      token
    }
  }
`;

export const ADD_PLIVO_CREDENTIAL = gql`
  mutation AddPlivoCredential($client_id: uuid!, $name: String!, $token: jsonb!) {
    insert_vocallabs_client_tokens(
      objects: {
        client_id: $client_id,
        name: $name,
        service: "plivo",
        token: $token,
        type: "call"
      }
    ) {
      affected_rows
      returning {
        id
        name
        token
      }
    }
  }
`;

export const UPDATE_PLIVO_CREDENTIAL = gql`
  mutation UpdatePlivoCredential($id: uuid!, $name: String!, $token: jsonb!) {
    update_vocallabs_client_tokens_by_pk(
      pk_columns: { id: $id },
      _set: { name: $name, token: $token }
    ) {
      id
      name
      token
    }
  }
`;

export const DELETE_PLIVO_CREDENTIAL = gql`
  mutation DeletePlivoCredential($id: uuid!) {
    delete_vocallabs_client_tokens_by_pk(id: $id) {
      id
    }
  }
`;
