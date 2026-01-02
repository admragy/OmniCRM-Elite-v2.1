
import React, { useState } from 'react';
import { BrandProfile } from '../types';
import { updateBrandProfile } from '../services/supabaseService';

interface KnowledgeBaseProps {
  brand: BrandProfile;
  setBrand: (b: BrandProfile) => void;
  language: 'en' | 'ar';
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ brand, setBrand, language }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState(brand.knowledgeBase || '');

  const t = {
    en: {
      title: 'Strategic Knowledge Base',
      desc: 'Inject your company policies, pricing, and secret sauce into the AI brain.',
      save: 'Sync Knowledge',
      placeholder: 'Paste your product lists, service details, or company mission here...',
      status: 'Neural Memory Active'
    },
    ar: {
      title: 'قاعدة المعرفة الاستراتيجية',
      desc: 'لقّن الذكاء الاصطناعي سياسات شركتك، قوائم الأسعار، وأسرار العمل.',
      save: 'مزامنة المعرفة',
      placeholder: 'الصق قوائم المنتجات، تفاصيل الخدمات، أو رؤية الشركة هنا...',
      status: 'الذاكرة العصبية نشطة'
    }
  }[language];

  const handleSave = async () => {
    setIsSaving(true);
    const updated = { ...brand, knowledgeBase: content };
    setBrand(updated);
    await updateBrandProfile(updated);
    setIsSaving(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-slate-900 rounded-[4rem] p-12 border border-white/5 relative overflow-hidden shadow-3xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex-1">
              <h2 className="text-4xl font-black text-white tracking-tighter mb-4 flex items-center gap-4">
                 <i className="fa-solid fa-database text-indigo-500"></i>
                 {t.title}
              </h2>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.desc}</p>
           </div>
           <div className="px-6 py-2 bg-indigo-600/20 rounded-full border border-indigo-500/30 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              {t.status}
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
         <div className="space-y-4">
            <textarea 
               value={content}
               onChange={e => setContent(e.target.value)}
               className="w-full h-96 bg-slate-50 dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 outline-none font-bold text-lg dark:text-white resize-none shadow-inner leading-relaxed"
               placeholder={t.placeholder}
            />
         </div>
         <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-8 bg-indigo-600 text-white rounded-[3rem] font-black text-xl shadow-3xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 uppercase tracking-widest"
         >
            {isSaving ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
            {isSaving ? 'Synchronizing...' : t.save}
         </button>
      </div>
    </div>
  );
};

export default KnowledgeBase;
