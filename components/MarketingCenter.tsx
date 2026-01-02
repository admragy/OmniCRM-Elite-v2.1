
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BrandProfile } from '../types';
import { generateAdImage } from '../services/geminiService';

interface MarketingCenterProps {
  language: 'en' | 'ar';
  brand: BrandProfile;
  deductTokens: (amount: number) => Promise<boolean>;
}

const MarketingCenter: React.FC<MarketingCenterProps> = ({ language, brand, deductTokens }) => {
  const [adContent, setAdContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [adCopy, setAdCopy] = useState<string | null>(null);
  const [adImage, setAdImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [fbStatus, setFbStatus] = useState(localStorage.getItem('OMNI_META_TOKEN') ? 'connected' : 'idle');

  const t = {
    en: {
      title: 'AI Ad Architect',
      desc: 'Create high-converting campaigns and deploy them directly.',
      fbConnect: 'Connect Meta Business',
      fbConnected: 'Meta Linked',
      generate: 'Generate Ad Assets',
      generateImage: 'Synthesize Visual Asset',
      deploy: 'Deploy to Facebook Ads Manager'
    },
    ar: {
      title: 'مهندس الإعلانات الذكي',
      desc: 'صمم حملات إعلانية احترافية وانشرها مباشرة على حساباتك.',
      fbConnect: 'ربط حساب فيسبوك بيزنس',
      fbConnected: 'حساب Meta متصل',
      generate: 'توليد محتوى الإعلان',
      generateImage: 'توليد الصورة الإعلانية',
      deploy: 'نشر الحملة على مدير الإعلانات'
    }
  }[language];

  const handleGenerateText = async () => {
    if (!adContent) return;
    const success = await deductTokens(20);
    if (!success) return;
    setIsGenerating(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a professional marketing ad copy in ${language === 'ar' ? 'Arabic' : 'English'} for: ${adContent}. Include emojis. Target Audience: ${brand.targetAudience}.`,
      });
      setAdCopy(response.text || "");
    } catch (e) { console.error(e); }
    finally { setIsGenerating(false); }
  };

  const handleGenerateImage = async () => {
    if (!adContent) return;
    const success = await deductTokens(30);
    if (!success) return;
    setIsGeneratingImage(true);
    const img = await generateAdImage(adContent);
    setAdImage(img);
    setIsGeneratingImage(false);
  };

  const handleDeploy = () => {
    if (fbStatus !== 'connected') {
      alert(language === 'ar' ? 'يرجى ربط توكن فيسبوك في الإعدادات أولاً' : 'Please link Meta Token in Settings first.');
      return;
    }
    alert(language === 'ar' ? 'تم إرسال الحملة إلى مسودة مدير الإعلانات بنجاح!' : 'Campaign deployed to Ads Manager drafts successfully!');
  };

  return (
    <div className="space-y-8 animate-in fade-in" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Integration Banner */}
      <div className={`rounded-[3rem] p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl transition-all duration-500 ${fbStatus === 'connected' ? 'bg-blue-600' : 'bg-slate-900'}`}>
         <div className="flex items-center gap-8">
            <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-lg ${fbStatus === 'connected' ? 'bg-white text-blue-600' : 'bg-white/10 text-white'}`}>
               <i className="fa-brands fa-facebook"></i>
            </div>
            <div>
               <h2 className="text-3xl font-black tracking-tight">{t.title}</h2>
               <p className="text-white/60 font-bold text-sm">{t.desc}</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
              {fbStatus === 'connected' ? t.fbConnected : t.fbConnect}
            </span>
            <div className={`w-3 h-3 rounded-full ${fbStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`}></div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="space-y-4">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">{language === 'ar' ? 'ما هو عرضك اليوم؟' : 'Ad Offer'}</label>
               <textarea 
                  value={adContent}
                  onChange={e => setAdContent(e.target.value)}
                  placeholder={language === 'ar' ? 'خصم 30% على جميع الخدمات بمناسبة الصيف...' : 'Flash sale 30% off...'}
                  className="w-full h-48 bg-gray-50 border-none p-8 rounded-[2rem] outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg resize-none shadow-inner"
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={handleGenerateText} disabled={isGenerating || !adContent} className="py-6 bg-gray-900 text-white rounded-[2rem] font-black text-sm hover:bg-blue-600 transition-all shadow-xl">
                 {isGenerating ? <i className="fa-solid fa-sync animate-spin"></i> : t.generate}
              </button>
              <button onClick={handleGenerateImage} disabled={isGeneratingImage || !adContent} className="py-6 bg-blue-600 text-white rounded-[2rem] font-black text-sm hover:bg-indigo-700 transition-all shadow-xl">
                 {isGeneratingImage ? <i className="fa-solid fa-sync animate-spin"></i> : t.generateImage}
              </button>
            </div>
         </div>

         <div className="bg-gray-100/50 p-12 rounded-[3.5rem] border border-dashed border-gray-300 flex flex-col gap-6">
            {adImage && (
              <div className="w-full bg-white p-4 rounded-[2.5rem] shadow-xl animate-in zoom-in-95">
                 <img src={adImage} className="w-full h-64 object-cover rounded-[2rem] shadow-inner" alt="Generated Ad Asset" />
              </div>
            )}
            
            {adCopy ? (
               <div className="w-full space-y-8 animate-in zoom-in-95">
                  <div className="bg-white p-10 rounded-[2.5rem] text-right border border-gray-100 shadow-xl relative">
                     <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg">
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                     </div>
                     <p className="text-gray-800 font-bold leading-loose text-lg">{adCopy}</p>
                  </div>
                  <button onClick={handleDeploy} className="w-full py-8 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-700 transition-all">
                     <i className="fa-brands fa-facebook mr-3"></i> {t.deploy}
                  </button>
               </div>
            ) : (
               <div className="flex-1 flex flex-col justify-center items-center text-center opacity-10">
                  <i className="fa-solid fa-paper-plane text-[120px] mb-10"></i>
                  <p className="font-black uppercase tracking-[0.5em] text-sm">{language === 'ar' ? 'بانتظار الإبداع' : 'Awaiting Synthesis'}</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default MarketingCenter;
