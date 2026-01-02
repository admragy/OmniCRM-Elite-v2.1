
import { createClient } from '@supabase/supabase-js';
import { Contact, Deal, BrandProfile, Task } from '../types';

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

// بيانات تجريبية (Fallback)
const DEMO_CONTACTS: Contact[] = [
  { 
    id: 'demo-1', 
    name: 'عميل أومني الافتراضي', 
    company: 'أومني كورب للاستشارات', 
    email: 'ceo@omni-usc.ai', 
    status: 'Customer', 
    lastInteraction: new Date().toISOString(), 
    value: 50000, 
    avatar: 'https://ui-avatars.com/api/?name=Omni+Commander&background=4f46e5&color=fff',
    psychology: { personalityType: 'Driver', sentimentScore: 98, happinessStatus: 'Thrilled', lastTone: 'Dominant' } 
  }
];

export const getContacts = async (): Promise<Contact[]> => {
  if (!supabase) return DEMO_CONTACTS;
  try {
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    return error ? DEMO_CONTACTS : (data || DEMO_CONTACTS);
  } catch { return DEMO_CONTACTS; }
};

export const getDeals = async (): Promise<Deal[]> => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('deals').select('*');
    return error ? [] : (data || []);
  } catch { return []; }
};

export const getBrandProfile = async (): Promise<BrandProfile | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('brand_profile').select('*').limit(1).single();
    return error ? null : data;
  } catch { return null; }
};

export const updateBrandProfile = async (profile: Partial<BrandProfile>) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('brand_profile').upsert({ id: 1, ...profile }).select();
    return data?.[0];
  } catch { return null; }
};

export const getTasks = async (): Promise<Task[]> => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('tasks').select('*');
    return data || [];
  } catch { return []; }
};
