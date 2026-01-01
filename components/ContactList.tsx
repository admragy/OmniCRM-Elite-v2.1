
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
  const [newContact, setNewContact] = useState({ name: '', company: '', email: '', value: 0 });

  const t = {
    en: {
      search: 'Search contacts...', add: 'Add New Record', contact: 'Partner Profile', status: 'Relationship',
      ltv: 'Capital Value', psychology: 'Neural Type', save: 'Finalize Synchronization', modalTitle: 'Integrate New Client'
    },
    ar: {
      search: 'البحث في جهات الاتصال...', add: 'إضافة سجل جديد', contact: 'ملف الشريك', status: 'طبيعة العلاقة',
      ltv: 'القيمة الرأسمالية', psychology: 'النمط العصبي', save: 'إتمام المزامنة', modalTitle: 'إدراج عميل جديد'
    }
  }[language];

  const getPsychBadge = (type?: string) => {
    const colors: any = { Analytical: 'bg-blue-100 text-blue-600', Expressive: 'bg-amber-100 text-amber-600', Amiable: 'bg-emerald-100 text-emerald-600', Driver: 'bg-rose-100 text-rose-600' };
    return type ? colors[type] : 'bg-slate-100 text-slate-400';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="relative w-full md:w-[450px]">
          <i className="fa-solid fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"></i>
          <input type="text" placeholder={t.search} className="w-full pl-16 py-5 bg-slate-50 border border-slate-100 rounded-[1.75rem] outline-none font-black text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-12 py-5 bg-slate-950 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">
          {t.add}
        </button>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-right">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.contact}</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.psychology}</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.status}</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.ltv}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50 transition-all cursor-pointer group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <img src={contact.avatar} className="w-16 h-16 rounded-[1.5rem] shadow-xl border-2 border-white" />
                      <div>
                        <p className="text-base font-black text-slate-900 mb-1">{contact.name}</p>
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
                          {[1,2,3,4,5].map(s => <div key={s} className={`w-1 h-3 rounded-full ${s <= (contact.psychology?.sentimentScore || 0)/20 ? 'bg-indigo-500' : 'bg-slate-100'}`}></div>)}
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase bg-slate-50 text-slate-500 border border-slate-100">{contact.status}</span>
                  </td>
                  <td className="px-10 py-8 text-lg font-black text-slate-900 tracking-tighter">${contact.value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
