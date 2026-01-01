
import React, { useState } from 'react';
import { BrandProfile } from '../types';

interface AccountSettingsProps {
  language: 'en' | 'ar';
  brand: BrandProfile;
  setBrand: (brand: BrandProfile) => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ language, brand, setBrand }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [copied, setCopied] = useState(false);

  const t = {
    en: {
      title: 'Management Hub',
      brandSection: 'Brand Identity',
      tokens: 'Quantum Energy Control',
      recharge: 'Add 500 Units',
      reset: 'Zero Balance',
      adminLabel: 'Admin Master Key',
      save: 'Synchronize System',
      brandName: 'Business Name',
      saving: 'Applying Changes...',
      sqlTitle: 'Strategic Database Deployment',
      sqlDesc: 'Copy and paste this SQL into Supabase SQL Editor to initialize your cloud brain.',
      copyBtn: 'Copy Migration Script',
      copied: 'Script Copied!'
    },
    ar: {
      title: 'مركز الإدارة التنفيذي',
      brandSection: 'هوية العلامة التجارية',
      tokens: 'التحكم في وحدات الطاقة الاستراتيجية',
      recharge: 'إضافة ٥٠٠ وحدة',
      reset: 'تصفير الرصيد',
      adminLabel: 'مفتاح المسؤول (Master Key)',
      save: 'مزامنة النظام بالكامل',
      brandName: 'اسم المشروع',
      saving: 'جاري تطبيق التعديلات...',
      sqlTitle: 'نشر قاعدة البيانات الاستراتيجية',
      sqlDesc: 'انسخ هذا الكود وضعه في SQL Editor داخل Supabase لتفعيل عقلك السحابي.',
      copyBtn: 'نسخ كود التهيئة (SQL)',
      copied: 'تم النسخ بنجاح!'
    }
  }[language];

  const sqlMigration = `-- OMNI CRM STRATEGIC INITIALIZATION
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  company TEXT,
  status TEXT,
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  value NUMERIC DEFAULT 0,
  avatar TEXT,
  psychology JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  title TEXT,
  contact_id TEXT REFERENCES contacts(id),
  value NUMERIC DEFAULT 0,
  stage TEXT,
  expected_close TEXT,
  probability NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  deal_id TEXT REFERENCES deals(id),
  contact_id TEXT REFERENCES contacts(id),
  title TEXT,
  priority TEXT,
  status TEXT,
  due_date TEXT,
  ai_suggested BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brand_profile (
  id SERIAL PRIMARY KEY,
  name TEXT,
  industry TEXT,
  description TEXT,
  tokens INTEGER DEFAULT 1000,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlMigration);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddTokens = () => {
    if (adminKey !== 'OMNI-ELITE-2025') {
       alert(language === 'ar' ? 'مفتاح المسؤول غير صحيح!' : 'Invalid Admin Key!');
       return;
    }
    setBrand({ ...brand, tokens: brand.tokens + 500 });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setBrand(brand);
    setIsSaving(false);
    alert(language === 'ar' ? 'تم تحديث سياق النظام!' : 'System context updated!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in slide-in-from-bottom-10 duration-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* SQL Migration Section */}
      <div className="bg-slate-900 rounded-[4rem] p-12 border border-white/5 shadow-3xl overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-10 opacity-10">
            <i className="fa-solid fa-database text-9xl text-indigo-400"></i>
         </div>
         <div className="relative z-10 space-y-8">
            <div>
               <h3 className="text-2xl font-black text-white tracking-tight mb-2">{t.sqlTitle}</h3>
               <p className="text-slate-400 font-bold text-sm max-w-xl">{t.sqlDesc}</p>
            </div>
            <div className="bg-black/50 p-6 rounded-3xl border border-white/10 font-mono text-[10px] text-indigo-300 max-h-40 overflow-y-auto custom-scrollbar whitespace-pre">
               {sqlMigration}
            </div>
            <button 
              onClick={handleCopySql}
              className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl'}`}
            >
              {copied ? t.copied : t.copyBtn}
            </button>
         </div>
      </div>

      {/* Admin Token Panel */}
      <div className="bg-indigo-950/40 rounded-[4rem] p-12 border border-indigo-500/20 shadow-3xl relative overflow-hidden group">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex-1">
               <h3 className="text-2xl font-black text-white tracking-tight mb-4">{t.tokens}</h3>
               <div className="flex items-center gap-4 mb-8">
                  <input 
                    type="password" 
                    placeholder={t.adminLabel} 
                    className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-white text-xs font-mono w-64"
                    value={adminKey}
                    onChange={e => setAdminKey(e.target.value)}
                  />
                  <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-indigo-400 font-black font-mono">{brand.tokens} Units</span>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={handleAddTokens} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all">
                    {t.recharge}
                  </button>
               </div>
            </div>
            <i className="fa-solid fa-bolt-lightning text-[120px] text-indigo-500/10 absolute -right-4 -bottom-4"></i>
         </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[4.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-12 md:p-16 space-y-16">
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-800 pb-6">{t.brandSection}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.brandName}</label>
                 <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-[2rem] outline-none font-bold dark:text-white" value={brand.name} onChange={e => setBrand({...brand, name: e.target.value})} />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Industry</label>
                 <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-[2rem] outline-none font-bold dark:text-white" value={brand.industry} onChange={e => setBrand({...brand, industry: e.target.value})} />
               </div>
            </div>
          </div>
        </div>

        <div className="px-16 py-10 bg-slate-50/80 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button onClick={handleSave} disabled={isSaving} className="px-20 py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-sm shadow-3xl hover:bg-indigo-700 transition-all">
            {isSaving ? t.saving : t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
