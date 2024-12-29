export interface Call {
  id: string;
  plivo_call_id: string;
  recording_url: string | null;
  agent_id: string;
  agent: {
    name: string;
  };
  created_at: string;
  updated_at: string;
  phone_from: string;
  phone_to: string;
  call_status: string;
  details_from_call?: Record<string, any> | null;
  conversation?: Array<{
    role: string;
    content: string;
  }>;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  role: 'assistant' | 'user';
}

export interface CallData {
  id: string;
  key: string;
  value: string | number | boolean;
  created_at: string;
}
