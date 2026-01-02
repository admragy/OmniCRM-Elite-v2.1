
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
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden" dir="rtl">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(79,70,229,0.15),transparent)]"></div>
         <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 ${scrolled ? 'bg-[#020617]/80 backdrop-blur-3xl border-b border-white/5 py-4 shadow-2xl' : 'py-10'}`}>
        <div className="container mx-auto px-10 flex justify-between items-center">
          <div className="flex items-center gap-5 group cursor-pointer">
            <div className="w-12 h-12 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center text-white font-black italic shadow-2xl shadow-indigo-600/40 group-hover:rotate-12 transition-all">O</div>
            <span className="text-3xl font-black tracking-tighter text-white uppercase">OMNI <span className="text-indigo-500">3.0</span></span>
          </div>
          <div className="flex items-center gap-10">
             <button onClick={() => setShowTerminal(true)} className="px-10 py-4 bg-white text-[#020617] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-4xl active:scale-95">
               COMMANDER LOGIN
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-10 pt-64 pb-32 text-center relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-4 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.5em] mb-12 text-indigo-400 animate-in slide-in-from-top-10 duration-1000">
             <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
             UNIVERSAL STRATEGIC COMMAND OS
          </div>
          <h1 className="text-7xl md:text-[130px] font-black tracking-tighter text-white leading-[0.85] mb-16 animate-in fade-in zoom-in-95 duration-1000">
            THE INTELLIGENCE <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x">THAT RULES.</span>
          </h1>
          <p className="text-slate-400 text-xl md:text-3xl font-bold max-w-3xl mx-auto mb-20 leading-relaxed opacity-80 animate-in fade-in duration-1000 delay-300">
            Omni isn't just a CRM. It's the neural core of your market dominance, strategic vision, and media production.
          </p>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center animate-in slide-in-from-bottom-10 duration-1000 delay-500">
             <button onClick={() => setShowTerminal(true)} className="px-16 py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-2xl shadow-4xl shadow-indigo-600/40 hover:bg-indigo-500 hover:-translate-y-2 transition-all active:scale-95">
               ENGAGE SYSTEM
             </button>
             <button onClick={() => onLaunch('Guest')} className="px-16 py-8 bg-white/5 border border-white/10 text-slate-400 rounded-[2.5rem] font-black text-2xl hover:bg-white/10 hover:text-white transition-all">
               VIEW ARCHIVE
             </button>
          </div>
        </div>
      </section>

      {/* Access Terminal Modal */}
      {showTerminal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6 animate-in fade-in duration-700">
           <div className="w-full max-w-2xl bg-[#020617] border border-white/10 rounded-[5rem] p-16 md:p-24 text-center shadow-4xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-indigo-600 to-transparent"></div>
              
              <button onClick={() => setShowTerminal(false)} className="absolute top-12 left-12 text-slate-600 hover:text-rose-500 transition-colors">
                 <i className="fa-solid fa-circle-xmark text-4xl"></i>
              </button>

              <div className={`w-32 h-32 rounded-[3rem] flex items-center justify-center text-5xl mx-auto mb-12 border-4 transition-all duration-1000 ${
                successStatus === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.2)]' : 
                successStatus === 'error' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_80px_rgba(244,63,94,0.2)]' :
                'bg-indigo-600/10 text-indigo-500 border-indigo-500/20 shadow-[0_0_80px_rgba(79,70,229,0.1)]'
              }`}>
                 <i className={`fa-solid ${isDecrypting ? 'fa-atom animate-spin' : successStatus === 'success' ? 'fa-check-double' : successStatus === 'error' ? 'fa-triangle-exclamation' : 'fa-shield-halved'}`}></i>
              </div>

              <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">NEURAL ACCESS LINK</h2>
              <p className="text-slate-500 font-black text-[11px] uppercase tracking-[0.6em] mb-16">IDENTITY VERIFICATION REQUIRED</p>

              <div className="space-y-10">
                 <div className="relative">
                    <input 
                        type="password" 
                        value={accessKey}
                        onChange={(e) => { setAccessKey(e.target.value); setSuccessStatus('idle'); }}
                        placeholder="••••••••••••"
                        className={`w-full bg-white/5 border-2 ${successStatus === 'error' ? 'border-rose-500/30' : 'border-white/5'} p-10 rounded-[2.5rem] outline-none focus:border-indigo-500 text-white text-center font-mono text-2xl tracking-[0.5em] transition-all shadow-inner`}
                        autoFocus
                    />
                 </div>
                 
                 <button 
                    onClick={handleAccess}
                    disabled={isDecrypting || accessKey.length < 4}
                    className="w-full py-10 bg-indigo-600 text-white rounded-[3rem] font-black text-2xl shadow-4xl hover:bg-indigo-500 disabled:opacity-10 transition-all uppercase tracking-[0.3em] relative overflow-hidden group"
                 >
                    <span className="relative z-10">{isDecrypting ? 'DECRYPTING...' : 'AUTHORIZE UPLINK'}</span>
                    <div className="absolute inset-0 bg-white/10 -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                 </button>

                 <div className="pt-6">
                    <button onClick={() => onLaunch('Guest')} className="text-slate-600 hover:text-indigo-400 font-black text-[11px] uppercase tracking-[0.4em] transition-colors">
                      BYPASS SECURITY (GUEST VIEW)
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 15s ease infinite; }
      `}</style>
    </div>
  );
};

export default LandingPage;
