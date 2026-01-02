
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

  // بيانات افتراضية للرسم البياني تعتمد على الصفقات الحالية
  const chartData = [
    { name: 'Week 1', rev: (deals.length * 500) * 0.4 },
    { name: 'Week 2', rev: (deals.length * 500) * 0.7 },
    { name: 'Week 3', rev: (deals.length * 500) * 0.9 },
    { name: 'Week 4', rev: deals.reduce((acc, d) => acc + d.value, 0) },
  ];

  const t = {
    en: {
      revenue: 'Total Capital Velocity',
      clients: 'Strategic Partners',
      health: 'Growth Index',
      tips: 'Strategic Actions',
      oracle: 'Oracle Visionary Insight',
      cloudOn: 'Quantum Cloud Active',
      cloudOff: 'Local Secure Mode',
      chartTitle: 'Revenue Momentum'
    },
    ar: {
      revenue: 'سرعة تدفق رأس المال',
      clients: 'الشركاء الاستراتيجيين',
      health: 'مؤشر النمو',
      tips: 'إجراءات استراتيجية',
      oracle: 'رؤية الأوراكل الاستراتيجية',
      cloudOn: 'السحابة الكمية نشطة',
      cloudOff: 'وضع العمل المحلي الآمن',
      chartTitle: 'زخم الإيرادات'
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
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4">
         <div className="flex flex-col">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{language === 'ar' ? 'مركز العمليات' : 'Operation Center'}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
         </div>
         <div className={`flex items-center gap-3 px-6 py-2 rounded-full text-[10px] font-black border transition-all ${isSupabaseConfigured ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/10' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
            {isSupabaseConfigured ? t.cloudOn : t.cloudOff}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[3.5rem] p-12 text-white border border-white/5 shadow-3xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">{t.revenue}</p>
            <h2 className="text-7xl font-black tracking-tighter mb-8">${totalRev.toLocaleString()}</h2>
            <div className="flex items-center gap-3 text-emerald-400 font-bold text-sm">
               <i className="fa-solid fa-arrow-trend-up"></i>
               <span>+12.5% {language === 'ar' ? 'نمو هائل' : 'Exponential Growth'}</span>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
          <i className="fa-solid fa-chart-line text-[200px] absolute -right-10 -bottom-10 opacity-5 rotate-12"></i>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center group hover:border-indigo-500 transition-all">
          <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] flex items-center justify-center text-4xl text-indigo-600 mb-6 font-black shadow-inner group-hover:scale-110 transition-transform">{healthScore}%</div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.health}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center group hover:border-emerald-500 transition-all">
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] flex items-center justify-center text-4xl text-emerald-600 mb-6 font-black shadow-inner group-hover:scale-110 transition-transform">{contacts.length}</div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.clients}</p>
        </div>
      </div>

      {/* Revenue Momentum Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl">
         <h3 className="text-xl font-black text-slate-900 dark:text-white mb-10 tracking-tight flex items-center gap-3">
            <i className="fa-solid fa-wave-square text-indigo-500"></i>
            {t.chartTitle}
         </h3>
         <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                  <defs>
                     <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <YAxis hide />
                  <Tooltip 
                     contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="rev" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Oracle Visionary Insight Section */}
      <div className="bg-indigo-600 rounded-[4rem] p-12 md:p-16 text-white border border-white/10 relative overflow-hidden shadow-3xl group">
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent)]"></div>
         <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 mb-8 flex items-center gap-4">
               <i className="fa-solid fa-microchip-ai animate-pulse"></i>
               {t.oracle}
            </h3>
            {loadingInsight ? (
               <div className="flex items-center gap-6 text-white/40 font-black text-xl animate-pulse">
                  <i className="fa-solid fa-sync animate-spin"></i>
                  <span>NEURAL SYNC IN PROGRESS...</span>
               </div>
            ) : (
               <p className="text-2xl md:text-4xl font-black leading-[1.3] text-white tracking-tight">
                  "{oracleInsight || 'Synchronizing with market dynamics...'}"
               </p>
            )}
         </div>
         <i className="fa-solid fa-brain text-[300px] absolute -left-20 -bottom-20 opacity-5 group-hover:rotate-12 transition-transform duration-1000"></i>
      </div>

      {/* Strategic Actions */}
      <div className="space-y-8">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight px-4">{t.tips}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {priorities.map((p, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all hover:-translate-y-2 group">
              <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase mb-6 inline-block border ${p.impact === 'High' ? 'bg-rose-50 border-rose-100 text-rose-600 shadow-lg shadow-rose-500/10' : 'bg-indigo-50 border-indigo-100 text-indigo-600 shadow-lg shadow-indigo-500/10'}`}>
                {p.impact} IMPACT
              </span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-indigo-600 transition-colors">{p.task}</h4>
              <p className="text-sm text-slate-400 font-bold leading-relaxed">{p.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
