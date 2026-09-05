import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { copy } from './copy';

const STORAGE_KEY = 'msg-lang';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || 'ar');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = copy[lang].dir;
  }, [lang]);

  const value = useMemo(() => {
    const t = copy[lang];
    return {
      lang,
      setLang,
      toggleLang: () => setLang((current) => (current === 'ar' ? 'en' : 'ar')),
      t,
      dir: t.dir,
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
