
import React, { useState, useEffect, useRef } from 'react';
import { NavigationTab, NavigationTabType, Contact, Deal, BrandProfile, Task, ChatLog } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ContactList from './components/ContactList';
import DealsPipeline from './components/DealsPipeline';
import ActionMatrix from './components/ActionMatrix';
import AIConsultant from './components/AIConsultant';
import MarketingCenter from './components/MarketingCenter';
import MarketIntelligence from './components/MarketIntelligence';
import AccountSettings from './components/AccountSettings';
import SmartGuide from './components/SmartGuide';
import { parseGlobalCommand } from './services/geminiService';
import { getContacts, getDeals, getTasks, getBrandProfile, saveContact, saveDeal, saveTask, deleteTask, updateBrandProfile, isSupabaseConfigured } from './services/supabaseService';

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
  const [activeTab, setActiveTab] = useState<NavigationTabType>(NavigationTab.Dashboard);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [brand, setBrand] = useState<BrandProfile>(INITIAL_BRAND);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('ar');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [isCloudLoading, setIsCloudLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsCloudLoading(false);
      return;
    }
    const fetchInitialData = async () => {
      setIsCloudLoading(true);
      try {
        const [dbContacts, dbDeals, dbTasks, dbBrand] = await Promise.all([
          getContacts(),
          getDeals(),
          getTasks(),
          getBrandProfile()
        ]);
        if (dbContacts.length > 0) setContacts(dbContacts);
        if (dbDeals.length > 0) setDeals(dbDeals);
        if (dbTasks.length > 0) setTasks(dbTasks);
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

  const handleAddTask = async (t: Task) => {
    setTasks(prev => [t, ...prev]);
    if (isSupabaseConfigured) await saveTask(t);
  };

  const handleToggleTask = async (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Pending' ? 'Completed' : 'Pending' } : t));
    const task = tasks.find(t => t.id === id);
    if (task && isSupabaseConfigured) await saveTask({ ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' });
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (isSupabaseConfigured) await deleteTask(id);
  };

  const handleUpdateBrand = async (newBrand: BrandProfile) => {
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
      if (result.action === 'add_contact') setActiveTab(NavigationTab.Contacts);
    } catch (e) {
    } finally {
      setIsAIProcessing(false);
      setSearchQuery('');
    }
  };

  const t = { 
    en: { subtitle: 'Strategic Management OS', searchPlaceholder: 'Strategic Command...' }, 
    ar: { subtitle: 'نظام الإدارة الاستراتيجي', searchPlaceholder: 'أمر استراتيجي...' } 
  }[language];

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
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Cloud Ready</span>
                  </div>
                )}
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">{t.subtitle}</p>
            </div>
          </div>
          <form onSubmit={handleGlobalSearch} className="flex-1 max-w-2xl relative w-full group">
            <input type="text" placeholder={t.searchPlaceholder} className="w-full pl-16 pr-24 py-6 bg-white/40 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-[2rem] text-sm font-black dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <i className={`fa-solid ${isAIProcessing ? 'fa-spinner-third animate-spin' : 'fa-wand-magic-sparkles'} absolute ${language === 'ar' ? 'right-7' : 'left-7'} top-1/2 -translate-y-1/2 text-indigo-500 text-xl`}></i>
          </form>
          <div className="flex items-center gap-6">
            <button onClick={() => setDarkMode(!darkMode)} className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"><i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'} text-xl`}></i></button>
            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-2 rounded-[1.5rem] border border-slate-200 dark:border-slate-700">
              <button onClick={() => setLanguage('en')} className={`px-5 py-2.5 text-[10px] font-black rounded-xl transition-all ${language === 'en' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>EN</button>
              <button onClick={() => setLanguage('ar')} className={`px-5 py-2.5 text-[10px] font-black rounded-xl transition-all ${language === 'ar' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>AR</button>
            </div>
          </div>
        </header>
        <div className="p-6 md:p-16 flex-1">
          {isCloudLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8">
               <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] animate-pulse"></div>
               <p className="font-black text-slate-400 uppercase tracking-[0.5em]">{language === 'ar' ? 'جاري مزامنة السحابة الاستراتيجية...' : 'Establishing Strategic Cloud...'}</p>
            </div>
          ) : (
            <>
              {activeTab === NavigationTab.Dashboard && <Dashboard contacts={contacts} deals={deals} language={language} brand={brand} />}
              {activeTab === NavigationTab.Contacts && <ContactList contacts={contacts} language={language} onAddContact={handleAddContact} />}
              {activeTab === NavigationTab.Deals && <DealsPipeline deals={deals} contacts={contacts} language={language} onAddDeal={handleAddDeal} />}
              {activeTab === NavigationTab.Tasks && <ActionMatrix tasks={tasks} deals={deals} contacts={contacts} language={language} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} />}
              {activeTab === NavigationTab.Intelligence && <MarketIntelligence brand={brand} language={language} />}
              {activeTab === NavigationTab.Marketing && <MarketingCenter language={language} brand={brand} />}
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
