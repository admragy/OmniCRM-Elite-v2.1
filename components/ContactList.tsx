
import React, { useState } from 'react';
import { Contact } from '../types';

interface ContactListProps {
  contacts: Contact[];
  language: 'en' | 'ar';
  onAddContact: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, language, onAddContact }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', company: '', email: '', value: '' });

  const t = {
    en: {
      search: 'Search contacts...', add: 'Add New Record', contact: 'Partner Profile', status: 'Relationship',
      ltv: 'Capital Value', psychology: 'Neural Type', save: 'Finalize Synchronization', modalTitle: 'Integrate New Client',
      nameLabel: 'Full Name', companyLabel: 'Organization', emailLabel: 'Electronic Mail', valueLabel: 'Projected Value ($)'
    },
    ar: {
      search: 'البحث في جهات الاتصال...', add: 'إضافة سجل جديد', contact: 'ملف الشريك', status: 'طبيعة العلاقة',
      ltv: 'القيمة الرأسمالية', psychology: 'النمط العصبي', save: 'إتمام المزامنة', modalTitle: 'إدراج عميل جديد',
      nameLabel: 'الاسم الكامل', companyLabel: 'الشركة / المؤسسة', emailLabel: 'البريد الإلكتروني', valueLabel: 'القيمة التقديرية ($)'
    }
  }[language];

  const getPsychBadge = (type?: string) => {
    const colors: any = { Analytical: 'bg-blue-100 text-blue-600', Expressive: 'bg-amber-100 text-amber-600', Amiable: 'bg-emerald-100 text-emerald-600', Driver: 'bg-rose-100 text-rose-600' };
    return type ? colors[type] : 'bg-slate-100 text-slate-400';
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
    setNewContact({ name: '', company: '', email: '', value: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="relative w-full md:w-[450px]">
          <i className={`fa-solid fa-search absolute ${language === 'ar' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-slate-300`}></i>
          <input type="text" placeholder={t.search} className={`w-full ${language === 'ar' ? 'pr-16' : 'pl-16'} py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.75rem] outline-none font-black text-sm dark:text-white`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-12 py-5 bg-slate-950 dark:bg-indigo-600 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
          {t.add}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.contact}</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.psychology}</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.status}</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.ltv}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <img src={contact.avatar} className="w-16 h-16 rounded-[1.5rem] shadow-xl border-2 border-white dark:border-slate-700" />
                      <div>
                        <p className="text-base font-black text-slate-900 dark:text-white mb-1">{contact.name}</p>
                        <p className="text-[11px] text-slate-400 font-bold">{contact.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getPsychBadge(contact.psychology?.personalityType)}`}>
                         {contact.psychology?.personalityType || 'Processing...'}
                       </span>
                       <div className="flex gap-1">
                          {[1,2,3,4,5].map(s => <div key={s} className={`w-1.5 h-3 rounded-full ${s <= (contact.psychology?.sentimentScore || 0)/20 ? 'bg-indigo-500' : 'bg-slate-100 dark:bg-slate-700'}`}></div>)}
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">{contact.status}</span>
                  </td>
                  <td className="px-10 py-8 text-lg font-black text-slate-900 dark:text-white tracking-tighter">${contact.value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[4rem] p-12 md:p-16 shadow-3xl relative border border-white/10">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-300 hover:text-rose-500 transition-colors"><i className="fa-solid fa-circle-xmark text-4xl"></i></button>
             <div className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">{t.modalTitle}</h2>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{language === 'ar' ? 'إضافة سجل جديد لنظامك الاستراتيجي' : 'Integrate a new node into your strategic network'}</p>
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.nameLabel}</label>
                    <input required className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 dark:text-white shadow-inner" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.companyLabel}</label>
                        <input required className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 dark:text-white shadow-inner" value={newContact.company} onChange={e => setNewContact({...newContact, company: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.valueLabel}</label>
                        <input type="number" className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 dark:text-white shadow-inner" value={newContact.value} onChange={e => setNewContact({...newContact, value: e.target.value})} />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.emailLabel}</label>
                    <input required type="email" className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 font-black text-slate-900 dark:text-white shadow-inner" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} />
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

export default ContactList;
