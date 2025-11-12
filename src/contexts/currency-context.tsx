"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from 'react';

import type { ShopifyAvailableCountry } from '@/lib/shopify-storefront';

interface AvailableCurrencyOption {
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  countryCode: string;
  countryName: string;
  flag: string;
}

interface CurrencyContextType {
  currency: string;
  currencySymbol: string;
  region: string;
  language: string;
  availableCurrencies: AvailableCurrencyOption[];
  isReady: boolean;
  setCurrency: (currencyCode: string, regionCode?: string) => void;
  setLanguage: (language: string) => void;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const DEFAULT_CURRENCY = 'GBP';
const DEFAULT_REGION = 'GB';
const DEFAULT_LANGUAGE = 'en-GB';

const PREFERRED_REGION_BY_CURRENCY: Record<string, string> = {
  AED: 'AE',
  AFN: 'AF',
  ALL: 'AL',
  AMD: 'AM',
  ANG: 'CW',
  AOA: 'AO',
  ARS: 'AR',
  AUD: 'AU',
  AWG: 'AW',
  AZN: 'AZ',
  BAM: 'BA',
  BBD: 'BB',
  BDT: 'BD',
  BGN: 'BG',
  BHD: 'BH',
  BIF: 'BI',
  BMD: 'BM',
  BND: 'BN',
  BOB: 'BO',
  BRL: 'BR',
  BSD: 'BS',
  BTN: 'BT',
  BWP: 'BW',
  BYN: 'BY',
  BZD: 'BZ',
  CAD: 'CA',
  CDF: 'CD',
  CHF: 'CH',
  CLP: 'CL',
  CNY: 'CN',
  COP: 'CO',
  CRC: 'CR',
  CVE: 'CV',
  CZK: 'CZ',
  DJF: 'DJ',
  DKK: 'DK',
  DOP: 'DO',
  DZD: 'DZ',
  EGP: 'EG',
  ETB: 'ET',
  EUR: 'FR',
  FJD: 'FJ',
  FKP: 'FK',
  GBP: 'GB',
  GEL: 'GE',
  GHS: 'GH',
  GIP: 'GI',
  GMD: 'GM',
  GNF: 'GN',
  GTQ: 'GT',
  GYD: 'GY',
  HKD: 'HK',
  HNL: 'HN',
  HRK: 'HR',
  HTG: 'HT',
  HUF: 'HU',
  IDR: 'ID',
  ILS: 'IL',
  INR: 'IN',
  IQD: 'IQ',
  IRR: 'IR',
  ISK: 'IS',
  JMD: 'JM',
  JOD: 'JO',
  JPY: 'JP',
  KES: 'KE',
  KGS: 'KG',
  KHR: 'KH',
  KMF: 'KM',
  KPW: 'KP',
  KRW: 'KR',
  KWD: 'KW',
  KYD: 'KY',
  KZT: 'KZ',
  LAK: 'LA',
  LBP: 'LB',
  LKR: 'LK',
  LRD: 'LR',
  LSL: 'LS',
  LYD: 'LY',
  MAD: 'MA',
  MDL: 'MD',
  MGA: 'MG',
  MKD: 'MK',
  MMK: 'MM',
  MNT: 'MN',
  MOP: 'MO',
  MUR: 'MU',
  MVR: 'MV',
  MWK: 'MW',
  MXN: 'MX',
  MYR: 'MY',
  MZN: 'MZ',
  NAD: 'NA',
  NGN: 'NG',
  NIO: 'NI',
  NOK: 'NO',
  NPR: 'NP',
  NZD: 'NZ',
  OMR: 'OM',
  PAB: 'PA',
  PEN: 'PE',
  PGK: 'PG',
  PHP: 'PH',
  PKR: 'PK',
  PLN: 'PL',
  PYG: 'PY',
  QAR: 'QA',
  RON: 'RO',
  RSD: 'RS',
  RUB: 'RU',
  RWF: 'RW',
  SAR: 'SA',
  SBD: 'SB',
  SCR: 'SC',
  SDG: 'SD',
  SEK: 'SE',
  SGD: 'SG',
  SHP: 'SH',
  SLL: 'SL',
  SOS: 'SO',
  SRD: 'SR',
  SSP: 'SS',
  STD: 'ST',
  SVC: 'SV',
  SYP: 'SY',
  SZL: 'SZ',
  THB: 'TH',
  TJS: 'TJ',
  TMT: 'TM',
  TND: 'TN',
  TOP: 'TO',
  TRY: 'TR',
  TTD: 'TT',
  TWD: 'TW',
  TZS: 'TZ',
  UAH: 'UA',
  UGX: 'UG',
  USD: 'US',
  UYU: 'UY',
  UZS: 'UZ',
  VES: 'VE',
  VND: 'VN',
  VUV: 'VU',
  WST: 'WS',
  XAF: 'CM',
  XCD: 'AG',
  XOF: 'SN',
  XPF: 'PF',
  YER: 'YE',
  ZAR: 'ZA',
  ZMW: 'ZM',
};

function countryCodeToFlag(isoCode: string): string {
  if (!isoCode || isoCode.length !== 2) {
    return '🌐';
  }

  const codePoints = [...isoCode.toUpperCase()].map((char) => {
    const base = 0x1F1E6; // Regional indicator symbol letter A
    const charCode = char.charCodeAt(0);
    if (charCode < 65 || charCode > 90) {
      return null;
    }
    return base + charCode - 65;
  });

  if (codePoints.includes(null)) {
    return '🌐';
  }

  return String.fromCodePoint(...(codePoints as number[]));
}

function buildCurrencyOptions(countries: ShopifyAvailableCountry[]): AvailableCurrencyOption[] {
  const groupMap = new Map<string, ShopifyAvailableCountry[]>();

  countries.forEach((country) => {
    const currency = country.currency;
    if (!currency?.isoCode) {
      return;
    }

    const list = groupMap.get(currency.isoCode) ?? [];
    list.push(country);
    groupMap.set(currency.isoCode, list);
  });

  const options: AvailableCurrencyOption[] = [];

  groupMap.forEach((countryList, currencyCode) => {
    const preferredRegion = PREFERRED_REGION_BY_CURRENCY[currencyCode];
    let chosenCountry = preferredRegion
      ? countryList.find((country) => country.isoCode === preferredRegion)
      : undefined;

    if (!chosenCountry) {
      chosenCountry = countryList.find((country) => country.isoCode === currencyCode);
    }

    if (!chosenCountry) {
      chosenCountry = countryList[0];
    }

    const currencyDetails = countryList[0].currency;
    const symbol = currencyDetails?.symbol?.trim() || currencyCode;
    const niceSymbol = symbol.length > 4 ? currencyCode : symbol; // Avoid overly long symbols

    options.push({
      currencyCode,
      currencyName: currencyDetails?.name ?? currencyCode,
      currencySymbol: niceSymbol,
      countryCode: chosenCountry.isoCode,
      countryName: chosenCountry.name,
      flag: countryCodeToFlag(chosenCountry.isoCode),
    });
  });

  return options.sort((a, b) => a.currencyCode.localeCompare(b.currencyCode));
}

function detectBrowserLanguage(): string {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const browserLang = navigator.language || DEFAULT_LANGUAGE;
  return browserLang;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>(DEFAULT_CURRENCY);
  const [region, setRegionState] = useState<string>(DEFAULT_REGION);
  const [language, setLanguageState] = useState<string>(DEFAULT_LANGUAGE);
  const [availableCurrencies, setAvailableCurrencies] = useState<AvailableCurrencyOption[]>([]);
  const [isReady, setIsReady] = useState(false);

  const currencySymbolMap = useMemo(() => {
    return availableCurrencies.reduce<Record<string, string>>((acc, option) => {
      acc[option.currencyCode] = option.currencySymbol;
      return acc;
    }, {});
  }, [availableCurrencies]);

  const formatPrice = useCallback((price: number): string => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
      }).format(price);
    } catch {
      const symbol = currencySymbolMap[currency] || currency;
      return `${symbol}${price.toFixed(2)}`;
    }
  }, [currency, currencySymbolMap]);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      if (typeof window === 'undefined') return;

      try {
        const response = await fetch('/api/shopify/available-countries');
        if (!response.ok) {
          throw new Error(`Failed to fetch currencies: ${response.status}`);
        }
        const data = await response.json();
        const countries: ShopifyAvailableCountry[] = data.countries ?? [];
        const currencyOptions = buildCurrencyOptions(countries);

        if (cancelled) return;

        setAvailableCurrencies(currencyOptions);

        const defaultOption = currencyOptions.find((option) => option.currencyCode === DEFAULT_CURRENCY) || currencyOptions[0];

        const savedCurrency = localStorage.getItem('lowther-currency');
        const savedRegion = localStorage.getItem('lowther-region');
        const savedLanguage = localStorage.getItem('lowther-language');

        const hasSavedCurrency = savedCurrency && currencyOptions.some((option) => option.currencyCode === savedCurrency);
        const savedOption = hasSavedCurrency
          ? currencyOptions.find((option) => option.currencyCode === savedCurrency)
          : undefined;

        if (hasSavedCurrency && savedOption) {
          setCurrencyState(savedOption.currencyCode);
          setRegionState(savedRegion || savedOption.countryCode);
          if (savedLanguage) {
            setLanguageState(savedLanguage);
          } else {
            const detectedLanguage = detectBrowserLanguage();
            setLanguageState(detectedLanguage);
            localStorage.setItem('lowther-language', detectedLanguage);
          }
        } else {
          const detectedLanguage = detectBrowserLanguage();
          let detectedCurrency = defaultOption?.currencyCode ?? DEFAULT_CURRENCY;
          let detectedRegion = defaultOption?.countryCode ?? DEFAULT_REGION;

          try {
            const geoResponse = await fetch('https://ipapi.co/json/');
            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              const countryCode = geoData?.country_code;
              if (countryCode) {
                const matchByCountry = currencyOptions.find((option) => option.countryCode === countryCode);
                if (matchByCountry) {
                  detectedCurrency = matchByCountry.currencyCode;
                  detectedRegion = matchByCountry.countryCode;
                }
              }
            }
          } catch (error) {
            console.warn('Failed to detect region via IP lookup:', error);
          }

          setCurrencyState(detectedCurrency);
          setRegionState(detectedRegion);
          setLanguageState(detectedLanguage);

          localStorage.setItem('lowther-currency', detectedCurrency);
          localStorage.setItem('lowther-region', detectedRegion);
          localStorage.setItem('lowther-language', detectedLanguage);
        }
      } catch (error) {
        console.error('Failed to initialize currency context:', error);
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = (currencyCode: string, regionCode?: string) => {
    const option = availableCurrencies.find((item) => item.currencyCode === currencyCode);
    if (!option) {
      console.warn(`Currency ${currencyCode} is not available. Keeping current currency.`);
      return;
    }

    const nextRegion = regionCode || option.countryCode;

    setCurrencyState(option.currencyCode);
    setRegionState(nextRegion);

    if (typeof window !== 'undefined') {
      localStorage.setItem('lowther-currency', option.currencyCode);
      localStorage.setItem('lowther-region', nextRegion);
    }
  };

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lowther-language', newLanguage);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencySymbol: currencySymbolMap[currency] || currency,
        region,
        language,
        availableCurrencies,
        isReady,
        setCurrency,
        setLanguage,
        formatPrice,
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
