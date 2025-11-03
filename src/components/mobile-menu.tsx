"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/language-selector";
import { X, ChevronRight, ChevronLeft, Calendar, MapPin, Globe } from "lucide-react";

interface MenuItem {
  label: string;
  href?: string;
  children?: Array<{
    label: string;
    href: string;
    image?: string;
    desc?: string;
  }>;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

type MenuView = 'main' | 'sub' | 'appointment' | 'locations' | 'languages';

export function MobileMenu({ isOpen, onClose, menuItems, currentLanguage, onLanguageChange }: MobileMenuProps) {
  const [currentView, setCurrentView] = useState<MenuView>('main');
  const [currentSubMenu, setCurrentSubMenu] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Reset view when menu closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('main');
      setCurrentSubMenu(null);
      setFormData({});
    }
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubMenuClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      setCurrentSubMenu(item);
      setCurrentView('sub');
    } else if (item.href) {
      // Handle direct links (like Our Blog, Contact Us)
      if (item.label === 'Our Blog' || item.label === 'Contact Us') {
        window.location.href = item.href;
        onClose();
      }
    }
  };

  const handleBackClick = () => {
    if (currentView === 'sub') {
      setCurrentView('main');
      setCurrentSubMenu(null);
    } else {
      setCurrentView('main');
      setFormData({});
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
    setCurrentView('main');
    setFormData({});
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[30000] bg-black animate-fade-in flex flex-col">
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b border-neutral-800 flex-shrink-0">
          {/* Left Side - Fixed Width */}
          <div className="w-16 flex items-center">
            {currentView === 'main' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-neutral-800 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="text-white hover:bg-[#c59862] hover:text-white p-2 flex items-center gap-2 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Back</span>
              </Button>
            )}
          </div>
          
          {/* Center - Logo or Title */}
          <div className="flex-1 flex justify-center">
            {currentView === 'main' ? (
              <Image
                src="/images/Lowther-logo.svg"
                alt="Lowther"
                width={80}
                height={20}
                className="h-4 w-auto filter brightness-0 invert"
              />
            ) : currentView === 'sub' ? (
              <h2 className="text-white font-display text-lg">
                {currentSubMenu?.label}
              </h2>
            ) : currentView === 'appointment' ? (
              <h2 className="text-white font-display text-lg">Book Appointment</h2>
            ) : currentView === 'locations' ? (
              <h2 className="text-white font-display text-lg">Points of Sale</h2>
            ) : currentView === 'languages' ? (
              <h2 className="text-white font-display text-lg">Languages</h2>
            ) : null}
          </div>

          {/* Right Side - Fixed Width */}
          <div className="w-16 flex items-center justify-end">
            {currentView === 'main' && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-neutral-800 hover:text-white p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {currentView === 'main' ? (
            <div className="px-6 py-8">
              {/* Main Menu Items */}
              <div className="space-y-1">
                {menuItems.map((item, index) => (
                  <button
                    key={item.label}
                    onClick={() => handleSubMenuClick(item)}
                    className="flex items-center justify-between w-full text-left py-4 text-white hover:bg-neutral-900 transition-colors group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="font-display text-lg">{item.label}</span>
                    {item.children && item.children.length > 0 && (
                      <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : currentView === 'sub' ? (
            <div className="px-6 py-8 pb-24">
              {/* Sub Menu Items with Images - Grid Layout */}
              <div className="grid grid-cols-2 gap-4">
                {currentSubMenu?.children?.map((child, index) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onClose}
                    className="block group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-900 mb-3">
                      {child.image ? (
                        <Image
                          src={child.image}
                          alt={child.label}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-neutral-500">
                          <span className="text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-medium text-sm mb-1 text-center">{child.label}</h3>
                    {child.desc && (
                      <p className="text-neutral-400 text-xs text-center">{child.desc}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ) : currentView === 'appointment' ? (
            <div className="px-6 py-8 pb-24">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    I would like to:
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="appointmentType"
                        value="phone"
                        checked={formData.appointmentType === 'phone'}
                        onChange={(e) => handleInputChange('appointmentType', e.target.value)}
                        className="mr-3 text-[#c59862]"
                      />
                      <span className="text-white">Schedule a phone call</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="appointmentType"
                        value="visit"
                        checked={formData.appointmentType === 'visit'}
                        onChange={(e) => handleInputChange('appointmentType', e.target.value)}
                        className="mr-3 text-[#c59862]"
                      />
                      <span className="text-white">Arrange a listening room visit</span>
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Country *</label>
                  <input
                    type="text"
                    value={formData.country || ''}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Preferred Date *</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Preferred Time *</label>
                  <input
                    type="time"
                    value={formData.time || ''}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Additional Message</label>
                  <textarea
                    value={formData.message || ''}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    placeholder="Tell us more about your requirements..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="white"
                    size="lowther"
                    className="w-full"
                  >
                    Submit Appointment Request
                  </Button>
                </div>
              </form>
            </div>
          ) : currentView === 'locations' ? (
            <div className="px-6 py-8 pb-24">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Preferred Location */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Preferred Location *</label>
                  <textarea
                    value={formData.preferredLocation || ''}
                    onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                    rows={3}
                    required
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    placeholder="Please specify your preferred location for points of sale (city, region, country)..."
                  />
                </div>

                {/* Information */}
                <div className="bg-neutral-800 p-4 rounded-lg">
                  <p className="text-sm text-neutral-300 mb-2">
                    <strong>About Points of Sale:</strong>
                  </p>
                  <p className="text-sm text-neutral-400">
                    We're always looking to expand our network of authorized dealers and points of sale. 
                    If you're interested in becoming a Lowther dealer or know of a potential location 
                    that would be suitable for our products, please let us know.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="white"
                    size="lowther"
                    className="w-full"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          ) : currentView === 'languages' ? (
            <div className="px-6 py-8 pb-24">
              <div className="space-y-2">
                {[
                  { code: "en", name: "United Kingdom (English)", flag: "🇬🇧" },
                  { code: "fr", name: "Français", flag: "🇫🇷" },
                  { code: "de", name: "Deutsch", flag: "🇩🇪" },
                  { code: "ja", name: "日本語", flag: "🇯🇵" },
                  { code: "es", name: "Español", flag: "🇪🇸" },
                  { code: "it", name: "Italiano", flag: "🇮🇹" },
                ].map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      onLanguageChange(language.code);
                      setCurrentView('main');
                    }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-neutral-800 transition-colors rounded-lg ${
                      currentLanguage === language.code ? "bg-neutral-800" : ""
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-white">{language.name}</span>
                    {currentLanguage === language.code && (
                      <svg className="w-5 h-5 ml-auto text-[#c59862]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Bottom Navigation - Only show on main view */}
        {currentView === 'main' && (
          <div className="border-t border-neutral-800 px-6 py-4 bg-black flex-shrink-0">
            <div className="flex items-center justify-around">
              {/* Book Appointment */}
              <button
                onClick={() => setCurrentView('appointment')}
                className="flex flex-col items-center gap-2 text-white hover:text-[#c59862] transition-colors group"
              >
                <div className="p-3 rounded-full bg-neutral-800 group-hover:bg-[#c59862] transition-colors">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Book Appointment</span>
              </button>

              {/* Points of Sale */}
              <button
                onClick={() => setCurrentView('locations')}
                className="flex flex-col items-center gap-2 text-white hover:text-[#c59862] transition-colors group"
              >
                <div className="p-3 rounded-full bg-neutral-800 group-hover:bg-[#c59862] transition-colors">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium">Locations</span>
              </button>

              {/* Language Selector */}
              <button
                onClick={() => setCurrentView('languages')}
                className="flex flex-col items-center gap-2 text-white hover:text-[#c59862] transition-colors group"
              >
                <div className="p-3 rounded-full bg-neutral-800 group-hover:bg-[#c59862] transition-colors">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <LanguageSelector 
                  currentLanguage={currentLanguage} 
                  onLanguageChange={onLanguageChange}
                  isMobile={true}
                />
              </button>
            </div>
          </div>
        )}
      </div>

    </>
  );
}
