
import React, { useState } from 'react';
import { BrandProfile } from '../types';

interface AccountSettingsProps {
  language: 'en' | 'ar';
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
  brand: BrandProfile;
  setBrand: (brand: BrandProfile) => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ language, isDarkMode = false, toggleDarkMode, brand, setBrand }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastCommit, setLastCommit] = useState(new Date().toISOString().split('T')[0]);

  const t = {
    en: {
      title: 'Executive Settings',
      profile: 'Personal Profile',
      brandSection: 'Brand Identity (AI Context)',
      brandName: 'Business Name',
      website: 'Website URL',
      industry: 'Industry',
      desc: 'Company Description',
      target: 'Target Audience',
      save: 'Synchronize Changes',
      githubTitle: 'GitHub Neural Sync',
      githubDesc: 'Manage strategic repository state and autonomous commits.',
      repoStatus: 'Repository Status',
      connected: 'Connected & Secure',
      syncBtn: 'Force Neural Sync',
      lastSync: 'Last Strategic Commit'
    },
    ar: {
      title: 'الإعدادات التنفيذية',
      profile: 'الملف الشخصي',
      brandSection: 'هوية العلامة التجارية (سياق الذكاء الاصطناعي)',
      brandName: 'اسم النشاط التجاري',
      website: 'رابط الموقع الإلكتروني',
      industry: 'مجال العمل',
      desc: 'وصف الشركة',
      target: 'الجمهور المستهدف',
      save: 'مزامنة التغييرات',
      githubTitle: 'المزامنة العصبية مع GitHub',
      githubDesc: 'إدارة حالة المستودع الاستراتيجي وعمليات التزام الذاتية.',
      repoStatus: 'حالة المستودع',
      connected: 'متصل ومؤمن بالكامل',
      syncBtn: 'بدء مزامنة فورية',
      lastSync: 'آخر مزامنة استراتيجية'
    }
  }[language];

  const handleGitHubSync = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 3000));
    setLastCommit(new Date().toISOString().split('T')[0]);
    setIsSyncing(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 animate-in slide-in-from-bottom-10 duration-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* GitHub Sync Section */}
      <div className="bg-slate-950 rounded-[4rem] p-12 border border-white/10 shadow-3xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] group-hover:bg-indigo-600/20 transition-all"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex-1">
               <div className="flex items-center gap-4 mb-4">
                  <i className="fa-brands fa-github text-4xl text-white"></i>
                  <h3 className="text-2xl font-black text-white tracking-tight">{t.githubTitle}</h3>
               </div>
               <p className="text-slate-400 font-bold text-sm max-w-lg mb-8">{t.githubDesc}</p>
               <div className="flex gap-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.repoStatus}</p>
                     <p className="text-emerald-400 font-black text-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        {t.connected}
                     </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.lastSync}</p>
                     <p className="text-white font-black text-sm">{lastCommit}</p>
                  </div>
               </div>
            </div>
            <button 
              onClick={handleGitHubSync}
              disabled={isSyncing}
              className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-100 transition-all flex items-center gap-4"
            >
              {isSyncing ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
              {isSyncing ? (language === 'ar' ? 'جاري المزامنة...' : 'Syncing...') : t.syncBtn}
            </button>
         </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative">
        <div className="p-10 md:p-16 space-y-16">
          <div className="space-y-8">
            <div className="flex items-center gap-4 border-b border-slate-50 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400"><i className="fa-solid fa-fingerprint"></i></div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t.brandSection}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.brandName}</label>
                 <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold dark:text-white" value={brand.name} onChange={e => setBrand({...brand, name: e.target.value})} />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.website}</label>
                 <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold dark:text-white" value={brand.website} onChange={e => setBrand({...brand, website: e.target.value})} />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.industry}</label>
                 <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold dark:text-white" value={brand.industry} onChange={e => setBrand({...brand, industry: e.target.value})} />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.target}</label>
                 <input className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold dark:text-white" value={brand.targetAudience} onChange={e => setBrand({...brand, targetAudience: e.target.value})} />
               </div>
               <div className="md:col-span-2 space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.desc}</label>
                 <textarea className="w-full h-32 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold dark:text-white resize-none" value={brand.description} onChange={e => setBrand({...brand, description: e.target.value})} />
               </div>
            </div>
          </div>
        </div>

        <div className="px-10 md:px-16 py-10 bg-slate-50/80 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button className="px-16 py-5 bg-indigo-600 text-white rounded-[2.5rem] font-black text-sm shadow-3xl hover:bg-indigo-700 transition-all">
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
