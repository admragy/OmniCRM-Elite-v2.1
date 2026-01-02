
import React from 'react';
import { NavigationTab, NavigationTabType, BrandProfile } from './types'; 

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
      dashboard: 'Dashboard', contacts: 'Clients', deals: 'Deals', tasks: 'Growth Plan',
      marketing: 'AI Ads', growth_lab: 'Growth Lab', behavior_expert: 'Psychology', media_lab: 'Video Lab', edge_ai: 'Privacy Node', intelligence: 'Market Pulse',
      ai_consultant: 'Voice Advisor', war_room: 'War Room', agent_fleet: 'Agent Fleet',
      admin_portal: 'Admin', settings: 'Settings', help: 'Masterclass'
    },
    ar: {
      dashboard: 'الرئيسية', contacts: 'العملاء', deals: 'الصفقات', tasks: 'خطة النمو',
      marketing: 'الإعلانات', growth_lab: 'مختبر النمو', behavior_expert: 'خبير السلوك', media_lab: 'مختبر الميديا', edge_ai: 'المعالج المحلي', intelligence: 'نبض السوق',
      ai_consultant: 'المستشار الصوتي', war_room: 'غرفة العمليات', agent_fleet: 'أسطول الوكلاء',
      admin_portal: 'الإدارة العليا', settings: 'الإعدادات', help: 'الدليل التعليمي'
    }
  };

  const t = translations[language];
  const isCommander = brand?.rank === 'Commander';

  const navItems: { id: NavigationTabType; icon: string; label: string }[] = [
    { id: NavigationTab.Dashboard, icon: 'fa-house', label: t.dashboard },
    { id: NavigationTab.Contacts, icon: 'fa-users', label: t.contacts },
    { id: NavigationTab.Deals, icon: 'fa-handshake', label: t.deals },
    { id: NavigationTab.Tasks, icon: 'fa-check-double', label: t.tasks },
    { id: NavigationTab.AI_Consultant, icon: 'fa-comment-dots', label: t.ai_consultant },
    { id: NavigationTab.Marketing, icon: 'fa-bolt', label: t.marketing },
    { id: NavigationTab.GrowthLab, icon: 'fa-rocket', label: t.growth_lab },
    { id: NavigationTab.BehaviorExpert, icon: 'fa-brain', label: t.behavior_expert },
    { id: NavigationTab.MediaLab, icon: 'fa-video', label: t.media_lab },
    { id: NavigationTab.WarRoom, icon: 'fa-tower-broadcast', label: t.war_room },
    { id: NavigationTab.Intelligence, icon: 'fa-globe', label: t.intelligence },
    { id: NavigationTab.AgentFleet, icon: 'fa-robot', label: t.agent_fleet },
    { id: NavigationTab.EdgeAI, icon: 'fa-shield-halved', label: t.edge_ai },
  ];

  if (isCommander) navItems.push({ id: NavigationTab.AdminPortal, icon: 'fa-crown', label: t.admin_portal });
  navItems.push({ id: NavigationTab.Settings, icon: 'fa-gear', label: t.settings });

  return (
    <aside className={`w-64 p-6 h-full flex flex-col transition-all duration-700 ${isCommander ? 'bg-slate-950 border-l border-blue-500/20 shadow-[20px_0_60px_rgba(37,99,235,0.05)]' : 'bg-slate-900 border-r border-white/5'} relative z-[600]`}>
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className={`w-8 h-8 ${isCommander ? 'bg-blue-600 shadow-blue-500/50' : 'bg-slate-700'} text-white rounded-lg flex items-center justify-center font-black italic text-sm shadow-lg`}>O</div>
        <div className="flex flex-col">
           <h2 className="text-lg font-black text-white tracking-tight uppercase leading-none">OMNI <span className={isCommander ? 'text-blue-500' : 'text-slate-500'}>3.0</span></h2>
           {isCommander && <span className="text-[7px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Commander Node</span>}
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id
                ? (isCommander ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' : 'bg-slate-700 text-white font-bold')
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-sm w-5 ${activeTab === item.id ? 'text-white' : 'group-hover:text-blue-400'}`}></i>
            <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
        {isCommander && (
           <div className="px-4 py-3 bg-blue-600/10 rounded-xl border border-blue-500/20 mb-4">
              <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1 text-center">Security Status: Active</p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="bg-blue-500 h-full w-full animate-pulse"></div>
              </div>
           </div>
        )}
        <button onClick={onOpenGuide} className="w-full bg-white/5 px-4 py-4 rounded-xl flex items-center gap-3 text-slate-400 hover:text-white transition-all border border-white/5 group">
          <i className="fa-solid fa-circle-info text-sm group-hover:text-blue-400"></i>
          <span className="text-[11px] font-bold uppercase tracking-wider">{t.help}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
