import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

const hideBootScreen = () => {
  const boot = document.getElementById('boot-screen');
  if (boot) {
    boot.style.opacity = '0';
    boot.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => boot.remove(), 800);
  }
};

if (container) {
  try {
    const root = createRoot(container);
    root.render(<App />);
    
    // إخفاء الشاشة بعد استقرار التحميل
    requestAnimationFrame(() => {
      setTimeout(hideBootScreen, 1000);
    });
  } catch (error) {
    console.error("Critical rendering error:", error);
    hideBootScreen(); // لا نترك المستخدم في شاشة التحميل للأبد
  }
}