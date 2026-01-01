
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BrandProfile } from '../types';

interface BehaviorExpertProps {
  language: 'en' | 'ar';
  brand: BrandProfile;
  deductTokens: (amount: number) => Promise<boolean>;
}

const BehaviorExpert: React.FC<BehaviorExpertProps> = ({ language, brand, deductTokens }) => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const t = {
    en: {
      title: 'Human Behavior Expert',
      desc: 'Deep psychological analysis of client intent and personality.',
      inputLabel: 'Paste client message or profile notes',
      analyze: 'Extract Psychological DNA',
      resultTitle: 'Behavioral Insights',
      closingStrategy: 'Recommended Closing Logic',
      traitLabel: 'Primary Trait',
      moodLabel: 'Current Sentiment'
    },
    ar: {
      title: 'خبير السلوك البشري',
      desc: 'تحليل نفسي عميق لنوايا العميل وشخصيته لتحسين عملية الاقناع.',
      inputLabel: 'الصق رسالة العميل او ملاحظات عن شخصيته',
      analyze: 'استخراج الشفرة النفسية',
      resultTitle: 'الرؤى السلوكية المستخرجة',
      closingStrategy: 'استراتيجية الاغلاق المقترحة',
      traitLabel: 'السمة الغالبة',
      moodLabel: 'الحالة المزاجية الحالية'
    }
  }[language];

  const handleAnalyze = async () => {
    if (!input) return;
    const success = await deductTokens(10);
    if (!success) return;

    setIsAnalyzing(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const targetLang = language === 'ar' ? 'Arabic' : 'English';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        config: { responseMimeType: "application/json" },
        contents: `
          Analyze this client input: "${input}". 
          Respond in ${targetLang}. No diacritics (No tashkeel).
          Context: Business is ${brand.industry}.
          Output JSON: {
            "trait": "Personality Type (Driver/Analytical/etc)",
            "mood": "Current Mood",
            "psychology": "Analysis of their hidden intent...",
            "strategy": "Step by step how to close this deal now."
          }
        `,
      });
      setAnalysis(JSON.parse(response.text || '{}'));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in pb-32" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <section className="bg-indigo-950 rounded-[4rem] p-12 border border-indigo-500/20 shadow-4xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent)]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4 flex items-center gap-4">
              <i className="fa-solid fa-brain-circuit text-indigo-400"></i>
              {t.title}
            </h2>
            <p className="text-indigo-200/60 font-bold text-sm tracking-widest uppercase">{t.desc}</p>
          </div>
          <div className="w-20 h-20 bg-indigo-600/20 rounded-3xl flex items-center justify-center text-3xl text-indigo-400 border border-indigo-500/30">
             <i className="fa-solid fa-eye"></i>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">{t.inputLabel}</label>
            <textarea 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full h-48 bg-slate-50 dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 outline-none font-bold text-sm dark:text-white resize-none shadow-inner"
              placeholder={language === 'ar' ? 'مثال: العميل بيسأل كتير عن السعر ومش مهتم بالجودة حاليا...' : 'Paste here...'}
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !input}
            className="w-full py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-lg shadow-3xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-4"
          >
            {isAnalyzing ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-fingerprint"></i>}
            {isAnalyzing ? 'جاري التحليل...' : t.analyze}
          </button>
        </div>

        <div className="relative">
          {analysis ? (
            <div className="bg-slate-900 rounded-[3.5rem] p-12 border border-white/5 shadow-4xl animate-in zoom-in-95 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.traitLabel}</p>
                   <p className="text-xl font-black text-indigo-400">{analysis.trait}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.moodLabel}</p>
                   <p className="text-xl font-black text-emerald-400">{analysis.mood}</p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-black text-white mb-4 border-b border-white/5 pb-4 uppercase tracking-tighter">{t.resultTitle}</h4>
                <p className="text-slate-400 font-bold text-sm leading-relaxed">{analysis.psychology}</p>
              </div>
              <div className="bg-indigo-600/10 p-8 rounded-[2.5rem] border border-indigo-500/20">
                <h4 className="text-indigo-400 font-black mb-4 uppercase tracking-tighter flex items-center gap-3">
                  <i className="fa-solid fa-bullseye"></i>
                  {t.closingStrategy}
                </h4>
                <p className="text-white font-bold text-sm leading-relaxed">{analysis.strategy}</p>
              </div>
            </div>
          ) : (
            <div className="h-full border-4 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-center p-20 opacity-20">
              <i className="fa-solid fa-brain-circuit text-[120px] mb-8"></i>
              <p className="text-2xl font-black uppercase tracking-[0.4em]">{language === 'ar' ? 'بانتظار المدخلات السلوكية' : 'Awaiting Input'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BehaviorExpert;
