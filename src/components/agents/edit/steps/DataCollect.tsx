import React, { useState } from 'react';
import { Agent } from '../../../../types/agent';

interface DataCollectProps {
  agent: Agent;
  onUpdate: (data: Partial<Agent>) => Promise<void>;
  onNext: () => void;
  onBack: () => void;
}

export function DataCollect({ agent, onUpdate, onNext, onBack }: DataCollectProps) {
  const [formData, setFormData] = useState({
    analyticsPrompt: agent.analyticsPrompt || '',
    inputsNeeded: agent.inputsNeeded || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(formData);
      onNext();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="analyticsPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Analytics Prompt
          </label>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Define how the agent should analyze and collect data during conversations
          </p>
          <textarea
            id="analyticsPrompt"
            rows={4}
            value={formData.analyticsPrompt}
            onChange={(e) => setFormData(prev => ({ ...prev, analyticsPrompt: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Example: Extract customer sentiment, key topics discussed, and any specific requirements mentioned"
          />
        </div>

        <div>
          <label htmlFor="inputsNeeded" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Required Inputs
          </label>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Specify the data points that need to be collected during the conversation
          </p>
          <textarea
            id="inputsNeeded"
            rows={4}
            value={formData.inputsNeeded}
            onChange={(e) => setFormData(prev => ({ ...prev, inputsNeeded: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Example: name, email, preferred contact time, budget range"
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
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </form>
  );
}
