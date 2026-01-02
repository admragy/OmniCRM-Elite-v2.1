
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
  
  // إخفاء شاشة التحميل فور بدء التطبيق مع تأثير انتقال ناعم
  const boot = document.getElementById('boot-screen');
  if (boot) {
    // نستخدم نافذة الوقت للتأكد من أن React قد بدأ في المعالجة
    requestAnimationFrame(() => {
      setTimeout(() => {
        boot.style.opacity = '0';
        boot.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => boot.remove(), 800);
      }, 500);
    });
  }
}
