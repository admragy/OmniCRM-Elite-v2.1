
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onLaunch: (rank: 'Commander' | 'Operator' | 'Guest') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [successStatus, setSuccessStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAccess = () => {
    setIsDecrypting(true);
    setSuccessStatus('idle');
    
    // محاكاة عملية فك تشفير أمنية عالية المستوى
    setTimeout(() => {
      if (accessKey === 'admin82@ragy') {
        setSuccessStatus('success');
        setTimeout(() => onLaunch('Commander'), 800);
      } else if (accessKey.length >= 4) {
        setSuccessStatus('success');
        setTimeout(() => onLaunch('Operator'), 800);
      } else {
        setIsDecrypting(false);
        setSuccessStatus('error');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1d1d1f] font-sans selection:bg-blue-100 overflow-x-hidden" dir="rtl">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled ? 'bg-white/90 backdrop-blur-2xl border-b border-gray-100 py-4 shadow-sm' : 'py-8'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold italic shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">O</div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">OMNI</span>
          </div>
          <div className="flex items-center gap-6">
             <button onClick={() => setShowTerminal(true)} className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-blue-600 hover:shadow-xl transition-all active:scale-95">
               دخول النظام
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-48 pb-32 md:pt-64 md:pb-52 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent)] -z-10 animate-pulse"></div>
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white border border-gray-100 shadow-sm rounded-full text-xs font-black uppercase tracking-widest mb-10 text-gray-400">
             <i className="fa-solid fa-star text-blue-500"></i> نظام التشغيل الاستراتيجي v3.0
          </div>
          <h1 className="text-6xl md:text-[100px] font-black tracking-tighter text-gray-900 leading-[0.95] mb-12">
            الذكاء الذي يقود <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">مستقبلك التجاري.</span>
          </h1>
          <p className="text-gray-500 text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
            منصة "أومني" ليست مجرد CRM، بل هي عقلك المدبر لإدارة العملاء والصفقات والإنتاج الإبداعي في مكان واحد.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
             <button onClick={() => setShowTerminal(true)} className="px-14 py-7 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-300 hover:bg-blue-700 hover:-translate-y-2 transition-all">
               ابدأ السيطرة الآن
             </button>
             <button onClick={() => onLaunch('Guest')} className="px-14 py-7 bg-white border-2 border-gray-100 text-gray-400 rounded-[2rem] font-black text-xl hover:bg-gray-50 hover:text-gray-900 transition-all">
               تصفح كضيف
             </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-32">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
               { icon: 'fa-brain-circuit', title: 'تحليل سلوك العملاء', desc: 'افهم شخصية عميلك وتوقع قراره قبل أن يتحدث.' },
               { icon: 'fa-bolt-lightning', title: 'أتمتة المبيعات', desc: 'دع الذكاء الاصطناعي يقوم بالمتابعة وإغلاق الصفقات الصعبة.' },
               { icon: 'fa-video', title: 'مختبر الميديا 4K', desc: 'ولد فيديوهات إعلانية سينمائية لمنتجاتك بضغطة زر.' }
            ].map((item, i) => (
               <div key={i} className="p-12 bg-white rounded-[4rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all group">
                  <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-3xl text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-10 shadow-inner">
                     <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter">{item.title}</h3>
                  <p className="text-gray-400 font-bold leading-relaxed">{item.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* Access Terminal Modal (The Login Engine) */}
      {showTerminal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/95 backdrop-blur-3xl p-6 animate-in fade-in duration-500">
           <div className="w-full max-w-xl bg-[#0a0c10] border border-white/5 rounded-[4rem] p-12 md:p-16 text-center shadow-[0_0_100px_rgba(37,99,235,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
              
              <button onClick={() => setShowTerminal(false)} className="absolute top-10 left-10 text-slate-600 hover:text-white transition-colors">
                 <i className="fa-solid fa-circle-xmark text-3xl"></i>
              </button>

              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-10 border transition-all duration-700 ${
                successStatus === 'success' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 
                successStatus === 'error' ? 'bg-rose-500/20 text-rose-500 border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.2)]' :
                'bg-blue-600/10 text-blue-500 border-blue-500/20'
              }`}>
                 <i className={`fa-solid ${isDecrypting ? 'fa-spinner animate-spin' : successStatus === 'success' ? 'fa-check-double' : successStatus === 'error' ? 'fa-triangle-exclamation' : 'fa-shield-halved'}`}></i>
              </div>

              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">بوابة الوصول الاستراتيجي</h2>
              <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] mb-12">أدخل مفتاح التشفير لتنشيط الوحدة</p>

              <div className="space-y-8">
                 <div className="relative">
                    <input 
                        type="password" 
                        value={accessKey}
                        onChange={(e) => { setAccessKey(e.target.value); setSuccessStatus('idle'); }}
                        placeholder="••••••••••••"
                        className={`w-full bg-white/5 border-2 ${successStatus === 'error' ? 'border-rose-500/50' : 'border-white/5'} p-8 rounded-[2rem] outline-none focus:border-blue-500 text-white text-center font-mono text-lg tracking-[0.4em] transition-all shadow-inner`}
                    />
                    {accessKey === 'admin82@ragy' && !isDecrypting && (
                      <div className="absolute -top-4 right-1/2 translate-x-1/2 bg-blue-600 text-white text-[8px] font-black px-4 py-1 rounded-full animate-bounce">
                        تم التعرف على مفتاح القائد
                      </div>
                    )}
                 </div>
                 
                 <button 
                    onClick={handleAccess}
                    disabled={isDecrypting || accessKey.length < 4}
                    className="w-full py-8 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-500 disabled:opacity-20 transition-all uppercase tracking-widest overflow-hidden relative group"
                 >
                    <span className="relative z-10">{isDecrypting ? 'جاري فك التشفير...' : 'تنشيط الاتصال'}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                 </button>

                 <div className="pt-4">
                    <button onClick={() => onLaunch('Guest')} className="text-slate-600 hover:text-blue-500 font-black text-[10px] uppercase tracking-widest transition-colors">
                      تخطي الدخول (كوضع ضيف)
                    </button>
                 </div>

                 <p className="text-[10px] text-slate-600 font-bold leading-relaxed max-w-xs mx-auto">
                   ملاحظة: دخول "القائد" يمنحك السيطرة الكاملة على ميزانية الـ Tokens وغرفة العمليات الاستراتيجية.
                 </p>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
