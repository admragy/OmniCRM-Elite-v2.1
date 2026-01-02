
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
    sentimentScore: number;
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

export interface Task {
  id: string;
  dealId?: string;
  contactId?: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed';
  dueDate: string;
  aiSuggested?: boolean;
}

export const NavigationTab = {
  Dashboard: 'dashboard',
  Contacts: 'contacts',
  Deals: 'deals',
  Tasks: 'tasks',
  Marketing: 'marketing',
  GrowthLab: 'growth_lab',
  BehaviorExpert: 'behavior_expert',
  MediaLab: 'media_lab',
  EdgeAI: 'edge_ai',
  Intelligence: 'intelligence',
  AI_Consultant: 'ai_consultant',
  WarRoom: 'war_room',
  AgentFleet: 'agent_fleet',
  AdminPortal: 'admin_portal',
  Settings: 'settings'
} as const;

export type NavigationTabType = typeof NavigationTab[keyof typeof NavigationTab];

export interface BrandProfile {
  name: string;
  website: string;
  industry: string;
  description: string;
  targetAudience: string;
  tokens: number;
  rank: 'Commander' | 'Operator' | 'Guest';
  userPsychology?: {
    stressLevel: number;
    focusArea: string;
    managementStyle: string;
  };
  aiMemory?: {
    adHistory: any[];
    chatHistory: any[];
  };
}

export interface ChatLog {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
