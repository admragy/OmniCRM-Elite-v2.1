
import React, { useState, useEffect } from 'react';
import { NavigationTab, NavigationTabType, Contact, Deal, BrandProfile, Task } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ContactList from './components/ContactList';
import DealsPipeline from './components/DealsPipeline';
import ActionMatrix from './components/ActionMatrix';
import AIConsultant from './components/AIConsultant';
import MarketingCenter from './components/MarketingCenter';
import BehaviorExpert from './components/BehaviorExpert';
import MediaLab from './components/MediaLab';
import EdgeIntelligence from './components/EdgeIntelligence';
import MarketIntelligence from './components/MarketIntelligence';
import AccountSettings from './components/AccountSettings';
import SmartGuide from './components/SmartGuide';
import AdminPortal from './components/AdminPortal';
import StrategicWarRoom from './components/StrategicWarRoom';
import AgentFleet from './components/AgentFleet';
import LandingPage from './components/LandingPage';
import { getContacts, getDeals, getTasks, getBrandProfile, updateBrandProfile, saveTask, deleteTask as deleteDbTask } from './services/supabaseService';

const INITIAL_BRAND: BrandProfile = {
  name: 'اومني المتكامل',
  website: 'https://omni-usc.ai',
  industry: 'ذكاء الاعمال الاستراتيجي',
  description: 'نظام متكامل لادارة ونمو الاعمال الذكية.',
  targetAudience: 'اصحاب الشركات والمديرين التنفيذيين.',
  tokens: 10000, 
  rank: 'Commander',
  userPsychology: { stressLevel: 0, focusArea: 'النمو المتسارع', managementStyle: 'سيادي' },
  aiMemory: { adHistory: [], chatHistory: [] }
};

const App: React.FC = () => {
  const [isLandingView, setIsLandingView] = useState(true);
  const [activeTab, setActiveTab] = useState<NavigationTabType>(NavigationTab.Dashboard);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [brand, setBrand] = useState<BrandProfile>(INITIAL_BRAND);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('ar');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [dbC, dbD, dbT, dbB] = await Promise.all([
          getContacts().catch(() => []),
          getDeals().catch(() => []),
          getTasks().catch(() => []),
          getBrandProfile().catch(() => null)
        ]);
        
        setContacts(dbC || []);
        setDeals(dbD || []);
        setTasks(dbT || []);
        if (dbB) setBrand({ ...INITIAL_BRAND, ...dbB });
      } catch (err) {
        console.error("USC Connection Error:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchInitialData();
  }, []);

  const deductTokens = async (amount: number) => {
    if (brand.tokens < amount) return false;
    const newBrand = { ...brand, tokens: brand.tokens - amount };
    setBrand(newBrand);
    try {
      await updateBrandProfile(newBrand);
    } catch (e) { console.error(e); }
    return true;
  };

  const handleAddTask = async (task: Task) => {
    setTasks([task, ...tasks]);
    await saveTask(task);
  };

  const handleToggleTask = async (id: string) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' as any } : t);
    setTasks(newTasks);
    const target = newTasks.find(t => t.id === id);
    if (target) await saveTask(target);
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    await deleteDbTask(id);
  };

  const getActiveTabTitle = () => {
    if (language === 'ar') {
      const titles: any = {
        dashboard: 'لوحة التحكم',
        contacts: 'قاعدة العملاء',
        deals: 'الصفقات',
        tasks: 'المهام الاستراتيجية',
        marketing: 'خبير الاعلانات والنمو',
        behavior_expert: 'خبير السلوك البشري',
        media_lab: 'مختبر الميديا',
        edge_ai: 'الذكاء المحلي',
        intelligence: 'نبض السوق',
        ai_consultant: 'المستشار الذكي',
        war_room: 'غرفة العمليات',
        agent_fleet: 'بوتات البيع',
        admin_portal: 'تحكم المدير',
        settings: 'الاعدادات'
      };
      return titles[activeTab] || brand.name;
    }
    return activeTab.replace('_', ' ');
  };

  if (!isLoaded) return null;

  if (isLandingView) {
    return (
      <LandingPage 
        language={language} 
        setLanguage={setLanguage} 
        onLaunch={() => setIsLandingView(false)} 
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[550] lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <div className={`fixed inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'} z-[600] lg:relative lg:translate-x-0 transition-transform duration-500 ${isSidebarOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
        <Sidebar 
          brand={brand} 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
          language={language} 
          onOpenGuide={() => setIsGuideOpen(true)} 
        />
      </div>

      <main className="flex-1 overflow-y-auto relative flex flex-col custom-scrollbar bg-slate-950/40 backdrop-blur-[1px]">
        <header className="sticky top-0 z-[100] px-6 py-4 md:px-10 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white border border-white/10">
              <i className="fa-solid fa-bars text-sm"></i>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter capitalize shimmer-text pb-1 leading-none">
                {getActiveTabTitle()}
              </h1>
              <p className="text-slate-500 text-[7px] font-black uppercase tracking-[0.3em] leading-none pt-1">{language === 'ar' ? 'عقدة النمو النشطة' : 'Active Growth Node'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-white font-black text-[8px] uppercase tracking-widest">
              {language === 'ar' ? 'English' : 'العربية'}
            </button>
            <div className="hidden sm:flex px-3 py-1.5 bg-indigo-600/10 rounded-xl border border-indigo-500/20 items-center gap-2">
               <div className="text-right">
                  <p className="text-xs font-black text-indigo-400 font-mono leading-none">{brand.tokens}</p>
               </div>
               <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-white text-[10px]">
                <i className="fa-solid fa-bolt"></i>
               </div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 flex-1">
          {activeTab === NavigationTab.Dashboard && <Dashboard contacts={contacts} deals={deals} language={language} brand={brand} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.Contacts && <ContactList contacts={contacts} language={language} onAddContact={(c) => setContacts([c, ...contacts])} />}
          {activeTab === NavigationTab.Deals && <DealsPipeline deals={deals} contacts={contacts} language={language} onAddDeal={(d) => setDeals([d, ...deals])} />}
          {activeTab === NavigationTab.Tasks && <ActionMatrix tasks={tasks} deals={deals} contacts={contacts} language={language} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} />}
          {activeTab === NavigationTab.Marketing && <MarketingCenter language={language} brand={brand} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.BehaviorExpert && <BehaviorExpert language={language} brand={brand} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.MediaLab && <MediaLab brand={brand} language={language} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.AI_Consultant && <AIConsultant brand={brand} contacts={contacts} deals={deals} language={language} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.WarRoom && <StrategicWarRoom brand={brand} language={language} />}
          {activeTab === NavigationTab.AgentFleet && <AgentFleet brand={brand} language={language} />}
          {activeTab === NavigationTab.Intelligence && <MarketIntelligence brand={brand} language={language} />}
          {activeTab === NavigationTab.EdgeAI && <EdgeIntelligence language={language} />}
          {activeTab === NavigationTab.AdminPortal && <AdminPortal brand={brand} language={language} />}
          {activeTab === NavigationTab.Settings && <AccountSettings language={language} brand={brand} setBrand={setBrand} />}
        </div>

        <SmartGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} language={language} />
      </main>
    </div>
  );
};

export default App;
