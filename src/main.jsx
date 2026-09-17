import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { MasterDataProvider } from './context/MasterDataContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { OperationsProvider } from './context/OperationsContext';
import { FleetProvider } from './context/FleetContext';
import App from './App';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <MasterDataProvider>
            <OnboardingProvider>
              <OperationsProvider>
                <FleetProvider>
                  <App />
                </FleetProvider>
              </OperationsProvider>
            </OnboardingProvider>
          </MasterDataProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
