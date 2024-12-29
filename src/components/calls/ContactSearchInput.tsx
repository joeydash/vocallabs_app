import React, { useState, useRef, useEffect } from 'react';
import { Phone, Search, Loader2, User } from 'lucide-react';
import { useContactSearch } from '../../hooks/contacts/useContactSearch';
import { Contact } from '../../types/contact';
import { cn } from '../../utils/cn';
import { formatPhoneNumber } from '../../utils/formatters';

interface ContactSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectContact: (contact: Contact) => void;
}

export function ContactSearchInput({ value, onChange, onSelectContact }: ContactSearchInputProps) {
  const [showResults, setShowResults] = useState(false);
  const { contacts, loading, searchContacts } = useContactSearch();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (newValue.trim()) {
      searchContacts(newValue);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSelectContact = (contact: Contact) => {
    onSelectContact(contact);
    setShowResults(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Phone className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          onFocus={() => value.trim() && setShowResults(true)}
          className={cn(
            "block w-full pl-10 py-2 sm:text-sm rounded-md",
            "border-gray-300 dark:border-gray-600",
            "focus:ring-primary-500 focus:border-primary-500",
            "dark:bg-gray-700 dark:text-white"
          )}
          placeholder="Search contacts or enter number"
        />
        <div className="absolute inset-y-0 right-3 flex items-center">
          {loading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
          {!loading && <Search className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
          {contacts.length > 0 ? (
            <ul className="max-h-60 overflow-auto py-1">
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <button
                    onClick={() => handleSelectContact(contact)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {contact.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatPhoneNumber(contact.phone)}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No contacts found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
