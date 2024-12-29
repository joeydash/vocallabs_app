import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';
import { Loader2 } from 'lucide-react';
import { QueueTable } from '../../components/campaigns/queue/QueueTable';
import { CallDetailsSidebar } from '../../components/calls/CallDetailsSidebar';
import { QueueFiltersModal } from '../../components/campaigns/queue/QueueFiltersModal';
import { AddContactsModal } from '../../components/campaigns/queue/AddContactsModal';
import { useQueueDetails } from '../../hooks/campaigns/useQueueDetails';
import { useAddContactsToCampaign } from '../../hooks/campaigns/useAddContactsToCampaign';
import { useStartCampaign } from '../../hooks/campaigns/useStartCampaign';
import { useStopCampaign } from '../../hooks/campaigns/useStopCampaign';
import { GET_CALL_DETAILS } from '../../services/campaigns/queries/queueQueries';
import { Call } from '../../types/call';
import { cn } from '../../utils/cn';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import { QueueHeader } from './components/QueueHeader';
import { EmptyQueueState } from './components/EmptyQueueState';
import { Pagination } from '../../components/shared/Pagination';
import { deleteQueueItems } from '../../services/campaigns/mutations/deleteQueueItems';

interface QueueFilters {
  dateRange: {
    from: string;
    to: string;
  };
}

const ITEMS_PER_PAGE = 10;

const initialFilters: QueueFilters = {
  dateRange: {
    from: '',
    to: '',
  }
};

export function CampaignQueueDetails() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [filters, setFilters] = useState<QueueFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddContacts, setShowAddContacts] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const { user, authToken } = useAuth();

  const { 
    queueItems, 
    totalCount,
    startableCount,
    loading, 
    error, 
    refetch: fetchQueueDetails 
  } = useQueueDetails({
    campaignId: campaignId!,
    filters,
    page,
    limit: ITEMS_PER_PAGE
  });

  const { addContacts, loading: addingContacts } = useAddContactsToCampaign();
  const { startCampaign, loading: startingCampaign } = useStartCampaign();
  const { stopCampaign, loading: stoppingCampaign } = useStopCampaign();
  const [isDeleting, setIsDeleting] = useState(false);

  const hasPendingCalls = queueItems.some(item => item.status === 'Pending');
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    if (user?.id && campaignId) {
      fetchQueueDetails();
    }
  }, [user?.id, campaignId, fetchQueueDetails, page]);

  const fetchCallDetails = async (callId: string) => {
    if (!authToken) return;

    try {
      const client = createGraphQLClient(authToken);
      const data = await client.request(GET_CALL_DETAILS, { call_id: callId });
      setSelectedCall(data.vocallabs_calls_by_pk);
    } catch (e) {
      console.error('Error fetching call details:', e);
    }
  };

  const handleSelectCall = (callId: string) => {
    fetchCallDetails(callId);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchQueueDetails();
    setIsRefreshing(false);
  };

  const handleStartCampaign = async () => {
    if (!campaignId) return;
    
    const success = await startCampaign(campaignId);
    if (success) {
      handleRefresh();
    }
  };

  const handleStopCampaign = async () => {
    if (!campaignId) return;
    
    const success = await stopCampaign(campaignId);
    if (success) {
      handleRefresh();
    }
  };

  const handleApplyFilters = (newFilters: QueueFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleAddContacts = async (groupId: string) => {
    if (!campaignId) return;
    
    try {
      await addContacts(campaignId, groupId);
      showSuccessToast('Contacts added to campaign successfully');
      setShowAddContacts(false);
      fetchQueueDetails();
    } catch (err) {
      showErrorToast('Failed to add contacts to campaign');
    }
  };

  const handleDeleteMultiple = async (ids: string[]) => {
    if (!authToken || isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteQueueItems(ids, authToken);
      showSuccessToast('Items deleted successfully');
      await fetchQueueDetails();
    } catch (err) {
      showErrorToast('Failed to delete items');
    } finally {
      setIsDeleting(false);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    return count;
  };

  if (loading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className={cn(
      "space-y-6 transition-all duration-300",
      selectedCall ? 'md:mr-96' : ''
    )}>
      <QueueHeader
        onRefresh={handleRefresh}
        onShowFilters={() => setShowFilters(true)}
        onShowAddContacts={() => setShowAddContacts(true)}
        onStartCampaign={handleStartCampaign}
        onStopCampaign={handleStopCampaign}
        isRefreshing={isRefreshing}
        startingCampaign={startingCampaign}
        stoppingCampaign={stoppingCampaign}
        activeFiltersCount={getActiveFiltersCount()}
        startableCount={startableCount}
        hasPendingCalls={hasPendingCalls}
      />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {queueItems.length === 0 ? (
        <EmptyQueueState onAddContacts={() => setShowAddContacts(true)} />
      ) : (
        <>
          <QueueTable
            items={queueItems}
            onSelectCall={handleSelectCall}
            onDeleteMultiple={handleDeleteMultiple}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {selectedCall && (
        <CallDetailsSidebar
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      )}

      <QueueFiltersModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />

      <AddContactsModal
        isOpen={showAddContacts}
        onClose={() => setShowAddContacts(false)}
        onSubmit={handleAddContacts}
        loading={addingContacts}
      />
    </div>
  );
}
