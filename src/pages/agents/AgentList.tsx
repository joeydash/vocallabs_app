import React, { useState } from 'react';
import { useAgents } from '../../hooks/agents/useAgents';
import { Agent } from '../../types/agent';
import { AgentList as AgentListComponent } from '../../components/agents/AgentList';
import { AgentForm } from '../../components/agents/AgentForm';
import { Modal } from '../../components/shared/Modal';
import { Pagination } from '../../components/shared/Pagination';
import { Plus, Bot } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';

const AGENTS_PER_PAGE = 10;

export function AgentList() {
  const { 
    agents, 
    loading, 
    error, 
    page, 
    totalPages,
    createAgent,
    updateAgent,
    deleteAgent,
    duplicateAgent,
    goToPage,
  } = useAgents({ limit: AGENTS_PER_PAGE });

  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const handleSubmit = async (agentData: Omit<Agent, 'id' | 'purpose'>) => {
    let success;
    if (editingAgent) {
      success = await updateAgent(editingAgent.id, agentData);
    } else {
      success = await createAgent(agentData);
    }

    if (success) {
      setShowModal(false);
      setEditingAgent(null);
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setShowModal(true);
  };

  const handleDuplicate = async (agent: Agent) => {
    await duplicateAgent(agent.id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAgent(null);
  };

  if (loading && agents.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Bot className="w-8 h-8 text-primary-500 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent List</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Agent
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingAgent ? 'Edit Agent' : 'Create New Agent'}
      >
        <AgentForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          initialData={editingAgent}
        />
      </Modal>

      <AgentListComponent
        agents={agents}
        onEdit={handleEdit}
        onDelete={deleteAgent}
        onDuplicate={handleDuplicate}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
