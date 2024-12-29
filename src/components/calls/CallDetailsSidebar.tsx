import React, { useState } from 'react';
import { X, Phone, Calendar, Clock, Bot, Play, MessageSquare } from 'lucide-react';
import { Call } from '../../types/call';
import { formatDate, formatTime, formatPhoneNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { LiveConversationModal } from './LiveConversationModal';
import { AudioModal } from '../audio/AudioModal';

interface CallDetailsSidebarProps {
  call: Call | null;
  onClose: () => void;
}

export function CallDetailsSidebar({ call, onClose }: CallDetailsSidebarProps) {
  const [showConversation, setShowConversation] = useState(false);
  const [showLiveConversation, setShowLiveConversation] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);

  if (!call) return null;

  const statusColors = {
    done: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  };

  const isLiveConversationAvailable = ['pending', 'in-progress'].includes(call.call_status);
  const canPlayRecording = !isLiveConversationAvailable && call.recording_url;

  const renderSection = (title: string, content: React.ReactNode) => (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        {content}
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      <div className={cn(
        "fixed inset-y-0 right-0 z-[49]", // Lower than navbar (z-50)
        "w-full md:w-96 max-w-full",
        "bg-gray-50 dark:bg-gray-900",
        "border-l border-gray-200 dark:border-gray-700",
        "transform transition-transform duration-300 ease-in-out",
        "flex flex-col h-[calc(100vh-4rem)]", // Subtract navbar height
        "mt-16" // Add top margin equal to navbar height
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Call Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Status and ID Section */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-3">
                <span className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                  statusColors[call.call_status as keyof typeof statusColors] || statusColors.default
                )}>
                  {call.call_status.charAt(0).toUpperCase() + call.call_status.slice(1)}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                ID: {call.id}
              </div>
            </div>

            {/* Actions */}
            {(canPlayRecording || isLiveConversationAvailable) && renderSection("Available Actions",
              <div className="flex flex-wrap gap-2">
                {canPlayRecording && (
                  <button
                    onClick={() => setShowAudioModal(true)}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                      "text-primary-600 dark:text-primary-400",
                      "bg-primary-50 dark:bg-primary-900/30",
                      "hover:bg-primary-100 dark:hover:bg-primary-900/50"
                    )}
                  >
                    <Play className="w-4 h-4" />
                    <span>Play Recording</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (isLiveConversationAvailable) {
                      setShowLiveConversation(true);
                    } else {
                      setShowConversation(true);
                    }
                  }}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    "text-primary-600 dark:text-primary-400",
                    "bg-primary-50 dark:bg-primary-900/30",
                    "hover:bg-primary-100 dark:hover:bg-primary-900/50"
                  )}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isLiveConversationAvailable ? 'View Live Conversation' : 'View Conversation'}</span>
                </button>
              </div>
            )}

            {/* Agent Information */}
            {renderSection("Agent Information",
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">{call.agent.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">Plivo ID: {call.plivo_call_id}</div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {renderSection("Contact Information",
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm text-gray-500 dark:text-gray-400">From</div>
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {formatPhoneNumber(call.phone_from)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm text-gray-500 dark:text-gray-400">To</div>
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {formatPhoneNumber(call.phone_to)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamp Information */}
            {renderSection("Time Information",
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Date</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDate(call.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Time</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatTime(call.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <LiveConversationModal
        isOpen={showConversation || showLiveConversation}
        onClose={() => {
          setShowConversation(false);
          setShowLiveConversation(false);
        }}
        callId={call.id}
        title={isLiveConversationAvailable ? "Live Call" : "Call Conversation"}
        disableLiveUpdates={!isLiveConversationAvailable}
      />

      {call.recording_url && (
        <AudioModal
          isOpen={showAudioModal}
          onClose={() => setShowAudioModal(false)}
          url={call.recording_url}
          title="Call Recording"
        />
      )}
    </>
  );
}
