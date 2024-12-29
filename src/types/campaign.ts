import { Agent } from './agent';

export interface Campaign {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  agent_id?: string;
  agent?: Agent;
  call_queues_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export interface QueueItem {
  id: string;
  phone: string;
  status: 'Done' | 'Pending' | 'Ongoing' | 'Paused';
  created_at: string;
  updated_at: string;
  call_id: string | null;
}
