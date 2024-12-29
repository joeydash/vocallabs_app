import React from 'react';
import { MessageSquare, FileJson, Loader2 } from 'lucide-react';
import { LiveConversationView } from './LiveConversationView';
import { LiveDataView } from './LiveDataView';
import { cn } from '../../utils/cn';
import { Message, CallData } from '../../types/call';

interface MobileLiveConversationProps {
  messages: Message[];
  data: CallData[];
  messagesLoading: boolean;
  dataLoading: boolean;
  messagesError: string | null;
  dataError: string | null;
  showDataPanel: boolean;
  status?: string;
}

export function MobileLiveConversation({
  messages,
  data,
  messagesLoading,
  dataLoading,
  messagesError,
  dataError,
  showDataPanel,
  status
}: MobileLiveConversationProps) {
  const [activeTab, setActiveTab] = React.useState<'conversation' | 'data'>('conversation');

  const tabs = [
    {
      id: 'conversation',
      label: 'Conversation',
      icon: MessageSquare,
      content: <LiveConversationView messages={messages} loading={messagesLoading} status={status} />,
      error: messagesError,
      loading: messagesLoading && messages.length === 0
    },
    ...(showDataPanel ? [{
      id: 'data',
      label: 'Data Collection',
      icon: FileJson,
      content: <LiveDataView data={data} />,
      error: dataError,
      loading: dataLoading && data.length === 0
    }] : [])
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="flex flex-col h-full">
      {showDataPanel && (
        <div className="flex space-x-1 border-b dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'conversation' | 'data')}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200",
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 dark:text-gray-400"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {activeTabData?.error ? (
        <div className="p-4">
          <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-700 dark:text-red-200">{activeTabData.error}</p>
          </div>
        </div>
      ) : activeTabData?.loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {activeTabData?.content}
        </div>
      )}
    </div>
  );
}
