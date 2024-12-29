export const CREATE_AGENT = `
  mutation CreateAgent($name: String!, $welcome_message: String, $agent_prompt: String, $analytics_prompt: String, $inputs_needed: String, $language: String, $client_id: uuid!) {
    insert_vocallabs_agent_one(object: {
      name: $name,
      purpose: "api",
      welcome_message: $welcome_message,
      agent_prompt: $agent_prompt,
      analytics_prompt: $analytics_prompt,
      inputs_needed: $inputs_needed,
      language: $language,
      client_id: $client_id,
      active: true
    }) {
      id
      name
      purpose
      welcome_message
      agent_prompt
      analytics_prompt
      inputs_needed
      language
    }
  }
`;

export const UPDATE_AGENT = `
  mutation UpdateAgent($id: uuid!, $name: String!, $welcome_message: String, $agent_prompt: String, $analytics_prompt: String, $inputs_needed: String, $language: String) {
    update_vocallabs_agent_by_pk(
      pk_columns: { id: $id },
      _set: {
        name: $name,
        welcome_message: $welcome_message,
        agent_prompt: $agent_prompt,
        analytics_prompt: $analytics_prompt,
        inputs_needed: $inputs_needed,
        language: $language
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
    }
  }
`;

export const DELETE_AGENT = `
  mutation DeleteAgent($id: uuid!) {
    update_vocallabs_agent_by_pk(
      pk_columns: {id: $id},
      _set: { active: false }
    ) {
      id
    }
  }
`;
