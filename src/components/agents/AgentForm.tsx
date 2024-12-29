import React, { useState, useEffect } from 'react';
import { Agent, SUPPORTED_LANGUAGES } from '../../types/agent';

interface AgentFormProps {
  onSubmit: (agent: Omit<Agent, 'id' | 'purpose'>) => void;
  onCancel: () => void;
  initialData?: Agent;
}

export function AgentForm({ onSubmit, onCancel, initialData }: AgentFormProps) {
  const [formData, setFormData] = useState<Omit<Agent, 'id' | 'purpose'>>({
    name: '',
    welcomeMessage: '',
    agentPrompt: '',
    analyticsPrompt: '',
    inputsNeeded: '',
    language: 'hi',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        welcomeMessage: initialData.welcomeMessage || '',
        agentPrompt: initialData.agentPrompt || '',
        analyticsPrompt: initialData.analyticsPrompt || '',
        inputsNeeded: initialData.inputsNeeded || '',
        language: initialData.language,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Enter agent name"
          />
        </div>

        <div>
          <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Welcome Message
          </label>
          <textarea
            id="welcomeMessage"
            name="welcomeMessage"
            rows={3}
            value={formData.welcomeMessage}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Enter welcome message"
          />
        </div>

        <div>
          <label htmlFor="agentPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Agent Prompt
          </label>
          <textarea
            id="agentPrompt"
            name="agentPrompt"
            rows={3}
            value={formData.agentPrompt}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Enter agent prompt"
          />
        </div>

        <div>
          <label htmlFor="analyticsPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Analytics Prompt
          </label>
          <textarea
            id="analyticsPrompt"
            name="analyticsPrompt"
            rows={3}
            value={formData.analyticsPrompt}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Enter analytics prompt"
          />
        </div>

        <div>
          <label htmlFor="inputsNeeded" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Inputs Needed
          </label>
          <textarea
            id="inputsNeeded"
            name="inputsNeeded"
            rows={3}
            value={formData.inputsNeeded}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Enter required inputs"
          />
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
        >
          {initialData ? 'Update Agent' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
}
