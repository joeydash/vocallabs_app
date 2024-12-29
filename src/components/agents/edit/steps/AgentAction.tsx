import React, { useState } from 'react';
import { Agent } from '../../../../types/agent';

interface AgentActionProps {
  agent: Agent;
  onUpdate: (data: Partial<Agent>) => Promise<void>;
  onBack: () => void;
  isLastStep: boolean;
}

export function AgentAction({ agent, onUpdate, onBack, isLastStep }: AgentActionProps) {
  const [formData, setFormData] = useState({
    welcomeMessage: agent.welcomeMessage || '',
    agentPrompt: agent.agentPrompt || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Welcome Message
          </label>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            The initial message the agent will use to greet users
          </p>
          <textarea
            id="welcomeMessage"
            rows={3}
            value={formData.welcomeMessage}
            onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Example: Hello! I'm your AI assistant. How can I help you today?"
          />
        </div>

        <div>
          <label htmlFor="agentPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Agent Prompt
          </label>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Define the agent's personality, knowledge base, and conversation style
          </p>
          <textarea
            id="agentPrompt"
            rows={6}
            value={formData.agentPrompt}
            onChange={(e) => setFormData(prev => ({ ...prev, agentPrompt: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Example: You are a friendly and knowledgeable customer service representative..."
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
