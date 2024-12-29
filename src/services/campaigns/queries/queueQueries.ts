import { gql } from 'graphql-request';

// Helper function to build the where clause dynamically
const buildWhereClause = (filters: {
  dateFrom?: string;
  dateTo?: string;
}) => {
  const conditions = [
    'campaign_id: { _eq: $campaign_id }',
    filters.dateFrom ? 'created_at: { _gte: $dateFrom }' : null,
    filters.dateTo ? 'created_at: { _lte: $dateTo }' : null,
  ].filter(Boolean);

  return conditions.length > 1 
    ? `_and: [{ ${conditions.join(' }, { ')} }]`
    : conditions[0];
};

export const createQueueDetailsQuery = (filters: {
  dateFrom?: string;
  dateTo?: string;
  withPagination?: boolean;
}) => {
  // Only include variable definitions for active filters
  const variableDefinitions = [
    '$campaign_id: uuid!',
    filters.withPagination ? '$limit: Int!' : '',
    filters.withPagination ? '$offset: Int!' : '',
    filters.dateFrom ? '$dateFrom: timestamptz!' : '',
    filters.dateTo ? '$dateTo: timestamptz!' : '',
  ].filter(Boolean).join(', ');

  return gql`
    query GetQueueDetails(${variableDefinitions}) {
      vocallabs_call_queue(
        where: { ${buildWhereClause(filters)} }
        order_by: { created_at: desc }
        ${filters.withPagination ? 'limit: $limit, offset: $offset' : ''}
      ) {
        id
        phone
        status
        created_at
        updated_at
        call_id
      }
      vocallabs_call_queue_aggregate(
        where: { ${buildWhereClause(filters)} }
      ) {
        aggregate {
          count
        }
      }
      startable_calls: vocallabs_call_queue_aggregate(
        where: {
          _and: [
            { campaign_id: { _eq: $campaign_id } },
            { status: { _in: ["Added", "Paused"] } }
          ]
        }
      ) {
        aggregate {
          count
        }
      }
    }
  `;
};

export const GET_CALL_DETAILS = gql`
  query GetCallDetails($call_id: uuid!) {
    vocallabs_calls_by_pk(id: $call_id) {
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
  }
`;

export const START_CAMPAIGN_MUTATION = gql`
  mutation StartCampaign($campaign_id: uuid!) {
    update_vocallabs_call_queue(
      where: {
        _and: [
          { campaign_id: { _eq: $campaign_id } },
          { status: { _in: ["Added", "Paused"] } }
        ]
      },
      _set: { status: "Pending" }
    ) {
      affected_rows
    }
  }
`;
