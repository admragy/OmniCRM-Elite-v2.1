
import React, { useState } from 'react';
import { BrandProfile } from '../types';
import { isSupabaseConfigured } from '../services/supabaseService';

interface AccountSettingsProps {
  language: 'en' | 'ar';
  brand: BrandProfile;
  setBrand: (brand: BrandProfile) => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ language, brand, setBrand }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // الأولوية: localStorage (تعديل المستخدم) ثم process.env (الإعداد الافتراضي)
  const [sUrl, setSUrl] = useState(localStorage.getItem('OMNI_SUPABASE_URL') || process.env.SUPABASE_URL || '');
  const [sKey, setSKey] = useState(localStorage.getItem('OMNI_SUPABASE_KEY') || process.env.SUPABASE_ANON_KEY || '');
  const [fbToken, setFbToken] = useState(localStorage.getItem('OMNI_META_TOKEN') || process.env.META_ACCESS_TOKEN || '');

  const t = {
    en: {
      title: 'Unified Command & Control',
      brandSection: 'Business Neural Profile',
      integrations: 'Strategic Integrations',
      supabaseTitle: 'Cloud Database (Supabase)',
      fbTitle: 'Ad Network (Meta/Facebook)',
      connected: 'System Active',
      disconnected: 'Offline Mode',
      save: 'Synchronize Keys',
      saving: 'Encrypting...',
      copySql: 'Get DB Tables (SQL)',
      url: 'Project Endpoint (URL)',
      key: 'Public API Key (Anon)'
    },
    ar: {
      title: 'مركز القيادة والتحكم الموحد',
      brandSection: 'الملف العصبي للبيزنس',
      integrations: 'الربط الاستراتيجي',
      supabaseTitle: 'قاعدة البيانات السحابية (Supabase)',
      fbTitle: 'شبكة الإعلانات (Facebook/Meta)',
      connected: 'النظام نشط',
      disconnected: 'وضع العمل المحلي',
      save: 'مزامنة المفاتيح',
      saving: 'جاري التشفير...',
      copySql: 'نسخ كود الجداول (SQL)',
      url: 'رابط المشروع (URL)',
      key: 'المفتاح البرمجي (Anon Key)'
    }
  }[language];

  const handleSaveAll = () => {
    setIsSaving(true);
    localStorage.setItem('OMNI_SUPABASE_URL', sUrl);
    localStorage.setItem('OMNI_SUPABASE_KEY', sKey);
    localStorage.setItem('OMNI_META_TOKEN', fbToken);
    
    setTimeout(() => {
      setIsSaving(false);
      window.location.reload(); 
    }, 1500);
  };

  const sqlCode = `CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT,
  company TEXT,
  email TEXT,
  status TEXT DEFAULT 'Lead',
  value NUMERIC DEFAULT 0,
  psychology JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      <div className="flex flex-col gap-2 mb-4">
         <h2 className="text-4xl font-black tracking-tighter text-slate-900">{t.title}</h2>
         <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">{t.integrations}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Supabase Integration Card */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden group">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-all"></div>
           <div className="flex justify-between items-center relative z-10">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 text-3xl shadow-sm">
                 <i className="fa-solid fa-cloud-bolt"></i>
              </div>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isSupabaseConfigured ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                 {isSupabaseConfigured ? t.connected : t.disconnected}
              </span>
           </div>
           
           <div className="space-y-6 relative z-10">
              <h3 className="text-2xl font-black text-slate-900">{t.supabaseTitle}</h3>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.url}</label>
                    <input type="text" value={sUrl} onChange={e => setSUrl(e.target.value)} placeholder="https://xxx.supabase.co" className="w-full bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.key}</label>
                    <input type="password" value={sKey} onChange={e => setSKey(e.target.value)} placeholder="eyJhbGci..." className="w-full bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm" />
                 </div>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(sqlCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-[11px] font-black text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all inline-block">
                 {copied ? '✅ تم نسخ الكود' : t.copySql}
              </button>
           </div>
        </div>

        {/* Facebook/Meta Integration Card */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden group">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-all"></div>
           <div className="flex justify-between items-center relative z-10">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-3xl shadow-sm">
                 <i className="fa-brands fa-facebook-f"></i>
              </div>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${fbToken ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                 {fbToken ? t.connected : t.disconnected}
              </span>
           </div>
           
           <div className="space-y-6 relative z-10">
              <h3 className="text-2xl font-black text-slate-900">{t.fbTitle}</h3>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{language === 'ar' ? 'رمز الوصول (Access Token)' : 'Access Token'}</label>
                    <input type="password" value={fbToken} onChange={e => setFbToken(e.target.value)} placeholder="EAAb..." className="w-full bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm" />
                 </div>
                 <p className="text-[10px] text-slate-400 leading-relaxed font-bold">
                    {language === 'ar' 
                      ? 'اربط مفاتيح Meta for Developers لإطلاق الحملات مباشرة من النظام.' 
                      : 'Connect Meta for Developers keys to launch campaigns directly.'}
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Global Brand Identity & Action Bar */}
      <div className="bg-slate-900 rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden relative">
        <div className="p-16 space-y-10 relative z-10">
           <h3 className="text-3xl font-black text-white tracking-tight">{t.brandSection}</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                 <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">{language === 'ar' ? 'اسم البيزنس الاستراتيجي' : 'Strategic Brand Name'}</label>
                 <input className="w-full bg-white/5 border border-white/10 p-6 rounded-[1.5rem] outline-none focus:border-blue-500 text-white font-black text-xl" value={brand.name} onChange={e => setBrand({...brand, name: e.target.value})} />
              </div>
              <div className="space-y-3">
                 <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">{language === 'ar' ? 'القطاع الصناعي' : 'Industry Vertical'}</label>
                 <input className="w-full bg-white/5 border border-white/10 p-6 rounded-[1.5rem] outline-none focus:border-blue-500 text-white font-black text-xl" value={brand.industry} onChange={e => setBrand({...brand, industry: e.target.value})} />
              </div>
           </div>
        </div>
        <div className="bg-white/5 p-12 flex justify-between items-center border-t border-white/10">
           <p className="text-slate-500 font-bold text-sm max-w-md">
              {language === 'ar' 
                ? 'سيتم استخدام المفاتيح الموجودة في ملف .env افتراضياً إلا إذا قمت بتعديلها هنا.' 
                : 'Keys from .env will be used by default unless modified here.'}
           </p>
           <button onClick={handleSaveAll} className="px-16 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-white hover:text-slate-950 transition-all shadow-3xl">
              {isSaving ? <i className="fa-solid fa-sync animate-spin"></i> : t.save}
           </button>
        </div>
        <i className="fa-solid fa-shield-halved text-[250px] text-white/5 absolute -bottom-20 -left-20 rotate-12"></i>
      </div>
    </div>
  );
};

export default AccountSettings;
