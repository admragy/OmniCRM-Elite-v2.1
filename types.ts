
export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'Lead' | 'Qualified' | 'Customer' | 'Churned';
  lastInteraction: string;
  value: number;
  avatar: string;
  location?: { lat: number; lng: number; city: string };
  psychology?: {
    personalityType: 'Analytical' | 'Expressive' | 'Amiable' | 'Driver';
    sentimentScore: number; // 0 to 100
    happinessStatus: 'Thrilled' | 'Satisfied' | 'Neutral' | 'Frustrated' | 'At Risk';
    lastTone: string;
  };
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  value: number;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  expectedClose: string;
  probability: number;
}

export interface AdCampaign {
  id: string;
  date: string;
  goal: string;
  content: string;
  locations: string;
  aiCopy: string;
  performanceNote?: string;
}

export interface ChatLog {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface BrandProfile {
  name: string;
  website: string;
  industry: string;
  description: string;
  targetAudience: string;
  userPsychology?: {
    stressLevel: number;
    focusArea: string;
    managementStyle: string;
  };
  aiMemory?: {
    adHistory: AdCampaign[];
    chatHistory: ChatLog[];
  };
}

export interface AICommandResult {
  action: 'add_contact' | 'add_deal' | 'search' | 'analyze' | 'none';
  data?: any;
  message: string;
}

export enum NavigationTab {
  Dashboard = 'dashboard',
  Contacts = 'contacts',
  Deals = 'deals',
  Marketing = 'marketing',
  AI_Consultant = 'ai_consultant',
  Settings = 'settings'
}
