
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
    }, 600);
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
    setTimeout(hideLoader, 1500);
  } catch (error) {
    console.error("Omni OS Critical Error:", error);
    const loaderP = document.querySelector('#boot-loader p');
    if (loaderP) {
      loaderP.textContent = "SYSTEM CRASH. CHECK CONSOLE.";
      (loaderP as HTMLElement).style.color = "#ef4444";
    }
  }
}
