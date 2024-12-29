import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';
import { Agent } from '../../types/agent';
import { GET_AGENTS } from '../../services/graphql/queries';
import { CREATE_AGENT, UPDATE_AGENT, DELETE_AGENT } from '../../services/graphql/mutations';
import { showSuccessToast, showErrorToast, showLoadingToast, updateToast } from '../../utils/toast';

const DUPLICATE_AGENT = `
  mutation DuplicateAgent($agent_id: uuid!, $client_id: uuid!) {
    vocallabsDuplicateAgent(request: {
      agent_id: $agent_id,
      client_id: $client_id
    }) {
      affected_rows
    }
  }
`;

interface UseAgentsOptions {
  limit?: number;
  initialPage?: number;
}

interface AgentsState {
  agents: Agent[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

export function useAgents({ limit = 10, initialPage = 1 }: UseAgentsOptions = {}) {
  const [state, setState] = useState<AgentsState>({
    agents: [],
    totalCount: 0,
    loading: true,
    error: null,
  });
  const [page, setPage] = useState(initialPage);
  const { user, authToken } = useAuth();

  const fetchAgents = useCallback(async (currentPage: number) => {
    if (!user?.id || !authToken) return;

    try {
      setState(prev => ({ ...prev, loading: true }));
      const client = createGraphQLClient(authToken);
      const offset = (currentPage - 1) * limit;
      
      const data = await client.request(GET_AGENTS, {
        client_id: user.id,
        limit,
        offset,
      });

      setState({
        agents: data.vocallabs_agent.map((agent: any) => ({
          ...agent,
          welcomeMessage: agent.welcome_message,
          agentPrompt: agent.agent_prompt,
          analyticsPrompt: agent.analytics_prompt,
          inputsNeeded: agent.inputs_needed,
        })),
        totalCount: data.vocallabs_agent_aggregate.aggregate.count,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch agents',
        loading: false,
      }));
      showErrorToast('Failed to fetch agents');
    }
  }, [user?.id, authToken, limit]);

  useEffect(() => {
    if (user?.id) {
      fetchAgents(page);
    }
  }, [user?.id, page, fetchAgents]);

  const createAgent = async (agentData: Omit<Agent, 'id' | 'purpose'>) => {
    if (!user?.id || !authToken) return false;

    const toastId = showLoadingToast('Creating agent...');

    try {
      const client = createGraphQLClient(authToken);
      await client.request(CREATE_AGENT, {
        name: agentData.name,
        welcome_message: agentData.welcomeMessage,
        agent_prompt: agentData.agentPrompt,
        analytics_prompt: agentData.analyticsPrompt,
        inputs_needed: agentData.inputsNeeded,
        language: agentData.language,
        client_id: user.id,
      });
      
      updateToast(toastId, 'success', 'Agent created successfully');
      await fetchAgents(page);
      return true;
    } catch (err) {
      updateToast(toastId, 'error', 'Failed to create agent');
      return false;
    }
  };

  const duplicateAgent = async (agentId: string) => {
    if (!user?.id || !authToken) return false;

    const toastId = showLoadingToast('Duplicating agent...');

    try {
      const client = createGraphQLClient(authToken);
      const result = await client.request(DUPLICATE_AGENT, {
        agent_id: agentId,
        client_id: user.id,
      });

      if (result.vocallabsDuplicateAgent.affected_rows > 0) {
        updateToast(toastId, 'success', 'Agent duplicated successfully');
        await fetchAgents(page);
        return true;
      } else {
        throw new Error('Failed to duplicate agent');
      }
    } catch (err) {
      updateToast(toastId, 'error', 'Failed to duplicate agent');
      return false;
    }
  };

  const updateAgent = async (id: string, agentData: Omit<Agent, 'id' | 'purpose'>) => {
    if (!authToken) return false;

    const toastId = showLoadingToast('Updating agent...');

    try {
      const client = createGraphQLClient(authToken);
      await client.request(UPDATE_AGENT, {
        id,
        name: agentData.name,
        welcome_message: agentData.welcomeMessage,
        agent_prompt: agentData.agentPrompt,
        analytics_prompt: agentData.analyticsPrompt,
        inputs_needed: agentData.inputsNeeded,
        language: agentData.language,
      });
      
      updateToast(toastId, 'success', 'Agent updated successfully');
      await fetchAgents(page);
      return true;
    } catch (err) {
      updateToast(toastId, 'error', 'Failed to update agent');
      return false;
    }
  };

  const deleteAgent = async (id: string) => {
    if (!authToken) return false;

    const toastId = showLoadingToast('Deleting agent...');

    try {
      const client = createGraphQLClient(authToken);
      await client.request(DELETE_AGENT, { id });
      updateToast(toastId, 'success', 'Agent deleted successfully');
      await fetchAgents(page);
      return true;
    } catch (err) {
      updateToast(toastId, 'error', 'Failed to delete agent');
      return false;
    }
  };

  const totalPages = Math.ceil(state.totalCount / limit);

  return {
    ...state,
    page,
    totalPages,
    createAgent,
    updateAgent,
    deleteAgent,
    duplicateAgent,
    goToPage: setPage,
    refetch: () => fetchAgents(page),
  };
}
