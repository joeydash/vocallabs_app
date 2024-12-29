import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';
import { Plus, MegaphoneIcon, Loader2 } from 'lucide-react';
import { Campaign } from '../../types/campaign';
import { CampaignCard } from '../../components/campaigns/CampaignCard';
import { CreateCampaignForm } from '../../components/campaigns/CreateCampaignForm';
import { RenameCampaignModal } from '../../components/campaigns/RenameCampaignModal';
import { Pagination } from '../../components/shared/Pagination';
import { Modal } from '../../components/shared/Modal';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const GET_CAMPAIGNS = `
  query GetCampaigns($client_id: uuid!, $limit: Int!, $offset: Int!) {
    vocallabs_campaigns(
      where: { deleted: { _eq: false }, client_id: { _eq: $client_id } }
      limit: $limit
      offset: $offset
      order_by: { updated_at: desc }
    ) {
      id
      name
      created_at
      updated_at
      agent_id
      agent {
        id
        name
      }
      call_queues_aggregate(where: { status: { _eq: "Pending" } }) {
        aggregate {
          count
        }
      }
    }
    vocallabs_campaigns_aggregate(
      where: { deleted: { _eq: false }, client_id: { _eq: $client_id } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const CREATE_CAMPAIGN = `
  mutation CreateCampaign($name: String!, $client_id: uuid!, $agent_id: uuid!) {
    insert_vocallabs_campaigns_one(
      object: { 
        name: $name, 
        client_id: $client_id,
        agent_id: $agent_id
      }
    ) {
      id
      name
      created_at
    }
  }
`;

const DELETE_CAMPAIGN = `
  mutation DeleteCampaign($id: uuid!) {
    update_vocallabs_campaigns_by_pk(
      pk_columns: { id: $id },
      _set: { deleted: true }
    ) {
      id
    }
  }
`;

const UPDATE_CAMPAIGN_NAME = `
  mutation UpdateCampaignName($id: uuid!, $name: String!) {
    update_vocallabs_campaigns_by_pk(
      pk_columns: { id: $id },
      _set: { name: $name }
    ) {
      id
      name
      updated_at
    }
  }
`;

const CAMPAIGNS_PER_PAGE = 10;

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const { user, authToken } = useAuth();

  const fetchCampaigns = React.useCallback(async () => {
    if (!user?.id || !authToken) return;

    try {
      setLoading(true);
      const client = createGraphQLClient(authToken);
      const offset = (page - 1) * CAMPAIGNS_PER_PAGE;

      const data = await client.request(GET_CAMPAIGNS, {
        client_id: user.id,
        limit: CAMPAIGNS_PER_PAGE,
        offset,
      });

      setCampaigns(data.vocallabs_campaigns);
      setTotalCount(data.vocallabs_campaigns_aggregate.aggregate.count);
      setError(null);
    } catch (err) {
      setError('Failed to fetch campaigns');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, authToken, page]);

  useEffect(() => {
    if (user?.id) {
      fetchCampaigns();
    }
  }, [user?.id, fetchCampaigns]);

  const handleCreateCampaign = async (data: { name: string; agentId: string }) => {
    if (!user?.id || !authToken) return;

    try {
      setCreating(true);
      const client = createGraphQLClient(authToken);
      await client.request(CREATE_CAMPAIGN, {
        name: data.name.trim(),
        client_id: user.id,
        agent_id: data.agentId,
      });

      showSuccessToast('Campaign created successfully');
      setShowCreateModal(false);
      fetchCampaigns();
    } catch (err) {
      showErrorToast('Failed to create campaign');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!authToken) return;

    try {
      const client = createGraphQLClient(authToken);
      await client.request(DELETE_CAMPAIGN, { id });
      showSuccessToast('Campaign deleted successfully');
      fetchCampaigns();
    } catch (err) {
      showErrorToast('Failed to delete campaign');
    }
  };

  const handleRenameCampaign = async (id: string, newName: string) => {
    if (!authToken) return;

    try {
      const client = createGraphQLClient(authToken);
      await client.request(UPDATE_CAMPAIGN_NAME, {
        id,
        name: newName,
      });
      showSuccessToast('Campaign renamed successfully');
      fetchCampaigns();
    } catch (err) {
      showErrorToast('Failed to rename campaign');
      console.error('Error renaming campaign:', err);
    }
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowRenameModal(true);
  };

  const totalPages = Math.ceil(totalCount / CAMPAIGNS_PER_PAGE);

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <MegaphoneIcon className="w-8 h-8 text-primary-500 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <MegaphoneIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No campaigns yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create your first campaign to start managing your outbound calls.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={handleEditCampaign}
              onDelete={handleDeleteCampaign}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Campaign"
      >
        <CreateCampaignForm
          onSubmit={handleCreateCampaign}
          onCancel={() => setShowCreateModal(false)}
          loading={creating}
        />
      </Modal>

      {selectedCampaign && (
        <RenameCampaignModal
          isOpen={showRenameModal}
          onClose={() => {
            setShowRenameModal(false);
            setSelectedCampaign(null);
          }}
          onSubmit={handleRenameCampaign}
          campaign={selectedCampaign}
        />
      )}
    </div>
  );
}
