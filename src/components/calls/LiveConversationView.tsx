import React, { useEffect, useRef } from 'react';
import { Message } from '../../types/call';
import { ConversationMessage } from './conversation/ConversationMessage';
import { EmptyConversation } from './conversation/EmptyConversation';
import { LoadingConversation } from './conversation/LoadingConversation';
import { ChatLoadingAnimation } from './conversation/ChatLoadingAnimation';

interface LiveConversationViewProps {
  messages: Message[];
  loading?: boolean;
  status?: string;
}

export function LiveConversationView({ messages, loading, status }: LiveConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading && messages.length === 0) {
    return <LoadingConversation />;
  }

  if (!loading && messages.length === 0) {
    return <EmptyConversation />;
  }

  const showLoadingAnimation = status && ['pending', 'in-progress'].includes(status.toLowerCase());

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <ConversationMessage key={index} message={message} />
      ))}
      
      {showLoadingAnimation && <ChatLoadingAnimation />}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
