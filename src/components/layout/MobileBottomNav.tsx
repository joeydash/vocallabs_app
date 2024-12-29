import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Bot, Users, Phone, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: Bot, label: 'Agents', to: '/agents/list' },
  { icon: Users, label: 'Contacts', to: '/contacts/groups' },
  { icon: Phone, label: 'Calls', to: '/analytics/call-history' },
  { icon: Settings, label: 'Settings', to: '/settings/general' },
];

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center w-full h-full",
              "text-xs font-medium transition-colors",
              isActive
                ? "text-primary-600 dark:text-primary-400"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
