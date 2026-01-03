
import React, { useState } from 'react';
import { BrandProfile } from '../types';

interface AdminPortalProps {
  brand: BrandProfile;
  language: 'en' | 'ar';
}

const AdminPortal: React.FC<AdminPortalProps> = ({ brand, language }) => {
  const [copied, setCopied] = useState(false);

  const t = {
    en: {
      title: 'Strategic Command Portal',
      subtitle: 'Systemic Architecture & Database Supremacy.',
      sqlTitle: 'Supabase Schema Initialization (God-Mode)',
      autoPilot: 'Auto-Pilot Configuration',
      copy: 'Copy Deployment Script'
    },
    ar: {
      title: 'بوابة القيادة الاستراتيجية',
      subtitle: 'الهيكل التنظيمي والسيادة الرقمية لقاعدة البيانات.',
      sqlTitle: 'تهيئة مخطط قاعدة البيانات (God-Mode)',
      autoPilot: 'إعدادات الطيار الآلي',
      copy: 'نسخ كود التهيئة'
    }
  }[language];

  const sqlCode = `
-- 1. Create Contacts Table with Psychology DNA
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'Lead',
  value NUMERIC DEFAULT 0,
  psychology JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Deals Table with ROAS tracking
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  contact_id UUID REFERENCES contacts(id),
  value NUMERIC DEFAULT 0,
  stage TEXT DEFAULT 'Discovery',
  ad_spend NUMERIC DEFAULT 0,
  roas NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Brand Profile Table
CREATE TABLE IF NOT EXISTS brand_profile (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT,
  industry TEXT,
  tokens INTEGER DEFAULT 1000,
  auto_pilot_settings JSONB DEFAULT '{"maxAdSpend": 500, "targetRoas": 4}'
);

-- 4. Create Competitor Scans Table
CREATE TABLE IF NOT EXISTS competitor_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  url TEXT,
  last_price NUMERIC,
  offers JSONB,
  threat_level TEXT,
  last_scan TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
  `;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 animate-in fade-in" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      <div className="bg-[#020617] rounded-[4rem] p-16 border border-white/5 relative overflow-hidden shadow-4xl">
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-600/20 via-transparent to-transparent"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
            <div>
               <h2 className="text-5xl font-black text-white tracking-tighter mb-4">{t.title}</h2>
               <p className="text-slate-400 font-bold text-sm tracking-[0.5em] uppercase">{t.subtitle}</p>
            </div>
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
               <i className="fa-solid fa-crown text-white text-3xl"></i>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 shadow-2xl space-y-8">
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
               <i className="fa-solid fa-database text-emerald-400"></i>
               {t.sqlTitle}
            </h3>
            <div className="bg-black/50 p-8 rounded-3xl border border-white/10 font-mono text-xs text-emerald-400 overflow-x-auto h-96 custom-scrollbar">
               <pre>{sqlCode}</pre>
            </div>
            <button 
               onClick={() => { navigator.clipboard.writeText(sqlCode); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}
               className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-4"
            >
               <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
               {copied ? 'COPIED TO CLIPBOARD' : t.copy}
            </button>
         </div>

         <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 shadow-2xl space-y-10">
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
               <i className="fa-solid fa-shuttle-space text-indigo-400"></i>
               {t.autoPilot}
            </h3>
            
            <div className="space-y-8">
               <div className="flex justify-between items-center p-8 bg-white/5 rounded-3xl border border-white/10">
                  <div>
                     <p className="text-white font-black text-lg">Max Daily Ad Spend</p>
                     <p className="text-slate-500 text-xs uppercase tracking-widest">Automatic cut-off limit</p>
                  </div>
                  <input type="number" defaultValue={500} className="w-32 bg-black/40 p-4 rounded-xl border border-white/10 text-white font-black text-right" />
               </div>

               <div className="flex justify-between items-center p-8 bg-white/5 rounded-3xl border border-white/10">
                  <div>
                     <p className="text-white font-black text-lg">Target ROAS Threshold</p>
                     <p className="text-slate-500 text-xs uppercase tracking-widest">AI Profitability Guard</p>
                  </div>
                  <input type="number" defaultValue={4.5} className="w-32 bg-black/40 p-4 rounded-xl border border-white/10 text-white font-black text-right" />
               </div>

               <div className="p-8 bg-indigo-600/10 rounded-3xl border border-indigo-500/20 flex items-center gap-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl">
                     <i className="fa-solid fa-toggle-on"></i>
                  </div>
                  <div>
                     <p className="text-white font-black">Dynamic Scaling Mode</p>
                     <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Auto-Scale budget when ROAS > 10x</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminPortal;
