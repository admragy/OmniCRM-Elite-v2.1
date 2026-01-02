
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
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

export interface Payment {
  id: string;
  amount: number;
  status: 'Paid' | 'Pending';
  date: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  value: number;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  expectedClose: string;
  probability: number;
  payments?: Payment[];
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
  KnowledgeBase: 'knowledge_base',
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
  knowledgeBase?: string; // نص يمثل معرفة الشركة (أسعار، سياسات، الخ)
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
