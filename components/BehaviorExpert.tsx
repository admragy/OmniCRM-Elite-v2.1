
import React, { useState } from 'react';
import { runNeuroAnalysis } from '../services/geminiService';
import { BrandProfile } from '../types';

interface BehaviorExpertProps {
  language: 'en' | 'ar';
  brand: BrandProfile;
}

const BehaviorExpert: React.FC<BehaviorExpertProps> = ({ language, brand }) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!input) return;
    setIsAnalyzing(true);
    const result = await runNeuroAnalysis(input, brand.industry, language);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const t = {
    en: { title: 'Neuro-Sales Engine', desc: 'Decode customer DNA. Force the close.', placeholder: 'Paste chat log here...', btn: 'Extract Psychological Profile' },
    ar: { title: 'محرك البيع العصبي', desc: 'فك شفرة الحمض النووي للعميل. اجبره على الإغلاق.', placeholder: 'الصق سجل المحادثة هنا...', btn: 'استخراج الملف النفسي' }
  }[language];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="bg-slate-950 rounded-[4rem] p-16 border border-white/5 relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(79,70,229,0.1),transparent)]"></div>
         <div className="relative z-10">
            <h2 className="text-6xl font-black text-white tracking-tighter mb-4">{t.title}</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.5em]">{t.desc}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 shadow-2xl space-y-8">
           <textarea 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full h-80 bg-black/40 p-10 rounded-[3rem] border border-white/10 outline-none font-bold text-lg text-white resize-none shadow-inner focus:border-indigo-500 transition-all"
              placeholder={t.placeholder}
           />
           <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !input}
              className="w-full py-10 bg-indigo-600 text-white rounded-[3rem] font-black text-2xl shadow-4xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-6"
           >
              {isAnalyzing ? <i className="fa-solid fa-atom animate-spin"></i> : <i className="fa-solid fa-fingerprint"></i>}
              {isAnalyzing ? 'DECRYPTING...' : t.btn}
           </button>
        </div>

        <div>
           {analysis ? (
             <div className="bg-[#020617] p-16 rounded-[5rem] border border-indigo-500/30 shadow-4xl animate-in zoom-in-95 space-y-12">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Customer Archetype</p>
                      <h4 className="text-5xl font-black text-indigo-400">{analysis.archetype}</h4>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Closing Prob.</p>
                      <h4 className="text-5xl font-black text-emerald-500">{analysis.probability}%</h4>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-indigo-500 uppercase mb-4">Recommended Tone</p>
                      <p className="text-white font-black">{analysis.recommendedTone}</p>
                   </div>
                   <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-rose-500 uppercase mb-4">Objections Detected</p>
                      <p className="text-white font-black">{analysis.hiddenObjections?.join(', ')}</p>
                   </div>
                </div>

                <div className="bg-indigo-600 p-12 rounded-[3.5rem] shadow-4xl relative overflow-hidden group">
                   <div className="relative z-10">
                      <h5 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-3">
                         <i className="fa-solid fa-bullseye"></i>
                         The Offensive Close
                      </h5>
                      <p className="text-white text-2xl font-black italic leading-relaxed">"{analysis.closingScript}"</p>
                   </div>
                   <i className="fa-solid fa-comment-check text-[150px] absolute -left-10 -bottom-10 text-white/10 group-hover:rotate-12 transition-transform"></i>
                </div>
             </div>
           ) : (
             <div className="h-full border-4 border-dashed border-white/5 rounded-[5rem] flex flex-col items-center justify-center text-center p-24 opacity-20">
                <i className="fa-solid fa-brain-circuit text-[120px] mb-10"></i>
                <p className="text-2xl font-black uppercase tracking-[0.5em]">Awaiting Signal...</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default BehaviorExpert;
