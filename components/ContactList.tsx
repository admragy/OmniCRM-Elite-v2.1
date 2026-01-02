
import React, { useState } from 'react';
import { Contact } from '../types';
import { enrichContactData } from '../services/geminiService';

interface ContactListProps {
  contacts: Contact[];
  language: 'en' | 'ar';
  onAddContact: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, language, onAddContact }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', company: '', email: '', value: '', phone: '' });
  
  const [enrichingId, setEnrichingId] = useState<string | null>(null);
  const [enrichmentResult, setEnrichmentResult] = useState<{ id: string, data: string } | null>(null);

  const t = {
    en: {
      search: 'Search Partner Index...', add: 'Onboard New Partner', contact: 'Partner Profile', status: 'Relationship Stage',
      ltv: 'Capital Capacity', psychology: 'Lead Archetype', save: 'Authorize Sync', modalTitle: 'Integrate Strategic Node',
      nameLabel: 'Legal Name', companyLabel: 'Organization', emailLabel: 'Encrypted Mail', valueLabel: 'Projected Revenue ($)',
      phoneLabel: 'Direct Line (WhatsApp)', enrich: 'Deep Web Scan', enriching: 'Scanning...'
    },
    ar: {
      search: 'البحث في فهرس الشركاء...', add: 'إدراج شريك جديد', contact: 'ملف الشريك', status: 'مرحلة العلاقة',
      ltv: 'القدرة الرأسمالية', psychology: 'تنميط العميل', save: 'تصريح المزامنة', modalTitle: 'دمج عقدة استراتيجية جديدة',
      nameLabel: 'الاسم القانوني', companyLabel: 'المؤسسة / الشركة', emailLabel: 'البريد المشفر', valueLabel: 'الإيراد المتوقع ($)',
      phoneLabel: 'الخط المباشر (واتساب)', enrich: 'مسح الويب العميق', enriching: 'جاري المسح...'
    }
  }[language];

  const handleEnrich = async (id: string, company: string) => {
    setEnrichingId(id);
    const data = await enrichContactData(company, language);
    setEnrichmentResult({ id, data });
    setEnrichingId(null);
  };

  const getWhatsAppLink = (phone?: string) => {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}`;
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contact: Contact = {
      id: `c-${Date.now()}`,
      name: newContact.name,
      company: newContact.company,
      email: newContact.email,
      phone: newContact.phone,
      status: 'Lead',
      lastInteraction: new Date().toISOString(),
      value: Number(newContact.value) || 0,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newContact.name)}&background=random&size=128`,
      psychology: {
        personalityType: 'Analytical',
        sentimentScore: 50,
        happinessStatus: 'Neutral',
        lastTone: 'Initial connection'
      }
    };
    onAddContact(contact);
    setNewContact({ name: '', company: '', email: '', value: '', phone: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[4rem] border border-slate-200 dark:border-slate-800 p-10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
        <div className="relative w-full md:w-[500px]">
          <i className={`fa-solid fa-search absolute ${language === 'ar' ? 'right-8' : 'left-8'} top-1/2 -translate-y-1/2 text-slate-300 text-lg`}></i>
          <input type="text" placeholder={t.search} className={`w-full ${language === 'ar' ? 'pr-20' : 'pl-20'} py-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] outline-none font-black text-sm dark:text-white shadow-inner focus:ring-4 focus:ring-indigo-500/5 transition-all`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-14 py-6 bg-slate-950 dark:bg-indigo-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/20">
          <i className="fa-solid fa-user-plus mr-3"></i> {t.add}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[4.5rem] border border-slate-200 dark:border-slate-800 shadow-3xl overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.contact}</th>
                <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.psychology}</th>
                <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.status}</th>
                <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{language === 'ar' ? 'التحكم' : 'Control'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredContacts.map((contact) => (
                <React.Fragment key={contact.id}>
                  <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-all cursor-pointer group">
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                           <img src={contact.avatar} className="w-20 h-20 rounded-[2rem] shadow-2xl border-2 border-white dark:border-slate-700 group-hover:rotate-6 transition-transform" />
                           <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full flex items-center justify-center">
                              <i className="fa-solid fa-bolt text-white text-[10px]"></i>
                           </div>
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">{contact.name}</p>
                          <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{contact.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <div className="space-y-2">
                         <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                            contact.psychology?.personalityType === 'Driver' ? 'bg-rose-50 border-rose-100 text-rose-600' : 
                            contact.psychology?.personalityType === 'Analytical' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                            'bg-slate-100 border-slate-200 text-slate-600'
                         }`}>
                           {contact.psychology?.personalityType || 'ARCHETYPING...'}
                         </span>
                         <p className="text-[10px] font-black text-slate-400 uppercase px-2">${contact.value.toLocaleString()} LTV</p>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <span className="px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-800 dark:border-slate-100 shadow-xl">{contact.status}</span>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleEnrich(contact.id, contact.company)}
                          disabled={enrichingId === contact.id}
                          className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl transition-all shadow-sm border border-slate-200 dark:border-slate-700"
                          title={t.enrich}
                        >
                          {enrichingId === contact.id ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-microchip"></i>}
                        </button>
                        {contact.phone && (
                          <a 
                            href={getWhatsAppLink(contact.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl hover:scale-110 transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-800"
                            title="WhatsApp Command"
                          >
                            <i className="fa-brands fa-whatsapp text-xl"></i>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                  {enrichmentResult?.id === contact.id && (
                    <tr className="bg-indigo-600/5 dark:bg-indigo-900/5">
                      <td colSpan={4} className="px-12 py-12">
                        <div className="bg-white dark:bg-slate-800 p-12 rounded-[3.5rem] border border-indigo-100 dark:border-indigo-800 shadow-3xl animate-in slide-in-from-top-10 duration-700">
                           <div className="flex justify-between items-center mb-8 border-b border-indigo-50 dark:border-indigo-900 pb-6">
                              <h4 className="text-2xl font-black text-indigo-600 uppercase tracking-tighter flex items-center gap-4">
                                 <i className="fa-solid fa-fingerprint"></i>
                                 Neural Deep Scan: {contact.company}
                              </h4>
                              <button onClick={() => setEnrichmentResult(null)} className="text-slate-300 hover:text-rose-500 transition-colors"><i className="fa-solid fa-circle-xmark text-4xl"></i></button>
                           </div>
                           <div className="prose dark:prose-invert max-w-none text-base font-bold text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-[1.8] tracking-tight">
                              {enrichmentResult.data}
                           </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[5rem] p-16 md:p-20 shadow-4xl relative border border-white/10 overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>
             <button onClick={() => setIsModalOpen(false)} className="absolute top-12 right-12 text-slate-300 hover:text-rose-500 transition-colors z-20"><i className="fa-solid fa-circle-xmark text-5xl"></i></button>
             <div className="mb-16 relative z-10">
                <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">{t.modalTitle}</h2>
                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">{language === 'ar' ? 'إدراج سجل استراتيجي جديد في الشبكة الموحدة' : 'Integrate a new strategic node into the unified network'}</p>
             </div>
             <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4">{t.nameLabel}</label>
                      <input required className="w-full bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 dark:text-white shadow-inner" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} />
                  </div>
                  <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4">{t.phoneLabel}</label>
                      <input className="w-full bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 dark:text-white shadow-inner" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} placeholder="+20..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4">{t.companyLabel}</label>
                        <input required className="w-full bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 dark:text-white shadow-inner" value={newContact.company} onChange={e => setNewContact({...newContact, company: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4">{t.valueLabel}</label>
                        <input type="number" className="w-full bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 dark:text-white shadow-inner" value={newContact.value} onChange={e => setNewContact({...newContact, value: e.target.value})} />
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4">{t.emailLabel}</label>
                    <input required type="email" className="w-full bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 dark:text-white shadow-inner" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} />
                </div>
                <button type="submit" className="w-full py-10 bg-indigo-600 text-white rounded-[3rem] font-black text-2xl shadow-4xl shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all mt-10 uppercase tracking-[0.2em]">
                  {t.save}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
