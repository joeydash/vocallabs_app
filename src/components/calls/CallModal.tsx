import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Agent } from '../../types/agent';
import { Bot, Loader2, Phone, UserPlus } from 'lucide-react';
import { useCall } from '../../hooks/useCall';
import { ContactSearchInput } from './ContactSearchInput';
import { Contact } from '../../types/contact';
import { cn } from '../../utils/cn';
import { showInfoToast } from '../../utils/toast';
import { useAuth } from '../../services/auth';
import { ContactStatus } from './contact/ContactStatus';
import { useContactCheck } from '../../hooks/contacts/useContactCheck';
import { AgentSelect } from '../shared/AgentSelect';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgent?: Agent;
  agents?: Agent[];
  initialPhoneNumber?: string;
  onCallInitiated: (callId: string) => void;
  onContactNotFound: (phone: string) => void;
}

export function CallModal({ 
  isOpen, 
  onClose, 
  selectedAgent, 
  agents = [], 
  initialPhoneNumber = '',
  onCallInitiated,
  onContactNotFound
}: CallModalProps) {
  const [formData, setFormData] = useState({
    number: initialPhoneNumber,
    agentId: selectedAgent?.id || '',
  });
  const { makeCall, loading: callLoading, error: callError } = useCall();
  const { 
    contact,
    loading: contactCheckLoading,
    error: contactCheckError,
    checkContact 
  } = useContactCheck();

  React.useEffect(() => {
    setFormData(prev => ({
      number: initialPhoneNumber,
      agentId: selectedAgent?.id || prev.agentId,
    }));
  }, [selectedAgent, initialPhoneNumber, isOpen]);

  React.useEffect(() => {
    if (formData.number.length >= 10) {
      checkContact(formData.number);
    }
  }, [formData.number, checkContact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.number.trim() || !formData.agentId) return;

    try {
      // If contact doesn't exist, open create contact modal
      if (!contact && !contactCheckLoading) {
        onContactNotFound(formData.number.trim());
        return;
      }

      const callId = await makeCall({
        number: formData.number.trim(),
        agent_id: formData.agentId,
      });
      
      if (callId) {
        localStorage.setItem('vocallabs_last_called_number', formData.number.trim());
        showInfoToast('Call initiated! Check call history for updates.');
        onCallInitiated(callId);
      }
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setFormData(prev => ({
      ...prev,
      number: contact.phone
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Call"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {(callError || contactCheckError) && (
          <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-700 dark:text-red-200">
              {callError || contactCheckError}
            </p>
          </div>
        )}

        {!selectedAgent && agents.length > 0 && (
          <div>
            <label htmlFor="agent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Agent <span className="text-red-500">*</span>
            </label>
            <AgentSelect
              value={formData.agentId}
              onChange={(value) => setFormData(prev => ({ ...prev, agentId: value }))}
            />
          </div>
        )}

        {selectedAgent && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Selected Agent</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedAgent.name}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <ContactSearchInput
            value={formData.number}
            onChange={(value) => setFormData(prev => ({ ...prev, number: value }))}
            onSelectContact={handleSelectContact}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Format: 919182517283 (with country code)
          </p>

          {formData.number.length >= 10 && (
            <div className="flex items-center justify-between">
              <ContactStatus
                isExisting={contact !== null}
                loading={contactCheckLoading}
              />
              {!contact && !contactCheckLoading && (
                <button
                  type="button"
                  onClick={() => onContactNotFound(formData.number)}
                  className={cn(
                    "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md",
                    "text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300",
                    "border border-gray-300 dark:border-gray-600",
                    "hover:bg-gray-50 dark:hover:bg-gray-600",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                    "transition-colors duration-200"
                  )}
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Add Contact
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md",
              "text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300",
              "border border-gray-300 dark:border-gray-600",
              "hover:bg-gray-50 dark:hover:bg-gray-600",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            )}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={callLoading || contactCheckLoading || !formData.number.trim() || !formData.agentId}
            className={cn(
              "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md",
              "text-white bg-primary-600",
              "border border-transparent",
              "hover:bg-primary-700",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {callLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Initiating Call...
              </>
            ) : (
              <>
                <Phone className="w-4 h-4 mr-2" />
                Make Call
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
