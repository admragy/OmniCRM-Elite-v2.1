
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { Contact, Deal, ChatLog } from '../types';
import { decodeBase64, encodeAudio, decodeAudioData } from '../services/geminiService';

interface AIConsultantProps {
  contacts: Contact[];
  deals: Deal[];
  language: 'en' | 'ar';
  onMessageLogged?: (log: ChatLog) => void;
  memory?: ChatLog[];
}

const AIConsultant: React.FC<AIConsultantProps> = ({ contacts, deals, language, onMessageLogged, memory = [] }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  const getCrmContext = () => {
    const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
    const topClients = contacts.slice(0, 3).map(c => `${c.name} from ${c.company}`).join(', ');
    return `The current CRM state: Total revenue is $${totalValue}. Top clients: ${topClients}. Total deals: ${deals.length}.`;
  };

  const getMemoryContext = () => {
    return memory.slice(-10).map(m => `${m.role}: ${m.text}`).join('\n');
  };

  const startVisualizer = (stream: MediaStream, context: AudioContext) => {
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!isActive) return;
      requestAnimationFrame(draw);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const averageVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const intensity = averageVolume / 128;
      
      const baseColor = status === 'listening' ? '#6366f1' : status === 'speaking' ? '#10b981' : '#334155';
      const glowColor = status === 'listening' ? 'rgba(99, 102, 241, ' : status === 'speaking' ? 'rgba(16, 185, 129, ' : 'rgba(51, 65, 85, ';

      if (intensity > 0.1) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 100 + (intensity * 15), 0, 2 * Math.PI);
        ctx.strokeStyle = `${glowColor}${0.2 * intensity})`;
        ctx.lineWidth = 20 * intensity;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, 100, 0, 2 * Math.PI);
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 4 + (intensity * 6);
      ctx.shadowBlur = intensity * 25;
      ctx.shadowColor = baseColor;
      ctx.stroke();
      ctx.shadowBlur = 0;

      const barCount = 72;
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2;
        const binIndex = Math.floor((i / barCount) * dataArray.length * 0.8);
        const value = dataArray[binIndex];
        const barHeight = (value / 255) * 80; 
        const innerRadius = 110;
        const outerRadius = innerRadius + barHeight;
        
        const x1 = centerX + Math.cos(angle) * innerRadius;
        const y1 = centerY + Math.sin(angle) * innerRadius;
        const x2 = centerX + Math.cos(angle) * outerRadius;
        const y2 = centerY + Math.sin(angle) * outerRadius;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 3 + (intensity * 2);
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    };
    draw();
  };

  const startSession = async () => {
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    const inputCtx = new AudioContextClass({ sampleRate: 16000 });
    const outputCtx = new AudioContextClass({ sampleRate: 24000 });
    
    // Resume contexts for browser safety
    if (inputCtx.state === 'suspended') await inputCtx.resume();
    if (outputCtx.state === 'suspended') await outputCtx.resume();
    
    audioContextRef.current = outputCtx;
    setStatus('connecting');

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const targetLang = language === 'ar' ? 'Arabic' : 'English';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');
            setIsActive(true);
            startVisualizer(stream, inputCtx);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ 
                media: { data: encodeAudio(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             if (message.serverContent?.inputTranscription) {
               currentInputTranscription.current += message.serverContent.inputTranscription.text;
             }
             if (message.serverContent?.outputTranscription) {
               currentOutputTranscription.current += message.serverContent.outputTranscription.text;
             }

             if (message.serverContent?.turnComplete) {
               const userText = currentInputTranscription.current.trim();
               const modelText = currentOutputTranscription.current.trim();
               if (userText) {
                 setTranscriptions(prev => [...prev, `${language === 'ar' ? 'أنت' : 'You'}: ${userText}`]);
                 if (onMessageLogged) onMessageLogged({ role: 'user', text: userText, timestamp: new Date().toISOString() });
               }
               if (modelText) {
                 setTranscriptions(prev => [...prev, `${language === 'ar' ? 'المستشار' : 'AI'}: ${modelText}`]);
                 if (onMessageLogged) onMessageLogged({ role: 'model', text: modelText, timestamp: new Date().toISOString() });
               }
               currentInputTranscription.current = '';
               currentOutputTranscription.current = '';
             }

             const interrupted = message.serverContent?.interrupted;
             if (interrupted) {
               for (const source of sourcesRef.current.values()) {
                 try { source.stop(); } catch(e) {}
               }
               sourcesRef.current.clear();
               nextStartTimeRef.current = 0;
               setStatus('listening');
             }

             const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (audioData) {
               setStatus('speaking');
               const buffer = await decodeAudioData(decodeBase64(audioData), outputCtx, 24000, 1);
               const source = outputCtx.createBufferSource();
               source.buffer = buffer;
               source.connect(outputCtx.destination);
               
               const playTime = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
               source.start(playTime);
               nextStartTimeRef.current = playTime + buffer.duration;
               sourcesRef.current.add(source);
               
               source.onended = () => { 
                 sourcesRef.current.delete(source);
                 if (sourcesRef.current.size === 0) setStatus('listening');
               };
             }
          },
          onerror: (e) => {
            console.error("Live session error:", e);
            stopSession();
          },
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `
            CRITICAL: You MUST respond in ${targetLang} language only.
            You are OmniOracle, an elite CRM strategic advisor. 
            CONTEXT: ${getCrmContext()}. 
            Always maintain a professional, visionary, and proactive tone. Avoid long technical jargon, stay strategic.`,
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error("Session activation failed:", err);
      setStatus('idle');
    }
  };

  const stopSession = () => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(s => s.close());
    }
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    setIsActive(false);
    setStatus('idle');
  };

  const ui = {
    ar: { title: 'مختبر OmniAI الاستراتيجي', start: 'تفعيل المستشار الصوتي', stop: 'إنهاء الجلسة', idle: 'النظام في وضع الاستعداد', listening: 'جاري الاستماع إليك...', speaking: 'جاري الرد...', connecting: 'جاري الاتصال...' },
    en: { title: 'OmniAI Strategic Lab', start: 'Activate Voice Oracle', stop: 'Terminate Session', idle: 'System Standby', listening: 'Listening...', speaking: 'Speaking...', connecting: 'Connecting...' }
  }[language];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-slate-950 rounded-[4rem] p-8 md:p-16 shadow-3xl border border-white/5 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] rounded-full transition-all duration-1000 ${status === 'listening' ? 'bg-indigo-600/20' : status === 'speaking' ? 'bg-emerald-600/20' : 'bg-slate-800/10'}`}></div>

      <div className="relative z-10 text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tighter">{ui.title}</h2>
        <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
           <span className={`w-3 h-3 rounded-full ${status === 'listening' ? 'bg-indigo-500 animate-ping' : status === 'speaking' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
           <span className="text-indigo-200 text-xs font-black uppercase tracking-widest">{ui[status]}</span>
        </div>
      </div>

      <div className="relative group">
        <canvas ref={canvasRef} width="400" height="400" className="w-[260px] h-[260px] md:w-[300px] md:h-[300px] mb-12 relative z-10" />
        {status === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
             <i className="fa-solid fa-microphone-slash text-6xl text-slate-700 animate-pulse"></i>
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl h-48 bg-white/5 rounded-[3rem] p-10 border border-white/10 shadow-inner overflow-y-auto mb-16 flex flex-col gap-4 backdrop-blur-sm relative z-10 custom-scrollbar">
         {transcriptions.length === 0 && <p className="text-slate-600 font-bold italic text-center mt-4">{language === 'ar' ? 'ابدأ التحدث للحصول على استشارة فورية...' : 'Start speaking for instant strategic advice...'}</p>}
         {transcriptions.map((t, i) => (
           <div key={i} className={`flex ${t.includes('AI') || t.includes('المستشار') ? 'justify-start' : 'justify-end'}`}>
             <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-bold ${t.includes('AI') || t.includes('المستشار') ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'bg-white/5 text-white border border-white/10'}`}>
               {t}
             </div>
           </div>
         ))}
      </div>

      <div className="flex gap-6 relative z-10">
        {!isActive ? (
          <button 
            onClick={startSession} 
            className="group relative px-10 py-6 md:px-12 md:py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xl md:text-2xl shadow-3xl hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <i className="fa-solid fa-microphone-lines text-2xl md:text-3xl"></i>
            {ui.start}
          </button>
        ) : (
          <button 
            onClick={stopSession} 
            className="px-10 py-6 md:px-12 md:py-8 bg-slate-800 text-white rounded-[2.5rem] font-black text-xl md:text-2xl hover:bg-rose-600 transition-all flex items-center gap-4"
          >
            <i className="fa-solid fa-phone-slash text-2xl md:text-3xl"></i>
            {ui.stop}
          </button>
        )}
      </div>

      <div className="mt-10 flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
         <i className="fa-solid fa-shield-check text-emerald-500"></i>
         {language === 'ar' ? 'الوصول للميكروفون مؤمن ومحمي' : 'Microphone Access Secured & Encrypted'}
      </div>
    </div>
  );
};

export default AIConsultant;
