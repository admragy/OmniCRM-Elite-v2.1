
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BrandProfile, AdCampaign } from '../types';
import { performMarketAnalysis, getAdOptimizationInsights } from '../services/geminiService';

interface MarketingCenterProps {
  language: 'en' | 'ar';
  brand: BrandProfile;
  onCampaignCreated?: (campaign: AdCampaign) => void;
}

const MarketingCenter: React.FC<MarketingCenterProps> = ({ language, brand, onCampaignCreated }) => {
  const [adContent, setAdContent] = useState('');
  const [spyMode, setSpyMode] = useState(false);
  const [competitors, setCompetitors] = useState('');
  const [spyResult, setSpyResult] = useState<{ intelligence: string; sources: any[] } | null>(null);
  
  const [adCopyA, setAdCopyA] = useState<string | null>(null);
  const [adCopyB, setAdCopyB] = useState<string | null>(null);
  const [activeVariant, setActiveVariant] = useState<'A' | 'B'>('A');
  const [winner, setWinner] = useState<'A' | 'B' | null>(null);
  const [optimizationInsight, setOptimizationInsight] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const [metrics, setMetrics] = useState({
    A: { ctr: 0, engagement: 0 },
    B: { ctr: 0, engagement: 0 }
  });
  
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpying, setIsSpying] = useState(false);
  const [learningMode, setLearningMode] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [leadForm, setLeadForm] = useState<any>(null);

  const [fbConnected, setFbConnected] = useState(false);
  const [waConnected, setWaConnected] = useState(false);
  
  // New state for platform selection
  const [selectedPlatforms, setSelectedPlatforms] = useState({ fb: false, wa: false });

  const t = {
    en: {
      title: 'Campaign Architect',
      desc: 'Neural engine learning from partnership history and market benchmarks.',
      connectTitle: 'Deployment Channels',
      fbConnect: 'Connect Meta Business',
      waConnect: 'Link WhatsApp API',
      generate: 'Engineer Market Leadership',
      spyLabel: 'Competitor Ad Spy (URLs & Profiles)',
      spyPlaceholder: 'Paste URLs or social profiles (e.g. competitor.com, @handle)...',
      launch: 'Deploy Strategic Winner',
      success: 'Strategic Broadcast Successful!',
      deploying: 'Broadcasting Winner...',
      postToFB: 'Post to Facebook Feed',
      postToWA: 'Send WhatsApp Broadcast',
      buildForm: 'Generate Intelligent Lead Form',
      metricsTitle: 'Neural Performance Prediction',
      ctr: 'Predicted CTR',
      engagement: 'Engagement Velocity',
      setWinner: 'Select as Winning Variant',
      winnerBadge: '🏆 Strategic Winner',
      spyBtn: 'Scan Competitor Intel',
      spyReportTitle: 'Competitor Ad Intelligence Report',
      sources: 'Intelligence Sources',
      optimizeBtn: 'Analyze & Optimize Future Campaigns',
      optimizing: 'Synthesizing Performance Data...',
      optimizeTitle: 'Strategic Optimization Loop',
      platformSelect: 'Select Deployment Targets',
      mustConnect: 'Connect accounts in header to enable selection'
    },
    ar: {
      title: 'مهندس الحملات الاستراتيجية',
      desc: 'المحرك العصبي يتعلم من سياق الشراكات وتاريخ مقارنات السوق المرجعية.',
      connectTitle: 'قنوات النشر والوصول',
      fbConnect: 'ربط مدير أعمال فيسبوك',
      waConnect: 'ربط واتساب للأعمال',
      generate: 'هندسة الريادة في السوق',
      spyLabel: 'تجسس إعلانات المنافسين (روابط وحسابات)',
      spyPlaceholder: 'أدخل روابط المواقع أو حسابات التواصل (مثل competitor.com)...',
      launch: 'نشر الإصدار الفائز',
      success: 'تم البث الاستراتيجي بنجاح!',
      deploying: 'جاري نشر الإصدار الفائز...',
      postToFB: 'نشر على الصفحة العامة',
      postToWA: 'إرسال بث واتساب',
      buildForm: 'توليد نموذج جمع عملاء ذكي',
      metricsTitle: 'توقعات الأداء العصبي',
      ctr: 'نسبة النقر المتوقعة',
      engagement: 'سرعة التفاعل',
      setWinner: 'اعتماد هذا الإصدار كفائز',
      winnerBadge: '🏆 الإصدار الاستراتيجي الفائز',
      spyBtn: 'مسح استخبارات المنافسين',
      spyReportTitle: 'تقرير استخبارات إعلانات المنافسين',
      sources: 'مصادر المعلومات',
      optimizeBtn: 'تحليل وتحسين الحملات المستقبلية',
      optimizing: 'جاري معالجة بيانات الأداء...',
      optimizeTitle: 'حلقة التحسين الاستراتيجي',
      platformSelect: 'اختر منصات النشر المستهدفة',
      mustConnect: 'قم بربط الحسابات في الأعلى لتتمكن من الاختيار'
    }
  }[language];

  // Auto-select platform when connected if none selected
  useEffect(() => {
    if (fbConnected && !selectedPlatforms.fb) setSelectedPlatforms(prev => ({ ...prev, fb: true }));
    if (!fbConnected && selectedPlatforms.fb) setSelectedPlatforms(prev => ({ ...prev, fb: false }));
  }, [fbConnected]);

  useEffect(() => {
    if (waConnected && !selectedPlatforms.wa) setSelectedPlatforms(prev => ({ ...prev, wa: true }));
    if (!waConnected && selectedPlatforms.wa) setSelectedPlatforms(prev => ({ ...prev, wa: false }));
  }, [waConnected]);

  const handleAnalyzePerformance = async () => {
    if (!adCopyA || !adCopyB) return;
    setIsOptimizing(true);
    setOptimizationInsight(null);
    try {
      const insight = await getAdOptimizationInsights(adCopyA, adCopyB, metrics, language);
      setOptimizationInsight(insight);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSpy = async () => {
    if (!competitors) return;
    setIsSpying(true);
    setSpyResult(null);
    try {
      const res = await performMarketAnalysis(competitors, language);
      setSpyResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSpying(false);
    }
  };

  const generateLeadForm = async () => {
    setIsGenerating(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const targetLang = language === 'ar' ? 'Arabic' : 'English';
    try {
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        config: { responseMimeType: "application/json" },
        contents: `Generate a Lead Generation Form for ${brand.industry}. 
        Return JSON: { "headline": "string", "questions": ["string"], "cta": "string" } in ${targetLang}.`
      });
      setLeadForm(JSON.parse(res.text || '{}'));
    } catch (e) {} finally { setIsGenerating(false); }
  };

  const handleGenerate = async () => {
    if (!adContent) return;
    setIsGenerating(true);
    setLearningMode(true);
    setAdCopyA(null);
    setAdCopyB(null);
    setWinner(null);
    setOptimizationInsight(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chatContext = brand.aiMemory?.chatHistory?.slice(-15).map(c => `${c.role}: ${c.text}`).join('\n') || '';
    const targetLang = language === 'ar' ? 'Arabic' : 'English';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        config: { responseMimeType: "application/json" },
        contents: `
          CRITICAL REQUIREMENT: You MUST generate all text content in ${targetLang} language.
          MISSION: Generate TWO high-performance strategic Ads.
          PARTNER CONTEXT: ${chatContext}
          TASK: Create Variant A (Gap Discovery) and Variant B (Brand Authority).
          Output JSON: { "copyA": "...", "copyB": "...", "insights": ["..."] }
        `,
      });

      const data = JSON.parse(response.text || '{}');
      setAdCopyA(data.copyA);
      setAdCopyB(data.copyB);
      
      // Generate simulated metrics
      setMetrics({
        A: { ctr: 2.4 + Math.random() * 2, engagement: 75 + Math.random() * 20 },
        B: { ctr: 2.1 + Math.random() * 2, engagement: 70 + Math.random() * 25 }
      });
      
      const imgRes = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: `Premium strategic commercial visual for ${brand.industry}, minimalist and professional.` }] },
        config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
      });

      for (const p of imgRes.candidates?.[0]?.content?.parts || []) {
        if (p.inlineData) setGeneratedImg(`data:image/png;base64,${p.inlineData.data}`);
      }

    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setLearningMode(false);
    }
  };

  const handleDeploy = async () => {
    if (!winner) {
      alert(language === 'ar' ? 'يرجى اختيار الإصدار الفائز أولاً' : 'Please select a winning variant first');
      return;
    }
    if (!selectedPlatforms.fb && !selectedPlatforms.wa) {
      alert(language === 'ar' ? 'يرجى اختيار منصة واحدة على الأقل للنشر' : 'Please select at least one platform to deploy');
      return;
    }
    
    setIsDeploying(true);
    // Simulate API calls to multiple platforms
    const activeTasks = [];
    if (selectedPlatforms.fb) activeTasks.push(new Promise(r => setTimeout(r, 1500)));
    if (selectedPlatforms.wa) activeTasks.push(new Promise(r => setTimeout(r, 1500)));
    
    await Promise.all(activeTasks);
    setIsDeploying(false);
    
    if (onCampaignCreated) {
      onCampaignCreated({
        id: `campaign-${Date.now()}`,
        date: new Date().toISOString(),
        goal: 'Strategic Growth',
        content: activeVariant === 'A' ? adCopyA! : adCopyB!,
        locations: 'Global',
        aiCopy: activeVariant === 'A' ? adCopyA! : adCopyB!,
        performanceNote: 'Simulated multi-platform deployment'
      });
    }
    
    alert(t.success);
  };

  const isAnythingSelected = selectedPlatforms.fb || selectedPlatforms.wa;

  return (
    <div className="space-y-10 pb-24" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <style>{`
        @keyframes radar {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(3); opacity: 0; }
        }
        .radar-circle {
          position: absolute;
          border: 1px solid rgba(99, 102, 241, 0.5);
          border-radius: 50%;
          animation: radar 2s infinite linear;
        }
      `}</style>

      <section className="bg-white/80 dark:bg-slate-900/80 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 backdrop-blur-3xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex-1">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{t.title}</h2>
          <p className="text-slate-400 font-bold text-sm max-w-xl">{t.desc}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setFbConnected(!fbConnected)}
            className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 border shadow-sm ${fbConnected ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-200 dark:shadow-indigo-900/40' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}
          >
            <i className={`fa-brands fa-facebook-f text-lg ${fbConnected ? 'animate-pulse' : ''}`}></i>
            {fbConnected ? (language === 'ar' ? 'متصل بفيسبوك' : 'Meta Connected') : t.fbConnect}
          </button>
          <button 
            onClick={() => setWaConnected(!waConnected)}
            className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 border shadow-sm ${waConnected ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-200 dark:shadow-emerald-900/40' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}
          >
            <i className={`fa-brands fa-whatsapp text-xl ${waConnected ? 'animate-bounce' : ''}`}></i>
            {waConnected ? (language === 'ar' ? 'متصل بواتساب' : 'WhatsApp Linked') : t.waConnect}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-3xl space-y-8 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.spyLabel}</label>
              <div onClick={() => setSpyMode(!spyMode)} className={`w-14 h-8 rounded-full relative cursor-pointer transition-all ${spyMode ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${language === 'ar' ? (spyMode ? 'left-1' : 'right-1') : (spyMode ? 'right-1' : 'left-1')}`}></div>
              </div>
            </div>

            {spyMode && (
              <div className="space-y-6 animate-in slide-in-from-top-4">
                 <div className="relative flex flex-col gap-4">
                    <input 
                      type="text" 
                      value={competitors} 
                      onChange={e => setCompetitors(e.target.value)} 
                      placeholder={t.spyPlaceholder} 
                      className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold dark:text-white" 
                    />
                    <button 
                      onClick={handleSpy} 
                      disabled={isSpying || !competitors} 
                      className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                       {isSpying && (
                         <>
                           <div className="radar-circle" style={{ width: '40px', height: '40px' }}></div>
                           <div className="radar-circle" style={{ width: '40px', height: '40px', animationDelay: '0.5s' }}></div>
                         </>
                       )}
                       {isSpying ? <i className="fa-solid fa-radar animate-pulse"></i> : <i className="fa-solid fa-user-secret"></i>}
                       {isSpying ? (language === 'ar' ? 'جاري تحليل الأهداف...' : 'Analyzing Targets...') : t.spyBtn}
                    </button>
                 </div>

                 {spyResult && (
                   <div className="p-8 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-[2.5rem] animate-in zoom-in-95">
                      <div className="flex items-center gap-3 mb-6">
                        <i className="fa-solid fa-file-shield text-indigo-500 text-xl"></i>
                        <h4 className="text-xl font-black text-indigo-900 dark:text-indigo-200 tracking-tight">{t.spyReportTitle}</h4>
                      </div>
                      <div className="prose dark:prose-invert max-w-none text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap mb-8">
                        {spyResult.intelligence}
                      </div>
                      {spyResult.sources.length > 0 && (
                        <div className="pt-6 border-t border-indigo-100 dark:border-indigo-800">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t.sources}</p>
                          <div className="flex flex-wrap gap-2">
                            {spyResult.sources.map((chunk: any, i: number) => (
                              <a key={i} href={chunk.web?.uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white dark:bg-slate-900 text-[10px] font-black text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                                {chunk.web?.title || 'Intelligence Source'}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                   </div>
                 )}
              </div>
            )}

            <div className="space-y-4">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Main Product/Service</label>
               <textarea value={adContent} onChange={e => setAdContent(e.target.value)} className="w-full h-32 bg-slate-50 dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 outline-none font-bold dark:text-white resize-none shadow-inner" placeholder="Describe the strategic offer..." />
            </div>

            <div className="flex gap-4">
               <button onClick={handleGenerate} disabled={isGenerating || !adContent} className="flex-1 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-4">
                 {isGenerating ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-sparkles"></i>}
                 {t.generate}
               </button>
               <button onClick={generateLeadForm} className="px-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:bg-white">
                 <i className="fa-solid fa-file-invoice mr-2"></i> {t.buildForm}
               </button>
            </div>

            {leadForm && (
              <div className="mt-8 p-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-[3rem] border border-indigo-100 dark:border-indigo-800 animate-in zoom-in-95">
                 <h4 className="text-xl font-black text-indigo-900 dark:text-indigo-200 mb-6">{leadForm.headline}</h4>
                 <div className="space-y-4">
                    {leadForm.questions.map((q: string, i: number) => (
                      <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">{q}</div>
                    ))}
                 </div>
                 <button className="w-full mt-8 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">{leadForm.cta}</button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-950 p-12 rounded-[4rem] border border-white/5 shadow-3xl relative overflow-hidden flex flex-col min-h-[900px]">
           {learningMode && (
             <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center p-12 text-center">
                <div className="relative w-48 h-48 mb-10">
                   <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fa-solid fa-rocket text-6xl text-indigo-500 animate-bounce"></i>
                   </div>
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-[0.4em] mb-4">ENGINEERING SUCCESS...</h3>
             </div>
           )}

           {(adCopyA || adCopyB) ? (
             <div className="flex-1 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
                <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/10 shrink-0">
                   <button onClick={() => setActiveVariant('A')} className={`flex-1 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all relative ${activeVariant === 'A' ? 'bg-indigo-600 text-white shadow-xl' : 'text-white/40'}`}>
                      VARIANT A
                      {winner === 'A' && <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[8px] px-2 py-1 rounded-full border border-white/20">WINNER</span>}
                   </button>
                   <button onClick={() => setActiveVariant('B')} className={`flex-1 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all relative ${activeVariant === 'B' ? 'bg-indigo-600 text-white shadow-xl' : 'text-white/40'}`}>
                      VARIANT B
                      {winner === 'B' && <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[8px] px-2 py-1 rounded-full border border-white/20">WINNER</span>}
                   </button>
                </div>

                <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">{t.metricsTitle}</h4>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400">{t.ctr}</span>
                            <span className="text-sm font-black text-white">{metrics[activeVariant].ctr.toFixed(1)}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${(metrics[activeVariant].ctr / 5) * 100}%` }}></div>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400">{t.engagement}</span>
                            <span className="text-sm font-black text-white">{metrics[activeVariant].engagement.toFixed(0)}</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${metrics[activeVariant].engagement}%` }}></div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex gap-3 mt-8">
                    {winner !== activeVariant && (
                      <button 
                        onClick={() => setWinner(activeVariant)}
                        className="flex-1 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                      >
                        {t.setWinner}
                      </button>
                    )}
                    <button 
                      onClick={handleAnalyzePerformance}
                      disabled={isOptimizing}
                      className="flex-1 py-4 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                    >
                      {isOptimizing ? <i className="fa-solid fa-microchip animate-spin"></i> : <i className="fa-solid fa-chart-line-up"></i>}
                      {isOptimizing ? t.optimizing : t.optimizeBtn}
                    </button>
                   </div>
                </div>

                {optimizationInsight && (
                  <div className="bg-white/5 border border-indigo-500/20 p-8 rounded-[2.5rem] animate-in slide-in-from-top-4">
                     <div className="flex items-center gap-3 mb-4">
                        <i className="fa-solid fa-flask-vial text-indigo-400"></i>
                        <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{t.optimizeTitle}</h4>
                     </div>
                     <div className="prose dark:prose-invert prose-sm text-white/80 font-bold leading-relaxed whitespace-pre-wrap">
                        {optimizationInsight}
                     </div>
                  </div>
                )}

                <div className="flex-1 flex items-center justify-center py-4">
                   <div className={`bg-white rounded-[3.5rem] overflow-hidden w-full max-w-[360px] shadow-3xl transform transition-all duration-500 ${winner === activeVariant ? 'ring-4 ring-emerald-500 ring-offset-4 ring-offset-slate-950 scale-[1.05]' : 'scale-100 opacity-90'}`}>
                      <div className="p-6 flex items-center justify-between border-b border-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black">{brand.name[0]}</div>
                          <div><p className="font-black text-sm text-slate-900">{brand.name}</p></div>
                        </div>
                        {winner === activeVariant && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{t.winnerBadge}</span>}
                      </div>
                      {generatedImg ? <img src={generatedImg} className="w-full aspect-square object-cover" /> : <div className="w-full aspect-square bg-slate-100 animate-pulse" />}
                      <div className="p-8">
                         <p className="text-sm font-bold text-slate-800 leading-relaxed">{activeVariant === 'A' ? adCopyA : adCopyB}</p>
                      </div>
                   </div>
                </div>

                {/* Platform Selection UI */}
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.platformSelect}</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        disabled={!fbConnected}
                        onClick={() => setSelectedPlatforms(p => ({ ...p, fb: !p.fb }))}
                        className={`py-4 rounded-2xl border flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${!fbConnected ? 'opacity-30 grayscale' : ''} ${selectedPlatforms.fb ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40'}`}
                      >
                         <i className="fa-brands fa-facebook"></i>
                         Facebook
                         {selectedPlatforms.fb && <i className="fa-solid fa-check-circle ml-1"></i>}
                      </button>
                      <button 
                        disabled={!waConnected}
                        onClick={() => setSelectedPlatforms(p => ({ ...p, wa: !p.wa }))}
                        className={`py-4 rounded-2xl border flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${!waConnected ? 'opacity-30 grayscale' : ''} ${selectedPlatforms.wa ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40'}`}
                      >
                         <i className="fa-brands fa-whatsapp"></i>
                         WhatsApp
                         {selectedPlatforms.wa && <i className="fa-solid fa-check-circle ml-1"></i>}
                      </button>
                   </div>
                   {(!fbConnected && !waConnected) && (
                     <p className="text-center text-[9px] font-bold text-rose-400 italic">{t.mustConnect}</p>
                   )}
                </div>

                <button 
                  onClick={handleDeploy} 
                  disabled={isDeploying || !winner || !isAnythingSelected}
                  className={`w-full py-8 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-xl ${winner && isAnythingSelected ? 'bg-white text-slate-950 hover:bg-slate-50' : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'}`}
                >
                  {isDeploying ? <i className="fa-solid fa-sync animate-spin text-indigo-600"></i> : <i className="fa-solid fa-rocket text-indigo-600"></i>}
                  {isDeploying ? t.deploying : t.launch}
                </button>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 space-y-12">
                <i className="fa-solid fa-chess-knight text-[140px] text-white"></i>
                <p className="text-3xl font-black text-white uppercase tracking-[0.5em]">Planning Suite</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default MarketingCenter;
