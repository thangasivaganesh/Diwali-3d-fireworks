import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTranslations } from './translations.js';

const STORAGE_KEY = 'diwali_lang';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || 'en'; }
    catch { return 'en'; }
  });

  const t = getTranslations(lang);

  const switchLang = useCallback((newLang) => {
    setLang(newLang);
    try { localStorage.setItem(STORAGE_KEY, newLang); } catch {}
    document.documentElement.lang = newLang;
    document.title = getTranslations(newLang).pageTitle;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.pageTitle;
  }, [lang, t]);

  return (
    <LanguageContext.Provider value={{ lang, t, switchLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
