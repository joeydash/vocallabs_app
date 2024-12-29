import React, { useState, useEffect } from 'react';
import { Modal } from '../../shared/Modal';
import { Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../../../services/auth';
import { createGraphQLClient } from '../../../services/graphql/client';
import { GET_TWILIO_CREDENTIALS, ADD_TWILIO_CREDENTIAL, UPDATE_TWILIO_CREDENTIAL, DELETE_TWILIO_CREDENTIAL } from '../../../services/integrations/queries/twilioQueries';
import { TwilioCredential, TwilioCredentialInput } from '../../../services/integrations/types/twilioTypes';
import { TwilioCredentialList } from './TwilioCredentialList';
import { TwilioCredentialForm } from './TwilioCredentialForm';
import { cn } from '../../../utils/cn';
import { showSuccessToast, showErrorToast } from '../../../utils/toast';

interface TwilioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onManagePhoneNumbers: (tokenId: string) => void;
}

export function TwilioModal({ isOpen, onClose, onManagePhoneNumbers }: TwilioModalProps) {
  const [credentials, setCredentials] = useState<TwilioCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCredential, setEditingCredential] = useState<TwilioCredential | null>(null);
  const [saving, setSaving] = useState(false);
  const { user, authToken } = useAuth();

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchCredentials();
    }
  }, [isOpen, user?.id]);

  const fetchCredentials = async () => {
    if (!user?.id || !authToken) return;

    try {
      setLoading(true);
      const client = createGraphQLClient(authToken);
      const data = await client.request(GET_TWILIO_CREDENTIALS, {
        client_id: user.id
      });
      setCredentials(data.vocallabs_client_tokens);
    } catch (err) {
      showErrorToast('Failed to fetch Twilio credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: TwilioCredentialInput) => {
    if (!user?.id || !authToken) return;

    try {
      setSaving(true);
      const client = createGraphQLClient(authToken);
      await client.request(ADD_TWILIO_CREDENTIAL, {
        client_id: user.id,
        name: data.name,
        token: {
          auth_id: data.auth_id,
          auth_token: data.auth_token
        }
      });
      await fetchCredentials();
      setShowForm(false);
      showSuccessToast('Twilio credential added successfully');
    } catch (err) {
      showErrorToast('Failed to add Twilio credential');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data: TwilioCredentialInput) => {
    if (!editingCredential?.id || !authToken) return;

    try {
      setSaving(true);
      const client = createGraphQLClient(authToken);
      await client.request(UPDATE_TWILIO_CREDENTIAL, {
        id: editingCredential.id,
        name: data.name,
        token: {
          auth_id: data.auth_id,
          auth_token: data.auth_token
        }
      });
      await fetchCredentials();
      setEditingCredential(null);
      showSuccessToast('Twilio credential updated successfully');
    } catch (err) {
      showErrorToast('Failed to update Twilio credential');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!authToken) return;

    if (!confirm('Are you sure you want to delete this credential?')) {
      return;
    }

    try {
      const client = createGraphQLClient(authToken);
      await client.request(DELETE_TWILIO_CREDENTIAL, { id });
      await fetchCredentials();
      showSuccessToast('Twilio credential deleted successfully');
    } catch (err) {
      showErrorToast('Failed to delete Twilio credential');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Twilio Integration">
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : showForm || editingCredential ? (
          <TwilioCredentialForm
            initialData={editingCredential ? {
              name: editingCredential.name,
              auth_id: editingCredential.token.auth_id,
              auth_token: editingCredential.token.auth_token
            } : undefined}
            onSubmit={editingCredential ? handleUpdate : handleAdd}
            onCancel={() => {
              setShowForm(false);
              setEditingCredential(null);
            }}
            loading={saving}
          />
        ) : (
          <>
            <div className="flex justify-end">
              <button
                onClick={() => setShowForm(true)}
                className={cn(
                  "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  "text-white bg-primary-600",
                  "hover:bg-primary-700",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                )}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Credential
              </button>
            </div>

            <TwilioCredentialList
              credentials={credentials}
              onEdit={setEditingCredential}
              onDelete={handleDelete}
              onManagePhones={onManagePhoneNumbers}
            />
          </>
        )}
      </div>
    </Modal>
  );
}
