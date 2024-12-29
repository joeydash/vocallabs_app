import { useState, useEffect } from 'react';
import { createGraphQLClient } from '../../services/graphql/client';
import { Message } from '../../types/call';
import { useAuth } from '../../services/auth';

const GET_CALL_CONVERSATION = `
  query GetCallConversation($call_id: uuid!) {
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

export function useCallConversation(callId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchConversation = async () => {
      if (!callId || !authToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const client = createGraphQLClient(authToken); // Create client with auth token
        const { vocallabs_call_message } = await client.request(GET_CALL_CONVERSATION, {
          call_id: callId,
        });

        const formattedMessages = vocallabs_call_message.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          timestamp: msg.created_at,
          role: msg.role || 'assistant'
        }));

        setMessages(formattedMessages);
        setError(null);
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError('Failed to fetch conversation');
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [callId, authToken]);

  return { messages, loading, error };
}
