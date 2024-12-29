import { gql } from 'graphql-request';

export const GET_AGENT_WITH_TOKEN = gql`
  query GetAgentWithToken($id: uuid!) {
    vocallabs_agent_by_pk(id: $id) {
      id
      name
      purpose
      welcome_message
      agent_prompt
      analytics_prompt
      inputs_needed
      language
      call_token_id
      created_at
    }
  }
`;

export const UPDATE_AGENT_WITH_TOKEN = gql`
  mutation UpdateAgentWithToken(
    $id: uuid!,
    $name: String!,
    $welcome_message: String,
    $agent_prompt: String,
    $analytics_prompt: String,
    $inputs_needed: String,
    $language: String,
    $call_token_id: uuid
  ) {
    update_vocallabs_agent_by_pk(
      pk_columns: { id: $id },
      _set: {
        name: $name,
        welcome_message: $welcome_message,
        agent_prompt: $agent_prompt,
        analytics_prompt: $analytics_prompt,
        inputs_needed: $inputs_needed,
        language: $language,
        call_token_id: $call_token_id
      }
    ) {
      id
      name
      purpose
      welcome_message
      agent_prompt
      analytics_prompt
      inputs_needed
      language
      call_token_id
    }
  }
`;
