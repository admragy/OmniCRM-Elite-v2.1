
export interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed';
  dueDate: string;
  aiSuggested?: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  status: 'Paid' | 'Pending';
  date: string;
}

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
    archetype?: 'Scrooge' | 'Hesitant' | 'VIP' | 'Urgent' | 'Researcher';
    sentimentScore: number;
    closingProbability?: number;
    recommendedTone?: string;
    hiddenObjections?: string[];
    closingScript?: string;
    personalityType?: string;
    happinessStatus?: string;
    lastTone?: string;
  };
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  value: number;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  adSpend: number;
  roas: number;
  expectedClose: string;
  probability: number;
  payments?: Payment[];
}

export interface BrandProfile {
  name: string;
  industry: string;
  tokens: number;
  rank: 'Commander' | 'Operator' | 'Guest';
  autoPilot: {
    enabled: boolean;
    targetRoas: number;
    budgetStep: number;
    maxDailySpend: number;
  };
  knowledgeBase: string;
  targetAudience?: string;
}

export interface CompetitorScan {
  id: string;
  name: string;
  url?: string;
  last_price?: number;
  offers?: any;
  threat_level?: string;
  lastScan: string;
}

export const NavigationTab = {
  Dashboard: 'dashboard',
  Contacts: 'contacts',
  Deals: 'deals',
  NeuroSales: 'neuro_sales',
  ShadowIntel: 'shadow_intel',
  WarRoom: 'war_room',
  MediaLab: 'media_lab',
  AgentFleet: 'agent_fleet',
  Marketing: 'marketing',
  GrowthLab: 'growth_lab',
  KnowledgeBase: 'knowledge_base',
  EdgeAI: 'edge_ai',
  Consultant: 'consultant',
  Admin: 'admin'
} as const;

export type NavigationTabType = typeof NavigationTab[keyof typeof NavigationTab];
