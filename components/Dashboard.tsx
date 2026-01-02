
import React, { useEffect, useState } from 'react';
import { Contact, Deal, BrandProfile } from '../types';
import { getStrategicPriorities, getSmartInsights } from '../services/geminiService';
import { isSupabaseConfigured } from '../services/supabaseService';

interface DashboardProps {
  contacts: Contact[];
  deals: Deal[];
  language: 'en' | 'ar';
  brand: BrandProfile;
  deductTokens: (amount: number) => Promise<boolean>;
}

const Dashboard: React.FC<DashboardProps> = ({ contacts, deals, language, brand, deductTokens }) => {
  const [priorities, setPriorities] = useState<any[]>([]);
  const [oracleInsight, setOracleInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const t = {
    en: {
      revenue: 'Total Revenue',
      clients: 'Active Clients',
      health: 'Business Health',
      tips: 'Smart Recommendations',
      oracle: 'Oracle Visionary Insight',
      cloudOn: 'Cloud Sync Active',
      cloudOff: 'Local Mode Only'
    },
    ar: {
      revenue: 'إجمالي الأرباح',
      clients: 'العملاء النشطين',
      health: 'حالة العمل',
      tips: 'توصيات ذكية',
      oracle: 'رؤية الأوراكل الاستراتيجية',
      cloudOn: 'المزامنة السحابية نشطة',
      cloudOff: 'وضع العمل المحلي'
    }
  }[language];

  useEffect(() => {
    const fetch = async () => {
      setLoadingInsight(true);
      const [prio, insight] = await Promise.all([
        getStrategicPriorities(contacts, deals, language),
        getSmartInsights(contacts, deals, language)
      ]);
      setPriorities(prio);
      setOracleInsight(insight);
      setLoadingInsight(false);
    };
    fetch();
  }, [contacts.length, deals.length, language]);

  const totalRev = deals.reduce((acc, d) => acc + d.value, 0);
  const healthScore = Math.min(100, (contacts.length * 5) + (deals.length * 10));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4">
         <h2 className="text-xl font-bold text-gray-900">{language === 'ar' ? 'نظرة عامة' : 'Dashboard'}</h2>
         <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border ${isSupabaseConfigured ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></span>
            {isSupabaseConfigured ? t.cloudOn : t.cloudOff}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm group relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t.revenue}</p>
            <h2 className="text-6xl font-black text-gray-900 tracking-tight">${(totalRev / 1000).toFixed(1)}k</h2>
          </div>
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl text-blue-600 mb-4 font-black">{healthScore}%</div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.health}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-2xl text-green-600 mb-4 font-black">{contacts.length}</div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.clients}</p>
        </div>
      </div>

      {/* Oracle Visionary Insight Section */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-12 text-white border border-white/5 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>
         <div className="relative z-10">
            <h3 className="text-lg font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-3">
               <i className="fa-solid fa-wand-magic-sparkles"></i>
               {t.oracle}
            </h3>
            {loadingInsight ? (
               <div className="flex items-center gap-4 text-slate-500 font-bold">
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  <span>Calculating visionary trajectory...</span>
               </div>
            ) : (
               <p className="text-xl md:text-2xl font-bold leading-relaxed text-slate-200 italic">
                  "{oracleInsight || 'Synchronizing with market dynamics...'}"
               </p>
            )}
         </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight px-2">{t.tips}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {priorities.map((p, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-8 border border-gray-100 hover:shadow-lg transition-all">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-4 inline-block ${p.impact === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                {p.impact} Impact
              </span>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{p.task}</h4>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">{p.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
