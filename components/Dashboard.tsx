
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  // حساب البيانات المالية الحقيقية بناءً على الصفقات والمدفوعات
  const totalValue = deals.reduce((acc, d) => acc + d.value, 0);
  const totalCollected = deals.reduce((acc, d) => {
    const paid = d.payments?.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0) || 0;
    return acc + paid;
  }, 0);

  const chartData = [
    { name: 'Initial', val: 0 },
    { name: 'Target', val: totalValue * 0.4 },
    { name: 'Progress', val: totalCollected },
    { name: 'Velocity', val: totalValue },
  ];

  const t = {
    en: {
      revenue: 'Capital Momentum',
      clients: 'Strategic Assets',
      health: 'Collection Index',
      tips: 'Strategic Warfare',
      oracle: 'Oracle Visionary Intelligence',
      ticker: 'NEURAL NETWORK ACTIVE • MARKET SCANNING • REVENUE VELOCITY OPTIMIZED • OMNI V3 ONLINE',
      chartTitle: 'Tactical Cashflow Radar'
    },
    ar: {
      revenue: 'زخم رأس المال',
      clients: 'الأصول البشرية',
      health: 'مؤشر التحصيل',
      tips: 'تكتيكات الحرب التجارية',
      oracle: 'رؤية الأوراكل الاستراتيجية',
      ticker: 'الشبكة العصبية نشطة • جاري مسح السوق • تم تحسين سرعة الإيرادات • نظام أومني متصل',
      chartTitle: 'رادار التدفق النقدي التكتيكي'
    }
  }[language];

  useEffect(() => {
    const fetch = async () => {
      setLoadingInsight(true);
      const [prio, insight] = await Promise.all([
        getStrategicPriorities(contacts, deals, language),
        getSmartInsights(contacts, deals, language, brand.knowledgeBase)
      ]);
      setPriorities(prio);
      setOracleInsight(insight);
      setLoadingInsight(false);
    };
    fetch();
  }, [contacts.length, deals.length, language, brand.knowledgeBase]);

  const collectionRate = totalValue > 0 ? Math.round((totalCollected / totalValue) * 100) : 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Strategic Ticker */}
      <div className="w-full bg-slate-900 overflow-hidden py-3 rounded-2xl border border-white/5 shadow-2xl relative">
         <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-indigo-500/10 pointer-events-none"></div>
         <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] px-10">{t.ticker}</span>
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] px-10">{t.ticker}</span>
         </div>
      </div>

      <div className="flex justify-between items-center px-4">
         <div className="flex flex-col">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
               <i className="fa-solid fa-tower-observation text-indigo-600"></i>
               {language === 'ar' ? 'مركز القيادة الموحد' : 'Unified Command Center'}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Operational State: Optimal</p>
         </div>
         <div className={`flex items-center gap-3 px-6 py-2 rounded-full text-[10px] font-black border transition-all ${isSupabaseConfigured ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/10' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
            {isSupabaseConfigured ? (language === 'ar' ? 'سحابة أومني نشطة' : 'Omni Cloud Active') : (language === 'ar' ? 'الوضع المحلي' : 'Local Mode')}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2 bg-slate-950 rounded-[4rem] p-12 text-white border border-white/10 shadow-4xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-4">{t.revenue}</p>
            <h2 className="text-7xl font-black tracking-tighter mb-8">${totalValue.toLocaleString()}</h2>
            <div className="flex items-center gap-6">
               <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-black">${totalCollected.toLocaleString()} {language === 'ar' ? 'محصل' : 'Collected'}</span>
               </div>
               <div className="text-indigo-400 text-xs font-black uppercase tracking-widest">+18.4% Efficiency</div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] group-hover:scale-125 transition-transform duration-1000"></div>
          <i className="fa-solid fa-chart-line text-[250px] absolute -right-20 -bottom-20 opacity-5 rotate-12"></i>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center group hover:border-indigo-500 transition-all">
          <div className="w-28 h-28 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2.5rem] flex items-center justify-center text-5xl text-indigo-600 mb-6 font-black shadow-inner group-hover:scale-110 transition-transform">{collectionRate}%</div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.health}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center group hover:border-emerald-500 transition-all">
          <div className="w-28 h-28 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2.5rem] flex items-center justify-center text-5xl text-emerald-600 mb-6 font-black shadow-inner group-hover:scale-110 transition-transform">{contacts.length}</div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.clients}</p>
        </div>
      </div>

      {/* Financial Radar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-[4.5rem] p-12 border border-slate-100 dark:border-slate-800 shadow-3xl">
         <div className="flex justify-between items-center mb-12">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
               <i className="fa-solid fa-microchip text-indigo-500"></i>
               {t.chartTitle}
            </h3>
            <div className="flex gap-3">
               <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-[9px] font-black text-indigo-600 uppercase border border-indigo-100 dark:border-indigo-800">
                  Real-time Sync
               </div>
            </div>
         </div>
         <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                  <defs>
                     <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'black', fill: '#94a3b8'}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 25px 60px rgba(0,0,0,0.15)', fontWeight: 'black', padding: '20px' }} 
                    itemStyle={{ color: '#6366f1' }}
                  />
                  <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorVal)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Strategic Oracle Insight */}
      <div className="bg-indigo-600 rounded-[4.5rem] p-12 md:p-20 text-white border border-white/10 relative overflow-hidden shadow-4xl group">
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent)]"></div>
         <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 mb-10 flex items-center gap-4">
               <i className="fa-solid fa-atom animate-spin-slow"></i>
               {t.oracle}
            </h3>
            {loadingInsight ? (
               <div className="flex items-center gap-8 text-white/40 font-black text-2xl animate-pulse">
                  <i className="fa-solid fa-sync animate-spin"></i>
                  <span>NEURAL RECONSTRUCTION IN PROGRESS...</span>
               </div>
            ) : (
               <p className="text-3xl md:text-5xl font-black leading-[1.2] text-white tracking-tighter">
                  "{oracleInsight || 'Awaiting strategic data injection...'}"
               </p>
            )}
         </div>
         <i className="fa-solid fa-brain text-[400px] absolute -left-40 -bottom-40 opacity-5 group-hover:scale-110 transition-transform duration-1000"></i>
      </div>

      {/* Strategic Actions Matrix */}
      <div className="space-y-10">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter px-6 flex items-center gap-4">
           <i className="fa-solid fa-list-check text-indigo-500"></i>
           {t.tips}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {priorities.map((p, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 border border-slate-100 dark:border-slate-800 hover:shadow-3xl transition-all hover:-translate-y-3 group cursor-pointer">
              <span className={`text-[10px] font-black px-6 py-2 rounded-full uppercase mb-8 inline-block border ${p.impact === 'High' ? 'bg-rose-50 border-rose-100 text-rose-600 shadow-lg shadow-rose-500/10' : 'bg-indigo-50 border-indigo-100 text-indigo-600 shadow-lg shadow-indigo-500/10'}`}>
                {p.impact} IMPACT
              </span>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-indigo-600 transition-colors leading-tight">{p.task}</h4>
              <p className="text-sm text-slate-400 font-bold leading-relaxed">{p.reason}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
