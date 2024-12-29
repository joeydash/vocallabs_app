import React, { createContext, useContext, useState, useCallback } from 'react';
import { Agent } from '../../types/agent';
import { CallModal } from '../calls/CallModal';
import { LiveConversationModal } from '../calls/LiveConversationModal';
import { CreateContactModal } from '../contacts/CreateContactModal';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

const CREATE_CONTACT = `
  mutation CreateContact($input: vocallabs_prospects_insert_input!) {
    insert_vocallabs_prospects_one(
      object: $input,
      on_conflict: {
        constraint: prospects_client_id_prospect_group_id_phone_key,
        update_columns: [name]
      }
    ) {
      id
      name
      phone
      prospect_group {
        id
        name
      }
    }
  }
`;

interface CallModalContextType {
  openCallModal: (options: { agent?: Agent; agents?: Agent[]; initialPhoneNumber?: string }) => void;
  closeCallModal: () => void;
}

const CallModalContext = createContext<CallModalContextType | undefined>(undefined);

export function CallModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLiveCall, setShowLiveCall] = useState(false);
  const [showCreateContact, setShowCreateContact] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [modalProps, setModalProps] = useState<{
    selectedAgent?: Agent;
    agents?: Agent[];
    initialPhoneNumber?: string;
  }>({});
  const { user, authToken } = useAuth();

  const openCallModal = useCallback((options: {
    agent?: Agent;
    agents?: Agent[];
    initialPhoneNumber?: string;
  }) => {
    setModalProps({
      selectedAgent: options.agent,
      agents: options.agents,
      initialPhoneNumber: options.initialPhoneNumber
    });
    setIsOpen(true);
  }, []);

  const closeCallModal = useCallback(() => {
    setIsOpen(false);
    setModalProps({});
  }, []);

  const handleCallInitiated = useCallback((newCallId: string) => {
    setCallId(newCallId);
    setShowLiveCall(true);
    closeCallModal();
  }, [closeCallModal]);

  const handleCreateContact = async (data: { name: string; phone: string; groupId?: string }) => {
    if (!user?.id || !authToken) {
      showErrorToast('Authentication required');
      return;
    }

    if (!data.groupId) {
      showErrorToast('Please select a contact group');
      return;
    }

    try {
      const client = createGraphQLClient(authToken);
      await client.request(CREATE_CONTACT, {
        input: {
          name: data.name,
          phone: data.phone,
          client_id: user.id,
          prospect_group_id: data.groupId
        }
      });

      showSuccessToast('Contact created successfully');
      setShowCreateContact(false);
      setIsOpen(true); // Reopen call modal
    } catch (err) {
      console.error('Failed to create contact:', err);
      showErrorToast('Failed to create contact');
    }
  };

  return (
    <CallModalContext.Provider value={{ openCallModal, closeCallModal }}>
      {children}
      <CallModal
        isOpen={isOpen}
        onClose={closeCallModal}
        selectedAgent={modalProps.selectedAgent}
        agents={modalProps.agents}
        initialPhoneNumber={modalProps.initialPhoneNumber}
        onCallInitiated={handleCallInitiated}
        onContactNotFound={(phone: string) => {
          setIsOpen(false);
          setShowCreateContact(true);
          setModalProps(prev => ({ ...prev, initialPhoneNumber: phone }));
        }}
      />
      {callId && (
        <LiveConversationModal
          isOpen={showLiveCall}
          onClose={() => setShowLiveCall(false)}
          callId={callId}
          title="Live Call"
        />
      )}
      <CreateContactModal
        isOpen={showCreateContact}
        onClose={() => {
          setShowCreateContact(false);
          setIsOpen(true);
        }}
        onSubmit={handleCreateContact}
        initialPhone={modalProps.initialPhoneNumber}
        requireGroup={true}
      />
    </CallModalContext.Provider>
  );
}

export const useCallModal = () => {
  const context = useContext(CallModalContext);
  if (!context) {
    throw new Error('useCallModal must be used within a CallModalProvider');
  }
  return context;
};
