"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "United Kingdom (English)", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

interface LanguageSelectorProps {
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
  isMobile?: boolean;
}

export function LanguageSelector({ currentLanguage = "en", onLanguageChange, isMobile = false }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find(lang => lang.code === currentLanguage) || languages[0]
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  // Update selected language when currentLanguage prop changes
  useEffect(() => {
    const newSelectedLanguage = languages.find(lang => lang.code === currentLanguage) || languages[0];
    setSelectedLanguage(newSelectedLanguage);
  }, [currentLanguage]);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange(language.code);
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
          <span>{selectedLanguage.flag}</span>
          <span>{selectedLanguage.code.toUpperCase()}</span>
        </button>

        {isOpen && typeof document !== 'undefined' && createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[9999]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div 
              className="fixed w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-[10000]"
              style={{
                top: buttonPosition.top,
                left: buttonPosition.left
              }}
            >
              <div className="py-1">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLanguageSelect(language);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-neutral-50 transition-colors text-black ${
                      selectedLanguage.code === language.code ? "bg-neutral-50 font-medium" : ""
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-black">{language.name}</span>
                    {selectedLanguage.code === language.code && (
                      <svg className="w-4 h-4 ml-auto text-black" fill="currentColor" viewBox="0 0 20 20">
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
        className="flex items-center gap-2 text-sm font-medium text-white hover:text-black hover:bg-white px-2 py-1 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{selectedLanguage.flag}</span>
        <span>{selectedLanguage.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9999]"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div 
            className="fixed w-56 bg-white border border-neutral-200 rounded-lg shadow-lg z-[10000]"
            style={{
              top: buttonPosition.top,
              left: buttonPosition.left
            }}
          >
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLanguageSelect(language);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-neutral-50 transition-colors text-black ${
                    selectedLanguage.code === language.code ? "bg-neutral-50 font-medium" : ""
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="text-black">{language.name}</span>
                  {selectedLanguage.code === language.code && (
                    <svg className="w-4 h-4 ml-auto text-black" fill="currentColor" viewBox="0 0 20 20">
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
