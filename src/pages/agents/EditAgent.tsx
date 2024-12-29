import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';
import { GET_AGENT_WITH_TOKEN, UPDATE_AGENT_WITH_TOKEN } from '../../services/agents/queries/editAgentQueries';
import { Agent } from '../../types/agent';
import { AgentEditSteps } from '../../components/agents/edit/AgentEditSteps';
import { AgentInfo } from '../../components/agents/edit/steps/AgentInfo';
import { DataCollect } from '../../components/agents/edit/steps/DataCollect';
import { AgentAction } from '../../components/agents/edit/steps/AgentAction';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { showLoadingToast, updateToast } from '../../utils/toast';
import { Bot, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/cn';

export function EditAgent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, authToken } = useAuth();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (id && user?.id) {
      fetchAgent();
    }
  }, [id, user?.id]);

  const fetchAgent = async () => {
    if (!id || !authToken) return;

    try {
      setLoading(true);
      const client = createGraphQLClient(authToken);
      const data = await client.request(GET_AGENT_WITH_TOKEN, { id });
      const fetchedAgent = data.vocallabs_agent_by_pk;
      
      if (!fetchedAgent) {
        throw new Error('Agent not found');
      }

      setAgent({
        ...fetchedAgent,
        welcomeMessage: fetchedAgent.welcome_message,
        agentPrompt: fetchedAgent.agent_prompt,
        analyticsPrompt: fetchedAgent.analytics_prompt,
        inputsNeeded: fetchedAgent.inputs_needed,
        call_token_id: fetchedAgent.call_token_id,
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch agent details');
      console.error('Error fetching agent:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData: Partial<Agent>) => {
    if (!id || !authToken || !agent) return;

    const toastId = showLoadingToast('Updating agent...');

    try {
      const client = createGraphQLClient(authToken);
      const variables = {
        id,
        name: updatedData.name || agent.name,
        welcome_message: updatedData.welcomeMessage || agent.welcomeMessage,
        agent_prompt: updatedData.agentPrompt || agent.agentPrompt,
        analytics_prompt: updatedData.analyticsPrompt || agent.analyticsPrompt,
        inputs_needed: updatedData.inputsNeeded || agent.inputsNeeded,
        language: updatedData.language || agent.language,
        call_token_id: updatedData.call_token_id || agent.call_token_id,
      };

      await client.request(UPDATE_AGENT_WITH_TOKEN, variables);
      updateToast(toastId, 'success', 'Agent updated successfully');
      
      setAgent(prev => prev ? { ...prev, ...updatedData } : null);
      
      if (currentStep < 2) {
        setCurrentStep(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error updating agent:', err);
      updateToast(toastId, 'error', 'Failed to update agent');
    }
  };

  const steps = [
    {
      title: 'Basic Info',
      description: 'Name and language',
      component: AgentInfo,
    },
    {
      title: 'Data Collection',
      description: 'Configure inputs',
      component: DataCollect,
    },
    {
      title: 'Behavior',
      description: 'Define responses',
      component: AgentAction,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 rounded-lg">
        <p className="text-sm text-red-700 dark:text-red-200">
          {error || 'Agent not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 px-4 sm:px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigate('/agents/list')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center space-x-3">
            <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500 dark:text-primary-400" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Edit Agent
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {agent.name}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <AgentEditSteps
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        </div>

        <div className="p-4 sm:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            {React.createElement(steps[currentStep].component, {
              agent,
              onUpdate: handleUpdate,
              onNext: () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1)),
              onBack: () => setCurrentStep(prev => Math.max(prev - 1, 0)),
              isLastStep: currentStep === steps.length - 1,
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
