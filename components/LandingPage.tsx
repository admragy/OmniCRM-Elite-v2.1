
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  language: 'en' | 'ar';
  onLaunch: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ language, onLaunch, setLanguage }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = {
    en: {
      brand: "OMNI Business",
      heroTitle: "Sell More. Stress Less.",
      heroSub: "The first AI-driven OS that replaces your entire marketing team and manages your sales 24/7 on WhatsApp & Messenger.",
      cta: "Activate Now",
      trust: "5,000+ Businesses Dominating the Market",
      
      roiTitle: "Business Payoff",
      roiDesc: "Why top entrepreneurs are switching to Omni OS.",
      benefits: [
        { title: "+45% Revenue", desc: "Average increase in sales within the first 60 days of deployment.", icon: "fa-chart-line-up" },
        { title: "-90% Overhead", desc: "Cut costs by replacing human manual sales and content agencies.", icon: "fa-money-bill-trend-up" },
        { title: "Behavioral Mastery", desc: "Understand client psychology and close deals with 3x efficiency.", icon: "fa-brain" }
      ],

      compareTitle: "The Omni Edge",
      compareSub: "How we outpace traditional methods.",
      comparison: [
        { feature: "Speed", omni: "Seconds", traditional: "Weeks" },
        { feature: "Psychology", omni: "AI Behavior Analysis", traditional: "Gut Feeling" },
        { feature: "Content", omni: "Unlimited 4K AI", traditional: "Paid Per Post" },
        { feature: "Sales", omni: "Auto-Closer AI", traditional: "Manual Follow-ups" }
      ],

      expertTitle: "The Elite Experts",
      expertDesc: "Two core engines that handle your marketing and human analysis.",
      expertFeatures: [
        { title: "Ad Expert", desc: "Generates psychological ads and 4K visuals automatically.", icon: "fa-wand-magic-sparkles" },
        { title: "Behavior Expert", desc: "Analyzes client personality and gives you the strategy to win.", icon: "fa-brain-circuit" }
      ],

      pricingTitle: "Flexible Entry Nodes",
      packages: [
        { name: "Free Node", price: "$0", features: ["Basic CRM", "AI Ads (Limited)", "500 Energy"], free: true },
        { name: "Growth Pro", price: "$99", features: ["WhatsApp Closer", "Behavior Expert", "4K Ad Factory"], popular: true },
        { name: "Enterprise", price: "Custom", features: ["Private API", "Unlimited Energy", "VIP Support"] }
      ],
      footer: "Omni Business v3.5 | Neural Strategic Command"
    },
    ar: {
      brand: "اومني بزنس",
      heroTitle: "بيع اكتر. بمجهود اقل.",
      heroSub: "اول نظام تشغيل ذكاء اصطناعي يستبدل فريق التسويق بالكامل ويدير مبيعاتك 24/7 على واتساب وماسنجر.",
      cta: "ابدأ الان",
      trust: "اكثر من 5,000 شركة تسيطر على السوق الان",
      
      roiTitle: "عائد مادي حقيقي",
      roiDesc: "ليه كبار رواد الاعمال بيحولوا نشاطهم لنظام اومني؟",
      benefits: [
        { title: "زيادة ارباح 45%", desc: "متوسط زيادة المبيعات خلال اول 60 يوم من تشغيل النظام.", icon: "fa-chart-line-up" },
        { title: "توفير 90% تكاليف", desc: "تخلص من رواتب المندوبين ومصاريف وكالات التسويق الغالية.", icon: "fa-money-bill-trend-up" },
        { title: "السيطرة السلوكية", desc: "افهم سيكولوجية عميلك واقفل الصفقات بفاعلية اكبر بـ 3 اضعاف.", icon: "fa-brain" }
      ],

      compareTitle: "ليه اومني احسن من غيره؟",
      compareSub: "مقارنة بين اومني والطرق التقليدية القديمة.",
      comparison: [
        { feature: "سرعة التنفيذ", omni: "ثواني معدودة", traditional: "اسابيع من العمل" },
        { feature: "فهم العميل", omni: "تحليل سلوكي بالذكاء", traditional: "توقعات بشرية" },
        { feature: "جودة المحتوى", omni: "صور 4K غير محدودة", traditional: "الدفع لكل تصميم" },
        { feature: "عملية البيع", omni: "رد وبيع تلقائي", traditional: "متابعة بشرية مملة" }
      ],

      expertTitle: "فريق الخبراء الذكي",
      expertDesc: "محركان اساسيان لادارة التسويق وتحليل السلوك البشري لعملائك.",
      expertFeatures: [
        { title: "خبير الاعلانات", desc: "توليد اعلانات وصور 4K نفسية تجذب العميل تلقائيا.", icon: "fa-wand-magic-sparkles" },
        { title: "خبير السلوك البشري", desc: "تحليل شخصية العميل واعطائك خطة الاقناع المثالية.", icon: "fa-brain-circuit" }
      ],

      pricingTitle: "خطط التشغيل",
      packages: [
        { name: "عقدة التجربة", price: "0$", features: ["ادارة عملاء اساسية", "اعلانات محدودة", "500 وحدة طاقة"], free: true },
        { name: "باقة النمو", price: "99$", features: ["بائع الواتساب الذكي", "خبير السلوك البشري", "مصنع الصور 4K"], popular: true },
        { name: "باقة المؤسسات", price: "تواصل معنا", features: ["ربط برمجي خاص", "طاقة غير محدودة", "دعم VIP"], popular: false }
      ],
      footer: "اومني بزنس v3.5 | نظام النمو الاستراتيجي"
    }
  }[language];

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden selection:bg-indigo-500/30 font-sans leading-normal" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-slate-950/95 backdrop-blur-xl py-3 border-b border-white/5' : 'py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-atom text-white text-xs"></i>
            </div>
            <span className="text-lg font-black tracking-tighter uppercase leading-none">{t.brand}</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {language === 'ar' ? 'English' : 'العربية'}
            </button>
            <button onClick={onLaunch} className="px-6 py-2 bg-white text-slate-950 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
              {language === 'ar' ? 'دخول النظام' : 'Enter System'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-6 pt-32 pb-16 md:pt-48 md:pb-24">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600/10 rounded-full border border-indigo-500/20">
             <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
             <span className="text-indigo-400 text-[9px] font-black uppercase tracking-widest">{language === 'ar' ? 'تكنولوجيا النمو المتسارع' : 'Next-Gen Growth Tech'}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1.1] pb-6 shimmer-text">
            {t.heroTitle}
          </h1>
          <p className="text-slate-400 text-lg md:text-2xl font-medium leading-relaxed max-w-3xl">
            {t.heroSub}
          </p>
          <div className="pt-6">
             <button onClick={onLaunch} className="px-12 py-6 bg-indigo-600 text-white rounded-full font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
               <i className="fa-solid fa-bolt"></i>
               {t.cta}
             </button>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="relative z-10 container mx-auto px-6 py-24 bg-white/[0.02] border-y border-white/5 rounded-[5rem]">
         <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 pb-2">{t.roiTitle}</h2>
            <p className="text-slate-400 font-bold max-w-2xl mx-auto">{t.roiDesc}</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.benefits.map((b, i) => (
              <div key={i} className="bg-slate-900/40 p-12 rounded-[3.5rem] border border-white/5 hover:border-indigo-500/30 transition-all group">
                 <i className={`fa-solid ${b.icon} text-5xl text-indigo-500 mb-8 block group-hover:scale-110 transition-transform`}></i>
                 <h3 className="text-3xl font-black mb-4 leading-tight pb-1">{b.title}</h3>
                 <p className="text-slate-400 font-bold text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Comparison Table */}
      <section className="relative z-10 container mx-auto px-6 py-24">
         <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 pb-2">{t.compareTitle}</h2>
            <p className="text-slate-400 font-bold max-w-2xl mx-auto">{t.compareSub}</p>
         </div>
         <div className="max-w-4xl mx-auto bg-slate-900/60 rounded-[3rem] border border-white/5 overflow-hidden shadow-3xl">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-indigo-600/10 border-b border-white/10">
                     <th className="p-8 text-[11px] font-black uppercase tracking-widest text-slate-400">{language === 'ar' ? 'الخاصية' : 'Feature'}</th>
                     <th className="p-8 text-[11px] font-black uppercase tracking-widest text-indigo-400">{language === 'ar' ? 'نظام اومني' : 'Omni OS'}</th>
                     <th className="p-8 text-[11px] font-black uppercase tracking-widest text-slate-600">{language === 'ar' ? 'الطرق التقليدية' : 'Traditional'}</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {t.comparison.map((item, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                       <td className="p-8 font-black text-sm">{item.feature}</td>
                       <td className="p-8 font-black text-sm text-indigo-300">
                          <i className="fa-solid fa-check-circle mr-2 text-indigo-500"></i> {item.omni}
                       </td>
                       <td className="p-8 font-bold text-xs text-slate-500">{item.traditional}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* Expert Spotlight */}
      <section className="relative z-10 container mx-auto px-6 py-24 bg-indigo-600 rounded-[5rem] overflow-hidden">
         <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
         <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
               <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none pb-2">{t.expertTitle}</h2>
               <p className="text-indigo-100 text-xl font-bold leading-relaxed">{t.expertDesc}</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {t.expertFeatures.map((f, i) => (
                    <div key={i} className="bg-white/10 p-8 rounded-[2.5rem] border border-white/10 group hover:bg-white/20 transition-all cursor-pointer">
                       <i className={`fa-solid ${f.icon} text-3xl text-white mb-4`}></i>
                       <h4 className="text-lg font-black text-white mb-2 leading-tight pb-1">{f.title}</h4>
                       <p className="text-indigo-50 font-bold text-xs">{f.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
            <div className="lg:w-1/2">
               <div className="bg-slate-950/40 p-4 rounded-[4rem] border border-white/10 shadow-4xl backdrop-blur-xl">
                  <img src="https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80&w=800" className="rounded-[3rem] shadow-2xl" alt="AI Production" />
               </div>
            </div>
         </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 container mx-auto px-6 py-24">
        <div className="text-center mb-16">
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 pb-2">{t.pricingTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {t.packages.map((pkg, i) => (
            <div key={i} className={`p-10 rounded-[4rem] border transition-all duration-500 flex flex-col ${pkg.popular ? 'bg-indigo-600 border-indigo-500 shadow-3xl scale-105 z-10' : 'bg-white/[0.03] border-white/10'}`}>
              <h3 className="text-xl font-black mb-4 leading-tight pb-1">{pkg.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                 <span className="text-5xl font-black tracking-tighter leading-none">{pkg.price}</span>
                 <span className="text-[9px] font-black opacity-40 uppercase tracking-widest">/ {language === 'ar' ? 'عقدة' : 'Node'}</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {pkg.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-xs font-bold opacity-80">
                    <i className="fa-solid fa-check-circle text-indigo-400 group-hover:text-white"></i> {f}
                  </li>
                ))}
              </ul>
              <button onClick={onLaunch} className={`w-full py-5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${pkg.popular ? 'bg-white text-indigo-600 shadow-xl' : 'bg-white/5 border border-white/10 text-white'}`}>
                {language === 'ar' ? 'تفعيل العقدة' : 'Activate Node'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 container mx-auto px-6 border-t border-white/5 text-center flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-atom text-white text-xs"></i>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase leading-none">{t.brand}</span>
        </div>
        <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest leading-none">{t.footer}</p>
      </footer>
    </div>
  );
};

export default LandingPage;
