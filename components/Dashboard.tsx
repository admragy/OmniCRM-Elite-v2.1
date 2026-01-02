
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Contact, Deal, BrandProfile } from '../types';
import { getStrategicPriorities, getSmartInsights } from '../services/geminiService';

interface DashboardProps {
  contacts: Contact[];
  deals: Deal[];
  language: 'en' | 'ar';
  brand: BrandProfile;
  deductTokens: (amount: number) => Promise<boolean>;
}

const Dashboard: React.FC<DashboardProps> = ({ contacts, deals, language, brand }) => {
  const [priorities, setPriorities] = useState<any[]>([]);
  const [oracleInsight, setOracleInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const totalValue = deals.reduce((acc, d) => acc + d.value, 0);
  const isCommander = brand.rank === 'Commander';

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [p, i] = await Promise.all([
        getStrategicPriorities(contacts, deals, language),
        getSmartInsights(contacts, deals, language, brand.knowledgeBase)
      ]);
      setPriorities(p);
      setOracleInsight(i);
      setLoading(false);
    };
    fetch();
  }, [contacts.length, deals.length, language]);

  const t = {
    en: { ticker: 'OMNI USC ACTIVE • GLOBAL NODES STABLE • STRATEGIC SYNC COMPLETE', oracle: 'The Strategic Oracle' },
    ar: { ticker: 'النظام نشط • العقد العالمية مستقرة • المزامنة الاستراتيجية مكتملة', oracle: 'أوراكل الاستراتيجية' }
  }[language];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      
      {/* HUD Ticker */}
      <div className={`w-full ${isCommander ? 'bg-[#020617]' : 'bg-slate-100'} overflow-hidden py-4 rounded-3xl border border-white/5 relative`}>
         <div className="flex whitespace-nowrap animate-marquee">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.6em] px-20">{t.ticker}</span>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.6em] px-20">{t.ticker}</span>
         </div>
      </div>

      {/* Main Stats HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[4rem] p-16 text-white shadow-4xl relative overflow-hidden group">
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-60">{language === 'ar' ? 'إجمالي الأصول تحت الإدارة' : 'Total Assets Under Management'}</p>
              <h2 className="text-8xl font-black tracking-tighter mb-8">${totalValue.toLocaleString()}</h2>
              <div className="flex items-center gap-6">
                 <div className="px-6 py-2 bg-white/10 rounded-full border border-white/20 text-xs font-black uppercase tracking-widest">+22.4% Strategic Velocity</div>
                 <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
           </div>
           <i className="fa-solid fa-chart-line text-[300px] absolute -right-20 -bottom-20 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000"></i>
        </div>

        <div className={`${isCommander ? 'bg-slate-900' : 'bg-white'} rounded-[4rem] p-12 border border-white/5 flex flex-col items-center justify-center text-center shadow-2xl`}>
           <div className="w-24 h-24 bg-indigo-600/10 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-indigo-500 mb-6">{contacts.length}</div>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{language === 'ar' ? 'العلاقات النشطة' : 'Active Partnerships'}</p>
        </div>
      </div>

      {/* Oracle Vision */}
      <div className="bg-[#020617] rounded-[5rem] p-16 md:p-24 border border-white/5 relative overflow-hidden group shadow-4xl">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(79,70,229,0.15),transparent)]"></div>
         <div className="relative z-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-indigo-500 mb-12 flex items-center gap-5">
               <i className="fa-solid fa-atom animate-spin-slow"></i>
               {t.oracle}
            </h3>
            {loading ? (
               <div className="text-white/20 font-black text-4xl animate-pulse">SYNTHESIZING MARKET INTELLIGENCE...</div>
            ) : (
               <p className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter max-w-5xl">
                  "{oracleInsight}"
               </p>
            )}
         </div>
      </div>

      {/* Action Priorities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
         {priorities.map((p, i) => (
            <div key={i} className={`${isCommander ? 'bg-slate-900' : 'bg-white'} rounded-[3.5rem] p-12 border border-white/5 hover:-translate-y-4 transition-all duration-500 shadow-2xl group`}>
               <span className="text-[9px] font-black px-4 py-1.5 bg-indigo-600 text-white rounded-full uppercase mb-10 inline-block">{p.impact} IMPACT</span>
               <h4 className="text-3xl font-black text-white mb-6 group-hover:text-indigo-500 transition-colors leading-tight">{p.task}</h4>
               <p className="text-slate-500 font-bold text-sm leading-relaxed">{p.reason}</p>
            </div>
         ))}
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard;
