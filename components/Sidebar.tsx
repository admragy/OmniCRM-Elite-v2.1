
import React from 'react';
import { NavigationTab, NavigationTabType, BrandProfile } from '../types';

interface SidebarProps {
  activeTab: NavigationTabType;
  setActiveTab: (tab: NavigationTabType) => void;
  language: 'en' | 'ar';
  onOpenGuide?: () => void;
  brand?: BrandProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language, onOpenGuide, brand }) => {
  const translations: any = {
    en: {
      dashboard: 'Dashboard', contacts: 'Contacts', deals: 'Deals', tasks: 'Tasks',
      marketing: 'AI Ads', behavior_expert: 'Behavior Expert', media_lab: 'Media Lab', edge_ai: 'Private AI', intelligence: 'Market Pulse',
      ai_consultant: 'AI Advisor', war_room: 'Ops Room', agent_fleet: 'AI Bots',
      admin_portal: 'Admin Control', settings: 'Settings', help: 'System Guide'
    },
    ar: {
      dashboard: 'لوحة التحكم', contacts: 'قاعدة العملاء', deals: 'الصفقات', tasks: 'المهام',
      marketing: 'اعلانات ذكية', behavior_expert: 'خبير السلوك', media_lab: 'مختبر الميديا', edge_ai: 'الذكاء المحلي', intelligence: 'نبض السوق',
      ai_consultant: 'المستشار الذكي', war_room: 'غرفة العمليات', agent_fleet: 'بوتات البيع',
      admin_portal: 'تحكم المدير', settings: 'الاعدادات', help: 'دليل النظام'
    }
  };

  const t = translations[language];
  const isCommander = brand?.rank === 'Commander';

  const navItems: { id: NavigationTabType; icon: string; label: string; highlight?: boolean }[] = [
    { id: NavigationTab.Dashboard, icon: 'fa-grid-horizontal', label: t.dashboard },
    { id: NavigationTab.WarRoom, icon: 'fa-tower-broadcast', label: t.war_room },
    { id: NavigationTab.AgentFleet, icon: 'fa-robot', label: t.agent_fleet },
    { id: NavigationTab.Contacts, icon: 'fa-users', label: t.contacts },
    { id: NavigationTab.Deals, icon: 'fa-handshake', label: t.deals },
    { id: NavigationTab.BehaviorExpert, icon: 'fa-brain-circuit', label: t.behavior_expert },
    { id: NavigationTab.Tasks, icon: 'fa-list-check', label: t.tasks },
    { id: NavigationTab.Intelligence, icon: 'fa-magnifying-glass-chart', label: t.intelligence },
    { id: NavigationTab.Marketing, icon: 'fa-wand-magic-sparkles', label: t.marketing },
    { id: NavigationTab.MediaLab, icon: 'fa-video', label: t.media_lab },
    { id: NavigationTab.AI_Consultant, icon: 'fa-headset', label: t.ai_consultant },
    { id: NavigationTab.EdgeAI, icon: 'fa-shield-halved', label: t.edge_ai },
  ];

  if (isCommander) navItems.push({ id: NavigationTab.AdminPortal, icon: 'fa-user-shield', label: t.admin_portal });
  navItems.push({ id: NavigationTab.Settings, icon: 'fa-gear', label: t.settings });

  return (
    <aside className="w-72 p-6 h-full flex flex-col bg-[#020617] border-r border-white/5 relative z-[600] shadow-xl">
      <div className="flex items-center gap-3 mb-8 px-2 shrink-0">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <i className="fa-solid fa-microchip text-white text-lg"></i>
        </div>
        <div className="whitespace-nowrap">
          <h2 className="text-lg font-black text-white tracking-tighter leading-none uppercase">Omni <span className="text-indigo-500">Business</span></h2>
          <p className="text-[7px] font-black text-indigo-400 uppercase tracking-widest mt-1 leading-none">Growth OS</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-base w-5 transition-all ${activeTab === item.id ? 'text-white' : 'group-hover:scale-110'}`}></i>
            <span className="text-[9px] uppercase tracking-widest font-black truncate leading-none">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <button onClick={onOpenGuide} className="w-full bg-white/5 px-4 py-4 rounded-2xl flex items-center gap-3 text-white hover:bg-white/10 transition-all border border-white/5">
          <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400"><i className="fa-solid fa-book-open text-xs"></i></div>
          <span className="text-[9px] font-black uppercase tracking-widest truncate leading-none">{t.help}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
