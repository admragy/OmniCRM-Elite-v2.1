
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

const hideLoader = () => {
  const loader = document.getElementById('boot-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      if (loader.parentNode) loader.remove();
    }, 800);
  }
};

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // إخفاء التحميل بمجرد أن يبدأ المتصفح في معالجة المكونات
    requestAnimationFrame(() => {
      setTimeout(hideLoader, 500);
    });
  } catch (error) {
    console.error("Omni OS Boot Error:", error);
    const loaderP = document.querySelector('#boot-loader p');
    if (loaderP) {
      loaderP.textContent = "CRITICAL ERROR. CHECK CONSOLE.";
      (loaderP as HTMLElement).style.color = "#f43f5e";
    }
  }
}
