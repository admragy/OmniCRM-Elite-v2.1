
import React, { useState } from 'react';
import { BrandProfile } from '../types';

interface AdminPortalProps {
  brand: BrandProfile;
  language: 'en' | 'ar';
}

const AdminPortal: React.FC<AdminPortalProps> = ({ brand, language }) => {
  const [activeSection, setActiveSection] = useState<number>(0);

  const t = {
    en: {
      title: 'Commander Command Center',
      subtitle: 'Systemic Architecture & Administrative Strategic Control.',
      sections: [
        {
          id: 0,
          title: 'Authority Hierarchy',
          icon: 'fa-users-gear',
          content: 'The system operates on a Neural Rank hierarchy. Command privileges (Commander) allow for database migration and capital allocation. Operators focus on task execution. Guests are restricted from resource consumption.'
        },
        {
          id: 1,
          title: 'Intelligence Calibration',
          icon: 'fa-brain-circuit',
          content: 'Strategic calibration is the foundation of Oracle logic. To optimize AI output, provide: 1. Core Mission 2. Typical Partner Profile 3. Strategic Tone. The more specific the calibration, the higher the ROI of AI insights.'
        },
        {
          id: 2,
          title: 'Operational Capital Allocation',
          icon: 'fa-bolt-lightning',
          content: 'Tokens are the energy units required for all high-fidelity operations. Use the Strategic Master Key in Settings to allocate capital. Each AI request utilizes a fraction of this capital based on strategic complexity.'
        },
        {
          id: 3,
          title: 'Unified Sovereignty Architecture',
          icon: 'fa-cloud-binary',
          content: 'OmniCRM utilizes a unified architecture for global persistence and local privacy. For maximum security, utilize the Edge Intelligence node to process high-value data without cloud dependency.'
        }
      ],
      quickActions: 'Strategic Master Key: OMNI-ELITE-2025',
      deploymentTitle: 'Cloud Infrastructure Readiness',
      deploymentSteps: [
        'Initialize Unified Storage Node',
        'Execute Data Migration Script from Settings',
        'Verify Strategic Connectivity in Dashboard'
      ]
    },
    ar: {
      title: 'مركز قيادة القائد (Commander Portal)',
      subtitle: 'الهيكل التنظيمي والتحكم الاستراتيجي في مفاصل النظام.',
      sections: [
        {
          id: 0,
          title: 'تسلسل السلطة والصلاحيات',
          icon: 'fa-users-gear',
          content: 'يعمل النظام بنظام الرتب العصبية. صلاحيات القائد (Commander) تتيح التحكم المطلق في البيانات وتخصيص الميزانية. المشغل (Operator) يركز على التنفيذ، بينما يقتصر وصول الزوار على الاستعراض فقط.'
        },
        {
          id: 1,
          title: 'معايرة الذكاء الاستراتيجي',
          icon: 'fa-brain-circuit',
          content: 'تعد المعايرة هي الجينوم الأساسي الذي يبني عليه الأوراكل استنتاجاته. لتحسين النتائج: حدد المهمة الجوهرية، ملف الشريك المستهدف، واللهجة الاستراتيجية. دقة المعايرة ترفع جودة الرؤى المستخرجة بشكل استثنائي.'
        },
        {
          id: 2,
          title: 'تخصيص الرأس مال التشغيلي',
          icon: 'fa-bolt-lightning',
          content: 'وحدات الطاقة هي الرأس مال اللازم لتشغيل العمليات فائقة الدقة. استخدم مفتاح المسؤول الاستراتيجي لشحن الميزانية. كل طلب ذكاء اصطناعي يمثل استثماراً تشغيلياً يختلف حسب تعقيد المهمة.'
        },
        {
          id: 3,
          title: 'بنية السيادة الرقمية الموحدة',
          icon: 'fa-cloud-binary',
          content: 'يجمع OmniCRM بين المزامنة العالمية والخصوصية المحلية المطلقة. للبيانات فائقة الحساسية، يفضل استخدام عقدة المعالجة المحلية لضمان سيادة البيانات بالكامل داخل جهازك.'
        }
      ],
      quickActions: 'مفتاح المسؤول الاستراتيجي: OMNI-ELITE-2025',
      deploymentTitle: 'جاهزية البنية التحتية السحابية',
      deploymentSteps: [
        'تهيئة عقدة التخزين الموحدة (Supabase)',
        'تنفيذ كود هجرة البيانات من مركز الإعدادات',
        'التحقق من حالة الربط الاستراتيجي في لوحة القيادة'
      ]
    }
  }[language];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-32" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Header Panel */}
      <div className="bg-slate-900 rounded-[4rem] p-12 md:p-16 border border-white/5 relative overflow-hidden group shadow-3xl">
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent"></div>
         <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                  <i className="fa-solid fa-crown text-white text-3xl"></i>
               </div>
               <div>
                  <h2 className="text-4xl font-black text-white tracking-tighter">{t.title}</h2>
                  <p className="text-slate-400 font-bold text-sm tracking-widest uppercase mt-1">{t.subtitle}</p>
               </div>
            </div>
            <div className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 inline-block">
               <span className="text-indigo-400 font-mono font-black text-xs uppercase tracking-[0.2em]">{t.quickActions}</span>
            </div>
         </div>
         <i className="fa-solid fa-shield-quartered text-[180px] text-white/5 absolute -right-10 -bottom-10 rotate-12"></i>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Navigation Grid */}
        <div className="lg:col-span-1 space-y-4">
           {t.sections.map((section, idx) => (
             <button 
               key={section.id}
               onClick={() => setActiveSection(idx)}
               className={`w-full flex items-center gap-5 p-8 rounded-[2.5rem] transition-all duration-500 border ${
                 activeSection === idx 
                 ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl scale-[1.02]' 
                 : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-white/10'
               }`}
             >
               <i className={`fa-solid ${section.icon} text-2xl`}></i>
               <span className="text-sm font-black uppercase tracking-widest">{section.title}</span>
             </button>
           ))}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[4rem] p-12 md:p-16 border border-slate-100 dark:border-slate-800 shadow-2xl relative">
           <div className="animate-in slide-in-from-bottom-5 duration-700">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter border-b border-slate-100 dark:border-slate-800 pb-6 flex items-center gap-4">
                 <i className={`fa-solid ${t.sections[activeSection].icon} text-indigo-500`}></i>
                 {t.sections[activeSection].title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium text-lg leading-loose">
                 {t.sections[activeSection].content}
              </p>
           </div>
        </div>
      </div>

      {/* Deployment Checklist */}
      <div className="bg-emerald-950/40 rounded-[4rem] p-12 border border-emerald-500/20 shadow-3xl">
         <h4 className="text-2xl font-black text-emerald-400 tracking-tighter mb-10 flex items-center gap-4">
            <i className="fa-solid fa-list-check"></i>
            {t.deploymentTitle}
         </h4>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.deploymentSteps.map((step, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex items-start gap-5">
                 <div className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center shrink-0 font-black">{i+1}</div>
                 <p className="text-white font-bold text-sm leading-relaxed">{step}</p>
              </div>
            ))}
         </div>
      </div>

    </div>
  );
};

export default AdminPortal;
