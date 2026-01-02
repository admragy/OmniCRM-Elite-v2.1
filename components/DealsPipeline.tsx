
import React, { useState } from 'react';
import { Deal, Contact, Payment } from '../types';

interface DealsPipelineProps {
  deals: Deal[];
  contacts: Contact[];
  language: 'en' | 'ar';
  onAddDeal: (deal: Deal) => void;
}

const STAGES: Deal['stage'][] = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won'];

const DealsPipeline: React.FC<DealsPipelineProps> = ({ deals, contacts, language, onAddDeal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({ title: '', value: '', contactId: '', stage: 'Discovery' as Deal['stage'] });

  const getContact = (id: string) => contacts.find(c => c.id === id);

  const t = {
    en: {
      Discovery: 'Discovery',
      Proposal: 'Proposal',
      Negotiation: 'Negotiation',
      'Closed Won': 'Closed Won',
      add: 'Add Opportunity',
      modalTitle: 'New Strategic Deal',
      titleLabel: 'Project Name',
      valueLabel: 'Cap. Value ($)',
      clientLabel: 'Target Client',
      stageLabel: 'Pipeline Entry',
      save: 'Secure Opportunity',
      collected: 'Collected',
      remaining: 'Remaining'
    },
    ar: {
      Discovery: 'الاكتشاف',
      Proposal: 'تقديم عرض',
      Negotiation: 'تفاوض نشط',
      'Closed Won': 'صفقة ناجحة',
      add: 'إضافة فرصة',
      modalTitle: 'فرصة بيع استراتيجية',
      titleLabel: 'اسم المشروع',
      valueLabel: 'القيمة التقديرية ($)',
      clientLabel: 'العميل المستهدف',
      stageLabel: 'نقطة الدخول',
      save: 'تأمين الفرصة',
      collected: 'المحصل',
      remaining: 'المتبقي'
    }
  }[language];

  const calculateFinance = (deal: Deal) => {
    const collected = deal.payments?.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0) || 0;
    return { collected, remaining: deal.value - collected };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDeal({
      id: `d-${Date.now()}`,
      title: newDeal.title,
      value: Number(newDeal.value),
      contactId: newDeal.contactId || (contacts[0]?.id || ''),
      stage: newDeal.stage,
      expectedClose: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      probability: 50,
      payments: []
    });
    setIsModalOpen(false);
    setNewDeal({ title: '', value: '', contactId: '', stage: 'Discovery' });
  };

  return (
    <div className="flex gap-8 overflow-x-auto pb-10 h-[calc(100vh-250px)] custom-scrollbar animate-in fade-in" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {STAGES.map(stage => {
        const stageDeals = deals.filter(d => d.stage === stage);
        const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

        return (
          <div key={stage} className="min-w-[340px] flex flex-col gap-6">
            <div className="flex justify-between items-center px-4">
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-lg">{t[stage as keyof typeof t]}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stageDeals.length} ACTIVE ITEMS</p>
              </div>
              <span className="text-sm font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                ${(stageTotal / 1000).toFixed(1)}k
              </span>
            </div>
            
            <div className="flex-1 bg-slate-100/40 dark:bg-slate-900/40 rounded-[3rem] p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col gap-6 overflow-y-auto custom-scrollbar shadow-inner">
              {stageDeals.map(deal => {
                const contact = getContact(deal.contactId);
                const { collected, remaining } = calculateFinance(deal);
                const collectionPercent = (collected / deal.value) * 100;

                return (
                  <div key={deal.id} className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 hover:scale-[1.03] transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-6">
                        <h5 className="font-black text-slate-800 dark:text-white text-base group-hover:text-indigo-600 transition-colors">{deal.title}</h5>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                      <img src={contact?.avatar} className="w-10 h-10 rounded-xl shadow-md border-2 border-white dark:border-slate-600" />
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">{contact?.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{contact?.company}</p>
                      </div>
                    </div>

                    {/* Financial Progress Tracker */}
                    <div className="mb-6 space-y-2">
                       <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                          <span>{t.collected}: ${collected.toLocaleString()}</span>
                          <span>{Math.round(collectionPercent)}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${collectionPercent}%` }}></div>
                       </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-slate-50 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                           <div className="bg-indigo-500 h-full" style={{width: `${deal.probability}%`}}></div>
                        </div>
                        <span className="text-[9px] font-black text-slate-400">{deal.probability}%</span>
                      </div>
                      <span className="text-base font-black text-slate-900 dark:text-white">${deal.value.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
              
              <button 
                onClick={() => {
                    setNewDeal({ ...newDeal, stage });
                    setIsModalOpen(true);
                }}
                className="w-full py-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[2rem] text-slate-400 dark:text-slate-600 hover:text-indigo-600 hover:border-indigo-400 transition-all text-xs font-black uppercase tracking-widest"
              >
                <i className="fa-solid fa-plus-circle mr-2"></i> {t.add}
              </button>
            </div>
          </div>
        );
      })}

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[4rem] p-12 md:p-16 shadow-3xl relative border border-white/10">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-300 hover:text-rose-500 transition-colors"><i className="fa-solid fa-circle-xmark text-4xl"></i></button>
             <div className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">{t.modalTitle}</h2>
                <p className="text-slate-400 font-bold text-sm">{language === 'ar' ? 'قم بتسجيل تفاصيل الفرصة لضمان دقة التوقعات' : 'Log opportunity details for precise forecasting'}</p>
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.titleLabel}</label>
                    <input required className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 dark:text-white shadow-inner" value={newDeal.title} onChange={e => setNewDeal({...newDeal, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.valueLabel}</label>
                        <input required type="number" className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 dark:text-white shadow-inner" value={newDeal.value} onChange={e => setNewDeal({...newDeal, value: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.stageLabel}</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 dark:text-white shadow-inner appearance-none" value={newDeal.stage} onChange={e => setNewDeal({...newDeal, stage: e.target.value as any})}>
                            {STAGES.map(s => <option key={s} value={s}>{t[s as keyof typeof t]}</option>)}
                        </select>
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.clientLabel}</label>
                    <select required className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 dark:text-white shadow-inner appearance-none" value={newDeal.contactId} onChange={e => setNewDeal({...newDeal, contactId: e.target.value})}>
                        <option value="">{language === 'ar' ? '-- اختر عميل من القاعدة --' : '-- Select Database Client --'}</option>
                        {contacts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
                    </select>
                </div>
                <button type="submit" className="w-full py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xl shadow-3xl shadow-indigo-200 dark:shadow-indigo-900/40 hover:bg-indigo-700 active:scale-95 transition-all mt-6 uppercase tracking-widest">
                  {t.save}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsPipeline;
