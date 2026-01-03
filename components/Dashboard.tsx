
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Contact, Deal, BrandProfile } from '../types';
import { getCommandDecision } from '../services/geminiService';

interface DashboardProps {
  contacts: Contact[];
  deals: Deal[];
  brand: BrandProfile;
  language: 'en' | 'ar';
}

const Dashboard: React.FC<DashboardProps> = ({ contacts, deals, brand, language }) => {
  const [oracleDecision, setOracleDecision] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const totalRevenue = deals.filter(d => d.stage === 'Closed Won').reduce((acc, d) => acc + d.value, 0);
  const totalAdSpend = deals.reduce((acc, d) => acc + d.adSpend, 0);
  const globalRoas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;

  useEffect(() => {
    const fetchOracle = async () => {
      setLoading(true);
      const decision = await getCommandDecision({ totalRevenue, totalAdSpend, globalRoas, leadCount: contacts.length }, brand);
      setOracleDecision(decision || '');
      setLoading(false);
    };
    fetchOracle();
  }, [deals.length]);

  const t = {
    en: { hud: 'OPERATIONS RADAR', status: 'SYSTEM SECURE', oracle: 'COMMANDER ORACLE', revenue: 'Total Revenue', roas: 'Global ROAS', autopilot: 'Auto-Pilot' },
    ar: { hud: 'رادار العمليات', status: 'النظام مؤمن', oracle: 'أوراكل القيادة', revenue: 'إجمالي الإيرادات', roas: 'العائد الإعلاني', autopilot: 'الطيار الآلي' }
  }[language];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-20">
      
      {/* High-Tech HUD Header */}
      <div className="flex justify-between items-center bg-slate-950/50 p-6 rounded-3xl border border-indigo-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <i className="fa-solid fa-satellite-dish text-white"></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-widest">{t.hud}</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{t.status}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-10">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase">{t.autopilot}</p>
              <p className={`text-sm font-black ${brand.autoPilot.enabled ? 'text-emerald-500' : 'text-rose-500'}`}>
                {brand.autoPilot.enabled ? 'ENGAGED' : 'STANDBY'}
              </p>
           </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <i className="fa-solid fa-chart-line text-[150px] text-white"></i>
           </div>
           <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{t.revenue}</p>
           <h3 className="text-7xl font-black text-white tracking-tighter mb-8">${totalRevenue.toLocaleString()}</h3>
           <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={deals.slice(-10)}>
                    <defs>
                       <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '15px', color: '#fff' }} />
                    <Area type="monotone" dataKey="value" stroke="#4f46e5" fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-4xl shadow-indigo-600/20">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-60">{t.roas}</p>
              <h4 className="text-5xl font-black">{globalRoas.toFixed(2)}x</h4>
              <p className="text-[10px] font-bold mt-4">Profitability Threshold: {brand.autoPilot.targetRoas}x</p>
           </div>
           <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Market Share Scan</p>
              <div className="flex items-center justify-between mb-4">
                 <span className="text-xs font-black text-white">Direct Leads</span>
                 <span className="text-xs font-black text-indigo-400">{contacts.length}</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                 <div className="bg-indigo-500 h-full" style={{ width: '65%' }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* The Oracle Box */}
      <div className="bg-[#020617] border border-indigo-500/30 rounded-[4rem] p-16 shadow-[0_0_80px_rgba(79,70,229,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        <h3 className="text-[12px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-10 flex items-center gap-4">
           <i className="fa-solid fa-brain-circuit animate-spin-slow"></i>
           {t.oracle}
        </h3>
        {loading ? (
          <div className="space-y-4">
            <div className="h-6 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
            <div className="h-6 bg-white/5 rounded-full w-1/2 animate-pulse"></div>
          </div>
        ) : (
          <p className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter italic">
            "{oracleDecision}"
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard;
