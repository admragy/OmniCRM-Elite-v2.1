
import React from 'react';
import { NavigationTab, NavigationTabType } from '../types';

interface SidebarProps {
  activeTab: NavigationTabType;
  setActiveTab: (tab: NavigationTabType) => void;
  language: 'en' | 'ar';
  onOpenGuide?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language, onOpenGuide }) => {
  const translations: any = {
    en: {
      dashboard: 'Overview', contacts: 'Partners', deals: 'Capital Flow', tasks: 'Execution',
      marketing: 'Growth', media_lab: 'Production', edge_ai: 'Privacy Node', intelligence: 'Market Pulse',
      ai_consultant: 'Oracle', settings: 'Management', help: 'Masterclass'
    },
    ar: {
      dashboard: 'نظرة عامة', contacts: 'الشركاء', deals: 'التدفق المالي', tasks: 'التنفيذ',
      marketing: 'النمو', media_lab: 'الإنتاج', edge_ai: 'عقدة الخصوصية', intelligence: 'نبض السوق',
      ai_consultant: 'الأوراكل', settings: 'الإدارة', help: 'الماستركلاس'
    }
  };

  const t = translations[language];

  const navItems = [
    { id: NavigationTab.Dashboard, icon: 'fa-grid-2', label: t.dashboard },
    { id: NavigationTab.Contacts, icon: 'fa-user-group-crown', label: t.contacts },
    { id: NavigationTab.Deals, icon: 'fa-chart-tree-map', label: t.deals },
    { id: NavigationTab.Tasks, icon: 'fa-microchip-ai', label: t.tasks },
    { id: NavigationTab.Intelligence, icon: 'fa-radar', label: t.intelligence },
    { id: NavigationTab.Marketing, icon: 'fa-rocket-launch', label: t.marketing },
    { id: NavigationTab.MediaLab, icon: 'fa-film-canister', label: t.media_lab },
    { id: NavigationTab.EdgeAI, icon: 'fa-fingerprint', label: t.edge_ai },
    { id: NavigationTab.AI_Consultant, icon: 'fa-sparkles', label: t.ai_consultant },
    { id: NavigationTab.Settings, icon: 'fa-sliders-up', label: t.settings },
  ];

  return (
    <aside className="w-80 p-8 h-full flex flex-col bg-[#020617] lg:bg-transparent border-r border-white/5 relative z-[600] shadow-2xl lg:shadow-none">
      <div className="flex items-center gap-4 mb-16 px-4 shrink-0">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30">
          <i className="fa-solid fa-cube text-white text-xl"></i>
        </div>
        <div className="whitespace-nowrap">
          <h2 className="text-xl font-black text-white tracking-tighter leading-none">Omni OS</h2>
          <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em] mt-1">Quantum V3</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-500 group relative whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-white/10 text-white font-bold shadow-xl border border-white/10'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg w-6 transition-all ${activeTab === item.id ? 'text-indigo-400' : 'group-hover:scale-110'}`}></i>
            <span className="text-xs uppercase tracking-widest font-black truncate">{item.label}</span>
            {activeTab === item.id && <div className="absolute right-4 w-1 h-4 bg-indigo-500 rounded-full shadow-[0_0_15px_#6366f1]"></div>}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8 shrink-0">
        <button 
          onClick={onOpenGuide}
          className="w-full quantum-card px-6 py-5 rounded-3xl flex items-center gap-4 text-white hover:border-indigo-500/50 transition-all whitespace-nowrap"
        >
          <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest truncate">{t.help}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
