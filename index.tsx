
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const initialize = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(<App />);
    
    // إخفاء شاشة الإقلاع بعد التشغيل الناجح
    setTimeout(() => {
      const boot = document.getElementById('boot-screen');
      if (boot) {
        boot.style.opacity = '0';
        setTimeout(() => boot.remove(), 500);
      }
    }, 1500);
    
  } catch (err: any) {
    console.error("Mounting Error:", err);
    if ((window as any).logStatus) {
      (window as any).logStatus("Critical UI Error: " + err.message);
    }
  }
};

initialize();
