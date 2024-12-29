import { HomeIcon, ChartBarIcon, Cog6ToothIcon, MegaphoneIcon, InboxIcon } from '@heroicons/react/24/outline';
import { Bot, Users } from 'lucide-react';

export const navigation = [
  { name: 'Home', to: '/', icon: HomeIcon },
  {
    name: 'Agents',
    to: '/agents',
    icon: Bot,
    submenu: [
      { name: 'Agent List', to: '/agents/list' },
      { name: 'Agent Templates', to: '/agents/templates' },
    ],
  },
  {
    name: 'Contacts',
    to: '/contacts',
    icon: Users,
    submenu: [
      { name: 'All Groups', to: '/contacts/groups' },
      { name: 'All Contacts', to: '/contacts/all' },
    ],
  },
  {
    name: 'Campaign',
    to: '/campaign',
    icon: MegaphoneIcon,
    submenu: [
      { name: 'Campaign List', to: '/campaign/list' },
      { name: 'Call Queue', to: '/campaign/queue' }, // Updated name
    ],
  },
  {
    name: 'Inbox',
    to: '/inbox',
    icon: InboxIcon,
  },
  {
    name: 'Analytics',
    to: '/analytics',
    icon: ChartBarIcon,
    submenu: [
      { name: 'Call History', to: '/analytics/call-history' },
      { name: 'Call Data', to: '/analytics/call-data' },
    ],
  },
  {
    name: 'Settings',
    to: '/settings',
    icon: Cog6ToothIcon,
    submenu: [
      { name: 'General', to: '/settings/general' },
      { name: 'Integrations', to: '/settings/integrations' },
    ],
  },
];
