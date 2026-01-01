
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
    const result = await runAgentSimulation(problem, brand, language);
    setSimulation(result);
    setIsSimulating(false);
  };

  const t = {
    en: { title: 'Tactical Agent Fleet', desc: 'Deploy autonomous specialized agents to solve complex business paradoxes.', placeholder: 'Describe the business challenge...', btn: 'Initiate Simulation' },
    ar: { title: 'أسطول الوكلاء التكتيكي', desc: 'نشر وكلاء مستقلين متخصصين لحل المعضلات التجارية المعقدة.', placeholder: 'صف التحدي التجاري الذي يواجهك...', btn: 'بدء المحاكاة التكتيكية' }
  }[language];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-32">
      <div className="bg-indigo-950 rounded-[4rem] p-12 border border-indigo-500/20 shadow-3xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex-1">
               <h2 className="text-4xl font-black text-white tracking-tighter mb-4">{t.title}</h2>
               <p className="text-indigo-200/60 font-bold text-sm tracking-widest uppercase">{t.desc}</p>
            </div>
            <div className="flex gap-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 animate-pulse" style={{ animationDelay: `${i*300}ms` }}>
                    <i className={`fa-solid ${i === 1 ? 'fa-user-ninja' : i === 2 ? 'fa-user-tie' : 'fa-user-shield'} text-indigo-400 text-2xl`}></i>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
         <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block px-4">Problem Architecture</label>
            <textarea 
              value={problem} 
              onChange={e => setProblem(e.target.value)}
              className="w-full h-40 bg-slate-50 dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 outline-none font-bold text-lg dark:text-white resize-none mb-8 shadow-inner"
              placeholder={t.placeholder}
            />
            <button 
              onClick={handleSimulate}
              disabled={isSimulating || !problem}
              className="w-full py-8 bg-slate-950 dark:bg-indigo-600 text-white rounded-[3rem] font-black text-xl shadow-3xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-4"
            >
              {isSimulating ? <i className="fa-solid fa-microchip animate-spin"></i> : <i className="fa-solid fa-brain-circuit"></i>}
              {isSimulating ? 'Processing Simulation...' : t.btn}
            </button>
         </div>

         {simulation && (
           <div className="bg-slate-950 p-12 rounded-[5rem] border border-indigo-500/20 shadow-4xl animate-in zoom-in-95">
              <div className="prose dark:prose-invert max-w-none text-white/90 font-bold leading-loose whitespace-pre-wrap font-mono text-sm bg-black/40 p-10 rounded-[3.5rem] border border-white/5">
                {simulation}
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default AgentFleet;
