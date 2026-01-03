
import React from 'react';
import { NavigationTab, NavigationTabType, BrandProfile } from './types'; 

interface SidebarProps {
  activeTab: NavigationTabType;
  setActiveTab: (tab: NavigationTabType) => void;
  language: 'en' | 'ar';
  brand: BrandProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language, brand }) => {
  const t = {
    en: {
      dashboard: 'Operations Radar',
      contacts: 'Intelligence Index',
      deals: 'Pipeline Theater',
      neuro_sales: 'Neuro-Sales Engine',
      shadow_intel: 'Shadow Intelligence',
      war_room: 'War Room',
      media_lab: 'Media Lab (VEO)',
      agent_fleet: 'Agent Fleet',
      marketing: 'Marketing Center',
      growth_lab: 'Growth Lab',
      knowledge_base: 'Strategic Memory',
      consultant: 'Live Oracle',
      edge_ai: 'Edge Processing',
      admin: 'High Command'
    },
    ar: {
      dashboard: 'رادار العمليات',
      contacts: 'فهرس الاستخبارات',
      deals: 'مسرح الصفقات',
      neuro_sales: 'محرك الإغلاق العصبي',
      shadow_intel: 'استخبارات الظل',
      war_room: 'غرفة العمليات',
      media_lab: 'مختبر الميديا',
      agent_fleet: 'أسطول الوكلاء',
      marketing: 'مركز التسويق',
      growth_lab: 'مختبر النمو',
      knowledge_base: 'الذاكرة الاستراتيجية',
      consultant: 'الأوراكل الحي',
      edge_ai: 'المعالجة المحلية',
      admin: 'القيادة العليا'
    }
  }[language];

  const menuItems = [
    { id: NavigationTab.Dashboard, icon: 'fa-radar', label: t.dashboard },
    { id: NavigationTab.Contacts, icon: 'fa-id-badge', label: t.contacts },
    { id: NavigationTab.Deals, icon: 'fa-briefcase-arrow-right', label: t.deals },
    { id: NavigationTab.Consultant, icon: 'fa-microphone-lines', label: t.consultant },
    { id: NavigationTab.NeuroSales, icon: 'fa-brain-circuit', label: t.neuro_sales },
    { id: NavigationTab.ShadowIntel, icon: 'fa-user-secret', label: t.shadow_intel },
    { id: NavigationTab.WarRoom, icon: 'fa-satellite-dish', label: t.war_room },
    { id: NavigationTab.MediaLab, icon: 'fa-film', label: t.media_lab },
    { id: NavigationTab.AgentFleet, icon: 'fa-users-gear', label: t.agent_fleet },
    { id: NavigationTab.Marketing, icon: 'fa-megaphone', label: t.marketing },
    { id: NavigationTab.GrowthLab, icon: 'fa-rocket', label: t.growth_lab },
    { id: NavigationTab.KnowledgeBase, icon: 'fa-database', label: t.knowledge_base },
    { id: NavigationTab.EdgeAI, icon: 'fa-shield-halved', label: t.edge_ai },
    { id: NavigationTab.Admin, icon: 'fa-crown', label: t.admin },
  ];

  return (
    <aside className="w-80 bg-slate-950 border-x border-white/5 h-full flex flex-col p-8 z-[200] overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-4 mb-12 shrink-0">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-[0_0_20px_rgba(79,70,229,0.3)]">O</div>
        <h2 className="text-2xl font-black text-white tracking-tighter">OMNI <span className="text-indigo-500">USC</span></h2>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-5 px-6 py-4 rounded-[1.8rem] transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 font-black scale-[1.02]' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-base w-6 transition-transform group-hover:scale-110`}></i>
            <span className="text-[10px] font-black uppercase tracking-widest text-start leading-none">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="mt-10 pt-10 border-t border-white/5 shrink-0">
         <div className="p-6 bg-indigo-600/5 rounded-3xl border border-indigo-500/10 backdrop-blur-sm">
            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-3">Neural Core Sync</p>
            <div className="flex gap-1.5">
               {[1,2,3,4,5,6].map(i => <div key={i} className="h-1 flex-1 bg-indigo-500/30 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 animate-pulse" style={{animationDelay: `${i*150}ms`}}></div>
               </div>)}
            </div>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;
