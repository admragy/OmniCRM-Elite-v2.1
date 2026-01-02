
import React, { useState, useEffect } from 'react';
import { analyzeGlobalRisk } from '../services/geminiService';
import { BrandProfile } from '../types';

interface StrategicWarRoomProps {
  brand: BrandProfile;
  language: 'en' | 'ar';
}

const StrategicWarRoom: React.FC<StrategicWarRoomProps> = ({ brand, language }) => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<{ text: string, grounding: any[] } | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation({ lat: 30.0444, lng: 31.2357 }) // Cairo Default
    );
  }, []);

  const handleAnalyze = async () => {
    if (!query || !location) return;
    setIsAnalyzing(true);
    const result = await analyzeGlobalRisk(query, location.lat, location.lng, language);
    setReport(result);
    setIsAnalyzing(false);
  };

  const t = {
    en: { title: 'Omni Strategic War Room', desc: 'Sovereign Intelligence Node: Spatial Risk & Market Grounding.', placeholder: 'Enter strategic mission (e.g., Geopolitical risks in tech sector)...', btn: 'Engage Global Scan', grounding: 'Intelligence Nodes' },
    ar: { title: 'غرفة العمليات الاستراتيجية', desc: 'عقدة الاستخبارات السيادية: مخاطر مكانية وتحليلات ميدانية.', placeholder: 'أدخل مهمة استراتيجية (مثال: المخاطر الجيوسياسية في قطاع التقنية)...', btn: 'بدء المسح العالمي', grounding: 'عقد الاستخبارات' }
  }[language];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="bg-[#020617] rounded-[4rem] p-12 border border-white/5 relative overflow-hidden shadow-4xl group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.2),transparent)]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1">
            <h2 className="text-5xl font-black text-white tracking-tighter mb-4 flex items-center gap-6">
              <i className="fa-solid fa-satellite-dish text-indigo-500 animate-pulse"></i>
              {t.title}
            </h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.5em]">{t.desc}</p>
          </div>
          <div className="px-8 py-4 bg-white/5 rounded-3xl border border-white/10 text-white font-mono text-xs">
            COORD: {location?.lat.toFixed(4)}N / {location?.lng.toFixed(4)}E
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 block px-2">MISSION PARAMETERS</label>
             <textarea 
                value={query} 
                onChange={e => setQuery(e.target.value)}
                className="w-full h-56 bg-black/40 p-8 rounded-[2rem] border border-white/10 outline-none font-bold text-sm text-white resize-none mb-10 shadow-inner focus:border-indigo-500 transition-all"
                placeholder={t.placeholder}
             />
             <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !query}
                className="w-full py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-lg shadow-4xl hover:bg-indigo-500 disabled:opacity-20 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
             >
                {isAnalyzing ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-crosshairs"></i>}
                {isAnalyzing ? 'UPLINKING...' : t.btn}
             </button>
          </div>

          <div className="bg-slate-900/50 rounded-[3rem] p-10 border border-white/5 flex flex-col items-center justify-center text-center group">
             <i className="fa-solid fa-shield-halved text-5xl text-indigo-500/20 mb-6 group-hover:scale-110 transition-transform"></i>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Security Status</p>
             <p className="text-emerald-500 font-black text-xs uppercase tracking-widest">Link Encrypted</p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-10">
           {report ? (
             <div className="animate-in slide-in-from-bottom-10 duration-700">
               <div className="bg-[#020617] p-16 rounded-[5rem] border border-white/10 shadow-4xl relative overflow-hidden min-h-[600px]">
                  <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                     <div className="grid grid-cols-12 grid-rows-12 h-full">
                        {Array.from({length: 144}).map((_, i) => <div key={i} className="border-[0.5px] border-white/10"></div>)}
                     </div>
                  </div>
                  
                  <div className="relative z-10 prose prose-invert max-w-none text-slate-300 font-medium leading-[2] whitespace-pre-wrap text-xl mb-16">
                    {report.text}
                  </div>
                  
                  {report.grounding.length > 0 && (
                    <div className="relative z-10 mt-16 pt-12 border-t border-white/5">
                      <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-10">{t.grounding}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {report.grounding.map((chunk: any, i: number) => (
                           <a 
                             key={i} 
                             href={chunk.maps?.uri || chunk.web?.uri} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 transition-all group flex items-start gap-4"
                           >
                             <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                                <i className={`fa-solid ${chunk.maps ? 'fa-map-pin' : 'fa-link'}`}></i>
                             </div>
                             <div>
                                <p className="text-white font-black text-xs line-clamp-2 mb-2">{chunk.maps?.title || chunk.web?.title || 'Tactical Node'}</p>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Access Node</span>
                             </div>
                           </a>
                         ))}
                      </div>
                    </div>
                  )}
               </div>
             </div>
           ) : (
             <div className="h-full bg-slate-900/20 rounded-[5rem] border-4 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-20 group">
                <div className="w-40 h-40 bg-white/5 rounded-[3rem] flex items-center justify-center text-[80px] text-slate-800 mb-12 group-hover:scale-110 transition-transform">
                   <i className="fa-solid fa-globe"></i>
                </div>
                <p className="text-slate-600 font-black uppercase tracking-[0.6em] text-sm">{language === 'ar' ? 'بانتظار تلقي تعليمات المهمة' : 'Awaiting Mission Directives'}</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default StrategicWarRoom;
