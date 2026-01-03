
import { createClient } from '@supabase/supabase-js';
import { Contact, Deal, BrandProfile, Task, CompetitorScan } from '../types';

const getSupabaseConfig = () => {
  try {
    const url = localStorage.getItem('OMNI_SUPABASE_URL') || (typeof process !== 'undefined' && process.env.SUPABASE_URL) || '';
    const key = localStorage.getItem('OMNI_SUPABASE_KEY') || (typeof process !== 'undefined' && process.env.SUPABASE_ANON_KEY) || '';
    return { url, key };
  } catch {
    return { url: '', key: '' };
  }
};

const config = getSupabaseConfig();
export const isSupabaseConfigured = config.url.startsWith('http') && config.key.length > 20;

let supabaseInstance: any = null;
if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(config.url, config.key);
  } catch (err) {
    console.warn("Supabase initialization bypassed.");
  }
}
export const supabase = supabaseInstance;

// --- REAL-TIME DATA FETCHERS ---

export const getContacts = async (): Promise<Contact[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
  return data || [];
};

export const getDeals = async (): Promise<Deal[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('deals').select('*').order('created_at', { ascending: false });
  return data || [];
};

export const getCompetitorScans = async (): Promise<CompetitorScan[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('competitor_scans').select('*').order('lastScan', { ascending: false });
  return data || [];
};

export const syncContactPsychology = async (id: string, psych: any) => {
  if (!supabase) return;
  await supabase.from('contacts').update({ psychology: psych }).eq('id', id);
};

export const updateDealROAS = async (id: string, adSpend: number, roas: number) => {
  if (!supabase) return;
  await supabase.from('deals').update({ adSpend, roas }).eq('id', id);
};

export const getBrandProfile = async (): Promise<BrandProfile | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('brand_profile').select('*').limit(1).single();
  return data || null;
};

export const updateBrandProfile = async (profile: Partial<BrandProfile>) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('brand_profile').upsert({ id: 1, ...profile }).select();
  return data?.[0];
};

export const getTasks = async (): Promise<Task[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('tasks').select('*');
  return data || [];
};
