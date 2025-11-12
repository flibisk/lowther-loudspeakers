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
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", currency: "AED", currencySymbol: "د.إ" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", currency: "ARS", currencySymbol: "$" },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD", currencySymbol: "A$" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", currency: "BDT", currencySymbol: "৳" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", currency: "BGN", currencySymbol: "лв" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭", currency: "BHD", currencySymbol: ".د.ب" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", currency: "BRL", currencySymbol: "R$" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", currencySymbol: "C$" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", currency: "CHF", currencySymbol: "CHF" },
  { code: "CL", name: "Chile", flag: "🇨🇱", currency: "CLP", currencySymbol: "$" },
  { code: "CN", name: "China", flag: "🇨🇳", currency: "CNY", currencySymbol: "¥" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", currency: "COP", currencySymbol: "$" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷", currency: "CRC", currencySymbol: "₡" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", currency: "CZK", currencySymbol: "Kč" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", currency: "DKK", currencySymbol: "kr" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", currency: "EGP", currencySymbol: "E£" },
  { code: "FR", name: "Eurozone", flag: "🇪🇺", currency: "EUR", currencySymbol: "€" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", currencySymbol: "£" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", currency: "HKD", currencySymbol: "HK$" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", currency: "HRK", currencySymbol: "kn" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", currency: "HUF", currencySymbol: "Ft" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", currency: "IDR", currencySymbol: "Rp" },
  { code: "IL", name: "Israel", flag: "🇮🇱", currency: "ILS", currencySymbol: "₪" },
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", currencySymbol: "₹" },
  { code: "IS", name: "Iceland", flag: "🇮🇸", currency: "ISK", currencySymbol: "kr" },
  { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY", currencySymbol: "¥" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", currency: "KES", currencySymbol: "KSh" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", currency: "KRW", currencySymbol: "₩" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", currency: "KWD", currencySymbol: "د.ك" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", currency: "LKR", currencySymbol: "Rs" },
  { code: "MA", name: "Morocco", flag: "🇲🇦", currency: "MAD", currencySymbol: "د.م." },
  { code: "MX", name: "Mexico", flag: "🇲🇽", currency: "MXN", currencySymbol: "$" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", currency: "MYR", currencySymbol: "RM" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN", currencySymbol: "₦" },
  { code: "NO", name: "Norway", flag: "🇳🇴", currency: "NOK", currencySymbol: "kr" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", currency: "NZD", currencySymbol: "NZ$" },
  { code: "OM", name: "Oman", flag: "🇴🇲", currency: "OMR", currencySymbol: "ر.ع." },
  { code: "PE", name: "Peru", flag: "🇵🇪", currency: "PEN", currencySymbol: "S/." },
  { code: "PH", name: "Philippines", flag: "🇵🇭", currency: "PHP", currencySymbol: "₱" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", currency: "PKR", currencySymbol: "₨" },
  { code: "PL", name: "Poland", flag: "🇵🇱", currency: "PLN", currencySymbol: "zł" },
  { code: "QA", name: "Qatar", flag: "🇶🇦", currency: "QAR", currencySymbol: "ر.ق" },
  { code: "RO", name: "Romania", flag: "🇷🇴", currency: "RON", currencySymbol: "lei" },
  { code: "RU", name: "Russia", flag: "🇷🇺", currency: "RUB", currencySymbol: "₽" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR", currencySymbol: "ر.س" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", currency: "SEK", currencySymbol: "kr" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", currency: "SGD", currencySymbol: "S$" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", currency: "THB", currencySymbol: "฿" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", currency: "TRY", currencySymbol: "₺" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", currency: "TWD", currencySymbol: "NT$" },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", currencySymbol: "$" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", currency: "VND", currencySymbol: "₫" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", currency: "ZAR", currencySymbol: "R" },
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
  const [searchQuery, setSearchQuery] = useState("");
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
    setSearchQuery("");
    if (onCurrencyChange) {
      onCurrencyChange(region.currency, region.code);
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('lowther-currency', region.currency);
      localStorage.setItem('lowther-region', region.code);
    }
  };

  const filteredRegions = regions.filter(region => 
    region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    region.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
    region.currencySymbol.includes(searchQuery)
  );

  const updateButtonPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Use fixed positioning relative to viewport (no scrollY/scrollX needed)
      setButtonPosition({
        top: rect.bottom + 4,
        left: rect.left
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
              onClick={() => {
                setIsOpen(false);
                setSearchQuery("");
              }}
            />
            
            <div 
              className="fixed w-72 bg-white border border-neutral-200 rounded-lg shadow-lg z-[10000] max-h-[500px] flex flex-col"
              style={{
                top: buttonPosition.top,
                left: buttonPosition.left
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
                {filteredRegions.length > 0 ? (
                  filteredRegions.map((region) => (
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
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    No currencies found
                  </div>
                )}
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
            onClick={() => {
              setIsOpen(false);
              setSearchQuery("");
            }}
          />
          
          <div 
            className="fixed w-72 bg-white border border-neutral-200 rounded-lg shadow-lg z-[10000] max-h-[500px] flex flex-col"
            style={{
              top: buttonPosition.top,
              left: buttonPosition.left
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
              {filteredRegions.length > 0 ? (
                filteredRegions.map((region) => (
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
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No currencies found
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}





