
import React, { useState, useEffect } from 'react';
import { NavigationTab, NavigationTabType, Contact, Deal, BrandProfile, Task, ChatLog } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ContactList from './components/ContactList';
import DealsPipeline from './components/DealsPipeline';
import ActionMatrix from './components/ActionMatrix';
import AIConsultant from './components/AIConsultant';
import MarketingCenter from './components/MarketingCenter';
import MediaLab from './components/MediaLab';
import EdgeIntelligence from './components/EdgeIntelligence';
import MarketIntelligence from './components/MarketIntelligence';
import AccountSettings from './components/AccountSettings';
import SmartGuide from './components/SmartGuide';
import { parseGlobalCommand } from './services/geminiService';
import { getContacts, getDeals, getTasks, getBrandProfile, saveContact, saveDeal, saveTask, deleteTask, updateBrandProfile } from './services/supabaseService';

const INITIAL_BRAND: BrandProfile = {
  name: 'Omni Digital',
  website: 'https://omnicrm.ai',
  industry: 'Strategic Marketing',
  description: 'Elite AI consulting for global brands.',
  targetAudience: 'Visionary leaders and enterprise executives.',
  tokens: 1000, // رصيد البداية
  userPsychology: { stressLevel: 10, focusArea: 'Exponential Growth', managementStyle: 'Strategic' },
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
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [dbC, dbD, dbT, dbB] = await Promise.all([getContacts(), getDeals(), getTasks(), getBrandProfile()]);
        if (dbC.length > 0) setContacts(dbC);
        if (dbD.length > 0) setDeals(dbD);
        if (dbT.length > 0) setTasks(dbT);
        if (dbB) setBrand({ ...INITIAL_BRAND, ...dbB });
      } catch (err) {}
    };
    fetchInitialData();
  }, []);

  const deductTokens = async (amount: number) => {
    if (brand.tokens < amount) {
      alert(language === 'ar' ? 'رصيد الطاقة غير كافٍ! يرجى الشحن.' : 'Insufficient energy! Please recharge.');
      return false;
    }
    const newBrand = { ...brand, tokens: brand.tokens - amount };
    setBrand(newBrand);
    await updateBrandProfile(newBrand);
    return true;
  };

  const formatSystemTime = () => {
    return currentTime.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const updatedTask = { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' } as Task;
    const result = await saveTask(updatedTask);
    if (result) {
      setTasks(tasks.map(t => t.id === id ? result : t));
    }
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className={`flex h-screen bg-transparent overflow-hidden transition-all duration-1000`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Backdrop for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[550] lg:hidden animate-in fade-in duration-300" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'} z-[600] transform lg:relative lg:translate-x-0 transition-all duration-700 ease-in-out ${isSidebarOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
        <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} language={language} onOpenGuide={() => setIsGuideOpen(true)} />
      </div>

      <main className="flex-1 overflow-y-auto relative flex flex-col custom-scrollbar">
        <header className="sticky top-0 z-[100] px-10 py-8 md:px-16 md:py-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-950/60 backdrop-blur-3xl border-b border-white/5 shadow-2xl">
          <div className="flex items-center gap-8 w-full md:w-auto">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 shrink-0"><i className="fa-solid fa-bars-staggered"></i></button>
            <div className="min-w-0">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter capitalize shimmer-text mb-1 truncate">{activeTab.replace('_', ' ')}</h1>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] truncate">{language === 'ar' ? 'مركز القيادة العصبية' : 'Neural Command Center'}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            {/* Token Counter */}
            <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4 group">
               <div className="flex flex-col items-end">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">{language === 'ar' ? 'وحدات الطاقة' : 'Energy Units'}</p>
                  <p className="text-lg font-black text-indigo-400 font-mono tracking-tighter">{brand.tokens}</p>
               </div>
               <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-500 shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-bolt-lightning text-xl"></i>
               </div>
            </div>

            <div className="hidden md:flex flex-col items-center px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 whitespace-nowrap">{language === 'ar' ? 'التوقيت' : 'Time'}</p>
               <p className="text-sm font-black text-slate-300 font-mono tracking-tighter whitespace-nowrap">{formatSystemTime()}</p>
            </div>
          </div>
        </header>

        <div className="p-10 md:p-16 flex-1">
          {activeTab === NavigationTab.Dashboard && <Dashboard contacts={contacts} deals={deals} language={language} brand={brand} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.Contacts && <ContactList contacts={contacts} language={language} onAddContact={(c) => setContacts([c, ...contacts])} />}
          {activeTab === NavigationTab.Deals && <DealsPipeline deals={deals} contacts={contacts} language={language} onAddDeal={(d) => setDeals([d, ...deals])} />}
          {activeTab === NavigationTab.Tasks && <ActionMatrix tasks={tasks} deals={deals} contacts={contacts} language={language} onAddTask={(t) => setTasks([t, ...tasks])} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} />}
          {activeTab === NavigationTab.Marketing && <MarketingCenter language={language} brand={brand} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.MediaLab && <MediaLab brand={brand} language={language} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.AI_Consultant && <AIConsultant contacts={contacts} deals={deals} language={language} deductTokens={deductTokens} />}
          {activeTab === NavigationTab.Settings && <AccountSettings language={language} brand={brand} setBrand={setBrand} />}
        </div>
        <SmartGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} language={language} />
      </main>
    </div>
  );
};

export default App;
