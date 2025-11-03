'use client';

import { useContext, createContext, ReactNode, useState } from 'react';
import { SupportedLanguage, translations, defaultLanguage, Translations } from '@/lib/i18n';

interface TranslationContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: Translations;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
  language?: SupportedLanguage;
}

export function TranslationProvider({ children, language = defaultLanguage }: TranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(language);

  const contextValue: TranslationContextType = {
    language: currentLanguage,
    setLanguage: setCurrentLanguage,
    t: translations[currentLanguage],
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }
  return context;
}

// Helper hook for getting current language
export function useLanguage() {
  const { language, setLanguage } = useTranslations();
  return { language, setLanguage };
}

// Helper hook for getting translations
export function useT() {
  const { t } = useTranslations();
  return t;
}
