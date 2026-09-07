import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { OnboardingProvider } from './context/OnboardingContext';
import App from './App';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <OnboardingProvider>
          <App />
        </OnboardingProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
