
import React from 'react';

interface SmartGuideProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ar';
}

const SmartGuide: React.FC<SmartGuideProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const t = {
    en: {
      title: 'Neural Operating Guide',
      subtitle: 'Master OmniCRM Ultimate in 60 seconds.',
      close: 'Got it, let’s scale!',
      steps: [
        {
          title: '1. Dashboard (The Brain)',
          desc: 'This is your radar. It shows your money, client happiness, and what you need to do RIGHT NOW.',
          icon: 'fa-chart-network'
        },
        {
          title: '2. Customers (The Heart)',
          desc: 'Store all your client info here. The AI will automatically tell you if they are happy or angry.',
          icon: 'fa-address-book'
        },
        {
          title: '3. Pipeline (The Flow)',
          desc: 'Drag and drop your sales stages. It helps you see which deal is about to bring in the cash.',
          icon: 'fa-file-invoice-dollar'
        },
        {
          title: '4. Growth Hub (The Engine)',
          desc: 'Create ads and lead forms in one click. Let the AI find new customers while you sleep.',
          icon: 'fa-megaphone'
        },
        {
          title: '5. Live Advisor (The Partner)',
          desc: 'Talk to the AI. Ask "How do I grow my business?" and listen to the strategic answer.',
          icon: 'fa-wand-magic-sparkles'
        }
      ]
    },
    ar: {
      title: 'دليل التشغيل الاستراتيجي',
      subtitle: 'ازاي تستخدم السيستم وتكبر شغلك في دقيقة واحدة.',
      close: 'فهمت الدنيا، يلا بينا!',
      steps: [
        {
          title: '١. لوحة التحكم (الرادار)',
          desc: 'هنا بتشوف فلوسك، ورضا عملائك، والذكاء الاصطناعي بيقولك تعمل إيه النهاردة بالظبط.',
          icon: 'fa-chart-network'
        },
        {
          title: '٢. العملاء (الكنز)',
          desc: 'سجل هنا كل زبائنك. السيستم هيعرف لوحده الزبون ده مبسوط ولا زعلان من غير ما تسأله.',
          icon: 'fa-address-book'
        },
        {
          title: '٣. المبيعات (المصنع)',
          desc: 'تابع صفقاتك ووزعها على مراحل. عشان تعرف مين اللي هيدفع ومين اللي محتاج زقة.',
          icon: 'fa-file-invoice-dollar'
        },
        {
          title: '٤. مركز النمو (الماكينة)',
          desc: 'بضغطة واحدة اعمل إعلانات ونماذج لجمع الزبائن. خلي الذكاء الاصطناعي يشتغل وأنت نايم.',
          icon: 'fa-megaphone'
        },
        {
          title: '٥. المستشار الحي (الشريك)',
          desc: 'افتح المايك واتكلم مع السيستم. اسأله "أعمل إيه عشان أكسب أكتر؟" وهيرد عليك بالصوت.',
          icon: 'fa-wand-magic-sparkles'
        }
      ]
    }
  }[language];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[4rem] p-10 md:p-16 shadow-3xl border border-white/10 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 mb-12 text-center">
           <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">{t.title}</h2>
           <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 relative z-10 max-h-[50vh] overflow-y-auto custom-scrollbar pr-4">
           {t.steps.map((step, i) => (
             <div key={i} className="flex items-start gap-8 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:scale-[1.01] transition-all">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-500 text-2xl shadow-xl shrink-0">
                   <i className={`fa-solid ${step.icon}`}></i>
                </div>
                <div>
                   <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">{step.title}</h4>
                   <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="mt-12 flex justify-center relative z-10">
           <button 
             onClick={onClose}
             className="px-20 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-3xl hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest"
           >
             {t.close}
           </button>
        </div>
      </div>
    </div>
  );
};

export default SmartGuide;
