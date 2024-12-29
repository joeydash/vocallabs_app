import { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import { createGraphQLClient } from '../services/graphql/client';

const GET_DAILY_CALLS = `
  query GetDailyCalls($client_id: uuid!, $start_date: timestamptz!) {
    daily_calls: vocallabs_calls_aggregate(
      where: {
        agent: { client: { id: { _eq: $client_id } } },
        created_at: { _gte: $start_date }
      }
      order_by: { created_at: asc }
    ) {
      nodes {
        created_at
      }
    }
  }
`;

export interface DailyCallData {
  date: string;
  calls: number;
}

export function useCallStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyCallData[]>([]);
  const { user, authToken } = useAuth();

  useEffect(() => {
    const fetchCallStats = async () => {
      if (!user?.id || !authToken) return;

      try {
        setLoading(true);
        const client = createGraphQLClient(authToken);
        
        // Get date from 30 days ago
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const { daily_calls } = await client.request(GET_DAILY_CALLS, {
          client_id: user.id,
          start_date: startDate.toISOString(),
        });

        // Process the data to get daily counts
        const dailyCounts = new Map<string, number>();
        
        // Initialize all dates in the last 30 days with 0
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          dailyCounts.set(dateStr, 0);
        }

        // Count calls per day
        daily_calls.nodes.forEach((call: { created_at: string }) => {
          const date = call.created_at.split('T')[0];
          dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
        });

        // Convert to array and sort by date
        const stats = Array.from(dailyCounts.entries())
          .map(([date, calls]) => ({ date, calls }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setDailyStats(stats);
        setError(null);
      } catch (err) {
        setError('Failed to fetch call statistics');
        console.error('Error fetching call stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCallStats();
  }, [user?.id, authToken]);

  return { dailyStats, loading, error };
}
