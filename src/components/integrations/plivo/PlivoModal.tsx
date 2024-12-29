import React, { useState, useEffect } from 'react';
import { Modal } from '../../shared/Modal';
import { Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../../../services/auth';
import { createGraphQLClient } from '../../../services/graphql/client';
import { GET_PLIVO_CREDENTIALS, ADD_PLIVO_CREDENTIAL, UPDATE_PLIVO_CREDENTIAL, DELETE_PLIVO_CREDENTIAL } from '../../../services/integrations/queries/plivoQueries';
import { PlivoCredential, PlivoCredentialInput } from '../../../services/integrations/types/plivoTypes';
import { PlivoCredentialList } from './PlivoCredentialList';
import { PlivoCredentialForm } from './PlivoCredentialForm';
import { cn } from '../../../utils/cn';
import { showSuccessToast, showErrorToast } from '../../../utils/toast';

interface PlivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onManagePhoneNumbers: (tokenId: string) => void;
}

export function PlivoModal({ isOpen, onClose, onManagePhoneNumbers }: PlivoModalProps) {
  const [credentials, setCredentials] = useState<PlivoCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCredential, setEditingCredential] = useState<PlivoCredential | null>(null);
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
      const data = await client.request(GET_PLIVO_CREDENTIALS, {
        client_id: user.id
      });
      setCredentials(data.vocallabs_client_tokens);
    } catch (err) {
      showErrorToast('Failed to fetch Plivo credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: PlivoCredentialInput) => {
    if (!user?.id || !authToken) return;

    try {
      setSaving(true);
      const client = createGraphQLClient(authToken);
      await client.request(ADD_PLIVO_CREDENTIAL, {
        client_id: user.id,
        name: data.name,
        token: {
          auth_id: data.auth_id,
          auth_token: data.auth_token
        }
      });
      await fetchCredentials();
      setShowForm(false);
      showSuccessToast('Plivo credential added successfully');
    } catch (err) {
      showErrorToast('Failed to add Plivo credential');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data: PlivoCredentialInput) => {
    if (!editingCredential?.id || !authToken) return;

    try {
      setSaving(true);
      const client = createGraphQLClient(authToken);
      await client.request(UPDATE_PLIVO_CREDENTIAL, {
        id: editingCredential.id,
        name: data.name,
        token: {
          auth_id: data.auth_id,
          auth_token: data.auth_token
        }
      });
      await fetchCredentials();
      setEditingCredential(null);
      showSuccessToast('Plivo credential updated successfully');
    } catch (err) {
      showErrorToast('Failed to update Plivo credential');
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
      await client.request(DELETE_PLIVO_CREDENTIAL, { id });
      await fetchCredentials();
      showSuccessToast('Plivo credential deleted successfully');
    } catch (err) {
      showErrorToast('Failed to delete Plivo credential');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Plivo Integration">
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : showForm || editingCredential ? (
          <PlivoCredentialForm
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

            <PlivoCredentialList
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
