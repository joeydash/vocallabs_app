import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentCallsList } from '../components/dashboard/RecentCallsList';
import { CallStatsGraph } from '../components/dashboard/CallStatsGraph';
import { Bot, PhoneCall, Users, FolderOpen, ArrowRight } from 'lucide-react';

export function Home() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4 mx-4 sm:mx-0">
        <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="Total Agents"
          value={stats.totalAgents}
          icon={Bot}
        />
        <StatCard
          title="Total Calls"
          value={stats.totalCalls}
          icon={PhoneCall}
        />
        <StatCard
          title="Total Groups"
          value={stats.totalGroups}
          icon={FolderOpen}
        />
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon={Users}
        />
      </div>

      <CallStatsGraph />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">Recent Calls</h3>
          <Link 
            to="/analytics/call-history"
            className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            See all
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <RecentCallsList calls={stats.recentCalls} />
      </div>
    </div>
  );
}
