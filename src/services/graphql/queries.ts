export const GET_AGENTS = `
  query GetAgents(
    $client_id: uuid!,
    $limit: Int = 30,
    $offset: Int = 0
  ) {
    vocallabs_agent(
      where: {
        _and: [
          { client_id: { _eq: $client_id } },
          { active: { _eq: true } }
        ]
      }
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
    ) {
      id
      name
      purpose
      welcome_message
      agent_prompt
      analytics_prompt
      inputs_needed
      language
      created_at
    }
    vocallabs_agent_aggregate(
      where: {
        _and: [
          { client_id: { _eq: $client_id } },
          { active: { _eq: true } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_AGENT_BY_ID = `
  query GetAgentById($id: uuid!) {
    vocallabs_agent_by_pk(id: $id) {
      id
      name
      purpose
      welcome_message
      agent_prompt
      analytics_prompt
      inputs_needed
      language
      created_at
    }
  }
`;

export const GET_CALLS = `
  query GetCalls(
    $client_id: uuid!,
    $limit: Int = 10,
    $offset: Int = 0
  ) {
    vocallabs_calls(
      where: { agent: { client: { id: { _eq: $client_id } } } }
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
      conversation
      details_from_call
    }
    vocallabs_calls_aggregate(
      where: { agent: { client: { id: { _eq: $client_id } } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_DASHBOARD_STATS = `
  query GetDashboardStats($client_id: uuid!) {
    total_agents: vocallabs_agent_aggregate(
      where: {
        _and: [
          { client_id: { _eq: $client_id } },
          { active: { _eq: true } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
    total_calls: vocallabs_calls_aggregate(
      where: { agent: { client: { id: { _eq: $client_id } } } }
    ) {
      aggregate {
        count
      }
    }
    total_groups: vocallabs_prospect_groups_aggregate(
      where: { client_id: { _eq: $client_id } }
    ) {
      aggregate {
        count
      }
    }
    total_contacts: vocallabs_prospects_aggregate(
      where: { client_id: { _eq: $client_id } }
    ) {
      aggregate {
        count
      }
    }
    recent_calls: vocallabs_calls(
      where: { agent: { client: { id: { _eq: $client_id } } } }
      limit: 5
      order_by: { created_at: desc }
    ) {
      id
      agent {
        name
      }
      created_at
      phone_to
      call_status
    }
  }
`;
