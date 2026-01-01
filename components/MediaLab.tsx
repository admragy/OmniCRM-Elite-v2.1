
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BrandProfile } from '../types';

interface MediaLabProps {
  brand: BrandProfile;
  language: 'en' | 'ar';
  deductTokens: (amount: number) => Promise<boolean>;
}

const MediaLab: React.FC<MediaLabProps> = ({ brand, language, deductTokens }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const t = {
    en: {
      title: 'Neural Media Lab',
      desc: 'Generate cinematic 4K marketing videos powered by Veo 3.1.',
      promptLabel: 'Cinematic Concept',
      placeholder: 'Describe your vision (e.g., A minimalist futuristic apartment with digital CRM holograms)...',
      generate: 'Synthesize Video',
      generating: 'Rendering Strategic Visuals...',
      statusWait: 'Processing request...',
      statusStep: 'Injecting neural frames...',
      statusFinal: 'Encoding strategic output...',
      ready: 'Strategic Asset Ready',
      keyRequired: 'Premium Access Required'
    },
    ar: {
      title: 'مختبر الميديا العصبي',
      desc: 'توليد فيديوهات تسويقية سينمائية مدعومة بنموذج Veo 3.1.',
      promptLabel: 'المفهوم السينمائي',
      placeholder: 'صف رؤيتك (مثال: مكتب مستقبلي مع هولوجرام يعرض بيانات العملاء)...',
      generate: 'توليد الفيديو',
      generating: 'جاري معالجة المشاهد الاستراتيجية...',
      statusWait: 'جاري إرسال الطلب...',
      statusStep: 'جاري رسم الإطارات العصبية...',
      statusFinal: 'جاري التشفير النهائي...',
      ready: 'الأصل الاستراتيجي جاهز',
      keyRequired: 'مطلوب وصول مميز'
    }
  }[language];

  const handleGenerateVideo = async () => {
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      return;
    }

    const success = await deductTokens(50);
    if (!success) return;

    setIsGenerating(true);
    setStatus(t.statusWait);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `${prompt}. High-end commercial style for ${brand.industry}. Cinematic lighting, 4K, professional color grading.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setStatus(t.statusStep);
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      setStatus(t.statusFinal);
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      setVideoUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Video generation failed:", error);
      alert("Generation failed. Ensure you have a paid API key.");
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32">
      <div className="bg-slate-950 rounded-[4rem] p-12 md:p-16 border border-white/5 relative overflow-hidden group shadow-3xl">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex-1 text-center lg:text-start">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-600/20 rounded-full border border-indigo-500/30 mb-8">
               <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
               <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Powered by VEO 3.1</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">{t.title}</h2>
            <p className="text-slate-400 font-bold text-base max-w-2xl leading-relaxed">{t.desc}</p>
          </div>
          <div className="w-full lg:w-96 p-8 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl">
            <i className="fa-solid fa-wand-magic-sparkles text-3xl text-indigo-500 mb-6 block"></i>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Neural Capacity</p>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-2">
               <div className="bg-indigo-500 h-full w-[85%]"></div>
            </div>
            <p className="text-white font-bold text-xs">High Fidelity Enabled</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4">{t.promptLabel}</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-48 bg-slate-50 dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 outline-none font-bold dark:text-white resize-none shadow-inner text-sm"
                placeholder={t.placeholder}
              />
            </div>
            <button 
              onClick={handleGenerateVideo}
              disabled={isGenerating || !prompt}
              className="w-full py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-lg shadow-3xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-4 uppercase tracking-widest"
            >
              {isGenerating ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-video-plus"></i>}
              {isGenerating ? status : t.generate}
            </button>
          </div>
        </div>

        <div className="relative group">
           {videoUrl ? (
             <div className="bg-slate-950 rounded-[3.5rem] overflow-hidden shadow-3xl border border-white/5 animate-in zoom-in-95 aspect-video flex items-center justify-center relative">
                <video src={videoUrl} controls className="w-full h-full object-cover" />
                <div className="absolute top-8 right-8 px-6 py-2 bg-emerald-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
                   {t.ready}
                </div>
             </div>
           ) : (
             <div className="bg-slate-900 rounded-[3.5rem] aspect-video flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                   <div className="grid grid-cols-8 grid-rows-8 h-full">
                      {Array.from({length: 64}).map((_, i) => <div key={i} className="border border-white/10"></div>)}
                   </div>
                </div>
                {isGenerating ? (
                   <div className="relative z-10 flex flex-col items-center">
                      <div className="w-24 h-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                      <p className="text-white font-black uppercase tracking-[0.4em] text-xs">{t.generating}</p>
                   </div>
                ) : (
                   <div className="relative z-10 opacity-20">
                      <i className="fa-solid fa-film text-[100px] text-white mb-8"></i>
                      <p className="text-white font-black uppercase tracking-[0.3em]">{language === 'ar' ? 'بانتظار الإبداع الاستراتيجي...' : 'Awaiting Strategic Vision...'}</p>
                   </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default MediaLab;
