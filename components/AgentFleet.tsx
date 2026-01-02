
import React, { useState } from 'react';
import { runAgentSimulation } from '../services/geminiService';
import { BrandProfile } from '../types';

interface AgentFleetProps {
  brand: BrandProfile;
  language: 'en' | 'ar';
}

const AgentFleet: React.FC<AgentFleetProps> = ({ brand, language }) => {
  const [problem, setProblem] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState<string | null>(null);

  const handleSimulate = async () => {
    if (!problem) return;
    setIsSimulating(true);
    setSimulation(null);
    const result = await runAgentSimulation(problem, brand, language);
    setSimulation(result);
    setIsSimulating(false);
  };

  const t = {
    en: { title: 'Tactical Agent Fleet', desc: 'Deploy a multi-agent War Room session for complex business architecture.', placeholder: 'Define the strategic challenge or paradox...', btn: 'Initialize Tactical Simulation' },
    ar: { title: 'أسطول الوكلاء التكتيكي', desc: 'عقد جلسة "غرفة عمليات" متعددة الوكلاء لحل المعضلات التجارية المعقدة.', placeholder: 'عرّف التحدي الاستراتيجي أو المعضلة الحالية...', btn: 'بدء المحاكاة التكتيكية' }
  }[language];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-32">
      <div className="bg-[#020617] rounded-[4rem] p-12 md:p-20 border border-white/5 relative overflow-hidden shadow-4xl group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.1),transparent)]"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex-1">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em]">Fleet Status: Active</span>
               </div>
               <h2 className="text-5xl font-black text-white tracking-tighter mb-6">{t.title}</h2>
               <p className="text-slate-400 font-bold text-xs tracking-[0.4em] uppercase leading-relaxed">{t.desc}</p>
            </div>
            <div className="flex gap-6">
               {[
                 { icon: 'fa-user-ninja', label: 'Tactician', color: 'text-indigo-400' },
                 { icon: 'fa-user-tie', label: 'Analyst', color: 'text-emerald-400' },
                 { icon: 'fa-user-shield', label: 'Security', color: 'text-rose-400' }
               ].map((agent, i) => (
                 <div key={i} className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl transition-all hover:-translate-y-2 cursor-help" title={agent.label}>
                       <i className={`fa-solid ${agent.icon} ${agent.color} text-3xl`}></i>
                    </div>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{agent.label}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
         <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 shadow-2xl relative">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8 block px-6">STRATEGIC INPUT VECTOR</label>
            <textarea 
              value={problem} 
              onChange={e => setProblem(e.target.value)}
              className="w-full h-48 bg-black/40 p-10 rounded-[3rem] border border-white/10 outline-none font-bold text-lg text-white resize-none mb-10 shadow-inner focus:border-indigo-500 transition-all leading-relaxed"
              placeholder={t.placeholder}
            />
            <button 
              onClick={handleSimulate}
              disabled={isSimulating || !problem}
              className="w-full py-10 bg-indigo-600 text-white rounded-[3.5rem] font-black text-2xl shadow-4xl hover:bg-indigo-700 active:scale-95 disabled:opacity-20 transition-all flex items-center justify-center gap-6 uppercase tracking-[0.2em]"
            >
              {isSimulating ? <i className="fa-solid fa-atom animate-spin"></i> : <i className="fa-solid fa-microchip"></i>}
              {isSimulating ? 'SYNCHRONIZING FLEET...' : t.btn}
            </button>
         </div>

         {isSimulating && (
           <div className="flex flex-col items-center gap-6 py-20 animate-pulse">
              <div className="flex gap-4">
                 <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                 <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                 <div className="w-4 h-4 bg-rose-500 rounded-full"></div>
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[1em]">DEBATING IN NEURAL SPACE</p>
           </div>
         )}

         {simulation && (
           <div className="bg-[#020617] p-16 rounded-[5rem] border border-indigo-500/20 shadow-4xl animate-in zoom-in-95 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                 <div className="px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
                    FIELD REPORT: SECURE
                 </div>
              </div>
              <div className="prose prose-invert max-w-none text-slate-300 font-medium leading-[2.2] whitespace-pre-wrap font-sans text-xl">
                {simulation}
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default AgentFleet;
