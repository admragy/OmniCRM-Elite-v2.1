
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
      () => setLocation({ lat: 30.0444, lng: 31.2357 }) // Default to Cairo
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
    en: { title: 'Strategic War Room', desc: 'Global Tactical Intelligence & Spatial Risk Analysis.', placeholder: 'Enter strategic query (e.g. Market risks in Middle East)...', btn: 'Engage Global Scan', grounding: 'Intelligence Sources' },
    ar: { title: 'غرفة العمليات الاستراتيجية', desc: 'استخبارات تكتيكية عالمية وتحليل مكاني للمخاطر.', placeholder: 'أدخل استفساراً استراتيجياً (مثال: مخاطر السوق في الشرق الأوسط)...', btn: 'بدء المسح العالمي', grounding: 'مصادر الاستخبارات' }
  }[language];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="bg-slate-900 rounded-[4rem] p-12 border border-white/5 relative overflow-hidden group shadow-3xl">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.15),transparent)]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4 flex items-center gap-4">
              <i className="fa-solid fa-satellite-dish text-indigo-500 animate-pulse"></i>
              {t.title}
            </h2>
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">{t.desc}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Strategic Query Input</label>
             <textarea 
                value={query} 
                onChange={e => setQuery(e.target.value)}
                className="w-full h-40 bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none font-bold text-sm dark:text-white resize-none mb-6"
                placeholder={t.placeholder}
             />
             <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !query}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3"
             >
                {isAnalyzing ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-crosshairs"></i>}
                {isAnalyzing ? 'Scanning...' : t.btn}
             </button>
          </div>

          <div className="bg-slate-950 rounded-[3rem] p-8 border border-white/5 h-64 flex flex-col items-center justify-center text-center">
             <i className="fa-solid fa-map-location-dot text-6xl text-indigo-500/20 mb-6"></i>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Geolocation</p>
             <p className="text-white font-mono mt-2">{location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           {report ? (
             <div className="animate-in slide-in-from-bottom-5 duration-700">
               <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                  <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-medium leading-loose whitespace-pre-wrap text-lg">
                    {report.text}
                  </div>
                  
                  {report.grounding.length > 0 && (
                    <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{t.grounding}</h4>
                      <div className="flex flex-wrap gap-3">
                         {report.grounding.map((chunk: any, i: number) => (
                           <a 
                             key={i} 
                             href={chunk.maps?.uri || chunk.web?.uri} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black border border-indigo-100 dark:border-indigo-800 hover:scale-105 transition-transform"
                           >
                             <i className={`fa-solid ${chunk.maps ? 'fa-map-pin' : 'fa-link'} mr-2`}></i>
                             {chunk.maps?.title || chunk.web?.title || 'External Intelligence'}
                           </a>
                         ))}
                      </div>
                    </div>
                  )}
               </div>
             </div>
           ) : (
             <div className="h-full bg-slate-100 dark:bg-slate-900/50 rounded-[4rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-20">
                <i className="fa-solid fa-globe text-[160px] text-slate-200 dark:text-slate-800 mb-12"></i>
                <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-sm">Awaiting Strategic Mission Parameters</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default StrategicWarRoom;
