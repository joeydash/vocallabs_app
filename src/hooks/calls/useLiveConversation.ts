import { useState, useEffect } from 'react';
import { createClient } from 'graphql-ws';
import { Message } from '../../types/call';
import { useAuth } from '../../services/auth';

const LIVE_CONVERSATION_SUBSCRIPTION = `
  subscription LiveConversationSubscription($call_id: uuid = "") {
    vocallabs_call_message(
      where: { call_id: { _eq: $call_id } }
      order_by: { created_at: asc }
    ) {
      id
      content
      created_at
      role
    }
  }
`;

export function useLiveConversation(callId: string, disableLiveUpdates: boolean = false) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();

  useEffect(() => {
    if (!callId || !authToken || disableLiveUpdates) {
      setLoading(false);
      return;
    }

    const client = createClient({
      url: 'wss://db.vocallabs.ai/v1/graphql',
      connectionParams: {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    });

    setLoading(true);
    setError(null);

    const unsubscribe = client.subscribe(
      {
        query: LIVE_CONVERSATION_SUBSCRIPTION,
        variables: { call_id: callId },
      },
      {
        next: (data: any) => {
          const newMessages = data.data.vocallabs_call_message.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            timestamp: msg.created_at,
            role: msg.role || 'assistant'
          }));
          setMessages(newMessages);
          setLoading(false);
        },
        error: (err) => {
          console.error('Subscription error:', err);
          setError('Failed to connect to live conversation');
          setLoading(false);
        },
        complete: () => {
          setLoading(false);
        },
      },
    );

    return () => {
      unsubscribe();
    };
  }, [callId, authToken, disableLiveUpdates]);

  return { messages, loading, error };
}
