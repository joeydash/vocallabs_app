import { gql } from 'graphql-request';

export const CREATE_CALL = gql`
  mutation CreateCall($agent_id: uuid!, $client_id: uuid!, $number: String!) {
    vocallabsCallSingle(request: {
      agent_id: $agent_id,
      client_id: $client_id,
      number: $number
    }) {
      call_id
      affected_rows
    }
  }
`;
