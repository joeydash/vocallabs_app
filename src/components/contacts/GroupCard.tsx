import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { ContactGroup } from '../../types/contact';
import { OptionsDropdown } from '../shared/OptionsDropdown';

interface GroupCardProps {
  group: ContactGroup;
  onEdit?: (group: ContactGroup) => void;
  onDelete?: (id: string) => void;
}

export function GroupCard({ group, onEdit, onDelete }: GroupCardProps) {
  const options = [
    ...(onEdit ? [{
      label: 'Edit',
      icon: Edit2,
      onClick: () => onEdit(group),
    }] : []),
    ...(onDelete ? [{
      label: 'Delete',
      icon: Trash2,
      onClick: () => onDelete(group.id),
      variant: 'danger' as const,
    }] : []),
  ];

  return (
    <div className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-visible">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Link to={`/contacts/groups/${group.id}`} className="flex items-center space-x-4 flex-1">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {group.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {group.prospectsByProspectGroupId_aggregate.aggregate.count} contacts
              </p>
            </div>
          </Link>
          <div className="flex items-center space-x-2">
            {(onEdit || onDelete) && <OptionsDropdown options={options} />}
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Created {formatDate(group.created_at)}</span>
            <span>Updated {formatDate(group.updated_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
