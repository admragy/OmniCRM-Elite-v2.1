
import React, { useState } from 'react';
import { Task, Deal, Contact } from '../types';
import { getStrategicPriorities } from '../services/geminiService';

interface ActionMatrixProps {
  tasks: Task[];
  deals: Deal[];
  contacts: Contact[];
  language: 'en' | 'ar';
  onAddTask: (task: Task) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const ActionMatrix: React.FC<ActionMatrixProps> = ({ tasks, deals, contacts, language, onAddTask, onToggleTask, onDeleteTask }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const t = {
    en: {
      title: 'Strategic Growth Plan',
      desc: 'High-impact actions engineered to accelerate business revenue.',
      generate: 'Sync AI Priorities',
      pending: 'Current Actions',
      completed: 'Executed Steps',
      high: 'Critical Priority',
      medium: 'Tactical Step',
      low: 'Operational Task',
      empty: 'No pending strategic actions found.'
    },
    ar: {
      title: 'خطة النمو الاستراتيجي',
      desc: 'إجراءات عالية التأثير مصممة لتسريع تدفق الأرباح وتوسيع نطاق الأعمال.',
      generate: 'مزامنة أولويات الذكاء الاصطناعي',
      pending: 'الإجراءات الحالية',
      completed: 'خطوات تم تنفيذها',
      high: 'أولوية قصوى',
      medium: 'خطوة تكتيكية',
      low: 'مهمة تشغيلية',
      empty: 'لا توجد إجراءات استراتيجية معلقة حالياً.'
    }
  }[language];

  const handleSyncPriorities = async () => {
    setIsGenerating(true);
    const priorities = await getStrategicPriorities(contacts, deals, language);
    priorities.forEach((p: any) => {
      onAddTask({
        id: `t-${Date.now()}-${Math.random()}`,
        title: p.task,
        priority: p.impact as any,
        status: 'Pending',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        aiSuggested: true
      });
    });
    setIsGenerating(false);
  };

  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{t.title}</h2>
          <p className="text-slate-400 font-bold text-sm">{t.desc}</p>
        </div>
        <button 
          onClick={handleSyncPriorities}
          disabled={isGenerating}
          className="px-10 py-5 bg-indigo-600 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-3"
        >
          {isGenerating ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-brain-circuit"></i>}
          {t.generate}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest text-[11px]">{t.pending}</h3>
          </div>
          
          {pendingTasks.length === 0 ? (
            <div className="h-48 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-400 font-bold italic">
              {t.empty}
            </div>
          ) : (
            pendingTasks.map(task => (
              <div key={task.id} className="group bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-lg hover:border-indigo-500 transition-all flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button onClick={() => onToggleTask(task.id)} className="w-8 h-8 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center">
                    <i className="fa-solid fa-check opacity-0 group-hover:opacity-20"></i>
                  </button>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-black text-slate-900 dark:text-white text-base leading-tight">{task.title}</p>
                      {task.aiSuggested && <span className="text-[8px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full">AI</span>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${task.priority === 'High' ? 'text-rose-500' : 'text-slate-400'}`}>
                        {t[task.priority.toLowerCase() as keyof typeof t.high]}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                        <i className="fa-solid fa-calendar-day"></i> {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => onDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-3 text-slate-300 hover:text-rose-500 transition-all">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest text-[11px]">{t.completed}</h3>
          </div>
          <div className="space-y-4 opacity-60 grayscale-[0.5]">
            {completedTasks.map(task => (
              <div key={task.id} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <p className="font-bold text-slate-500 line-through text-sm">{task.title}</p>
                </div>
                <button onClick={() => onDeleteTask(task.id)} className="text-slate-300 hover:text-rose-500"><i className="fa-solid fa-trash-can"></i></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionMatrix;
