
import React from 'react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  language: 'en' | 'ar';
  onOpenGuide?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language, onOpenGuide }) => {
  const translations: any = {
    en: {
      dashboard: 'Overview',
      contacts: 'Customers',
      deals: 'Pipeline',
      marketing: 'Growth Hub',
      ai_consultant: 'Live Advisor',
      settings: 'Management',
      plan: 'System Tier',
      planName: 'Omni Enterprise Pro',
      usage: '8.4TB / 10TB Synced',
      upgrade: 'Unlock AI Analytics',
      help: 'Operating Guide'
    },
    ar: {
      dashboard: 'نظرة عامة',
      contacts: 'العملاء',
      deals: 'المبيعات',
      marketing: 'مركز النمو',
      ai_consultant: 'المستشار الحي',
      settings: 'الإدارة',
      plan: 'باقة النظام',
      planName: 'باقة الشركات الكبرى',
      usage: 'تمت مزامنة 8.4TB',
      upgrade: 'تفعيل التحليلات المتقدمة',
      help: 'دليل التشغيل (للمبتدئين)'
    }
  };

  const t = translations[language];

  const navItems = [
    { id: NavigationTab.Dashboard, icon: 'fa-chart-network', label: t.dashboard },
    { id: NavigationTab.Contacts, icon: 'fa-address-book', label: t.contacts },
    { id: NavigationTab.Deals, icon: 'fa-file-invoice-dollar', label: t.deals },
    { id: NavigationTab.Marketing, icon: 'fa-megaphone', label: t.marketing },
    { id: NavigationTab.AI_Consultant, icon: 'fa-wand-magic-sparkles', label: t.ai_consultant },
    { id: NavigationTab.Settings, icon: 'fa-user-gear', label: t.settings },
  ];

  return (
    <aside className="w-80 bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl relative z-50 transition-colors duration-500">
      <div className="p-10 flex items-center gap-5">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/30 rotate-3 hover:rotate-0 transition-transform duration-500">
          <i className="fa-solid fa-cube text-white text-2xl"></i>
        </div>
        <div>
          <span className="font-black text-slate-900 dark:text-white text-2xl tracking-tighter block leading-none">OmniCRM</span>
          <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.3em] mt-1">Ultimate OS</span>
        </div>
      </div>

      <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-5 px-6 py-4 rounded-[2rem] transition-all duration-500 group relative ${
              activeTab === item.id
                ? 'bg-slate-900 dark:bg-indigo-600 text-white font-black shadow-2xl shadow-slate-200 dark:shadow-indigo-900/40 translate-x-2'
                : 'text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:translate-x-1'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg w-7 group-hover:scale-110 transition-transform ${activeTab === item.id ? 'text-indigo-400 dark:text-indigo-200' : ''}`}></i>
            <span className="text-sm tracking-tight">{item.label}</span>
            {activeTab === item.id && <div className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} w-2 h-2 bg-indigo-500 dark:bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,1)]`}></div>}
          </button>
        ))}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
           <button 
             onClick={onOpenGuide}
             className="w-full flex items-center gap-5 px-6 py-4 rounded-[2rem] text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
           >
             <i className="fa-solid fa-circle-info text-lg w-7"></i>
             <span>{t.help}</span>
           </button>
        </div>
      </nav>

      <div className="p-8">
        <div className="bg-indigo-600 dark:bg-indigo-700 rounded-[3rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-100 dark:shadow-black/20 border border-white/10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-3">{t.plan}</p>
            <p className="text-lg font-black mb-6 leading-tight">{t.planName}</p>
            <div className="w-full bg-indigo-900/40 rounded-full h-2.5 mb-3 shadow-inner">
              <div className="bg-white h-full rounded-full w-3/4 shadow-[0_0_15px_rgba(255,255,255,0.6)]"></div>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-[10px] font-bold text-indigo-100">{t.usage}</p>
                <button className="text-[10px] font-black uppercase tracking-widest text-white hover:underline">{t.upgrade}</button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
