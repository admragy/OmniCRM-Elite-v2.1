
import React, { useEffect, useState } from 'react';
import { Contact, Deal, BrandProfile } from '../types';
import { getSmartInsights, getStrategicPriorities, generateStrategicAuditReport } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

interface DashboardProps {
  contacts: Contact[];
  deals: Deal[];
  language: 'en' | 'ar';
  brand: BrandProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ contacts, deals, language, brand }) => {
  const [insights, setInsights] = useState<string>('');
  const [priorities, setPriorities] = useState<any[]>([]);
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = {
    en: {
      total: 'Total Revenue', active: 'Active Partners', happiness: 'Satisfaction Index', efficiency: 'AI Sync',
      compass: 'Strategic Compass', compassDesc: 'Your priority action items for today',
      insights: 'Growth Strategy', loading: 'Syncing intelligence...',
      auditBtn: 'Generate Strategic Market Audit', auditing: 'Analyzing System Gaps...',
      auditTitle: 'System & Market Alignment Report',
      pipelineTitle: 'Revenue Pipeline Distribution',
      performanceTitle: 'Growth Velocity'
    },
    ar: {
      total: 'إجمالي الإيرادات', active: 'الشركاء النشطون', happiness: 'مؤشر الرضا العام', efficiency: 'مزامنة ذكية',
      compass: 'البوصلة الاستراتيجية', compassDesc: 'أهم التحركات المقترحة لك اليوم لزيادة النمو',
      insights: 'رؤى النمو الاستراتيجي', loading: 'جاري مزامنة البيانات...',
      auditBtn: 'توليد تقرير تدقيق السوق الاستراتيجي', auditing: 'جاري تحليل فجوات النظام...',
      auditTitle: 'تقرير توافق النظام مع متطلبات السوق',
      pipelineTitle: 'توزيع تدفق الإيرادات',
      performanceTitle: 'سرعة النمو'
    }
  }[language];

  const fetchData = async () => {
    setIsLoading(true);
    const [ins, prio] = await Promise.all([
      getSmartInsights(contacts, deals, language),
      getStrategicPriorities(contacts, deals, language)
    ]);
    setInsights(ins);
    setPriorities(prio);
    setIsLoading(false);
  };

  const runAudit = async () => {
    setIsAuditing(true);
    const report = await generateStrategicAuditReport(contacts, deals, brand, language);
    setAuditReport(report);
    setIsAuditing(false);
  };

  useEffect(() => {
    fetchData();
  }, [contacts.length, deals.length, language]);

  const totalRev = deals.reduce((acc, d) => acc + d.value, 0);
  const avgSatisfaction = contacts.length > 0 
    ? Math.round(contacts.reduce((acc, c) => acc + (c.psychology?.sentimentScore || 0), 0) / contacts.length)
    : 85;

  // Chart Data Preparation
  const pipelineData = [
    { name: language === 'ar' ? 'اكتشاف' : 'Discovery', value: deals.filter(d => d.stage === 'Discovery').reduce((a,b)=>a+b.value, 0) },
    { name: language === 'ar' ? 'عرض' : 'Proposal', value: deals.filter(d => d.stage === 'Proposal').reduce((a,b)=>a+b.value, 0) },
    { name: language === 'ar' ? 'تفاوض' : 'Negotiation', value: deals.filter(d => d.stage === 'Negotiation').reduce((a,b)=>a+b.value, 0) },
    { name: language === 'ar' ? 'إغلاق' : 'Won', value: deals.filter(d => d.stage === 'Closed Won').reduce((a,b)=>a+b.value, 0) },
  ];

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <KPICard title={t.total} value={`$${(totalRev / 1000).toFixed(1)}k`} change="+12.4%" icon="fa-sack-dollar" color="indigo" />
        <KPICard title={t.active} value={contacts.length.toString()} change="Partners" icon="fa-users-crown" color="emerald" />
        <KPICard title={t.happiness} value={`${avgSatisfaction}%`} change="AI Index" icon="fa-face-smile-hearts" color="rose" />
        <KPICard title={t.efficiency} value="99.9%" change="Active" icon="fa-bolt-lightning" color="sky" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[4rem] p-10 shadow-3xl border border-slate-100 dark:border-slate-800">
           <div className="flex justify-between items-center mb-10">
             <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{t.pipelineTitle}</h3>
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Flow</span>
             </div>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}} 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                  />
                  <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#6366f1', '#818cf8', '#a5b4fc', '#10b981'][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-slate-950 rounded-[4rem] p-10 shadow-3xl border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
           <h3 className="text-xl font-black text-white tracking-tight mb-8 relative z-10">{t.performanceTitle}</h3>
           <div className="h-[180px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[{v: 20}, {v: 45}, {v: 38}, {v: 70}, {v: 60}, {v: 85}]}>
                    <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={4} fill="url(#colorPv)" />
                    <defs>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                 </AreaChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-end relative z-10">
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Growth Forecast</p>
                 <p className="text-2xl font-black text-white">+28.5%</p>
              </div>
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                 <i className="fa-solid fa-arrow-trend-up"></i>
              </div>
           </div>
        </div>
      </div>

      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3.5rem] p-1 md:p-1.5 shadow-3xl overflow-hidden group">
         <div className="bg-white dark:bg-slate-900 rounded-[3.3rem] p-10 h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
               <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{t.compass}</h3>
                  <p className="text-slate-400 font-bold text-sm">{t.compassDesc}</p>
               </div>
               <button 
                onClick={runAudit}
                disabled={isAuditing}
                className="px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
               >
                 {isAuditing ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-chart-magnifying-glass"></i>}
                 {isAuditing ? t.auditing : t.auditBtn}
               </button>
            </div>

            {auditReport ? (
              <div className="mb-10 p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/50 animate-in slide-in-from-top-4">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center"><i className="fa-solid fa-clipboard-check"></i></div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">{t.auditTitle}</h4>
                 </div>
                 <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-wrap">
                    {auditReport}
                 </div>
                 <button onClick={() => setAuditReport(null)} className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">{language === 'ar' ? 'إغلاق التقرير' : 'Close Report'}</button>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {priorities.length > 0 ? priorities.map((p, i) => (
                 <div key={i} className="group/item relative bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:scale-[1.02] cursor-pointer">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm text-indigo-500 font-black">0{i+1}</div>
                       <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${p.impact === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                         {p.impact} Impact
                       </span>
                    </div>
                    <p className="text-base font-black text-slate-900 dark:text-white mb-3 leading-tight">{p.task}</p>
                    <p className="text-[11px] font-bold text-slate-400 leading-relaxed">{p.reason}</p>
                 </div>
               )) : (
                 [1,2,3].map(i => <div key={i} className="h-48 bg-slate-50 dark:bg-slate-800 animate-pulse rounded-[2.5rem]"></div>)
               )}
            </div>
         </div>
      </section>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-3xl border border-slate-100 dark:border-slate-800">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-10">{t.insights}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {insights ? insights.split('\n').filter(l => l.trim()).map((line, i) => (
             <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
               <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-sm"><i className="fa-solid fa-lightbulb"></i></div>
               <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</p>
             </div>
           )) : <p className="animate-pulse text-slate-400">{t.loading}</p>}
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, change, icon, color }: any) => {
  const colorMap: any = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100/50 dark:border-indigo-800/50',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-800/50',
    rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100/50 dark:border-rose-800/50',
    sky: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-100/50 dark:border-sky-800/50'
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl transition-all hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-8">
        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-lg border transition-all ${colorMap[color]}`}><i className={`fa-solid ${icon}`}></i></div>
        <span className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-[10px] font-black rounded-full text-slate-500 dark:text-slate-400 uppercase tracking-widest">{change}</span>
      </div>
      <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{value}</p>
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{title}</p>
    </div>
  );
};

export default Dashboard;
