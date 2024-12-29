import { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import { createGraphQLClient } from '../services/graphql/client';
import { GET_DASHBOARD_STATS } from '../services/graphql/queries';

interface DashboardStats {
  totalAgents: number;
  totalCalls: number;
  totalGroups: number;
  totalContacts: number;
  recentCalls: Array<{
    id: string;
    agent: {
      name: string;
    };
    created_at: string;
    phone_to: string;
  }>;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, authToken } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id || !authToken) return;

      try {
        setLoading(true);
        const client = createGraphQLClient(authToken);
        const data = await client.request(GET_DASHBOARD_STATS, {
          client_id: user.id,
        });

        setStats({
          totalAgents: data.total_agents.aggregate.count,
          totalCalls: data.total_calls.aggregate.count,
          totalGroups: data.total_groups.aggregate.count,
          totalContacts: data.total_contacts.aggregate.count,
          recentCalls: data.recent_calls,
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [user?.id, authToken]);

  return { stats, loading, error };
}
