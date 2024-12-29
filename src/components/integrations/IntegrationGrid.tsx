import React from 'react';
import { PlivoCard } from './plivo/PlivoCard';
import { TwilioCard } from './twilio/TwilioCard';
import { OtherIntegrationCard } from './OtherIntegrationCard';
import { MessageSquare, Calendar, Database, Workflow } from 'lucide-react';

interface IntegrationGridProps {
  onPlivoClick: () => void;
  onTwilioClick: () => void;
  onOtherClick: () => void;
}

const otherIntegrations = [
  {
    name: 'Slack',
    description: 'Get real-time notifications and updates in your Slack workspace',
    icon: MessageSquare,
  },
  {
    name: 'Google Calendar',
    description: 'Sync your calls and meetings with Google Calendar',
    icon: Calendar,
  },
  {
    name: 'Salesforce',
    description: 'Integrate with Salesforce CRM for enhanced lead management',
    icon: Database,
  },
  {
    name: 'N8N',
    description: 'Create automated workflows and integrate with other services',
    icon: Workflow,
  }
];

export function IntegrationGrid({ onPlivoClick, onTwilioClick, onOtherClick }: IntegrationGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <PlivoCard onClick={onPlivoClick} />
      <TwilioCard onClick={onTwilioClick} />
      {otherIntegrations.map((integration) => (
        <OtherIntegrationCard
          key={integration.name}
          name={integration.name}
          description={integration.description}
          icon={integration.icon}
          onClick={onOtherClick}
        />
      ))}
    </div>
  );
}
