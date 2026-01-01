
import React, { useState, useEffect, useRef } from 'react';
import { NavigationTab, Contact, Deal, BrandProfile, AdCampaign, ChatLog } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ContactList from './components/ContactList';
import DealsPipeline from './components/DealsPipeline';
import AIConsultant from './components/AIConsultant';
import MarketingCenter from './components/MarketingCenter';
import AccountSettings from './components/AccountSettings';
import SmartGuide from './components/SmartGuide';
import { parseGlobalCommand, runBackgroundEmpathySync } from './services/geminiService';
import { getContacts, getDeals, getBrandProfile, saveContact, saveDeal, updateBrandProfile, isSupabaseConfigured } from './services/supabaseService';

const INITIAL_BRAND: BrandProfile = {
  name: 'Omni Digital',
  website: 'https://omnicrm.ai',
  industry: 'Real Estate Marketing',
  description: 'We help premium agencies scale through AI strategy.',
  targetAudience: 'High-net-worth investors and real estate brokers.',
  userPsychology: { stressLevel: 20, focusArea: 'Growth', managementStyle: 'Visionary' },
  aiMemory: { adHistory: [], chatHistory: [] }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.Dashboard);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [brand, setBrand] = useState<BrandProfile>(INITIAL_BRAND);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('ar');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [isNeuralSyncing, setIsNeuralSyncing] = useState(false);
  const [isCloudLoading, setIsCloudLoading] = useState(isSupabaseConfigured);

  const lastSyncRef = useRef<number>(0);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsCloudLoading(false);
      return;
    }
    const fetchInitialData = async () => {
      setIsCloudLoading(true);
      try {
        const [dbContacts, dbDeals, dbBrand] = await Promise.all([
          getContacts(),
          getDeals(),
          getBrandProfile()
        ]);
        if (dbContacts.length > 0) setContacts(dbContacts);
        if (dbDeals.length > 0) setDeals(dbDeals);
        if (dbBrand) setBrand(dbBrand);
      } catch (err) {
        console.error("Supabase initial sync failed:", err);
      } finally {
        setIsCloudLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const triggerSilentSync = async () => {
      const now = Date.now();
      if (now - lastSyncRef.current < 60000 || isCloudLoading) return; 
      setIsNeuralSyncing(true);
      try {
        const intel = await runBackgroundEmpathySync(contacts, brand.aiMemory?.chatHistory || [], brand, language);
        if (intel) {
          let updatedBrand = { ...brand };
          if (intel.userPsychology) {
            updatedBrand = {
              ...brand,
              userPsychology: {
                stressLevel: intel.userPsychology.stressLevel,
                focusArea: brand.userPsychology?.focusArea || 'Strategic Growth',
                managementStyle: intel.userPsychology.managementStyle
              }
            };
            setBrand(updatedBrand);
            if (isSupabaseConfigured) await updateBrandProfile(updatedBrand);
          }
          if (intel.contactPsychology) {
            const updatedContacts = contacts.map(c => {
              const found = intel.contactPsychology.find((p: any) => p.name === c.name);
              if (found) {
                const uContact = { ...c, psychology: { ...c.psychology!, personalityType: found.personality as any, sentimentScore: found.satisfaction, happinessStatus: found.status as any } };
                if (isSupabaseConfigured) saveContact(uContact);
                return uContact;
              }
              return c;
            });
            setContacts(updatedContacts);
          }
        }
      } catch (e) {
        console.warn("Silent context sync paused.");
      } finally {
        setIsNeuralSyncing(false);
        lastSyncRef.current = now;
      }
    };
    if (!isCloudLoading) triggerSilentSync();
  }, [brand.aiMemory?.chatHistory, contacts.length, language]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleAddContact = async (c: Contact) => {
    setContacts(prev => [c, ...prev]);
    if (isSupabaseConfigured) await saveContact(c);
  };

  const handleAddDeal = async (d: Deal) => {
    setDeals(prev => [d, ...prev]);
    if (isSupabaseConfigured) await saveDeal(d);
  };

  const handleUpdateBrand = async (newBrand: BrandProfile) => {
    setBrand(newBrand);
    if (isSupabaseConfigured) await updateBrandProfile(newBrand);
  };

  const saveAdToMemory = async (campaign: AdCampaign) => {
    const newBrand = { ...brand, aiMemory: { ...brand.aiMemory!, adHistory: [campaign, ...(brand.aiMemory?.adHistory || [])].slice(0, 10) } };
    setBrand(newBrand);
    if (isSupabaseConfigured) await updateBrandProfile(newBrand);
  };

  const saveChatToMemory = async (log: ChatLog) => {
    const newBrand = { ...brand, aiMemory: { ...brand.aiMemory!, chatHistory: [...(brand.aiMemory?.chatHistory || []), log].slice(-20) } };
    setBrand(newBrand);
    if (isSupabaseConfigured) await updateBrandProfile(newBrand);
  };

  const handleGlobalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsAIProcessing(true);
    try {
      const result = await parseGlobalCommand(searchQuery, language);
      console.log("OmniCommand Result:", result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAIProcessing(false);
      setSearchQuery('');
    }
  };

  const t = { en: { subtitle: 'Strategic Management OS', searchPlaceholder: 'Strategic Command...' }, ar: { subtitle: 'نظام الإدارة الاستراتيجي', searchPlaceholder: 'أمر استراتيجي...' } }[language];

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-all duration-700 ${language === 'ar' ? 'font-arabic' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;900&family=Outfit:wght@300;400;500;600;700;900&display=swap');
        .font-arabic { font-family: 'Noto Sans Arabic', 'Outfit', sans-serif; }
      `}</style>
      <div className={`fixed inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'} z-50 transform lg:relative lg:translate-x-0 transition-all duration-700 ${isSidebarOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
        <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} language={language} onOpenGuide={() => setIsGuideOpen(true)} />
      </div>
      <main className="flex-1 overflow-y-auto relative flex flex-col pb-24 lg:pb-0 custom-scrollbar">
        <header className="sticky top-0 z-[100] px-6 py-6 md:px-16 md:py-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-white/70 dark:bg-slate-950/70 backdrop-blur-3xl border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-8 w-full md:w-auto">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-[1.5rem] shadow-sm"><i className="fa-solid fa-bars-staggered text-xl"></i></button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none capitalize">{activeTab.replace('_', ' ')}</h1>
                {isSupabaseConfigured && !isCloudLoading && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Cloud Active</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                 <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">{t.subtitle}</p>
                 {isNeuralSyncing && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>}
              </div>
            </div>
          </div>
          <form onSubmit={handleGlobalSearch} className="flex-1 max-w-2xl relative w-full group">
            <input type="text" placeholder={t.searchPlaceholder} className="w-full pl-16 pr-24 py-6 bg-white/40 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-[2rem] text-sm font-black dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-2xl" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <i className={`fa-solid ${isAIProcessing ? 'fa-spinner-third animate-spin' : 'fa-wand-magic-sparkles'} absolute ${language === 'ar' ? 'right-7' : 'left-7'} top-1/2 -translate-y-1/2 text-indigo-500 text-xl`}></i>
          </form>
          <div className="flex items-center gap-6">
            <button onClick={() => setDarkMode(!darkMode)} className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all shadow-sm hover:scale-105"><i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'} text-xl`}></i></button>
            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-2 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
              <button onClick={() => setLanguage('en')} className={`px-5 py-2.5 text-[10px] font-black rounded-xl transition-all ${language === 'en' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>EN</button>
              <button onClick={() => setLanguage('ar')} className={`px-5 py-2.5 text-[10px] font-black rounded-xl transition-all ${language === 'ar' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>AR</button>
            </div>
          </div>
        </header>
        <div className="p-6 md:p-16 flex-1">
          {isCloudLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8 animate-pulse">
               <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-[2rem]"></div>
               <p className="font-black text-slate-400 uppercase tracking-[0.5em]">{language === 'ar' ? 'جاري مزامنة السحابة الاستراتيجية...' : 'Establishing Strategic Cloud...'}</p>
            </div>
          ) : (
            <>
              {activeTab === NavigationTab.Dashboard && <Dashboard contacts={contacts} deals={deals} language={language} brand={brand} />}
              {activeTab === NavigationTab.Contacts && <ContactList contacts={contacts} language={language} onAddContact={handleAddContact} />}
              {activeTab === NavigationTab.Deals && <DealsPipeline deals={deals} contacts={contacts} language={language} onAddDeal={handleAddDeal} />}
              {activeTab === NavigationTab.Marketing && <MarketingCenter language={language} brand={brand} onCampaignCreated={saveAdToMemory} />}
              {activeTab === NavigationTab.AI_Consultant && <AIConsultant contacts={contacts} deals={deals} language={language} onMessageLogged={saveChatToMemory} memory={brand.aiMemory?.chatHistory} />}
              {activeTab === NavigationTab.Settings && <AccountSettings language={language} brand={brand} setBrand={handleUpdateBrand} />}
            </>
          )}
        </div>
        <SmartGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} language={language} />
      </main>
    </div>
  );
};

export default App;
