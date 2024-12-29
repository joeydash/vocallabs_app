import React from 'react';
import { Link } from 'react-router-dom';
import { MegaphoneIcon, Edit2, Trash2, Clock } from 'lucide-react';
import { Campaign } from '../../types/campaign';
import { formatDate } from '../../utils/formatters';
import { OptionsDropdown } from '../shared/OptionsDropdown';
import { cn } from '../../utils/cn';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (id: string) => void;
}

export function CampaignCard({ campaign, onEdit, onDelete }: CampaignCardProps) {
  const options = [
    ...(onEdit ? [{
      label: 'Rename Campaign',
      icon: Edit2,
      onClick: () => onEdit(campaign),
    }] : []),
    ...(onDelete ? [{
      label: 'Delete Campaign',
      icon: Trash2,
      onClick: () => {
        if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
          onDelete(campaign.id);
        }
      },
      variant: 'danger' as const,
    }] : []),
  ];

  const pendingCount = campaign.call_queues_aggregate.aggregate.count;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on the options menu
    if ((e.target as HTMLElement).closest('.options-menu')) {
      e.preventDefault();
    }
  };

  return (
    <Link 
      to={`/campaign/${campaign.id}/queue`}
      className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-visible group"
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
              <MegaphoneIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {campaign.name}
              </h3>
              {pendingCount > 0 && (
                <div className="flex items-center mt-1">
                  <div className={cn(
                    "flex items-center px-2.5 py-1 rounded-full text-sm font-medium",
                    "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                    "border border-amber-200 dark:border-amber-800",
                    "group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors"
                  )}>
                    <Clock className="w-3.5 h-3.5 mr-1 animate-pulse" />
                    <span>{pendingCount} pending</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="options-menu" onClick={e => e.preventDefault()}>
            <OptionsDropdown options={options} />
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Created {formatDate(campaign.created_at)}</span>
            <span>Updated {formatDate(campaign.updated_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
