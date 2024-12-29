import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://db.vocallabs.ai/v1/graphql';

export const createGraphQLClient = (authToken?: string | null) => {
  return new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
    },
  });
};

export const graphqlClient = createGraphQLClient();
