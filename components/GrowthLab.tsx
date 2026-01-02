
import React, { useState } from 'react';
import { getGrowthStrategy } from '../services/geminiService';
import { BrandProfile } from '../types';

interface GrowthLabProps {
  brand: BrandProfile;
  language: 'en' | 'ar';
}

const GrowthLab: React.FC<GrowthLabProps> = ({ brand, language }) => {
  const [strategy, setStrategy] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const t = {
    en: {
      title: 'Viral Growth Lab',
      desc: 'Smart Meta alternatives & organic reach engineering.',
      generate: 'Engineer Viral Strategy',
      generating: 'Scanning Web for Trends...',
      subtitle: 'Guerrilla Marketing Matrix',
      hooks: 'Viral Hook Generator',
      communities: 'Sovereign Community Logic'
    },
    ar: {
      title: 'مختبر النمو الفيروسي',
      desc: 'بدائل ميتا الذكية وهندسة الوصول العضوي الفائق.',
      generate: 'هندسة استراتيجية الانتشار',
      generating: 'مسح الويب بحثاً عن التريندات...',
      subtitle: 'مصفوفة التسويق غير التقليدي',
      hooks: 'مولد "الخُطّافات" الفيروسية',
      communities: 'منطق المجتمعات السيادية'
    }
  }[language];

  const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await getGrowthStrategy(brand.industry, language);
    setStrategy(result.text);
    setSources(result.sources);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32">
      {/* Header Panel */}
      <div className="bg-slate-900 rounded-[4rem] p-12 md:p-16 border border-white/5 relative overflow-hidden group shadow-3xl">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 via-transparent to-transparent"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-start">
               <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                  <i className="fa-solid fa-bolt-lightning"></i> NO-API ACCESS
               </div>
               <h2 className="text-5xl font-black text-white tracking-tighter mb-4">{t.title}</h2>
               <p className="text-slate-400 font-bold text-base max-w-xl">{t.desc}</p>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-14 py-7 bg-white text-slate-950 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-4 group"
            >
              {isGenerating ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles group-hover:rotate-12 transition-transform"></i>}
              {isGenerating ? t.generating : t.generate}
            </button>
         </div>
         <i className="fa-solid fa-rocket text-[220px] text-white/5 absolute -right-20 -bottom-20 rotate-12"></i>
      </div>

      {strategy ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 border border-slate-100 dark:border-slate-800 shadow-xl relative">
              <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-medium leading-[2] whitespace-pre-wrap text-lg">
                {strategy}
              </div>
           </div>
           
           <div className="space-y-6">
              <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                 <div className="relative z-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 opacity-60">أهم المراجع (Grounding)</h4>
                    <div className="space-y-4">
                       {sources.map((s, i) => (
                         <a key={i} href={s.web?.uri} target="_blank" className="block p-5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/5">
                            <p className="text-xs font-black line-clamp-2">{s.web?.title}</p>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[8px] mt-2 opacity-50"></i>
                         </a>
                       ))}
                    </div>
                 </div>
                 <i className="fa-solid fa-link text-[150px] absolute -left-10 -bottom-10 opacity-10"></i>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">إجراءات فورية</h4>
                 <div className="space-y-4">
                    {["إنشاء هوك لـ Reels", "أتمتة رسالة واتساب", "تحسين ملف LinkedIn"].map((action, i) => (
                      <div key={i} className="flex items-center gap-4">
                         <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-black">{i+1}</div>
                         <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{action}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="h-96 bg-white/30 dark:bg-slate-900/30 rounded-[4rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-20 opacity-30">
           <i className="fa-solid fa-wand-sparkles text-[120px] mb-8"></i>
           <p className="text-2xl font-black uppercase tracking-[0.4em]">{language === 'ar' ? 'بانتظار هندسة الانتشار...' : 'Awaiting Viral Synthesis...'}</p>
        </div>
      )}
    </div>
  );
};

export default GrowthLab;
