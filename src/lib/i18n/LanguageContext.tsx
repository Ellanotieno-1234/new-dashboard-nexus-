"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { en } from './translations/en';
import { fr } from './translations/fr';
import { de } from './translations/de';
import { sv } from './translations/sv';
import { LanguageCode } from './languages';

type TranslationsType = typeof en;

const translations: Record<LanguageCode, TranslationsType> = {
  en,
  fr,
  de,
  sv,
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && isValidLanguage(savedLanguage)) {
      setLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const isValidLanguage = (lang: string): lang is LanguageCode => {
    return Object.keys(translations).includes(lang);
  };

  const handleSetLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const translate = (key: string): string => {
    const keys = key.split('.');
    let current = translations[language];

    for (const k of keys) {
      if (!current || typeof current !== 'object') {
        return key;
      }
      current = (current as any)[k];
    }

    return typeof current === 'string' ? current : key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t: translate,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
