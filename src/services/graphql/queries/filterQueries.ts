import { gql } from 'graphql-request';

export const GET_CALL_STATUSES = gql`
  query GetCallStatuses($client_id: uuid!) {
    vocallabs_calls(
      distinct_on: call_status, 
      where: {agent: {client_id: {_eq: $client_id}}}
    ) {
      call_status
    }
  }
`;

// Helper function to build the where clause dynamically
const buildWhereClause = (
  hasAgentId: boolean, 
  hasDateFrom: boolean, 
  hasDateTo: boolean, 
  hasStatus: boolean, 
  hasPhoneNumber: boolean
) => {
  const conditions = [
    '{ agent: { client_id: { _eq: $clientId } } }',
    hasAgentId ? '{ agent_id: { _eq: $agentId } }' : null,
    hasDateFrom ? '{ created_at: { _gte: $dateFrom } }' : null,
    hasDateTo ? '{ created_at: { _lte: $dateTo } }' : null,
    hasStatus ? '{ call_status: { _in: $status } }' : null,
    hasPhoneNumber ? '{ _or: [{ phone_from: { _ilike: $phoneNumber } }, { phone_to: { _ilike: $phoneNumber } }] }' : null,
  ].filter(Boolean).join(',\n');

  return `_and: [${conditions}]`;
};

export const createFilteredCallsQuery = (
  hasAgentId: boolean,
  hasDateFrom: boolean,
  hasDateTo: boolean,
  hasStatus: boolean,
  hasPhoneNumber: boolean
) => {
  // Only include variable definitions for filters that are actually being used
  const variableDefinitions = [
    '$clientId: uuid!',
    '$limit: Int!',
    '$offset: Int!',
    hasAgentId ? '$agentId: uuid!' : '',
    hasDateFrom ? '$dateFrom: timestamptz!' : '',
    hasDateTo ? '$dateTo: timestamptz!' : '',
    hasStatus ? '$status: [String!]!' : '',
    hasPhoneNumber ? '$phoneNumber: String!' : '',
  ].filter(Boolean).join(', ');

  return gql`
    query GetFilteredCalls(${variableDefinitions}) {
      vocallabs_calls(
        where: {
          ${buildWhereClause(hasAgentId, hasDateFrom, hasDateTo, hasStatus, hasPhoneNumber)}
        }
        limit: $limit
        offset: $offset
        order_by: { created_at: desc }
      ) {
        id
        plivo_call_id
        recording_url
        agent_id
        agent {
          name
        }
        created_at
        updated_at
        phone_from
        phone_to
        call_status
      }
      vocallabs_calls_aggregate(
        where: {
          ${buildWhereClause(hasAgentId, hasDateFrom, hasDateTo, hasStatus, hasPhoneNumber)}
        }
      ) {
        aggregate {
          count
        }
      }
    }
  `;
};
