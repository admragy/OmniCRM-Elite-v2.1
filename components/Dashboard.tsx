
import React, { useEffect, useState } from 'react';
import { Contact, Deal, BrandProfile } from '../types';
import { getSmartInsights, getStrategicPriorities, generateStrategicAuditReport } from '../services/geminiService';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
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
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const isGeminiReady = !!process.env.API_KEY;
  const isCloudReady = isSupabaseConfigured;

  const t = {
    en: {
      total: 'Total Revenue Potential', 
      totalDesc: 'The total value of all business opportunities.',
      active: 'Trusted Partners', 
      happiness: 'Relationship Health', 
      auditTitle: 'Strategic Business Audit', 
      auditBtn: 'Run AI Diagnostics',
      cost: 'Cost: 5 Units',
      growth: 'Revenue Velocity (7d)',
      movesTitle: 'Top Priority Moves',
      linkStatus: 'Neural Link Status',
      online: 'Strategic Cloud: Online',
      offline: 'Demo Mode: Local Only'
    },
    ar: {
      total: 'إجمالي قيمة الإيرادات', 
      totalDesc: 'القيمة المالية لكل الفرص المسجلة حالياً.',
      active: 'الشركاء الموثوقون', 
      happiness: 'صحة العلاقات', 
      auditTitle: 'التدقيق الاستراتيجي للأعمال', 
      auditBtn: 'تشغيل تشخيص الذكاء الاصطناعي',
      cost: 'التكلفة: ٥ وحدات طاقة',
      growth: 'سرعة الإيرادات (أسبوعي)',
      movesTitle: 'تحركات ذات أولوية قصوى',
      linkStatus: 'حالة الاتصال العصبي',
      online: 'السحابة الاستراتيجية: متصلة',
      offline: 'وضع المحاكاة: محلي فقط'
    }
  }[language];

  useEffect(() => {
    const fetch = async () => {
      const prio = await getStrategicPriorities(contacts, deals, language);
      setPriorities(prio);
    };
    fetch();
  }, [contacts.length, deals.length, language]);

  const totalRev = deals.reduce((acc, d) => acc + d.value, 0);

  const handleAudit = async () => {
    const success = await deductTokens(5);
    if (!success) return;
    
    setIsAuditing(true);
    const r = await generateStrategicAuditReport(contacts, deals, brand, language);
    setAuditReport(r);
    setIsAuditing(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      
      {/* Neural Status Indicator */}
      <div className="flex justify-end gap-4">
         <div className={`px-5 py-2 rounded-full border flex items-center gap-3 transition-all ${isCloudReady ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
            <span className={`w-2 h-2 rounded-full ${isCloudReady ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="text-[10px] font-black uppercase tracking-widest">{isCloudReady ? t.online : t.offline}</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="md:col-span-2 quantum-card rounded-[3.5rem] p-12 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5">
              <i className="fa-solid fa-vault text-9xl text-indigo-400"></i>
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"></span>
                <p className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.3em]">{t.total}</p>
              </div>
              <h2 className="text-7xl font-black text-white tracking-tighter mb-4 shimmer-text">${(totalRev / 1000).toFixed(1)}k</h2>
              <p className="text-slate-500 text-sm font-bold">{t.totalDesc}</p>
           </div>
        </div>

        <div className="md:col-span-1 quantum-card rounded-[3.5rem] p-10 flex flex-col justify-between items-center text-center">
           <div className="w-20 h-20 bg-indigo-600/10 rounded-[2.5rem] flex items-center justify-center mb-6 border border-indigo-500/20 shadow-inner">
              <i className="fa-solid fa-heart-pulse text-3xl text-indigo-400"></i>
           </div>
           <div>
              <h3 className="text-5xl font-black text-white mb-2 tracking-tight">94%</h3>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">{t.happiness}</p>
           </div>
        </div>

        <div className="md:col-span-1 quantum-card rounded-[3.5rem] p-10 flex flex-col justify-between">
           <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-slate-800 rounded-[1.5rem] flex items-center justify-center shadow-xl border border-white/5">
                <i className="fa-solid fa-handshake text-xl text-slate-400"></i>
              </div>
           </div>
           <div>
              <h3 className="text-6xl font-black text-white mb-2 tracking-tighter">{contacts.length}</h3>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t.active}</p>
           </div>
        </div>

        <div className="md:col-span-3 quantum-card rounded-[4rem] p-12">
           <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{v: 30}, {v: 55}, {v: 45}, {v: 85}, {v: 70}, {v: 98}, {v: 90}]}>
                  <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={5} fill="rgba(99, 102, 241, 0.1)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div 
          onClick={handleAudit}
          className="md:col-span-1 bg-indigo-600 hover:bg-indigo-500 rounded-[4rem] p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95 shadow-3xl shadow-indigo-600/30 group"
        >
           <div className="w-20 h-20 bg-white/15 rounded-[2rem] flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-2xl">
              <i className={`fa-solid ${isAuditing ? 'fa-spinner-third animate-spin' : 'fa-brain-circuit'} text-4xl text-white`}></i>
           </div>
           <h3 className="text-lg font-black text-white uppercase tracking-widest leading-tight">{isAuditing ? 'DIAGNOSING...' : t.auditBtn}</h3>
           <p className="text-indigo-200 text-[9px] font-black mt-3 opacity-80 uppercase tracking-widest">{t.cost}</p>
        </div>

      </div>

      <div className="space-y-8 mt-16">
        <h3 className="text-2xl font-black text-white tracking-tighter uppercase px-6">{t.movesTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {priorities.map((p, i) => (
            <div key={i} className="quantum-card rounded-[3rem] p-10 border-l-8 border-l-indigo-600">
              <h4 className="text-xl font-black text-white mb-4 leading-tight">{p.task}</h4>
              <p className="text-xs font-bold text-slate-500 leading-relaxed">{p.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {auditReport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-950/95 backdrop-blur-3xl overflow-y-auto">
          <div className="quantum-card w-full max-w-5xl rounded-[5rem] p-16 md:p-20 relative border border-white/15 custom-scrollbar overflow-y-auto max-h-[90vh]">
             <button onClick={() => setAuditReport(null)} className="absolute top-12 right-12 text-slate-500 hover:text-white transition-colors bg-white/5 w-16 h-16 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-xmark text-2xl"></i>
             </button>
             <h2 className="text-5xl font-black text-white tracking-tighter mb-16">{t.auditTitle}</h2>
             <div className="prose prose-invert max-w-none text-slate-300 font-medium leading-loose whitespace-pre-wrap text-xl bg-white/5 p-12 rounded-[3.5rem] border border-white/10 shadow-inner">
                {auditReport}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
