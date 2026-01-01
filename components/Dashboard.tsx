
import React, { useEffect, useState } from 'react';
import { Contact, Deal, BrandProfile } from '../types';
import { getStrategicPriorities, generateStrategicAuditReport } from '../services/geminiService';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
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

  const isCloudReady = isSupabaseConfigured;

  const t = {
    en: {
      total: 'Growth Revenue', 
      totalDesc: 'Current cash flow and opportunities.',
      active: 'Clients', 
      happiness: 'Satisfaction', 
      auditTitle: 'System Audit', 
      auditBtn: 'Performance Audit',
      cost: 'Cost: 5 Units',
      growth: 'Sales Velocity',
      movesTitle: 'Smart Actions',
      online: 'Cloud Active',
      offline: 'Secure Local'
    },
    ar: {
      total: 'ارباح النمو', 
      totalDesc: 'التدفق المالي والفرص الحالية بنظامك.',
      active: 'العملاء', 
      happiness: 'نسبة الرضا', 
      auditTitle: 'تدقيق النظام', 
      auditBtn: 'فحص الاداء الكامل',
      cost: 'التكلفة: 5 وحدات',
      growth: 'سرعة المبيعات',
      movesTitle: 'اجراءات ذكية',
      online: 'سحابة نشطة',
      offline: 'وضع محلي امن'
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
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* System Status */}
      <div className="flex justify-end">
         <div className={`px-4 py-1.5 rounded-full border flex items-center gap-3 transition-all ${isCloudReady ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-500'}`}>
            <span className={`w-2 h-2 rounded-full ${isCloudReady ? 'bg-indigo-400' : 'bg-rose-500'}`}></span>
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">{isCloudReady ? t.online : t.offline}</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Main Card */}
        <div className="md:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 relative overflow-hidden shadow-xl">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-coins text-indigo-500 text-sm"></i>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{t.total}</p>
              </div>
              <h2 className="text-6xl font-black text-white tracking-tighter mb-2 leading-[1.1] pb-3 shimmer-text">${(totalRev / 1000).toFixed(1)}k</h2>
              <p className="text-slate-500 text-xs font-bold leading-relaxed">{t.totalDesc}</p>
           </div>
        </div>

        {/* Small Stats */}
        <div className="bg-slate-900/20 border border-white/5 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center">
           <i className="fa-solid fa-face-smile text-3xl text-indigo-500 mb-4"></i>
           <h3 className="text-4xl font-black text-white mb-1 leading-none pb-2">98%</h3>
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{t.happiness}</p>
        </div>

        <div className="bg-slate-900/20 border border-white/5 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center">
           <i className="fa-solid fa-users text-3xl text-emerald-500 mb-4"></i>
           <h3 className="text-4xl font-black text-white mb-1 leading-none pb-2">{contacts.length}</h3>
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{t.active}</p>
        </div>

        {/* Sales Chart */}
        <div className="md:col-span-3 bg-slate-900/10 border border-white/5 rounded-[3rem] p-8 h-64">
           <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 leading-none">{t.growth}</h4>
           <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{v: 20}, {v: 40}, {v: 35}, {v: 70}, {v: 60}, {v: 95}, {v: 85}]}>
                  <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={4} fill="rgba(99,102,241,0.1)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Audit Button */}
        <div 
          onClick={handleAudit}
          className="md:col-span-1 bg-indigo-600 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-500 transition-all shadow-xl group"
        >
           <i className={`fa-solid ${isAuditing ? 'fa-sync animate-spin' : 'fa-clipboard-check'} text-4xl text-white mb-4`}></i>
           <h3 className="text-sm font-black text-white uppercase tracking-widest leading-tight">{isAuditing ? 'جاري الفحص...' : t.auditBtn}</h3>
           <p className="text-indigo-200 text-[8px] font-black mt-2 opacity-60 tracking-widest leading-none">{t.cost}</p>
        </div>

      </div>

      {/* Strategic Actions */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-white tracking-tighter uppercase flex items-center gap-3 leading-tight pb-3">
           <i className="fa-solid fa-bolt text-indigo-500 text-sm"></i>
           {t.movesTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {priorities.map((p, i) => (
            <div key={i} className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 border-r-4 border-r-indigo-500">
              <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mb-3 inline-block leading-none ${p.impact === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                {p.impact} Impact
              </span>
              <h4 className="text-lg font-black text-white mb-2 leading-tight pb-1">{p.task}</h4>
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed">{p.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
