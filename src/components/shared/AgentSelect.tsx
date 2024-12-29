import React from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAgentOptions } from '../../hooks/agents/useAgentOptions';

interface AgentSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function AgentSelect({ value, onChange, className }: AgentSelectProps) {
  const { agents, loading, error } = useAgentOptions();

  if (error) {
    return (
      <div className="text-sm text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className={cn(
          "block w-full pl-10 pr-10 py-2 sm:text-sm rounded-md",
          "border-gray-300 dark:border-gray-600",
          "focus:ring-primary-500 focus:border-primary-500",
          "dark:bg-gray-700 dark:text-white",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "appearance-none",
          className
        )}
      >
        <option value="">All Agents</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>
      <Bot className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      {loading ? (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
      ) : (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
}
