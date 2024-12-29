import React, { useState } from 'react';
import { Agent, SUPPORTED_LANGUAGES } from '../../../../types/agent';
import { useTokens } from '../../../../hooks/agents/useTokens';
import { cn } from '../../../../utils/cn';
import { Loader2 } from 'lucide-react';

interface AgentInfoProps {
  agent: Agent;
  onUpdate: (data: Partial<Agent>) => Promise<void>;
  onNext: () => void;
}

export function AgentInfo({ agent, onUpdate, onNext }: AgentInfoProps) {
  const [formData, setFormData] = useState({
    name: agent.name,
    language: agent.language,
    call_token_id: agent.call_token_id || '',
  });
  const [loading, setLoading] = useState(false);
  const { tokens, loading: tokensLoading, error: tokensError } = useTokens();

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
    <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Agent Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={cn(
              "mt-1 block w-full rounded-md shadow-sm sm:text-sm",
              "border-gray-300 dark:border-gray-600",
              "focus:ring-primary-500 focus:border-primary-500",
              "dark:bg-gray-700 dark:text-white"
            )}
            required
          />
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Language
          </label>
          <select
            id="language"
            value={formData.language}
            onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
            className={cn(
              "mt-1 block w-full rounded-md shadow-sm sm:text-sm",
              "border-gray-300 dark:border-gray-600",
              "focus:ring-primary-500 focus:border-primary-500",
              "dark:bg-gray-700 dark:text-white"
            )}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="call_token_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Call Token
          </label>
          <select
            id="call_token_id"
            value={formData.call_token_id}
            onChange={(e) => setFormData(prev => ({ ...prev, call_token_id: e.target.value }))}
            className={cn(
              "mt-1 block w-full rounded-md shadow-sm sm:text-sm",
              "border-gray-300 dark:border-gray-600",
              "focus:ring-primary-500 focus:border-primary-500",
              "dark:bg-gray-700 dark:text-white",
              tokensLoading && "animate-pulse"
            )}
            disabled={tokensLoading}
          >
            <option value="">Select a token</option>
            {tokens.map((token) => (
              <option key={token.id} value={token.id}>
                {token.name} ({token.service})
              </option>
            ))}
          </select>
          {tokensError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {tokensError}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md",
            "text-white bg-primary-600",
            "border border-transparent",
            "hover:bg-primary-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors duration-200"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save & Continue'
          )}
        </button>
      </div>
    </form>
  );
}
