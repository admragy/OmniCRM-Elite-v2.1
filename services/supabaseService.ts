
import { createClient } from '@supabase/supabase-js';
import { Contact, Deal, BrandProfile, Task } from '../types';

// Safe environment variable fetcher
const safeGetEnv = (key: string): string => {
  try {
    // Priority: window.process.env -> globalThis.process.env -> fallback
    const val = (window as any).process?.env?.[key] || (globalThis as any).process?.env?.[key];
    return typeof val === 'string' ? val : '';
  } catch (e) {
    console.warn(`Environment access error for ${key}:`, e);
    return '';
  }
};

const SUPABASE_URL = safeGetEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = safeGetEnv('SUPABASE_ANON_KEY');

export const isSupabaseConfigured = 
  SUPABASE_URL.startsWith('http') && 
  SUPABASE_ANON_KEY.length > 20;

// Initialize Supabase client lazily or handle null
let supabaseInstance: any = null;
try {
  if (isSupabaseConfigured) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.error("Failed to initialize Supabase client:", err);
}

export const supabase = supabaseInstance;

const DEMO_CONTACTS: Contact[] = [
  { 
    id: 'demo-1', 
    name: 'Strategic Partner Alpha', 
    company: 'Future Systems Inc', 
    email: 'alpha@future.ai', 
    status: 'Customer', 
    lastInteraction: new Date().toISOString(), 
    value: 75000, 
    avatar: 'https://ui-avatars.com/api/?name=Partner+Alpha&background=6366f1&color=fff',
    psychology: { personalityType: 'Driver', sentimentScore: 95, happinessStatus: 'Thrilled', lastTone: 'Vibrant' } 
  }
];

export const getContacts = async (): Promise<Contact[]> => {
  if (!supabase) return DEMO_CONTACTS;
  try {
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data && data.length > 0 ? data : DEMO_CONTACTS;
  } catch (err) { 
    console.error("Supabase error (contacts):", err);
    return DEMO_CONTACTS; 
  }
};

export const getDeals = async (): Promise<Deal[]> => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('deals').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) { 
    console.error("Supabase error (deals):", err);
    return []; 
  }
};

export const getTasks = async (): Promise<Task[]> => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) { 
    console.error("Supabase error (tasks):", err);
    return []; 
  }
};

export const saveTask = async (task: Partial<Task>) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('tasks').upsert(task).select();
    if (error) throw error;
    return data?.[0];
  } catch (err) { return null; }
};

export const deleteTask = async (id: string) => {
  if (!supabase) return;
  try {
    await supabase.from('tasks').delete().eq('id', id);
  } catch (e) {}
};

export const getBrandProfile = async (): Promise<BrandProfile | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('brand_profile').select('*').limit(1).single();
    if (error) return null;
    return data;
  } catch (err) { return null; }
};

export const updateBrandProfile = async (profile: Partial<BrandProfile>) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('brand_profile').upsert({ id: 1, ...profile }).select();
    if (error) throw error;
    return data?.[0];
  } catch (err) { return null; }
};
