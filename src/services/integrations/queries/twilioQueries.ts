import { gql } from 'graphql-request';

export const GET_TWILIO_CREDENTIALS = gql`
  query GetTwilioCredentials($client_id: uuid!) {
    vocallabs_client_tokens(
      where: { client_id: { _eq: $client_id }, service: { _eq: "twilio" } }
    ) {
      id
      name
      token
    }
  }
`;

export const ADD_TWILIO_CREDENTIAL = gql`
  mutation AddTwilioCredential($client_id: uuid!, $name: String!, $token: jsonb!) {
    insert_vocallabs_client_tokens(
      objects: {
        client_id: $client_id,
        name: $name,
        service: "twilio",
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

export const UPDATE_TWILIO_CREDENTIAL = gql`
  mutation UpdateTwilioCredential($id: uuid!, $name: String!, $token: jsonb!) {
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

export const DELETE_TWILIO_CREDENTIAL = gql`
  mutation DeleteTwilioCredential($id: uuid!) {
    delete_vocallabs_client_tokens_by_pk(id: $id) {
      id
    }
  }
`;
