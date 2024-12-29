import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { useCallStats } from '../../hooks/useCallStats';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export function CallStatsGraph() {
  const { dailyStats, loading, error } = useCallStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-red-500 dark:text-red-400 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        Calls Per Day (Last 30 Days)
      </h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3F51B5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3F51B5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(parseISO(date), 'MMM d')}
              stroke="#9CA3AF"
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFF',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
              }}
              labelFormatter={(date) => format(parseISO(date as string), 'MMM d, yyyy')}
            />
            <Area
              type="monotone"
              dataKey="calls"
              stroke="#3F51B5"
              fillOpacity={1}
              fill="url(#colorCalls)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
