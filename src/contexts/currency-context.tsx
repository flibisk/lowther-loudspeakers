"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currency: string;
  currencySymbol: string;
  region: string;
  language: string;
  setCurrency: (currency: string, region: string) => void;
  setLanguage: (language: string) => void;
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

// Auto-detect currency/region based on geo-location
async function detectRegionAndCurrency(): Promise<{ currency: string; region: string }> {
  try {
    // Use a free geo-location API
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    const countryCode = data.country_code;
    
    // Map country codes to our supported regions
    const regionMapping: Record<string, { currency: string; region: string }> = {
      'GB': { currency: 'GBP', region: 'GB' },
      'US': { currency: 'USD', region: 'US' },
      'JP': { currency: 'JPY', region: 'JP' },
      'AU': { currency: 'AUD', region: 'AU' },
      'CA': { currency: 'CAD', region: 'CA' },
      // European countries
      'FR': { currency: 'EUR', region: 'EU' },
      'DE': { currency: 'EUR', region: 'EU' },
      'IT': { currency: 'EUR', region: 'EU' },
      'ES': { currency: 'EUR', region: 'EU' },
      'NL': { currency: 'EUR', region: 'EU' },
      'BE': { currency: 'EUR', region: 'EU' },
      'AT': { currency: 'EUR', region: 'EU' },
      'PT': { currency: 'EUR', region: 'EU' },
      'IE': { currency: 'EUR', region: 'EU' },
      'GR': { currency: 'EUR', region: 'EU' },
    };
    
    return regionMapping[countryCode] || { currency: 'GBP', region: 'GB' };
  } catch (error) {
    console.error('Failed to detect region:', error);
    return { currency: 'GBP', region: 'GB' };
  }
}

// Auto-detect language from browser
function detectBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language || 'en';
  
  // Map browser language codes to our supported languages
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('it')) return 'it';
  
  return 'en'; // Default to English
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>('GBP');
  const [region, setRegionState] = useState<string>('GB');
  const [language, setLanguageState] = useState<string>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-detect on first mount
  useEffect(() => {
    async function initialize() {
      if (typeof window === 'undefined') return;
      
      // Check if user has already set preferences
      const savedCurrency = localStorage.getItem('lowther-currency');
      const savedRegion = localStorage.getItem('lowther-region');
      const savedLanguage = localStorage.getItem('lowther-language');
      
      if (savedCurrency && savedRegion && savedLanguage) {
        // User has preferences, use them
        setCurrencyState(savedCurrency);
        setRegionState(savedRegion);
        setLanguageState(savedLanguage);
      } else {
        // Auto-detect
        const detectedLang = detectBrowserLanguage();
        const { currency: detectedCurrency, region: detectedRegion } = await detectRegionAndCurrency();
        
        setCurrencyState(detectedCurrency);
        setRegionState(detectedRegion);
        setLanguageState(detectedLang);
        
        // Save auto-detected values
        localStorage.setItem('lowther-currency', detectedCurrency);
        localStorage.setItem('lowther-region', detectedRegion);
        localStorage.setItem('lowther-language', detectedLang);
      }
      
      setIsInitialized(true);
    }
    
    initialize();
  }, []);

  const setCurrency = (newCurrency: string, newRegion: string) => {
    setCurrencyState(newCurrency);
    setRegionState(newRegion);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('lowther-currency', newCurrency);
      localStorage.setItem('lowther-region', newRegion);
    }
  };

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage);
    
    if (typeof window !== 'undefined') {
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
        region,
        language,
        setCurrency,
        setLanguage,
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

