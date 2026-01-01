
import { createClient } from '@supabase/supabase-js';
import { Contact, Deal, BrandProfile, Task } from '../types';

const getEnv = (key: string) => {
  try {
    return process.env[key] || '';
  } catch {
    return '';
  }
};

const SUPABASE_URL = getEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY');

export const isSupabaseConfigured = 
  typeof SUPABASE_URL === 'string' && 
  SUPABASE_URL.length > 10 && 
  SUPABASE_URL.startsWith('http') &&
  typeof SUPABASE_ANON_KEY === 'string' &&
  SUPABASE_ANON_KEY.length > 10;

export const supabase = isSupabaseConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// بيانات افتراضية (Demo Data) لتشغيل النظام في حال عدم الاتصال
const DEMO_CONTACTS: Contact[] = [
  { id: 'demo-1', name: 'Elite Partner X', company: 'Global Tech Corp', email: 'ceo@global.tech', status: 'Customer', lastInteraction: new Date().toISOString(), value: 50000, avatar: 'https://ui-avatars.com/api/?name=Partner+X', psychology: { personalityType: 'Driver', sentimentScore: 90, happinessStatus: 'Thrilled', lastTone: 'Optimistic' } }
];

export const getContacts = async (): Promise<Contact[]> => {
  if (!supabase) return DEMO_CONTACTS;
  try {
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data && data.length > 0 ? data : DEMO_CONTACTS;
  } catch (err) { return DEMO_CONTACTS; }
};

export const saveContact = async (contact: Partial<Contact>) => {
  if (!supabase) {
    console.warn("Supabase not connected. Saving to local session only.");
    return contact;
  };
  try {
    const { data, error } = await supabase.from('contacts').upsert(contact).select();
    if (error) throw error;
    return data?.[0];
  } catch (err) { return null; }
};

export const getDeals = async (): Promise<Deal[]> => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('deals').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) { return []; }
};

export const saveDeal = async (deal: Partial<Deal>) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('deals').upsert(deal).select();
    if (error) throw error;
    return data?.[0];
  } catch (err) { return null; }
};

export const getTasks = async (): Promise<Task[]> => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) { return []; }
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
  await supabase.from('tasks').delete().eq('id', id);
};

export const getBrandProfile = async (): Promise<BrandProfile | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('brand_profile').select('*').limit(1).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
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
