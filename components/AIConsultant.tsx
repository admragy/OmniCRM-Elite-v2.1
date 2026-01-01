
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { Contact, Deal, ChatLog, BrandProfile } from '../types';
import { decodeBase64, encodeAudio, decodeAudioData } from '../services/geminiService';

interface AIConsultantProps {
  contacts: Contact[];
  deals: Deal[];
  language: 'en' | 'ar';
  brand: BrandProfile;
  deductTokens: (amount: number) => Promise<boolean>;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ contacts, deals, language, brand, deductTokens }) => {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'Strategic' | 'Tactical' | 'Combat'>('Strategic');
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
    return `The current CRM state: Total revenue is $${totalValue}. Industry: ${brand.industry}. Mode: ${mode}.`;
  };

  const startVisualizer = (stream: MediaStream, context: AudioContext) => {
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
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
      
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const intensity = average / 128;

      // Glow logic
      const color = mode === 'Combat' ? '#f43f5e' : status === 'speaking' ? '#10b981' : '#6366f1';
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 120 + intensity * 20, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.2 * intensity;
      ctx.lineWidth = 30;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Circular bars
      const barCount = 120;
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2;
        const value = dataArray[i % dataArray.length];
        const barHeight = (value / 255) * 100 * intensity;
        
        const x1 = centerX + Math.cos(angle) * 130;
        const y1 = centerY + Math.sin(angle) * 130;
        const x2 = centerX + Math.cos(angle) * (130 + barHeight);
        const y2 = centerY + Math.sin(angle) * (130 + barHeight);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    };
    draw();
  };

  const startSession = async () => {
    const success = await deductTokens(15);
    if (!success) return;

    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
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
             if (message.serverContent?.inputTranscription) currentInputTranscription.current += message.serverContent.inputTranscription.text;
             if (message.serverContent?.outputTranscription) currentOutputTranscription.current += message.serverContent.outputTranscription.text;

             if (message.serverContent?.turnComplete) {
               const userText = currentInputTranscription.current.trim();
               const modelText = currentOutputTranscription.current.trim();
               if (userText) setTranscriptions(prev => [...prev, `User: ${userText}`]);
               if (modelText) setTranscriptions(prev => [...prev, `Advisor: ${modelText}`]);
               // Fix: Correctly update the ref's current value instead of reassigning the constant ref object
               currentInputTranscription.current = '';
               currentOutputTranscription.current = '';
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
          onerror: () => stopSession(),
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
          systemInstruction: `IDENTITY: OmniAdvisor V3. Current Mode: ${mode}. Language: ${targetLang}. 
          If Combat Mode: Be aggressive, brief, and focus on capturing market share.
          If Strategic Mode: Be visionary, long-term oriented, and philosophical.
          If Tactical Mode: Focus on execution, steps, and CRM data points.
          Context: ${getCrmContext()}`,
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) { setStatus('idle'); }
  };

  const stopSession = () => {
    if (sessionPromiseRef.current) sessionPromiseRef.current.then(s => s.close());
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setIsActive(false);
    setStatus('idle');
  };

  const ui = {
    ar: { title: 'مستشار النمو الاستراتيجي', start: 'بدء الجلسة الاستشارية', stop: 'إنهاء الجلسة' },
    en: { title: 'Strategic Growth Advisor', start: 'Start Advisory Session', stop: 'End Session' }
  }[language];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-slate-950 rounded-[5rem] p-12 border border-white/5 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Mode Selector */}
      <div className="absolute top-16 flex gap-4 z-20">
        {['Strategic', 'Tactical', 'Combat'].map(m => (
          <button 
            key={m} 
            onClick={() => setMode(m as any)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${mode === m ? 'bg-white text-slate-950 border-white' : 'text-slate-500 border-white/10 hover:border-white/30'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="relative z-10 text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter shimmer-text mb-6">{ui.title}</h2>
        <div className="inline-flex items-center gap-4 px-10 py-4 bg-white/5 rounded-full border border-white/10 backdrop-blur-3xl">
           <span className={`w-3 h-3 rounded-full ${status === 'listening' ? 'bg-indigo-500 animate-ping' : status === 'speaking' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
           <span className="text-white text-xs font-black uppercase tracking-[0.3em]">{status}</span>
        </div>
      </div>

      <canvas ref={canvasRef} width="500" height="500" className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] mb-12 relative z-10" />

      <div className="w-full max-w-5xl h-64 bg-black/40 rounded-[4rem] p-12 border border-white/5 overflow-y-auto mb-16 flex flex-col gap-6 custom-scrollbar shadow-inner relative z-10">
         {transcriptions.map((t, i) => (
           <div key={i} className={`flex ${t.startsWith('Advisor') ? 'justify-start' : 'justify-end'}`}>
             <div className={`max-w-[85%] p-6 rounded-[2.5rem] text-sm font-bold ${t.startsWith('Advisor') ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/20' : 'bg-white/5 text-white/70 border border-white/10'}`}>
               {t}
             </div>
           </div>
         ))}
      </div>

      <div className="flex gap-8 relative z-10">
        {!isActive ? (
          <button onClick={startSession} className="px-16 py-8 bg-indigo-600 text-white rounded-[3rem] font-black text-2xl shadow-[0_20px_60px_rgba(99,102,241,0.4)] hover:bg-indigo-500 transition-all flex items-center gap-6 group">
            <i className="fa-solid fa-headset text-3xl group-hover:scale-110 transition-transform"></i> {ui.start}
          </button>
        ) : (
          <button onClick={stopSession} className="px-16 py-8 bg-slate-900 text-white rounded-[3rem] font-black text-2xl hover:bg-rose-600 transition-all flex items-center gap-6 border border-white/10 shadow-2xl">
            <i className="fa-solid fa-stop-circle text-3xl"></i> {ui.stop}
          </button>
        )}
      </div>
    </div>
  );
};

export default AIConsultant;
