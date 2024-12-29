import { GraphQLClient } from 'graphql-request';
import { API_CONFIG } from './config';

export const createHasuraClient = (authToken?: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return new GraphQLClient(API_CONFIG.HASURA_ENDPOINT, { headers });
};

export const createGrowClient = (authToken?: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return new GraphQLClient(API_CONFIG.GROW_ENDPOINT, { headers });
};

export const publicGraphQLClient = new GraphQLClient(API_CONFIG.HASURA_ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
  },
});
