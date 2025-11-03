"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currency: string;
  currencySymbol: string;
  language: string;
  setCurrency: (currency: string, language: string) => void;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const currencySymbols: Record<string, string> = {
  'GBP': '£',
  'USD': '$',
  'EUR': '€',
  'JPY': '¥',
  'AUD': 'A$',
  'CAD': 'C$',
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>('GBP');
  const [language, setLanguageState] = useState<string>('en-GB');

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('lowther-currency');
      const savedLanguage = localStorage.getItem('lowther-language');
      
      if (savedCurrency) setCurrencyState(savedCurrency);
      if (savedLanguage) setLanguageState(savedLanguage);
    }
  }, []);

  const setCurrency = (newCurrency: string, newLanguage: string) => {
    setCurrencyState(newCurrency);
    setLanguageState(newLanguage);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('lowther-currency', newCurrency);
      localStorage.setItem('lowther-language', newLanguage);
    }
  };

  const formatPrice = (price: number): string => {
    const symbol = currencySymbols[currency] || currency;
    
    // Format based on currency
    if (currency === 'JPY') {
      // Japanese Yen doesn't use decimals
      return `${symbol}${Math.round(price).toLocaleString('ja-JP')}`;
    }
    
    return `${symbol}${price.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <CurrencyContext.Provider 
      value={{ 
        currency, 
        currencySymbol: currencySymbols[currency] || currency,
        language,
        setCurrency, 
        formatPrice 
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

