"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/currency-context";

interface CurrencySelectorProps {
  currentCurrency?: string;
  onCurrencyChange?: (currency: string, regionCode: string) => void;
  isMobile?: boolean;
}

interface SelectorOption {
  currencyCode: string;
  currencySymbol: string;
  countryCode: string;
  countryName: string;
  flag: string;
}

export function CurrencySelector({
  currentCurrency,
  onCurrencyChange,
  isMobile = false,
}: CurrencySelectorProps) {
  const { currency, availableCurrencies, setCurrency } = useCurrency();
  const controlledCurrency = currentCurrency ?? currency;
  const handleCurrencyChange = onCurrencyChange ?? setCurrency;

  const options: SelectorOption[] = useMemo(() => {
    return availableCurrencies.map((entry) => ({
      currencyCode: entry.currencyCode,
      currencySymbol: entry.currencySymbol,
      countryCode: entry.countryCode,
      countryName: entry.countryName,
      flag: entry.flag,
    }));
  }, [availableCurrencies]);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState<SelectorOption | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const newSelectedOption = options.find((option) => option.currencyCode === controlledCurrency) || null;
    setSelectedOption(newSelectedOption);
  }, [controlledCurrency, options]);

  const handleSelect = (option: SelectorOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchQuery("");
    handleCurrencyChange(option.currencyCode, option.countryCode);
  };

  const filteredOptions = options.filter((option) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      option.countryName.toLowerCase().includes(query) ||
      option.currencyCode.toLowerCase().includes(query) ||
      option.currencySymbol.toLowerCase().includes(query)
    );
  });

  const updateButtonPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  };

  const renderDropdown = () => (
    <>
      <div
        className="fixed inset-0 z-[9999]"
        onClick={() => {
          setIsOpen(false);
          setSearchQuery("");
        }}
      />

      <div
        className="fixed w-80 max-w-[90vw] bg-white border border-neutral-200 rounded-lg shadow-lg z-[10000] max-h-[500px] flex flex-col"
        style={{
          top: buttonPosition.top,
          left: Math.min(buttonPosition.left, window.innerWidth - 320),
        }}
      >
        <div className="px-4 py-3 border-b border-neutral-100">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Select Region & Currency
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search currencies..."
              className="w-full px-3 py-2 pr-8 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
            />
            <svg
              className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="overflow-y-auto py-2">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={`${option.countryCode}-${option.currencyCode}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(option);
                }}
                className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-neutral-50 transition-colors text-black ${
                  selectedOption?.currencyCode === option.currencyCode ? "bg-neutral-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl" aria-hidden>{option.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-black font-medium">{option.countryName}</span>
                    <span className="text-xs text-gray-500">
                      {option.currencyCode} {option.currencySymbol}
                    </span>
                  </div>
                </div>
                {selectedOption?.currencyCode === option.currencyCode && (
                  <svg className="w-5 h-5 text-[#c59862]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-gray-500">No currencies found</div>
          )}
        </div>
      </div>
    </>
  );

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
          disabled={options.length === 0}
        >
          <span>{selectedOption?.flag ?? '🌐'}</span>
          <span>{selectedOption?.currencySymbol ?? controlledCurrency}</span>
        </button>

        {isOpen && typeof document !== 'undefined' && createPortal(renderDropdown(), document.body)}
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
        disabled={options.length === 0}
      >
        <span>{selectedOption?.flag ?? '🌐'}</span>
        <span>{selectedOption?.currencySymbol ?? controlledCurrency}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && typeof document !== 'undefined' && createPortal(renderDropdown(), document.body)}
    </div>
  );
}
