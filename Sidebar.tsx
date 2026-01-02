
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
      admin_portal: 'Admin', settings: 'Settings', help: 'Masterclass', knowledge_base: 'Company Brain'
    },
    ar: {
      dashboard: 'الرئيسية', contacts: 'العملاء', deals: 'الصفقات', tasks: 'خطة النمو',
      marketing: 'الإعلانات', growth_lab: 'مختبر النمو', behavior_expert: 'خبير السلوك', media_lab: 'مختبر الميديا', edge_ai: 'المعالج المحلي', intelligence: 'نبض السوق',
      ai_consultant: 'المستشار الصوتي', war_room: 'غرفة العمليات', agent_fleet: 'أسطول الوكلاء',
      admin_portal: 'الإدارة العليا', settings: 'الإعدادات', help: 'الدليل التعليمي', knowledge_base: 'عقل الشركة'
    }
  };

  const t = translations[language];
  const isCommander = brand?.rank === 'Commander';

  const navItems: { id: NavigationTabType; icon: string; label: string; highlight?: boolean }[] = [
    { id: NavigationTab.Dashboard, icon: 'fa-house', label: t.dashboard },
    { id: NavigationTab.Contacts, icon: 'fa-users', label: t.contacts },
    { id: NavigationTab.Deals, icon: 'fa-handshake', label: t.deals },
    { id: NavigationTab.Tasks, icon: 'fa-check-double', label: t.tasks },
    { id: NavigationTab.AI_Consultant, icon: 'fa-comment-dots', label: t.ai_consultant, highlight: true },
    { id: NavigationTab.KnowledgeBase, icon: 'fa-database', label: t.knowledge_base },
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
    <aside className={`w-64 p-6 h-full flex flex-col transition-all duration-700 ${isCommander ? 'bg-slate-950 border-l border-indigo-500/20 shadow-[20px_0_100px_rgba(79,70,229,0.1)]' : 'bg-slate-900 border-r border-white/5'} relative z-[600]`}>
      
      {/* Brand Identity */}
      <div className="flex items-center gap-4 mb-10 px-2 group cursor-pointer">
        <div className={`w-10 h-10 ${isCommander ? 'bg-indigo-600 shadow-indigo-500/50' : 'bg-slate-700'} text-white rounded-xl flex items-center justify-center font-black italic text-base shadow-2xl group-hover:rotate-12 transition-all`}>O</div>
        <div className="flex flex-col">
           <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">OMNI <span className={isCommander ? 'text-indigo-500' : 'text-slate-500'}>3.0</span></h2>
           {isCommander && <span className="text-[7px] font-black text-indigo-400 uppercase tracking-[0.5em] mt-1.5">Elite Commander</span>}
        </div>
      </div>

      {/* Nav Section */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
              activeTab === item.id
                ? (isCommander ? 'bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-600/30' : 'bg-slate-700 text-white font-bold')
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.highlight && !activeTab && (
               <span className="absolute left-1 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
            )}
            <i className={`fa-solid ${item.icon} text-sm w-5 ${activeTab === item.id ? 'text-white' : 'group-hover:text-indigo-400 group-hover:scale-110 transition-transform'}`}></i>
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
        {isCommander && (
           <div className="px-5 py-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 mb-4 text-center">
              <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Neural Link: Stable</p>
              <div className="flex justify-center gap-1">
                 {[1,2,3,4,5].map(i => <div key={i} className={`w-1 h-3 rounded-full ${i <= 4 ? 'bg-indigo-500' : 'bg-slate-700'} animate-pulse`} style={{ animationDelay: `${i*100}ms` }}></div>)}
              </div>
           </div>
        )}
        <button onClick={onOpenGuide} className="w-full bg-white/5 px-5 py-4 rounded-2xl flex items-center gap-4 text-slate-400 hover:text-white transition-all border border-white/5 group hover:bg-indigo-600/10 hover:border-indigo-500/20">
          <i className="fa-solid fa-graduation-cap text-base group-hover:text-indigo-400"></i>
          <span className="text-[10px] font-black uppercase tracking-widest">{t.help}</span>
        </button>
      </div>

      <style>{`
         .custom-scrollbar::-webkit-scrollbar { width: 3px; }
         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
         .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </aside>
  );
};

export default Sidebar;
