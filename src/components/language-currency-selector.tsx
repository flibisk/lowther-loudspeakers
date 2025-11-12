"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

import { useCurrency } from "@/contexts/currency-context";

interface Language {
  code: string;
  name: string;
  flag: string;
  currency: string;
}

const languagesWithCurrency: Language[] = [
  { code: "en-GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP" },
  { code: "en-US", name: "United States", flag: "🇺🇸", currency: "USD" },
  { code: "en-FR", name: "Europe", flag: "🇪🇺", currency: "EUR" },
  { code: "ja-JP", name: "日本 (Japan)", flag: "🇯🇵", currency: "JPY" },
  { code: "en-AU", name: "Australia", flag: "🇦🇺", currency: "AUD" },
  { code: "en-CA", name: "Canada", flag: "🇨🇦", currency: "CAD" },
];

interface LanguageCurrencySelectorProps {
  currentLanguage?: string;
  onLanguageChange?: (language: string, currency: string) => void;
  isMobile?: boolean;
}

export function LanguageCurrencySelector({
  currentLanguage = "en-GB",
  onLanguageChange,
  isMobile = false,
}: LanguageCurrencySelectorProps) {
  const { setCurrency, availableCurrencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    languagesWithCurrency.find((lang) => lang.code === currentLanguage) || languagesWithCurrency[0]
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const newSelectedLanguage = languagesWithCurrency.find((lang) => lang.code === currentLanguage) || languagesWithCurrency[0];
    setSelectedLanguage(newSelectedLanguage);
  }, [currentLanguage]);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    onLanguageChange?.(language.code, language.currency);

    const currencyOption = availableCurrencies.find((option) => option.currencyCode === language.currency);
    if (currencyOption) {
      setCurrency(currencyOption.currencyCode, currencyOption.countryCode);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('lowther-language', language.code);
    }
  };

  const updateButtonPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  };

  const currentCurrency = availableCurrencies.find((option) => option.currencyCode === selectedLanguage.currency);

  if (isMobile) {
    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateButtonPosition();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-2 text-xs font-medium text-white hover:text-[#c59862] transition-colors"
        >
          <span>{selectedLanguage.flag}</span>
          <span>{selectedLanguage.name.split(' ')[0]}</span>
          <span className="text-[10px] opacity-75">({currentCurrency?.currencySymbol ?? selectedLanguage.currency})</span>
        </button>

        {isOpen && typeof document !== 'undefined' &&
          createPortal(
            <>
              <div className="fixed inset-0 z-[9999]" onClick={() => setIsOpen(false)} />

              <div
                className="fixed w-64 bg-white border border-neutral-200 rounded-lg shadow-lg z-[10000]"
                style={{
                  top: buttonPosition.top,
                  left: buttonPosition.left,
                }}
              >
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Select Region & Currency
                  </div>
                  {languagesWithCurrency.map((language) => (
                    <button
                      key={language.code}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLanguageSelect(language);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-neutral-50 transition-colors text-black ${
                        selectedLanguage.code === language.code ? "bg-neutral-50 font-medium" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{language.flag}</span>
                        <span className="text-black">{language.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-mono">{language.currency}</span>
                        {selectedLanguage.code === language.code && (
                          <svg className="w-4 h-4 text-[#c59862]" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>,
            document.body,
          )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          updateButtonPosition();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 text-sm font-medium text-white hover:text-black hover:bg-white px-3 py-1.5 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{selectedLanguage.flag}</span>
        <span>{selectedLanguage.name.split('(')[0].trim()}</span>
        <span className="text-xs opacity-75">({currentCurrency?.currencySymbol ?? selectedLanguage.currency})</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && typeof document !== 'undefined' &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[9999]" onClick={() => setIsOpen(false)} />

            <div
              className="fixed w-80 bg-white border border-neutral-200 rounded-lg shadow-lg z-[10000]"
              style={{
                top: buttonPosition.top,
                left: buttonPosition.left,
              }}
            >
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-neutral-100">
                  Select Region & Currency
                </div>
                {languagesWithCurrency.map((language) => (
                  <button
                    key={language.code}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLanguageSelect(language);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-neutral-50 transition-colors text-black ${
                      selectedLanguage.code === language.code ? "bg-neutral-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{language.flag}</span>
                      <div className="flex flex-col">
                        <span className="text-black font-medium">{language.name}</span>
                        <span className="text-xs text-gray-500">
                          {language.currency} {availableCurrencies.find((option) => option.currencyCode === language.currency)?.currencySymbol ?? ''}
                        </span>
                      </div>
                    </div>
                    {selectedLanguage.code === language.code && (
                      <svg className="w-5 h-5 text-[#c59862]" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
