export interface Agent {
  id: string;
  name: string;
  purpose: string;
  welcomeMessage?: string;
  agentPrompt?: string;
  analyticsPrompt?: string;
  inputsNeeded?: string;
  language: string;
  call_token_id?: string;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
];
