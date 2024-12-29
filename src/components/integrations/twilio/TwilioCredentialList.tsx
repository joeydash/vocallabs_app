import React from 'react';
import { Edit2, Trash2, Eye, EyeOff, Phone } from 'lucide-react';
import { TwilioCredential } from '../../../services/integrations/types/twilioTypes';
import { cn } from '../../../utils/cn';

interface TwilioCredentialListProps {
  credentials: TwilioCredential[];
  onEdit: (credential: TwilioCredential) => void;
  onDelete: (id: string) => void;
  onManagePhones: (id: string) => void;
}

export function TwilioCredentialList({ 
  credentials, 
  onEdit, 
  onDelete,
  onManagePhones 
}: TwilioCredentialListProps) {
  const [showTokens, setShowTokens] = React.useState<Record<string, boolean>>({});

  const toggleTokenVisibility = (id: string) => {
    setShowTokens(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (credentials.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        No credentials found. Add your first Twilio credential to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {credentials.map((credential) => (
        <div
          key={credential.id}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {credential.name}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onManagePhones(credential.id)}
                className={cn(
                  "p-1 rounded-lg transition-colors",
                  "text-primary-600 hover:bg-primary-50",
                  "dark:text-primary-400 dark:hover:bg-primary-900/30"
                )}
                title="Manage phone numbers"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEdit(credential)}
                className={cn(
                  "p-1 rounded-lg transition-colors",
                  "text-primary-600 hover:bg-primary-50",
                  "dark:text-primary-400 dark:hover:bg-primary-900/30"
                )}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(credential.id)}
                className={cn(
                  "p-1 rounded-lg transition-colors",
                  "text-red-600 hover:bg-red-50",
                  "dark:text-red-400 dark:hover:bg-red-900/30"
                )}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Account SID:
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  {showTokens[credential.id] 
                    ? credential.token.auth_id
                    : '••••••••••••'}
                </span>
                <button
                  onClick={() => toggleTokenVisibility(credential.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showTokens[credential.id] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
