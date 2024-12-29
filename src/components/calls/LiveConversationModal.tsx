import React from 'react';
import { MessageSquare, FileJson, Loader2 } from 'lucide-react';
import { useLiveConversation } from '../../hooks/calls/useLiveConversation';
import { useCallConversation } from '../../hooks/calls/useCallConversation';
import { useLiveData } from '../../hooks/calls/useLiveData';
import { useCallData } from '../../hooks/calls/useCallData';
import { useCallStatus } from '../../hooks/calls/useCallStatus';
import { LiveConversationView } from './LiveConversationView';
import { DataDisplay } from './data/DataDisplay';
import { MobileLiveConversation } from './MobileLiveConversation';
import { ModalHeader } from '../shared/ModalHeader';
import { CallStatusIndicator } from './status/CallStatusIndicator';
import { cn } from '../../utils/cn';

interface LiveConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  callId: string;
  title?: string;
  disableLiveUpdates?: boolean;
}

export function LiveConversationModal({ 
  isOpen, 
  onClose, 
  callId,
  title = "Live Call",
  disableLiveUpdates = false
}: LiveConversationModalProps) {
  const liveConversation = useLiveConversation(callId, disableLiveUpdates);
  const staticConversation = useCallConversation(callId);
  const liveData = useLiveData(callId, disableLiveUpdates);
  const staticData = useCallData(callId);
  const { status } = useCallStatus(callId, disableLiveUpdates);

  const {
    messages,
    loading: messagesLoading,
    error: messagesError
  } = disableLiveUpdates ? staticConversation : liveConversation;

  const {
    data,
    loading: dataLoading,
    error: dataError
  } = disableLiveUpdates ? staticData : liveData;

  return (
    <div className={cn(
      "fixed inset-0 z-50 transition-opacity",
      !isOpen && "pointer-events-none opacity-0"
    )}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-2xl overflow-hidden">
        <ModalHeader
          title={title}
          icon={<MessageSquare className="h-5 w-5 text-primary-600 dark:text-primary-400" />}
          onClose={onClose}
          rightContent={
            status && <CallStatusIndicator status={status} />
          }
        />

        {/* Content */}
        <div className="h-full pt-16">
          {/* Desktop Layout */}
          <div className="hidden md:flex h-full">
            {/* Conversation Panel */}
            <div className="flex-1 border-r dark:border-gray-700">
              {messagesError ? (
                <div className="p-4">
                  <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4">
                    <p className="text-sm text-red-700 dark:text-red-200">{messagesError}</p>
                  </div>
                </div>
              ) : messagesLoading && messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                </div>
              ) : (
                <div className="h-full overflow-y-auto p-6">
                  <LiveConversationView 
                    messages={messages} 
                    loading={messagesLoading}
                    status={status}
                  />
                </div>
              )}
            </div>

            {/* Data Collection Panel */}
            <div className="w-96 flex flex-col">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <FileJson className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Data Collection
                  </h3>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                {dataError ? (
                  <div className="p-4">
                    <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4">
                      <p className="text-sm text-red-700 dark:text-red-200">{dataError}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto">
                    <DataDisplay data={data} loading={dataLoading} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden h-full">
            <MobileLiveConversation
              messages={messages}
              data={data}
              messagesLoading={messagesLoading}
              dataLoading={dataLoading}
              messagesError={messagesError}
              dataError={dataError}
              showDataPanel={true}
              status={status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
