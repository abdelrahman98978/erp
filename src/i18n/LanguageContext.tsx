import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, Language, TRANSLATIONS } from './languages';
import i18n from './config';

interface LanguageContextType {
  currentLanguage: Language;
  theme: 'light' | 'dark';
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  t: (key: string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: LANGUAGES[0],
  theme: 'light',
  setLanguage: () => {},
  toggleTheme: () => {},
  t: (key: string, defaultText?: string) => defaultText || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LANGUAGES[0]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('lang', currentLanguage.code);
    document.documentElement.setAttribute('dir', currentLanguage.dir);
    i18n.changeLanguage(currentLanguage.code);
  }, [currentLanguage]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSetLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const t = (key: string, defaultText?: string): string => {
    const langDict = TRANSLATIONS[currentLanguage.code];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const englishDict = TRANSLATIONS['en'];
    if (englishDict && englishDict[key]) {
      return englishDict[key];
    }
    const arabicDict = TRANSLATIONS['ar'];
    if (arabicDict && arabicDict[key]) {
      return arabicDict[key];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, theme, setLanguage: handleSetLanguage, toggleTheme, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
