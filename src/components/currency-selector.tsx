"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

interface Region {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

const regions: Region[] = [
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", currencySymbol: "£" },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", currencySymbol: "$" },
  { code: "EU", name: "Europe", flag: "🇪🇺", currency: "EUR", currencySymbol: "€" },
  { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY", currencySymbol: "¥" },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD", currencySymbol: "A$" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", currencySymbol: "C$" },
];

interface CurrencySelectorProps {
  currentCurrency?: string;
  onCurrencyChange?: (currency: string, regionCode: string) => void;
  isMobile?: boolean;
}

export function CurrencySelector({ 
  currentCurrency = "GBP", 
  onCurrencyChange, 
  isMobile = false 
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(
    regions.find(region => region.currency === currentCurrency) || regions[0]
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const newSelectedRegion = regions.find(region => region.currency === currentCurrency) || regions[0];
    setSelectedRegion(newSelectedRegion);
  }, [currentCurrency]);

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    setIsOpen(false);
    if (onCurrencyChange) {
      onCurrencyChange(region.currency, region.code);
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('lowther-currency', region.currency);
      localStorage.setItem('lowther-region', region.code);
    }
  };

  const updateButtonPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      });
    }
  };

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
          <span>{selectedRegion.flag}</span>
          <span>{selectedRegion.currencySymbol}</span>
        </button>

        {isOpen && typeof document !== 'undefined' && createPortal(
          <>
            <div
              className="fixed inset-0 z-[9999]"
              onClick={() => setIsOpen(false)}
            />
            
            <div 
              className="fixed w-64 bg-white border border-neutral-200 rounded-lg shadow-lg z-[10000]"
              style={{
                top: buttonPosition.top,
                left: buttonPosition.left
              }}
            >
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-neutral-100">
                  Select Region & Currency
                </div>
                {regions.map((region) => (
                  <button
                    key={region.code}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRegionSelect(region);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-neutral-50 transition-colors text-black ${
                      selectedRegion.code === region.code ? "bg-neutral-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{region.flag}</span>
                      <div className="flex flex-col">
                        <span className="text-black font-medium">{region.name}</span>
                        <span className="text-xs text-gray-500">{region.currency} {region.currencySymbol}</span>
                      </div>
                    </div>
                    {selectedRegion.code === region.code && (
                      <svg className="w-4 h-4 text-[#c59862]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>,
          document.body
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
        <span>{selectedRegion.flag}</span>
        <span>{selectedRegion.currencySymbol}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          <div
            className="fixed inset-0 z-[9999]"
            onClick={() => setIsOpen(false)}
          />
          
          <div 
            className="fixed w-64 bg-white border border-neutral-200 rounded-lg shadow-lg z-[10000]"
            style={{
              top: buttonPosition.top,
              left: buttonPosition.left
            }}
          >
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-neutral-100">
                Select Region & Currency
              </div>
              {regions.map((region) => (
                <button
                  key={region.code}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRegionSelect(region);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-neutral-50 transition-colors text-black ${
                    selectedRegion.code === region.code ? "bg-neutral-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{region.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-black font-medium">{region.name}</span>
                      <span className="text-xs text-gray-500">{region.currency} {region.currencySymbol}</span>
                    </div>
                  </div>
                  {selectedRegion.code === region.code && (
                    <svg className="w-5 h-5 text-[#c59862]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

