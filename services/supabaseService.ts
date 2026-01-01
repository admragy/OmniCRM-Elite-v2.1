
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

export const getContacts = async (): Promise<Contact[]> => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) { return []; }
};

export const saveContact = async (contact: Partial<Contact>) => {
  if (!supabase) return null;
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
