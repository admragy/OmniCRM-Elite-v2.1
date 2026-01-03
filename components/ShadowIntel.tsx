
import React, { useState } from 'react';
import { scanCompetitors } from '../services/geminiService';
import { BrandProfile } from '../types';

interface ShadowIntelProps {
  brand: BrandProfile;
  language: 'en' | 'ar';
}

const ShadowIntel: React.FC<ShadowIntelProps> = ({ brand, language }) => {
  const [query, setQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // New State for Granular Scan Controls
  const [scanDepth, setScanDepth] = useState<'shallow' | 'standard' | 'deep'>('standard');
  const [dataPoints, setDataPoints] = useState<string[]>(['pricing', 'ad_copy']);

  const availableDataPoints = [
    { id: 'pricing', icon: 'fa-tag', label: { en: 'Pricing', ar: 'الأسعار' } },
    { id: 'ad_copy', icon: 'fa-ad', label: { en: 'Ad Strategy', ar: 'استراتيجية الإعلانات' } },
    { id: 'social_engagement', icon: 'fa-users-viewfinder', label: { en: 'Social Intel', ar: 'التفاعل الاجتماعي' } },
    { id: 'tech_stack', icon: 'fa-code', label: { en: 'Tech Stack', ar: 'البنية التقنية' } },
    { id: 'reviews', icon: 'fa-star-half-stroke', label: { en: 'Sentiment', ar: 'انطباع العملاء' } }
  ];

  const toggleDataPoint = (id: string) => {
    setDataPoints(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleScan = async () => {
    if (!query) return;
    setIsScanning(true);
    const data = await scanCompetitors(query, brand.industry, language, scanDepth, dataPoints);
    setResult(data);
    setIsScanning(false);
  };

  const t = {
    en: { 
      title: 'Shadow Intelligence', 
      desc: 'Total market visibility. Reveal competitor weaknesses.', 
      placeholder: 'Enter competitor brand name...', 
      btn: 'Deploy Deep Web Scan',
      depth: 'Scan Depth Intensity',
      points: 'Intelligence Data Points',
      shallow: 'Shallow (Fast)',
      standard: 'Standard',
      deep: 'Deep (Full Trace)',
      scanning: 'EXECUTING DEEP SCAN...'
    },
    ar: { 
      title: 'استخبارات الظل', 
      desc: 'رؤية كاملة للسوق. كشف نقاط ضعف المنافسين.', 
      placeholder: 'أدخل اسم المنافس هنا...', 
      btn: 'بدء مسح الويب العميق',
      depth: 'كثافة المسح الاستخباري',
      points: 'نقاط البيانات المستهدفة',
      shallow: 'سطحي (سريع)',
      standard: 'قياسي',
      deep: 'عميق (أثر كامل)',
      scanning: 'جاري تنفيذ المسح العميق...'
    }
  }[language];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-32">
      <header className="bg-slate-950 rounded-[4rem] p-12 md:p-16 border border-rose-500/20 shadow-[0_0_80px_rgba(244,63,94,0.08)] relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-16 z-0">
            <div className="w-32 h-32 border-2 border-rose-500/10 rounded-full flex items-center justify-center animate-spin-slow">
               <i className="fa-solid fa-crosshairs text-rose-500/20 text-5xl"></i>
            </div>
         </div>
         <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-rose-500/10 rounded-full border border-rose-500/20 mb-8">
               <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
               <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest">Sovereign Intel Node Active</span>
            </div>
            <h2 className="text-6xl font-black text-white tracking-tighter mb-4">{t.title}</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.5em]">{t.desc}</p>
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Control Panel */}
         <div className="lg:col-span-5 bg-slate-900/50 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/5 shadow-2xl space-y-12">
            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6">{language === 'ar' ? 'اسم الهدف' : 'Target Target Name'}</label>
               <input 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 p-8 rounded-[2.5rem] outline-none font-black text-xl text-white focus:border-rose-500 transition-all shadow-inner"
                  placeholder={t.placeholder}
               />
            </div>

            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6">{t.depth}</label>
               <div className="grid grid-cols-3 gap-3 bg-black/40 p-2 rounded-[2rem] border border-white/5">
                  {(['shallow', 'standard', 'deep'] as const).map(d => (
                    <button 
                      key={d}
                      onClick={() => setScanDepth(d)}
                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${scanDepth === d ? 'bg-rose-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                      {t[d as keyof typeof t]}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6">{t.points}</label>
               <div className="flex flex-wrap gap-3">
                  {availableDataPoints.map(point => (
                    <button
                      key={point.id}
                      onClick={() => toggleDataPoint(point.id)}
                      className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all ${dataPoints.includes(point.id) ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                    >
                      <i className={`fa-solid ${point.icon}`}></i>
                      <span className="text-[10px] font-black uppercase tracking-widest">{point.label[language]}</span>
                    </button>
                  ))}
               </div>
            </div>

            <button 
               onClick={handleScan}
               disabled={isScanning || !query || dataPoints.length === 0}
               className="w-full py-10 bg-rose-600 text-white rounded-[3rem] font-black text-2xl hover:bg-rose-500 transition-all flex items-center justify-center gap-6 shadow-4xl active:scale-95 disabled:opacity-30"
            >
               {isScanning ? <i className="fa-solid fa-satellite-dish animate-pulse"></i> : <i className="fa-solid fa-radar"></i>}
               {isScanning ? t.scanning : t.btn}
            </button>
         </div>

         {/* Intelligence Feed */}
         <div className="lg:col-span-7 relative h-full">
            {result ? (
               <div className="bg-[#020617] p-16 rounded-[5rem] border border-rose-500/10 shadow-4xl animate-in slide-in-from-right-10 duration-700 h-full overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between mb-12 border-b border-rose-500/10 pb-8">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-rose-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-xl">
                           <i className="fa-solid fa-file-shield"></i>
                        </div>
                        <div>
                           <h4 className="text-3xl font-black text-white tracking-tighter uppercase">{query} Intel Report</h4>
                           <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Confidential Data Feed</span>
                        </div>
                     </div>
                     <button onClick={() => setResult(null)} className="text-slate-600 hover:text-rose-500 transition-colors">
                        <i className="fa-solid fa-circle-xmark text-4xl"></i>
                     </button>
                  </div>
                  
                  <div className="prose prose-invert max-w-none text-slate-300 font-medium leading-[2.4] whitespace-pre-wrap text-xl mb-16 font-sans">
                     {result.analysis}
                  </div>

                  {result.sources.length > 0 && (
                     <div className="pt-10 border-t border-rose-500/10">
                        <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-8">Intelligence Grounds (Web Sources)</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {result.sources.map((source: any, i: number) => (
                             <a key={i} href={source.web?.uri} target="_blank" rel="noopener noreferrer" className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all flex items-center gap-5 group">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-rose-600 group-hover:text-white transition-all shrink-0">
                                   <i className="fa-solid fa-link"></i>
                                </div>
                                <span className="text-xs font-black text-slate-400 truncate tracking-tight">{source.web?.title}</span>
                             </a>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            ) : (
               <div className="h-full bg-slate-900/20 rounded-[5rem] border-4 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-24 group opacity-40">
                  <div className="w-48 h-48 bg-white/5 rounded-[4rem] flex items-center justify-center text-[100px] text-slate-800 mb-12 group-hover:scale-110 group-hover:rotate-12 transition-all">
                     <i className="fa-solid fa-ghost"></i>
                  </div>
                  <p className="text-slate-600 font-black uppercase tracking-[0.8em] text-sm">{language === 'ar' ? 'بانتظار تلقي تعليمات المهمة' : 'Awaiting Operational Directives'}</p>
               </div>
            )}
         </div>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
};

export default ShadowIntel;
