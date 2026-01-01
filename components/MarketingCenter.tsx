
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BrandProfile, AdCampaign } from '../types';

interface MarketingCenterProps {
  language: 'en' | 'ar';
  brand: BrandProfile;
  onCampaignCreated?: (campaign: AdCampaign) => void;
  deductTokens: (amount: number) => Promise<boolean>;
}

const MarketingCenter: React.FC<MarketingCenterProps> = ({ language, brand, onCampaignCreated, deductTokens }) => {
  const [adContent, setAdContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeChannel, setActiveChannel] = useState<'FB' | 'WA' | 'MSG'>('FB');
  
  const [adCopy, setAdCopy] = useState<string | null>(null);
  const [chatPreview, setChatPreview] = useState<any[]>([]);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const t = {
    en: {
      title: 'AI Ad Expert',
      desc: 'Elite campaign architecture and visual production engine.',
      channels: { FB: 'Social Feed', WA: 'WhatsApp Closer', MSG: 'Messenger AI' },
      inputLabel: 'Describe your product or offer',
      generate: 'Generate Full Campaign',
      blueprint: 'Psychology Analysis',
      chatSim: 'AI Sales Conversation',
      ready: 'Deploy Strategic Asset'
    },
    ar: {
      title: 'خبير الاعلانات والنمو',
      desc: 'محرك هندسة الحملات والانتاج البصري فائق الدقة.',
      channels: { FB: 'اعلانات السوشيال', WA: 'بائع الواتساب', MSG: 'ذكاء الماسنجر' },
      inputLabel: 'صف منتجك او عرضك بكلمات بسيطة',
      generate: 'توليد الحملة الكاملة',
      blueprint: 'التحليل النفسي للاعلان',
      chatSim: 'محاكاة محادثة البيع الذكية',
      ready: 'نشر الاصل الاستراتيجي'
    }
  }[language];

  const handleGenerate = async () => {
    if (!adContent) return;
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) { setShowKeyModal(true); return; }

    const success = await deductTokens(20);
    if (!success) return;

    setIsGenerating(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const targetLang = language === 'ar' ? 'Arabic' : 'English';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        config: { responseMimeType: "application/json" },
        contents: `
          Respond in ${targetLang}. No diacritics (No tashkeel).
          Create a campaign for ${brand.industry} about ${adContent}. 
          Channel: ${activeChannel}.
          JSON Output: { 
            "copy": "...", 
            "psychology": "Why this AI copy works...",
            "chat": [{"role": "bot", "text": "..."}, {"role": "user", "text": "I am interested."}, {"role": "bot", "text": "..."}] 
          }
        `,
      });

      const data = JSON.parse(response.text || '{}');
      setAdCopy(data.copy);
      setChatPreview(data.chat || []);

      const imgRes = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: `High-end commercial product shot for ${brand.industry}: ${adContent}. Studio lighting, 4K, hyper-realistic.` }] },
        config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
      });
      for (const p of imgRes.candidates?.[0]?.content?.parts || []) {
        if (p.inlineData) setGeneratedImg(`data:image/png;base64,${p.inlineData.data}`);
      }
    } catch (e) { console.error(e); }
    finally { setIsGenerating(false); }
  };

  return (
    <div className="space-y-12 pb-32 animate-in fade-in" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Dynamic Header */}
      <section className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-12 rounded-[4rem] flex flex-col lg:flex-row justify-between items-center gap-12 relative overflow-hidden shadow-4xl">
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4 flex items-center gap-4">
             <i className="fa-solid fa-wand-magic-sparkles text-indigo-500"></i>
             {t.title}
          </h2>
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">{t.desc}</p>
        </div>
        <div className="flex flex-wrap gap-4 relative z-10">
           {(['FB', 'WA', 'MSG'] as const).map((chan) => (
             <button 
               key={chan} 
               onClick={() => setActiveChannel(chan)}
               className={`px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all border ${activeChannel === chan ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl scale-105' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
             >
               <i className={`fa-brands ${chan === 'FB' ? 'fa-facebook' : chan === 'MSG' ? 'fa-facebook-messenger' : 'fa-whatsapp'} mr-3 text-lg`}></i>
               {t.channels[chan]}
             </button>
           ))}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Left Input */}
        <div className="xl:col-span-4 space-y-10">
           <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 leading-none">{t.inputLabel}</label>
                 <textarea 
                   value={adContent} 
                   onChange={e => setAdContent(e.target.value)}
                   className="w-full h-40 bg-slate-50 dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 outline-none font-bold text-sm dark:text-white resize-none shadow-inner"
                   placeholder={language === 'ar' ? 'اكتب مثلا: عرض خصم 50% على الكورسات بمناسبة رمضان...' : 'Describe your goal...'}
                 />
              </div>
              <button 
                onClick={handleGenerate} 
                disabled={isGenerating || !adContent}
                className="w-full py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-lg shadow-3xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 uppercase tracking-widest"
              >
                {isGenerating ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                {isGenerating ? 'جاري المعالجة...' : t.generate}
              </button>
           </div>
        </div>

        {/* Right Preview */}
        <div className="xl:col-span-8 space-y-10">
           {adCopy ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Visual Ad */}
                <div className="bg-white rounded-[3.5rem] overflow-hidden shadow-4xl border border-slate-100 animate-in zoom-in-95">
                   <div className="p-6 border-b border-slate-50 flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><i className="fa-solid fa-atom"></i></div>
                      <span className="font-black text-xs">{brand.name}</span>
                   </div>
                   {generatedImg && <img src={generatedImg} className="w-full aspect-video object-cover" />}
                   <div className="p-8">
                      <p className="text-sm font-bold text-slate-800 leading-relaxed pb-2">{adCopy}</p>
                   </div>
                </div>

                {/* AI Chat Closer */}
                <div className="bg-slate-900 rounded-[3.5rem] p-10 border border-white/5 flex flex-col h-full shadow-4xl animate-in slide-in-from-right-4">
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                      <i className="fa-solid fa-comments-dollar"></i>
                      {t.chatSim}
                   </h4>
                   <div className="flex-1 space-y-6 overflow-y-auto mb-10 pr-2 custom-scrollbar">
                      {chatPreview.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}>
                           <div className={`max-w-[80%] p-5 rounded-[2rem] text-xs font-bold ${msg.role === 'bot' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
                              {msg.text}
                           </div>
                        </div>
                      ))}
                   </div>
                   <button className="w-full py-6 bg-emerald-500 text-white rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all">
                      {t.ready}
                   </button>
                </div>
             </div>
           ) : (
             <div className="h-[600px] border-2 border-dashed border-white/5 rounded-[5rem] flex flex-col items-center justify-center text-center p-20 opacity-20">
                <i className="fa-solid fa-robot text-[120px] text-white mb-8"></i>
                <p className="text-2xl font-black text-white uppercase tracking-[0.4em]">{language === 'ar' ? 'بانتظار المدخلات الاستراتيجية' : 'Awaiting Strategic Input'}</p>
             </div>
           )}
        </div>
      </div>

      {showKeyModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl">
           <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[4rem] p-12 text-center shadow-4xl">
              <i className="fa-solid fa-key text-6xl text-indigo-500 mb-8"></i>
              <h3 className="text-2xl font-black text-white mb-4">Paid API Key Required</h3>
              <p className="text-slate-400 font-bold text-sm mb-10">Select a paid API key to unlock full AI production capabilities.</p>
              <button onClick={async () => { /* @ts-ignore */ await window.aistudio.openSelectKey(); setShowKeyModal(false); }} className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Select Key</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default MarketingCenter;
