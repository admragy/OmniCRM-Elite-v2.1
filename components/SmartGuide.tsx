
import React, { useState } from 'react';

interface SmartGuideProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ar';
}

const SmartGuide: React.FC<SmartGuideProps> = ({ isOpen, onClose, language }) => {
  const [activePillar, setActivePillar] = useState<number>(0);

  if (!isOpen) return null;

  const content = {
    en: {
      title: 'Omni Masterclass',
      subtitle: 'Your Blueprint for Market Dominance.',
      close: 'Launch Strategic Operations',
      pillars: [
        {
          id: 0,
          label: 'Core CRM',
          icon: 'fa-microchip-ai',
          steps: [
            { title: 'The Dashboard Radar', desc: 'Monitor your Revenue Velocity and Satisfaction Index in real-time.', icon: 'fa-chart-network' },
            { title: 'Customer Psychology', desc: 'AI analyzes every interaction to predict personality types and conversion probability.', icon: 'fa-brain-circuit' },
            { title: 'Pipeline Mastery', desc: 'Drag deals through stages. AI calculates probability based on historical momentum.', icon: 'fa-file-invoice-dollar' }
          ]
        },
        {
          id: 1,
          label: 'AI Production',
          icon: 'fa-wand-magic-sparkles',
          steps: [
            { title: 'Media Lab (VEO 3.1)', desc: 'Generate 4K cinematic marketing assets by simply describing your vision.', icon: 'fa-film' },
            { title: 'Campaign Architect', desc: 'Engineer high-converting ads for Facebook & WhatsApp with generated visuals.', icon: 'fa-megaphone' },
            { title: 'Market Intelligence', desc: 'Use Deep Web Scanning to analyze competitor strategies and market gaps.', icon: 'fa-magnifying-glass-chart' }
          ]
        },
        {
          id: 2,
          label: 'Sovereignty & Edge',
          icon: 'fa-shield-halved',
          steps: [
            { title: 'Edge Intelligence', desc: 'Process sensitive contracts locally on your device. Data never leaves your hardware.', icon: 'fa-fingerprint' },
            { title: 'Unified Sync', desc: 'Data is encrypted and synced to your private sovereign cloud instantly.', icon: 'fa-cloud-lock' }
          ]
        },
        {
          id: 3,
          label: 'Executive Strategy',
          icon: 'fa-chess-knight',
          steps: [
            { title: 'Live Voice Oracle', desc: 'Talk to Gemini directly. Ask for growth hacks or strategic business pivots.', icon: 'fa-microphone-lines' },
            { title: 'Market Pulse', desc: 'Scan global news daily to find untapped industry gaps.', icon: 'fa-globe' }
          ]
        }
      ],
      blueprint: {
        title: 'Success Checklist',
        items: [
          'Connect Sovereign Storage (Supabase)',
          'Calibrate Strategic Intelligence in Settings',
          'Run a Competitive Market Intelligence scan',
          'Deploy your first 4K Strategic Asset'
        ]
      }
    },
    ar: {
      title: 'دليل احتراف أومني (Masterclass)',
      subtitle: 'خريطتك للسيطرة على السوق والنمو المتسارع.',
      close: 'بدء تشغيل العمليات',
      pillars: [
        {
          id: 0,
          label: 'أساسيات CRM',
          icon: 'fa-cube',
          steps: [
            { title: 'رادار لوحة التحكم', desc: 'راقب سرعة نمو الإيرادات ومؤشر رضا العملاء لحظة بلحظة.', icon: 'fa-chart-network' },
            { title: 'سيكولوجية العميل', desc: 'الذكاء الاصطناعي يحلل الشخصيات ويتوقع احتمالات التحويل تلقائياً.', icon: 'fa-brain-circuit' },
            { title: 'إدارة الصفقات', desc: 'حرك صفقاتك بسلاسة، وسيقوم النظام بحساب احتمالية النجاح بناءً على الزخم.', icon: 'fa-file-invoice-dollar' }
          ]
        },
        {
          id: 1,
          label: 'الإنتاج الذكي',
          icon: 'fa-sparkles',
          steps: [
            { title: 'مختبر الميديا (VEO)', desc: 'ولد أصولاً تسويقية 4K سينمائية بمجرد وصف رؤيتك للنظام.', icon: 'fa-film' },
            { title: 'مهندس الحملات', desc: 'صمم إعلانات فيسبوك وواتساب مع صور مولدة بالذكاء الاصطناعي.', icon: 'fa-megaphone' },
            { title: 'استخبارات السوق', desc: 'استخدم المسح العميق للويب لتحليل استراتيجيات المنافسين وفجوات السوق.', icon: 'fa-magnifying-glass-chart' }
          ]
        },
        {
          id: 2,
          label: 'السيادة والمعالجة المحلية',
          icon: 'fa-shield-check',
          steps: [
            { title: 'المحرك المحلي (Edge)', desc: 'حلل العقود الحساسة محلياً على جهازك لضمان السرية المطلقة.', icon: 'fa-fingerprint' },
            { title: 'المزامنة الموحدة', desc: 'تشفير كامل للبيانات ومزامنتها مع سحابتك السيادية الخاصة.', icon: 'fa-cloud-lock' }
          ]
        },
        {
          id: 3,
          label: 'الاستراتيجية العليا',
          icon: 'fa-crown',
          steps: [
            { title: 'المستشار الصوتي الحي', desc: 'تحدث مع Gemini مباشرة. اطلب منه أفكاراً لزيادة أرباحك.', icon: 'fa-microphone-lines' },
            { title: 'نبض السوق الاستراتيجي', desc: 'امسح الأخبار العالمية يومياً لاكتشاف فجوات السوق غير المستغلة.', icon: 'fa-globe' }
          ]
        }
      ],
      blueprint: {
        title: 'قائمة التحقق للنجاح',
        items: [
          'ربط التخزين السيادي (Supabase)',
          'معايرة الذكاء الاستراتيجي في الإعدادات',
          'إجراء أول عملية تحليل لاستخبارات السوق',
          'نشر أول أصل استراتيجي بجودة 4K'
        ]
      }
    }
  }[language];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-[3rem] md:rounded-[5rem] shadow-4xl border border-white/10 relative overflow-hidden flex flex-col lg:flex-row min-h-[80vh]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Left Sidebar: Pillars Selection */}
        <div className="lg:w-80 bg-slate-50 dark:bg-slate-800/50 p-8 md:p-12 flex flex-col gap-4 border-x border-slate-200 dark:border-slate-800">
           <div className="mb-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{content.title}</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">{content.subtitle}</p>
           </div>
           
           <div className="space-y-3">
              {content.pillars.map((pillar) => (
                <button 
                  key={pillar.id}
                  onClick={() => setActivePillar(pillar.id)}
                  className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all duration-500 group ${
                    activePillar === pillar.id 
                    ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30' 
                    : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <i className={`fa-solid ${pillar.icon} text-lg w-8`}></i>
                  <span className="text-sm font-black uppercase tracking-widest">{pillar.label}</span>
                </button>
              ))}
           </div>

           <div className="mt-auto pt-10 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">{content.blueprint.title}</h4>
              <ul className="space-y-4">
                 {content.blueprint.items.map((item, i) => (
                   <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-emerald-500/30 flex items-center justify-center">
                         <i className="fa-solid fa-check text-[8px] text-emerald-500 opacity-50"></i>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{item}</span>
                   </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* Right Section: Content Rendering */}
        <div className="flex-1 p-8 md:p-20 overflow-y-auto custom-scrollbar">
           <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-600/10 rounded-full border border-indigo-500/20 mb-10">
                 <i className={`fa-solid ${content.pillars[activePillar].icon} text-indigo-500`}></i>
                 <span className="text-indigo-500 text-[10px] font-black uppercase tracking-widest">{content.pillars[activePillar].label} Mastery</span>
              </div>

              <div className="grid grid-cols-1 gap-12">
                 {content.pillars[activePillar].steps.map((step, idx) => (
                   <div key={idx} className="flex items-start gap-10 group animate-in slide-in-from-bottom-10" style={{ animationDelay: `${idx * 150}ms` }}>
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-3xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 shadow-xl shrink-0 group-hover:rotate-6">
                         <i className={`fa-solid ${step.icon}`}></i>
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{step.title}</h3>
                         <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">{step.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{language === 'ar' ? 'أتقن الركيزة وتقدم للأمام' : 'Master this pillar to progress'}</p>
                 <button 
                   onClick={onClose}
                   className="px-12 py-6 bg-slate-900 dark:bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-3xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
                 >
                   {content.close}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SmartGuide;
