import React from 'react';
import { Agent } from '../../types/agent';
import { AgentCard } from './AgentCard';

interface AgentListProps {
  agents: Agent[];
  onEdit: (agent: Agent) => void;
  onDelete: (id: string) => void;
  onDuplicate: (agent: Agent) => void;
}

export function AgentList({ agents, onEdit, onDelete, onDuplicate }: AgentListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
}
