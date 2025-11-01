"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/language-selector";
import { Menu, Search, User, Heart, ShoppingBag, Phone, Calendar, Mail, MapPin } from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Loudspeakers", href: "/category/loudspeakers" },
  { name: "Drive Units", href: "/category/drive-units" },
  { name: "Cables", href: "/category/cables" },
  { name: "Build", href: "/build-a-lowther" },
  { name: "Blog", href: "/blog" },
  { name: "Listen", href: "/listen" },
  { name: "Our Brand", href: "/brand/handcrafted" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    // TODO: Implement actual language switching logic
  };

  return (
    <>
      {/* Utility Navigation Bar */}
      <div className="bg-neutral-900 text-white text-sm">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-10">
            {/* Left Side - Language Selector */}
            <div className="flex items-center">
              <LanguageSelector 
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>

            {/* Right Side - Utility Links */}
            <div className="flex items-center space-x-6">
              <Link href="tel:+441234567890" className="flex items-center gap-2 hover:text-neutral-300 transition-colors">
                <Phone className="w-4 h-4" />
                <span>+44 1234 567890</span>
              </Link>
              <Link href="/contact?subject=Appointment" className="flex items-center gap-2 hover:text-neutral-300 transition-colors">
                <Calendar className="w-4 h-4" />
                <span>Book an appointment</span>
              </Link>
              <Link href="/contact" className="flex items-center gap-2 hover:text-neutral-300 transition-colors">
                <Mail className="w-4 h-4" />
                <span>Contact us</span>
              </Link>
              <Link href="/contact?subject=Dealers" className="flex items-center gap-2 hover:text-neutral-300 transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Points of Sale</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <header className="sticky top-10 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-neutral-200">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Menu & Search */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMainMenuOpen(true)}
                className="p-2 hover:bg-neutral-100"
              >
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open main menu</span>
              </Button>
              <Button variant="ghost" size="icon" className="p-2 hover:bg-neutral-100">
                <Search className="w-5 h-5" />
                <span className="sr-only">Search</span>
              </Button>
            </div>

            {/* Center - Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/Lowther-logo.svg"
                  alt="Lowther Loudspeakers"
                  width={180}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Right Side - User Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="p-2 hover:bg-neutral-100">
                <User className="w-5 h-5" />
                <span className="sr-only">Account</span>
              </Button>
              <Button variant="ghost" size="icon" className="p-2 hover:bg-neutral-100">
                <Heart className="w-5 h-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="p-2 hover:bg-neutral-100 relative"
                asChild
              >
                <Link href="https://shop.lowtherloudspeakers.com" target="_blank" rel="noopener noreferrer">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="sr-only">Shopping cart</span>
                  {/* Cart count badge would go here */}
                  {/* <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span> */}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Menu Overlay - Placeholder for now */}
      {isMainMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsMainMenuOpen(false)}>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center">
              <h2 className="text-2xl font-display font-bold mb-4">Main Menu</h2>
              <p className="text-neutral-600 mb-6">Full-page menu coming soon...</p>
              <Button onClick={() => setIsMainMenuOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}