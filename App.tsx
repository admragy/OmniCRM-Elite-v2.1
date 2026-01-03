
import React, { useState, useEffect, useCallback } from 'react';
import { NavigationTab, NavigationTabType, Contact, Deal, BrandProfile, Task } from './types';
import Sidebar from './Sidebar'; 
import Dashboard from './components/Dashboard';
import ContactList from './components/ContactList';
import DealsPipeline from './components/DealsPipeline';
import BehaviorExpert from './components/BehaviorExpert';
import ShadowIntel from './components/ShadowIntel';
import AdminPortal from './components/AdminPortal';
import LandingPage from './components/LandingPage';
import MarketingCenter from './components/MarketingCenter';
import GrowthLab from './components/GrowthLab';
import StrategicWarRoom from './components/StrategicWarRoom';
import AgentFleet from './components/AgentFleet';
import AIConsultant from './components/AIConsultant';
import KnowledgeBase from './components/KnowledgeBase';
import MediaLab from './components/MediaLab';
import EdgeIntelligence from './components/EdgeIntelligence';

import { getContacts, getDeals, getBrandProfile, getTasks, updateBrandProfile } from './services/supabaseService';

const INITIAL_BRAND: BrandProfile = {
  name: 'OMNI COMMAND OS',
  industry: 'Strategic Dominance',
  tokens: 10000, 
  rank: 'Guest',
  autoPilot: { enabled: true, targetRoas: 4.5, budgetStep: 50, maxDailySpend: 1000 },
  knowledgeBase: '',
  targetAudience: 'High-Value Enterprise'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTabType>(NavigationTab.Dashboard);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [brand, setBrand] = useState<BrandProfile>(INITIAL_BRAND);
  const [language, setLanguage] = useState<'en' | 'ar'>('ar');
  const [isLandingView, setIsLandingView] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedRank = localStorage.getItem('OMNI_USER_RANK');
    
    const loadInitialData = async () => {
      try {
        // إذا كان المستخدم قد دخل مسبقاً، ننتقل فوراً للوحة القيادة
        if (savedRank && savedRank !== 'Guest') {
          setIsLandingView(false);
        }

        const [c, d, b, t] = await Promise.all([
          getContacts().catch(() => []), 
          getDeals().catch(() => []), 
          getBrandProfile().catch(() => null),
          getTasks().catch(() => [])
        ]);
        
        if (c) setContacts(c);
        if (d) setDeals(d);
        if (t) setTasks(t);
        if (b) setBrand(prev => ({ ...prev, ...b, rank: (savedRank as any) || b.rank || 'Guest' }));
      } catch (err) {
        console.warn("Omni OS: Sync Engine offline. Local session active.");
      } finally {
        setIsLoaded(true);
      }
    };

    loadInitialData();
  }, []);

  const deductTokens = useCallback(async (amount: number) => {
    if (brand.tokens < amount) {
      alert(language === 'ar' ? 'رصيد التوكنات غير كافٍ' : 'Insufficient tokens');
      return false;
    }
    const newTokens = brand.tokens - amount;
    setBrand(prev => ({ ...prev, tokens: newTokens }));
    try {
      await updateBrandProfile({ tokens: newTokens });
    } catch (e) {
      console.warn("Token cloud sync skipped.");
    }
    return true;
  }, [brand.tokens, language]);

  if (!isLoaded) return null;

  if (isLandingView) {
    return <LandingPage onLaunch={(rank) => {
      localStorage.setItem('OMNI_USER_RANK', rank);
      setIsLandingView(false);
    }} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case NavigationTab.Dashboard:
        return <Dashboard contacts={contacts} deals={deals} brand={brand} language={language} />;
      case NavigationTab.Contacts:
        return <ContactList contacts={contacts} language={language} onAddContact={c => setContacts([c, ...contacts])} />;
      case NavigationTab.Deals:
        return <DealsPipeline deals={deals} contacts={contacts} language={language} onAddDeal={d => setDeals([d, ...deals])} />;
      case NavigationTab.NeuroSales:
        return <BehaviorExpert language={language} brand={brand} />;
      case NavigationTab.ShadowIntel:
        return <ShadowIntel brand={brand} language={language} />;
      case NavigationTab.WarRoom:
        return <StrategicWarRoom brand={brand} language={language} />;
      case NavigationTab.MediaLab:
        return <MediaLab brand={brand} language={language} deductTokens={deductTokens} />;
      case NavigationTab.AgentFleet:
        return <AgentFleet brand={brand} language={language} />;
      case NavigationTab.Marketing:
        return <MarketingCenter language={language} brand={brand} deductTokens={deductTokens} />;
      case NavigationTab.GrowthLab:
        return <GrowthLab brand={brand} language={language} />;
      case NavigationTab.KnowledgeBase:
        return <KnowledgeBase brand={brand} setBrand={setBrand} language={language} />;
      case NavigationTab.Consultant:
        return <AIConsultant contacts={contacts} deals={deals} brand={brand} language={language} deductTokens={deductTokens} />;
      case NavigationTab.EdgeAI:
        return <EdgeIntelligence language={language} />;
      case NavigationTab.Admin:
        return <AdminPortal brand={brand} language={language} />;
      default:
        return <Dashboard contacts={contacts} deals={deals} brand={brand} language={language} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#020617] text-slate-200 overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} language={language} brand={brand} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="px-10 py-6 border-b border-white/5 bg-slate-900/60 backdrop-blur-3xl z-50 shrink-0">
          <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex flex-col">
               <h1 className="text-xl font-black tracking-tighter text-white uppercase leading-none mb-1">{brand.name}</h1>
               <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] text-indigo-500">SYSTEM SECURE</span>
               </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
                  <i className="fa-solid fa-coins text-amber-500 text-[10px]"></i>
                  <span className="text-[11px] font-black text-white">{brand.tokens.toLocaleString()}</span>
               </div>
               <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="px-3 py-1.5 rounded-lg text-[9px] font-black text-slate-400 hover:text-white border border-white/5 uppercase tracking-widest transition-all">
                  {language === 'ar' ? 'EN' : 'AR'}
               </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
          <div className="max-w-7xl mx-auto w-full h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
