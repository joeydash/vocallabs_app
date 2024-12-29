import React, { useState, useRef, useEffect } from 'react';
import { FolderOpen, Search, Loader2 } from 'lucide-react';
import { useContactGroups } from '../../../hooks/contacts/useContactGroups';
import { ContactGroup } from '../../../types/contact';
import { cn } from '../../../utils/cn';

interface GroupSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectGroup: (group: ContactGroup) => void;
  defaultGroupId?: string;
}

export function GroupSearchInput({ value, onChange, onSelectGroup, defaultGroupId }: GroupSearchInputProps) {
  const [showResults, setShowResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { groups, loading } = useContactGroups();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (defaultGroupId) {
      const defaultGroup = groups.find(g => g.id === defaultGroupId);
      if (defaultGroup) {
        onSelectGroup(defaultGroup);
      }
    }
  }, [defaultGroupId, groups, onSelectGroup]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (newValue.trim()) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSelectGroup = (group: ContactGroup) => {
    onSelectGroup(group);
    setShowResults(false);
    setSearchTerm('');
  };

  const selectedGroup = groups.find(g => g.id === value);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FolderOpen className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setShowResults(true)}
          className={cn(
            "block w-full pl-10 py-2 sm:text-sm rounded-md",
            "border-gray-300 dark:border-gray-600",
            "focus:ring-primary-500 focus:border-primary-500",
            "dark:bg-gray-700 dark:text-white"
          )}
          placeholder={selectedGroup ? selectedGroup.name : "Search groups..."}
        />
        <div className="absolute inset-y-0 right-3 flex items-center">
          {loading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
          {!loading && <Search className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
          {filteredGroups.length > 0 ? (
            <ul className="max-h-60 overflow-auto py-1">
              {filteredGroups.map((group) => (
                <li key={group.id}>
                  <button
                    onClick={() => handleSelectGroup(group)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <FolderOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {group.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {group.prospectsByProspectGroupId_aggregate.aggregate.count} contacts
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No groups found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
