
import React, { useState, useEffect } from 'react';
import { getMarketIntelligence } from '../services/geminiService';
import { BrandProfile } from '../types';

interface MarketIntelligenceProps {
  brand: BrandProfile;
  language: 'en' | 'ar';
}

const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({ brand, language }) => {
  const [report, setReport] = useState<string | null>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const t = {
    en: {
      title: 'Strategic Market Pulse',
      desc: 'Real-time intelligence scanned from global news and trends.',
      scan: 'Initiate Market Scan',
      scanning: 'Synchronizing with Global News...',
      opportunities: 'Strategic Gaps Found',
      sources: 'Intelligence Grounding'
    },
    ar: {
      title: 'نبض السوق الاستراتيجي',
      desc: 'استخبارات حية يتم مسحها من الأخبار والاتجاهات العالمية.',
      scan: 'بدء المسح الاستراتيجي',
      scanning: 'جاري المزامنة مع الأخبار العالمية...',
      opportunities: 'الفجوات الاستراتيجية المكتشفة',
      sources: 'مصادر الاستخبارات'
    }
  }[language];

  const handleScan = async () => {
    setIsScanning(true);
    const result = await getMarketIntelligence(brand.industry, language);
    setReport(result.report);
    setTrends(result.trends);
    setIsScanning(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-slate-950 rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 border border-white/5 relative overflow-hidden group shadow-3xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-start">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4">{t.title}</h2>
            <p className="text-slate-400 font-bold text-sm max-w-xl">{t.desc}</p>
          </div>
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-100 transition-all flex items-center gap-4"
          >
            {isScanning ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-radar"></i>}
            {isScanning ? t.scanning : t.scan}
          </button>
        </div>
      </div>

      {report ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl">
             <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                {report}
             </div>
          </div>
          <div className="space-y-6">
             <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl border border-white/10">
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-60">{t.sources}</h4>
                <div className="space-y-4">
                   {trends.map((trend, i) => (
                     <a key={i} href={trend.web?.uri} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/5 group">
                        <p className="text-[11px] font-bold line-clamp-1 mb-1">{trend.web?.title}</p>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-40 group-hover:opacity-100 transition-all"></i>
                     </a>
                   ))}
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="h-96 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
           <i className="fa-solid fa-globe text-[120px] mb-8 opacity-20"></i>
           <p className="font-black uppercase tracking-[0.4em]">{language === 'ar' ? 'بانتظار مسح السوق...' : 'Awaiting Market Scan...'}</p>
        </div>
      )}
    </div>
  );
};

export default MarketIntelligence;
