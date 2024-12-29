import React, { useState, useEffect } from 'react';
import { Phone, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { Agent } from '../../types/agent';
import { createGraphQLClient } from '../../services/graphql/client';
import { GET_AGENTS } from '../../services/graphql/queries';
import { useCallModal } from '../shared/CallModalProvider';

const LAST_CALLED_NUMBER_KEY = 'vocallabs_last_called_number';

export function QuickCallButton() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, authToken } = useAuth();
  const navigate = useNavigate();
  const { openCallModal } = useCallModal();

  useEffect(() => {
    if (user?.id) {
      fetchAgents();
    }
  }, [user?.id]);

  const fetchAgents = async () => {
    if (!user?.id || !authToken) return;

    try {
      setLoading(true);
      const client = createGraphQLClient(authToken);
      const data = await client.request(GET_AGENTS, { client_id: user.id });
      setAgents(data.vocallabs_agent);
    } catch (err) {
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (agents.length === 0) {
      navigate('/agents/list');
    } else {
      openCallModal({
        agents,
        initialPhoneNumber: localStorage.getItem(LAST_CALLED_NUMBER_KEY) || ''
      });
    }
  };

  return (
    <button
      onClick={handleButtonClick}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
    >
      {agents.length === 0 ? (
        <>
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </>
      ) : (
        <>
          <Phone className="w-4 h-4 mr-2" />
          Quick Call
        </>
      )}
    </button>
  );
}
