
import React, { useState, useEffect } from 'react';
import { NavigationTab, NavigationTabType, Contact, Deal, BrandProfile, Task } from './types';
import Sidebar from './Sidebar'; 
import Dashboard from './components/Dashboard';
import ContactList from './components/ContactList';
import DealsPipeline from './components/DealsPipeline';
import MarketingCenter from './components/MarketingCenter';
import AccountSettings from './components/AccountSettings';
import SmartGuide from './components/SmartGuide';
import LandingPage from './components/LandingPage';
import AIConsultant from './components/AIConsultant';
import BehaviorExpert from './components/BehaviorExpert';
import MediaLab from './components/MediaLab';
import EdgeIntelligence from './components/EdgeIntelligence';
import StrategicWarRoom from './components/StrategicWarRoom';
import AgentFleet from './components/AgentFleet';
import AdminPortal from './components/AdminPortal';
import MarketIntelligence from './components/MarketIntelligence';
import ActionMatrix from './components/ActionMatrix';
import GrowthLab from './components/GrowthLab';
import KnowledgeBase from './components/KnowledgeBase';

import { getContacts, getDeals, getTasks, getBrandProfile, updateBrandProfile } from './services/supabaseService';

const INITIAL_BRAND: BrandProfile = {
  name: 'أومني للنمو الاستراتيجي',
  website: '',
  industry: 'التجارة والخدمات',
  description: 'نظام قيادة استراتيجي متكامل.',
  targetAudience: 'أصحاب الأعمال',
  tokens: 5000, 
  rank: 'Guest',
  knowledgeBase: '',
  userPsychology: { stressLevel: 0, focusArea: 'النمو', managementStyle: 'منظم' },
  aiMemory: { adHistory: [], chatHistory: [] }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTabType>(NavigationTab.Dashboard);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [brand, setBrand] = useState<BrandProfile>(INITIAL_BRAND);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('ar');
  const [isLandingView, setIsLandingView] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedRank = localStorage.getItem('OMNI_USER_RANK') as any;
    if (savedRank && savedRank !== 'Guest') {
      setBrand(prev => ({ ...prev, rank: savedRank }));
      setIsLandingView(false);
    }
    setIsLoaded(true); 
    
    const loadData = async () => {
      try {
        const [c, d, t, b] = await Promise.all([
          getContacts(),
          getDeals(),
          getTasks(),
          getBrandProfile()
        ]);
        setContacts(c || []);
        setDeals(d || []);
        setTasks(t || []);
        if (b) setBrand(prev => ({ ...prev, ...b, rank: savedRank || b.rank || 'Guest' }));
      } catch (e) {
        console.warn("Data sync bypassed.");
      }
    };
    loadData();
  }, []);

  const handleLaunch = (rank: 'Commander' | 'Operator' | 'Guest') => {
    localStorage.setItem('OMNI_USER_RANK', rank);
    setBrand(prev => ({ ...prev, rank }));
    setIsLandingView(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('OMNI_USER_RANK');
    setBrand(INITIAL_BRAND);
    setIsLandingView(true);
  };

  const deductTokens = async (amount: number) => {
    // للقائد (Commander)، الوحدات غير محدودة للعمليات الاستراتيجية
    if (brand.rank === 'Commander') return true;
    
    if (brand.tokens < amount) {
      alert(language === 'ar' ? 'وحدات الطاقة غير كافية!' : 'Insufficient Operational Capital!');
      return false;
    }
    const newBrand = { ...brand, tokens: brand.tokens - amount };
    setBrand(newBrand);
    try { await updateBrandProfile(newBrand); } catch (e) {}
    return true;
  };

  const handleUpdateDeal = (updatedDeal: Deal) => {
    setDeals(deals.map(d => d.id === updatedDeal.id ? updatedDeal : d));
  };

  const handleAddTask = (task: Task) => setTasks([task, ...tasks]);
  const handleToggleTask = (id: string) => setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Pending' ? 'Completed' : 'Pending' } : t));
  const handleDeleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));

  if (!isLoaded) return null;
  if (isLandingView) return <LandingPage onLaunch={handleLaunch} />;

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar 
        brand={brand} 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
        language={language} 
        onOpenGuide={() => setIsGuideOpen(true)} 
      />

      <main className="flex-1 overflow-y-auto flex flex-col relative bg-slate-950/50">
        <header className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-slate-900/40 backdrop-blur-3xl sticky top-0 z-[100]">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-white text-xl p-2"><i className="fa-solid fa-bars"></i></button>
             <div className="flex flex-col">
                <h1 className="text-xl font-black text-white hidden md:block tracking-tighter uppercase">{brand.name}</h1>
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-indigo-500 hidden md:block">Tactical Node: {brand.rank}</span>
             </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border ${brand.rank === 'Commander' ? 'bg-indigo-600/20 border-indigo-500/30' : 'bg-slate-800 border-white/5'}`}>
              <span className="text-xs font-black text-white">{brand.rank === 'Commander' ? '∞' : brand.tokens.toLocaleString()}</span>
              <i className="fa-solid fa-bolt-lightning text-indigo-400 text-[10px]"></i>
            </div>
            <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all">{language === 'ar' ? 'ENG' : 'AR'}</button>
            <button onClick={handleLogout} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-white/5"><i className="fa-solid fa-power-off"></i></button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {activeTab === NavigationTab.Dashboard && <Dashboard contacts={contacts} deals={deals} language={language} brand={brand} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.Contacts && <ContactList contacts={contacts} language={language} onAddContact={(c) => setContacts([c, ...contacts])} />}
          {activeTab === NavigationTab.Deals && <DealsPipeline deals={deals} contacts={contacts} language={language} onAddDeal={(d) => setDeals([d, ...deals])} onUpdateDeal={handleUpdateDeal} />}
          {activeTab === NavigationTab.Tasks && <ActionMatrix tasks={tasks} deals={deals} contacts={contacts} language={language} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} />}
          {activeTab === NavigationTab.KnowledgeBase && <KnowledgeBase brand={brand} setBrand={setBrand} language={language} />}
          {activeTab === NavigationTab.AI_Consultant && <AIConsultant contacts={contacts} deals={deals} language={language} brand={brand} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.Marketing && <MarketingCenter language={language} brand={brand} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.GrowthLab && <GrowthLab brand={brand} language={language} />}
          {activeTab === NavigationTab.BehaviorExpert && <BehaviorExpert language={language} brand={brand} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.MediaLab && <MediaLab brand={brand} language={language} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.EdgeAI && <EdgeIntelligence language={language} />}
          {activeTab === NavigationTab.WarRoom && <StrategicWarRoom brand={brand} language={language} />}
          {activeTab === NavigationTab.Intelligence && <MarketIntelligence brand={brand} language={language} />}
          {activeTab === NavigationTab.AgentFleet && <AgentFleet brand={brand} language={language} />}
          {activeTab === NavigationTab.AdminPortal && <AdminPortal brand={brand} language={language} />}
          {activeTab === NavigationTab.Settings && <AccountSettings language={language} brand={brand} setBrand={setBrand} />}
        </div>
      </main>

      <SmartGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} language={language} />
    </div>
  );
};

export default App;
