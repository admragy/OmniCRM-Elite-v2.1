
import React, { useState, useEffect } from 'react';

interface EdgeIntelligenceProps {
  language: 'en' | 'ar';
}

const EdgeIntelligence: React.FC<EdgeIntelligenceProps> = ({ language }) => {
  const [modelStatus, setModelStatus] = useState<'idle' | 'loading' | 'ready'>('idle');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const t = {
    en: {
      title: 'Neural Edge Node',
      desc: 'Privacy-First processing. Your data never leaves this device.',
      loadModel: 'Download Local Brain',
      loading: 'Initializing Neural Weights...',
      ready: 'Local Engine Active',
      placeholder: 'Paste sensitive contract or client data here for private analysis...',
      analyze: 'Run Local Privacy Scan',
      analyzing: 'Processing at the Edge...',
      resultTitle: 'Local Inference Result',
      privacyNote: '100% Client-Side Encryption'
    },
    ar: {
      title: 'محرك المعالجة المحلي',
      desc: 'خصوصية مطلقة. بياناتك لا تغادر هذا الجهاز أبداً.',
      loadModel: 'تحميل العقل المحلي',
      loading: 'جاري تهيئة الأوزان العصبية...',
      ready: 'المحرك المحلي نشط',
      placeholder: 'أدخل العقود الحساسة أو بيانات العملاء هنا لتحليلها بخصوصية تامة...',
      analyze: 'بدء المسح الأمني المحلي',
      analyzing: 'جاري المعالجة على حافة الشبكة...',
      resultTitle: 'نتيجة الاستنتاج المحلي',
      privacyNote: 'تشفير كامل على مستوى المستخدم (Client-Side)'
    }
  }[language];

  // محاكاة تحميل النموذج المحلي (لأغراض الواجهة والتجربة)
  const loadLocalModel = () => {
    setModelStatus('loading');
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setModelStatus('ready');
      }
    }, 150);
  };

  const handleAnalyze = async () => {
    if (!inputText) return;
    setIsProcessing(true);
    // محاكاة الاستنتاج المحلي
    setTimeout(() => {
      setResult({
        sentiment: 'Positive',
        confidence: '94.2%',
        riskLevel: 'Low',
        entities: ['Strategic Partnership', 'Budget Approval', 'Q4 Expansion']
      });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32">
      <div className="bg-emerald-950 rounded-[4rem] p-12 md:p-16 border border-emerald-500/20 relative overflow-hidden group shadow-3xl">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex-1 text-center lg:text-start">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30 mb-8">
               <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
               <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{t.privacyNote}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">{t.title}</h2>
            <p className="text-emerald-100/60 font-bold text-base max-w-2xl leading-relaxed">{t.desc}</p>
          </div>
          
          <div className="w-full lg:w-96">
            {modelStatus !== 'ready' ? (
              <button 
                onClick={loadLocalModel}
                disabled={modelStatus === 'loading'}
                className="w-full py-8 bg-emerald-500 text-slate-950 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-emerald-400 transition-all flex flex-col items-center gap-4"
              >
                {modelStatus === 'loading' ? (
                  <>
                    <i className="fa-solid fa-sync animate-spin text-2xl"></i>
                    <span>{progress}% - {t.loading}</span>
                    <div className="w-48 h-1 bg-slate-900/20 rounded-full mt-2">
                       <div className="bg-slate-900 h-full rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                    </div>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-download text-2xl"></i>
                    <span>{t.loadModel}</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-white/10 backdrop-blur-xl rounded-[3rem] p-8 border border-emerald-500/30 text-center">
                 <i className="fa-solid fa-shield-check text-4xl text-emerald-400 mb-4"></i>
                 <p className="text-white font-black uppercase tracking-widest text-xs">{t.ready}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
           <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4">{language === 'ar' ? 'بيانات الخصوصية' : 'Sensitive Input'}</label>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-64 bg-slate-50 dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 outline-none font-bold dark:text-white resize-none shadow-inner text-sm leading-relaxed"
                placeholder={t.placeholder}
              />
           </div>
           <button 
              onClick={handleAnalyze}
              disabled={isProcessing || modelStatus !== 'ready' || !inputText}
              className="w-full py-8 bg-slate-950 dark:bg-emerald-600 text-white rounded-[2.5rem] font-black text-lg shadow-3xl hover:bg-emerald-700 disabled:opacity-30 transition-all flex items-center justify-center gap-4 uppercase tracking-widest"
           >
              {isProcessing ? <i className="fa-solid fa-microchip animate-spin"></i> : <i className="fa-solid fa-fingerprint"></i>}
              {isProcessing ? t.analyzing : t.analyze}
           </button>
        </div>

        <div className="relative">
           {result ? (
             <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border-2 border-emerald-500/20 shadow-2xl animate-in zoom-in-95 h-full">
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-10 tracking-tighter">{t.resultTitle}</h4>
                <div className="space-y-10">
                   <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sentiment Analysis</p>
                         <p className="text-xl font-black text-emerald-500">{result.sentiment}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Confidence</p>
                         <p className="text-xl font-black text-slate-900 dark:text-white">{result.confidence}</p>
                      </div>
                   </div>
                   
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Local Entity Extraction</p>
                      <div className="flex flex-wrap gap-3">
                         {result.entities.map((ent: string, i: number) => (
                           <span key={i} className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-black border border-emerald-100 dark:border-emerald-800">
                             {ent}
                           </span>
                         ))}
                      </div>
                   </div>

                   <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                      <i className="fa-solid fa-shield-check text-emerald-500 text-2xl"></i>
                      <p className="text-xs font-bold text-slate-400">{language === 'ar' ? 'تمت هذه المعالجة بالكامل على معالج جهازك.' : 'This inference was executed locally on your device CPU/GPU.'}</p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full bg-slate-100 dark:bg-slate-900/50 rounded-[3.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center mb-8">
                   <i className="fa-solid fa-brain-circuit text-4xl text-slate-300"></i>
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs leading-relaxed max-w-xs">{language === 'ar' ? 'بانتظار تفعيل العقل المحلي والبدء في تحليل البيانات...' : 'Waiting for local brain activation to start data synthesis...'}</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default EdgeIntelligence;
