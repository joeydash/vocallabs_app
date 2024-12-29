import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Agent } from '../../types/agent';
import { SUPPORTED_LANGUAGES } from '../../types/agent';
import { MessageSquare, Languages, Phone, Edit2, Trash2, Copy } from 'lucide-react';
import { useCallModal } from '../shared/CallModalProvider';
import { OptionsDropdown } from '../shared/OptionsDropdown';

interface AgentCardProps {
  agent: Agent;
  onDelete: (id: string) => void;
  onDuplicate: (agent: Agent) => void;
}

export function AgentCard({ agent, onDelete, onDuplicate }: AgentCardProps) {
  const navigate = useNavigate();
  const { openCallModal } = useCallModal();
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === agent.language)?.name || agent.language;

  const options = [
    {
      label: 'Make Call',
      icon: Phone,
      onClick: () => openCallModal({ agent }),
    },
    {
      label: 'Edit',
      icon: Edit2,
      onClick: () => navigate(`/agents/edit/${agent.id}`),
    },
    {
      label: 'Duplicate',
      icon: Copy,
      onClick: () => onDuplicate(agent),
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: () => onDelete(agent.id),
      variant: 'danger' as const,
    },
  ];

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-visible">
      {/* Top accent bar with gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600"></div>

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {agent.name}
              </h3>
              <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Languages className="w-4 h-4" />
                <span>{language}</span>
              </div>
            </div>
          </div>

          <OptionsDropdown options={options} />
        </div>

        {/* Status indicator */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Active</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            ID: {agent.id.slice(0, 8)}...
          </div>
        </div>
      </div>
    </div>
  );
}
