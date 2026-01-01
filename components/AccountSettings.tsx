
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
      title: 'System Management',
      brandSection: 'Company Identity',
      tokens: 'System Energy Units',
      recharge: 'Add 500 Units',
      reset: 'Reset Budget',
      adminLabel: 'Admin Master Key',
      save: 'Save Changes',
      brandName: 'Business Name',
      saving: 'Updating System...',
      sqlTitle: 'Cloud Database Setup',
      sqlDesc: 'For Admins: Execute this in Supabase to start your private cloud memory.',
      copyBtn: 'Copy SQL Code',
      copied: 'Copied!',
      rankLabel: 'User Level'
    },
    ar: {
      title: 'إدارة النظام',
      brandSection: 'هوية البيزنس',
      tokens: 'وحدات طاقة النظام',
      recharge: 'إضافة ٥٠٠ وحدة',
      reset: 'تصفير الميزانية',
      adminLabel: 'مفتاح المدير الرئيسي',
      save: 'حفظ التعديلات',
      brandName: 'اسم البيزنس',
      saving: 'جاري التحديث...',
      sqlTitle: 'إعداد السحابة الخاصة',
      sqlDesc: 'للمدير فقط: قم بتنفيذ هذا الكود في Supabase لتهيئة ذاكرة النظام السحابية.',
      copyBtn: 'نسخ كود SQL',
      copied: 'تم النسخ!',
      rankLabel: 'مستوى المستخدم'
    }
  }[language];

  const sqlMigration = `-- OMNI CRM INITIALIZATION
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
);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlMigration);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddTokens = () => {
    if (adminKey !== 'OMNI-ELITE-2025') {
       alert(language === 'ar' ? 'المفتاح غير صحيح!' : 'Invalid Key!');
       return;
    }
    setBrand({ ...brand, tokens: brand.tokens + 500, rank: 'Commander' });
    alert(language === 'ar' ? 'تمت إضافة الوحدات بنجاح!' : 'Units added successfully!');
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setBrand(brand);
    setIsSaving(false);
    alert(language === 'ar' ? 'تم حفظ الإعدادات!' : 'Settings saved!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in slide-in-from-bottom-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Energy Panel */}
      <div className="bg-indigo-950/40 rounded-[4rem] p-12 border border-indigo-500/20 shadow-3xl relative overflow-hidden group">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex-1">
               <h3 className="text-2xl font-black text-white tracking-tight mb-2">{t.tokens}</h3>
               <p className="text-indigo-300/60 text-xs mb-6">{language === 'ar' ? 'تحكم في رصيد وحدات التشغيل الخاصة بك.' : 'Control your system operating units.'}</p>
               <div className="flex flex-wrap items-center gap-4 mb-8">
                  <input 
                    type="password" 
                    placeholder={t.adminLabel} 
                    className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-white text-xs font-mono w-64"
                    value={adminKey}
                    onChange={e => setAdminKey(e.target.value)}
                  />
                  <div className="px-6 py-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <span className="text-indigo-400 font-black font-mono">{brand.tokens} Units</span>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={handleAddTokens} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl">
                    {t.recharge}
                  </button>
               </div>
            </div>
            <i className="fa-solid fa-bolt text-[120px] text-indigo-500/10 absolute -right-4 -bottom-4"></i>
         </div>
      </div>

      {/* Brand Form */}
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
               <div className="md:col-span-2 space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{language === 'ar' ? 'عن البيزنس بتاعك (AI Context)' : 'About Your Business'}</label>
                 <textarea className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-[2.5rem] outline-none font-bold dark:text-white h-40 resize-none" value={brand.description} onChange={e => setBrand({...brand, description: e.target.value})} />
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
