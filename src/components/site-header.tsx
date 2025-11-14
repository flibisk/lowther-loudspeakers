'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Menu } from 'lucide-react';
import { LanguageSelectorSimple } from '@/components/language-selector-simple';
import { CurrencySelector } from '@/components/currency-selector';
import { BookAppointmentForm } from '@/components/forms/book-appointment-form';
import { ContactForm } from '@/components/forms/contact-form';
import { PointsOfSaleForm } from '@/components/forms/points-of-sale-form';
import { MobileMenu } from '@/components/mobile-menu';
import { CartOverlay } from '@/components/cart-overlay';
import { useCurrency } from '@/contexts/currency-context';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';

type Props = {
  nav: Array<{ label: string; href: string; children?: Array<{ label: string; href: string; desc?: string }> }>;
};

export default function SiteHeader({ nav }: Props) {
  const pathname = usePathname();
  const { setCurrency, setLanguage, language, currency } = useCurrency();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [onDark, setOnDark] = useState(true); // assume hero is dark
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [bookAppointmentOpen, setBookAppointmentOpen] = useState(false);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [pointsOfSaleOpen, setPointsOfSaleOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const handleDropdownClick = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleCurrencyChange = (newCurrency: string, newRegion: string) => {
    setCurrency(newCurrency, newRegion);
  };

  // Image mapping for individual link hover states
  const menuImages = {
    // Masterpieces
    'acousta-qw': '/images/Menu/masterpieces/acousta-qw.jpg',
    'acousta-quarter-wave': '/images/Menu/masterpieces/acousta-qw.jpg',
    'acousta-117': '/images/Menu/masterpieces/acousta-117.jpg',
    'edilia': '/images/Menu/masterpieces/edilia.jpg',
    'almira': '/images/Menu/masterpieces/almira.jpg',
    'tp2': '/images/Menu/masterpieces/tp2.jpg',
    'audiovector': '/images/Menu/masterpieces/audiovector.jpg',
    'hegeman': '/images/Menu/masterpieces/hegeman.jpg',
    'voigt-horn': '/images/Menu/masterpieces/voigt-horn.jpg',
    
    // Instruments
    'concert-collection': '/images/Menu/instruments/concert-collection.jpg',
    'sinfonia-collection': '/images/Menu/instruments/sinfonia-collection.jpg',
    'philharmonic-collection': '/images/Menu/instruments/philharmonic-collection.jpg',
    'grand-opera-collection': '/images/Menu/instruments/grand-opera-collection.jpg',
    'super-tweeter': '/images/drive-units/super-tweeter/gallery/Super Tweeter - Product Image.jpg',
    
    // Ensemble - Fixed paths
    'px4-amplifier': '/images/Menu/Ensemble/PX4-Amplifier.avif',
    'reference-cables': '/images/Menu/Ensemble/Reference-Cables.avif',
    'phase-equalisers': '/images/Menu/Ensemble/Phase-Plugs.webp',
    'lowther-badges': '/images/Menu/Ensemble/Lowther-badges.avif',
    'white-glove-residential': '/images/Menu/Ensemble/White-Glove-residential.avif',
    'white-glove-commercial': '/images/Menu/Ensemble/Commercial-white-glove.avif',
    
    // Brand
    'history': '/images/Menu/brand/history.jpg',
    'handcrafted': '/images/Menu/brand/handcrafted.jpg',
    'lasting-legacy': '/images/Menu/brand/lasting-legacy.jpg',
    'paul-voigt-era': '/images/Menu/brand/paul-voigt-era.jpg',
    'donald-chave-era': '/images/Menu/brand/donald-chave-era.jpg',
    
    // Speaker Making
    'our-craft': '/images/Menu/speaker-making/our-craft.jpg',
    'build-your-own': '/images/Menu/speaker-making/build-your-own.jpg',
    
    // Services
    'refurbishments-upgrades': '/images/Menu/services/vintage-repairs.jpg',
    'warranty': '/images/Menu/services/warranty.jpg',
    'authenticity-checker': '/images/Menu/services/authenticity-checker.jpg',
    'listening-rooms': '/images/Menu/services/listening-rooms.jpg',
    'order-catalogue': '/images/Menu/services/order-catalogue.jpg',
    'oem-opportunities': '/images/Menu/services/oem-opportunities.jpg'
  };

  const lastYRef = useRef(0);
  const [y, setY] = useState(0);
  const [yDebounced] = useDebounceValue(y, 60);

  // Scroll direction hide / reveal
  useEffect(() => {
    const onScroll = () => setY(window.scrollY || 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Keep header always visible for e-commerce experience
    setHidden(false);
    lastYRef.current = yDebounced;
  }, [yDebounced]);

  // Intersection observers to control transparency and colour inversion
  useEffect(() => {
    const header = document.getElementById('site-header');
    const heroSentinel = document.getElementById('hero-sentinel');
    const themeSentinels = document.querySelectorAll<HTMLElement>('[data-surface]');

    if (!header || !heroSentinel) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        setSolid(!entry.isIntersecting);
      },
      { rootMargin: '-1px 0px 0px 0px', threshold: 0 }
    );

    const themeObserver = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio - a.intersectionRatio))[0];

        if (top) {
          const surface = (top.target as HTMLElement).dataset.surface;
          setOnDark(surface === 'dark');
        }
      },
      { rootMargin: '-64px 0px -80% 0px', threshold: [0, 0.1, 0.25, 0.5] }
    );

    heroObserver.observe(heroSentinel);
    themeSentinels.forEach(s => themeObserver.observe(s));

    return () => {
      heroObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <>
      {/* Utility Navigation Bar - Hidden on mobile */}
      <div
        className={clsx(
            'hidden 930:block fixed inset-x-0 top-0 z-50 transition-transform duration-300 will-change-transform',
            hidden ? '-translate-y-[200%]' : 'translate-y-0',
          'bg-neutral-900 text-white text-sm'
        )}
      >
        <div className="w-full px-6 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-10">
            {/* Left Side - Language & Currency Selectors */}
            <div className="flex items-center gap-3">
              <LanguageSelectorSimple 
                currentLanguage={language} 
                onLanguageChange={handleLanguageChange}
              />
              <div className="h-4 w-px bg-neutral-700" />
              <CurrencySelector 
                currentCurrency={currency} 
                onCurrencyChange={handleCurrencyChange}
              />
            </div>

            {/* Right Side - Utility Links */}
            <div className="flex items-center space-x-6">
              <Link href="tel:+442083009166" className="flex items-center gap-2 hover:text-neutral-300 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+44 20 8300 9166</span>
              </Link>
              <button 
                onClick={() => setBookAppointmentOpen(true)}
                className="flex items-center gap-2 hover:text-neutral-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Book an appointment</span>
              </button>
              <button 
                onClick={() => setContactFormOpen(true)}
                className="flex items-center gap-2 hover:text-neutral-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact us</span>
              </button>
              <button 
                onClick={() => setPointsOfSaleOpen(true)}
                className="flex items-center gap-2 hover:text-neutral-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Points of Sale</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <header
        id="site-header"
        className={clsx(
            'fixed inset-x-0 top-0 930:top-10 z-50 transition-transform duration-300 will-change-transform',
            hidden ? '-translate-y-[200%]' : 'translate-y-0'
        )}
      >
        <div
          className={clsx(
            'w-full flex h-16 items-center px-6 sm:h-20 sm:px-6 lg:px-8 xl:px-12 transition-colors duration-300',
            solid
              ? 'bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70'
              : 'bg-gradient-to-b from-black/20 via-black/10 to-transparent',
            onDark && !solid ? 'text-white' : 'text-neutral-900'
          )}
        >
          {/* Left Side - Menu & Search */}
          <div className="flex items-center space-x-2">
            <button
              aria-label="Open menu"
              onClick={() => {
                // Check if we're on mobile (screen width < 930px)
                if (window.innerWidth < 930) {
                  setMobileMenuOpen(true);
                } else {
                  setMenuOpen(true);
                }
              }}
              className={clsx(
                'inline-flex items-center justify-center rounded-md p-2 hover:bg-neutral-100 transition-colors',
                onDark && !solid ? 'text-white hover:bg-white/10' : 'text-neutral-900'
              )}
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              aria-label="Search"
              className={clsx(
                'inline-flex items-center justify-center rounded-md p-2 hover:bg-neutral-100 transition-colors',
                onDark && !solid ? 'text-white hover:bg-white/10' : 'text-neutral-900'
              )}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Center - Logo */}
          <div className="flex items-center flex-1 justify-center px-4">
            <Link href="/" className="flex items-center">
              <img
                src="/images/Lowther-logo.svg"
                alt="Lowther Loudspeakers"
                className="h-4 w-auto"
              />
            </Link>
          </div>

          {/* Right Side - User Actions */}
          <div className="flex items-center space-x-1">
            <Link
              href="/account"
              aria-label="Account"
              className={clsx(
                'inline-flex items-center justify-center rounded-md p-2 hover:bg-neutral-100 transition-colors',
                onDark && !solid ? 'text-white hover:bg-white/10' : 'text-neutral-900'
              )}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={clsx(
                'inline-flex items-center justify-center rounded-md p-2 hover:bg-neutral-100 transition-colors relative',
                onDark && !solid ? 'text-white hover:bg-white/10' : 'text-neutral-900'
              )}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c59862] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className={clsx(
                'inline-flex items-center justify-center rounded-md p-2 hover:bg-neutral-100 transition-colors relative',
                onDark && !solid ? 'text-white hover:bg-white/10' : 'text-neutral-900'
              )}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c59862] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen Menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
          {/* Top Header Bar - 100% opacity */}
          <div className="flex items-center justify-between px-6 sm:px-6 lg:px-8 xl:px-12 py-4 border-b border-neutral-800 flex-shrink-0 bg-black">
            {/* Left - Close & Search */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setActiveDropdown(null);
                  setHoveredImage(null);
                }}
                className="text-white hover:text-neutral-300 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button className="text-white hover:text-neutral-300 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Center - Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
                <img
                  src="/images/Lowther-logo.svg"
                  alt="Lowther Loudspeakers"
                  className="h-4 w-auto"
                />
              </Link>
            </div>

            {/* Right - User Actions */}
            <div className="flex items-center space-x-4">
              <Link href="/account" className="text-white hover:text-neutral-300 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link href="/wishlist" className="text-white hover:text-neutral-300 transition-colors relative">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c59862] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="text-white hover:text-neutral-300 transition-colors relative"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c59862] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Menu Content - 90% opacity */}
          <div className="flex min-h-[calc(100vh-80px)] bg-black/90">
            {/* Left Panel - Menu Items */}
            <div className="w-1/3 px-6 sm:px-6 lg:px-8 xl:px-12 py-12">
              <nav className="space-y-4">
                {/* Masterpieces */}
                <div className="animate-slide-in-left">
                  <button 
                    onClick={() => handleDropdownClick('masterpieces')}
                    className="flex items-center justify-between w-full text-left text-white hover:text-neutral-300 transition-colors py-2"
                  >
                    <span className="font-display text-xl">Masterpieces</span>
                    <svg className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'masterpieces' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'masterpieces' && (
                    <div className="mt-2 space-y-2 pl-4">
                      {['Acousta QW', 'Acousta 117', 'Edilia', 'Almira', 'TP2', 'AudioVector', 'Hegeman', 'Voigt Horn'].map((item) => {
                        // Handle specific URL mappings
                        const slugMap: { [key: string]: string } = {
                          'Acousta QW': 'acousta-quarter-wave',
                          'Acousta 117': 'acousta-117',
                          'Edilia': 'edilia',
                          'Almira': 'almira',
                          'TP2': 'tp2',
                          'AudioVector': 'audiovector',
                          'Hegeman': 'hegeman',
                          'Voigt Horn': 'voigt-horn'
                        };
                        const slug = slugMap[item] || item.toLowerCase().replace(/\s+/g, '-');
                        return (
                          <Link 
                            key={item} 
                            href={`/loudspeakers/${slug}`} 
                            className="block text-neutral-400 hover:text-white transition-colors py-1" 
                            onClick={() => setMenuOpen(false)}
                            onMouseEnter={() => setHoveredImage(menuImages[slug as keyof typeof menuImages])}
                            onMouseLeave={() => setHoveredImage(null)}
                          >
                            {item}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Instruments */}
                <div className="animate-slide-in-left-delay-1">
                  <button 
                    onClick={() => handleDropdownClick('instruments')}
                    className="flex items-center justify-between w-full text-left text-white hover:text-neutral-300 transition-colors py-2"
                  >
                    <span className="font-display text-xl">Instruments</span>
                    <svg className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'instruments' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'instruments' && (
                    <div className="mt-2 space-y-2 pl-4">
                      {['Concert Collection', 'Sinfonia Collection', 'Philharmonic Collection', 'Grand Opera Collection', 'Super Tweeter'].map((item) => {
                        // Handle specific URL mappings
                        const slugMap: { [key: string]: string } = {
                          'Concert Collection': '/collection/concert',
                          'Sinfonia Collection': '/collection/sinfonia',
                          'Philharmonic Collection': '/collection/philharmonic',
                          'Grand Opera Collection': '/collection/grand-opera',
                          'Super Tweeter': '/collection/super-tweeter',
                        };
                        const href = slugMap[item];
                        const menuImageSlug = item.toLowerCase().replace(/\s+/g, '-');
                        return (
                          <Link 
                            key={item} 
                            href={href} 
                            className="block text-neutral-400 hover:text-white transition-colors py-1" 
                            onClick={() => setMenuOpen(false)}
                            onMouseEnter={() => setHoveredImage(menuImages[menuImageSlug as keyof typeof menuImages])}
                            onMouseLeave={() => setHoveredImage(null)}
                          >
                            {item}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Lowther Ensemble */}
                <div className="animate-slide-in-left-delay-2">
                  <button 
                    onClick={() => handleDropdownClick('ensemble')}
                    className="flex items-center justify-between w-full text-left text-white hover:text-neutral-300 transition-colors py-2"
                  >
                    <span className="font-display text-xl">Lowther Ensemble</span>
                    <svg className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'ensemble' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'ensemble' && (
                    <div className="mt-2 space-y-2 pl-4">
                      <Link href="/ensemble/px4-amplifier" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['px4-amplifier'])} onMouseLeave={() => setHoveredImage(null)}>PX4 Tube Amplifier</Link>
                      <Link href="/ensemble/reference-cables" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['reference-cables'])} onMouseLeave={() => setHoveredImage(null)}>Lowther Reference Cables</Link>
                      <Link href="/ensemble/phase-plugs" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['phase-equalisers'])} onMouseLeave={() => setHoveredImage(null)}>Phase Plugs</Link>
                      <Link href="/ensemble/lowther-badges" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['lowther-badges'])} onMouseLeave={() => setHoveredImage(null)}>Lowther Badges</Link>
                      <Link href="/ensemble/residential-system-design" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['white-glove-residential'])} onMouseLeave={() => setHoveredImage(null)}>Residential System Design</Link>
                      <Link href="/ensemble/commercial-system-design" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['white-glove-commercial'])} onMouseLeave={() => setHoveredImage(null)}>Commercial System Design</Link>
                    </div>
                  )}
                </div>

                {/* The Brand */}
                <div className="animate-slide-in-left-delay-3">
                  <button 
                    onClick={() => handleDropdownClick('brand')}
                    className="flex items-center justify-between w-full text-left text-white hover:text-neutral-300 transition-colors py-2"
                  >
                    <span className="font-display text-xl">The Brand</span>
                    <svg className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'brand' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'brand' && (
                    <div className="mt-2 space-y-2 pl-4">
                      <Link href="/history" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages.history)} onMouseLeave={() => setHoveredImage(null)}>History</Link>
                      <Link href="/brand/handcrafted" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages.handcrafted)} onMouseLeave={() => setHoveredImage(null)}>Handcrafted</Link>
                      <Link href="/brand/lasting-legacy" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['lasting-legacy'])} onMouseLeave={() => setHoveredImage(null)}>Lasting Legacy</Link>
                      <Link href="/brand/paul-voigt-era" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['paul-voigt-era'])} onMouseLeave={() => setHoveredImage(null)}>Paul Voigt Era</Link>
                      <Link href="/brand/donald-chave-era" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['donald-chave-era'])} onMouseLeave={() => setHoveredImage(null)}>Donald Chave Era</Link>
                    </div>
                  )}
                </div>

                {/* Speaker Making */}
                <div className="animate-slide-in-left-delay-4">
                  <button 
                    onClick={() => handleDropdownClick('speaker-making')}
                    className="flex items-center justify-between w-full text-left text-white hover:text-neutral-300 transition-colors py-2"
                  >
                    <span className="font-display text-xl">Speaker Making</span>
                    <svg className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'speaker-making' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'speaker-making' && (
                    <div className="mt-2 space-y-2 pl-4">
                      <Link href="/brand/our-craft" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['our-craft'])} onMouseLeave={() => setHoveredImage(null)}>Our Craft</Link>
                      <Link href="/build-a-lowther" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['build-your-own'])} onMouseLeave={() => setHoveredImage(null)}>Build Your Own</Link>
                    </div>
                  )}
                </div>

                {/* Services */}
                <div className="animate-slide-in-left-delay-5">
                  <button 
                    onClick={() => handleDropdownClick('services')}
                    className="flex items-center justify-between w-full text-left text-white hover:text-neutral-300 transition-colors py-2"
                  >
                    <span className="font-display text-xl">Services</span>
                    <svg className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'services' && (
                    <div className="mt-2 space-y-2 pl-4">
                      <Link href="/services/refurbishments-upgrades" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['refurbishments-upgrades'])} onMouseLeave={() => setHoveredImage(null)}>Refurbishments & Upgrades</Link>
                      <Link href="/warranty" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages.warranty)} onMouseLeave={() => setHoveredImage(null)}>Warranty</Link>
                      <Link href="/verify" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['authenticity-checker'])} onMouseLeave={() => setHoveredImage(null)}>Authenticity Checker</Link>
                      <Link href="/services/listening-rooms" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['listening-rooms'])} onMouseLeave={() => setHoveredImage(null)}>Listening Rooms</Link>
                      <Link href="/catalogue" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['order-catalogue'])} onMouseLeave={() => setHoveredImage(null)}>Order a Catalogue</Link>
                      <Link href="/services/oem-opportunities" className="block text-neutral-400 hover:text-white transition-colors py-1" onClick={() => setMenuOpen(false)} onMouseEnter={() => setHoveredImage(menuImages['oem-opportunities'])} onMouseLeave={() => setHoveredImage(null)}>OEM Opportunities</Link>
                    </div>
                  )}
                </div>

                {/* Our Blog */}
                <Link 
                  href="/blog" 
                  className="block text-white hover:text-neutral-300 transition-colors font-display text-xl py-2 animate-slide-in-left-delay-6" 
                  onClick={() => setMenuOpen(false)}
                >
                  Our Blog
                      </Link>

                {/* Contact Us */}
                <button 
                  onClick={() => {
                    setMenuOpen(false);
                    setContactFormOpen(true);
                  }}
                  className="block text-white hover:text-neutral-300 transition-colors font-display text-xl py-2 animate-slide-in-left-delay-7 text-left"
                >
                  Contact Us
                </button>
              </nav>
            </div>

            {/* Right Panel - Image */}
            <div className="w-2/3 relative overflow-hidden flex items-center justify-center">
              {hoveredImage && (
                <div className="relative w-3/4 h-3/4">
                  <img 
                    src={hoveredImage} 
                    alt="Menu preview" 
                    className="w-full h-full object-cover opacity-0 animate-fade-in rounded-lg"
                  />
                  </div>
                )}
              </div>
          </div>
      </div>
      )}

      {/* Form Overlays */}
      <BookAppointmentForm 
        isOpen={bookAppointmentOpen} 
        onClose={() => setBookAppointmentOpen(false)} 
      />
      <ContactForm 
        isOpen={contactFormOpen} 
        onClose={() => setContactFormOpen(false)} 
      />
      <PointsOfSaleForm 
        isOpen={pointsOfSaleOpen} 
        onClose={() => setPointsOfSaleOpen(false)} 
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        menuItems={[
          {
            label: 'Masterpieces',
            children: [
              { label: 'Acousta QW', href: '/loudspeakers/acousta-quarter-wave', image: '/images/Menu/masterpieces/acousta-qw.jpg' },
              { label: 'Acousta 117', href: '/loudspeakers/acousta-117', image: '/images/Menu/masterpieces/acousta-117.jpg' },
              { label: 'Edilia', href: '/loudspeakers/edilia', image: '/images/Menu/masterpieces/edilia.jpg' },
              { label: 'Almira', href: '/loudspeakers/almira', image: '/images/Menu/masterpieces/almira.jpg' },
              { label: 'TP2', href: '/loudspeakers/tp2', image: '/images/Menu/masterpieces/tp2.jpg' },
              { label: 'AudioVector', href: '/loudspeakers/audiovector', image: '/images/Menu/masterpieces/audiovector.jpg' },
              { label: 'Hegeman', href: '/loudspeakers/hegeman', image: '/images/Menu/masterpieces/hegeman.jpg' },
              { label: 'Voigt Horn', href: '/loudspeakers/voigt-horn', image: '/images/Menu/masterpieces/voigt-horn.jpg' },
            ]
          },
          {
            label: 'Instruments',
            children: [
              { label: 'Concert Collection', href: '/collection/concert', image: '/images/Menu/instruments/concert-collection.jpg' },
              { label: 'Sinfonia Collection', href: '/collection/sinfonia', image: '/images/Menu/instruments/sinfonia-collection.jpg' },
              { label: 'Philharmonic Collection', href: '/collection/philharmonic', image: '/images/Menu/instruments/philharmonic-collection.jpg' },
              { label: 'Grand Opera Collection', href: '/collection/grand-opera', image: '/images/Menu/instruments/grand-opera-collection.jpg' },
              { label: 'Super Tweeter', href: '/collection/super-tweeter', image: '/images/drive-units/super-tweeter/gallery/Super Tweeter - Product Image.jpg' },
            ]
          },
          {
            label: 'Lowther Ensemble',
            children: [
              { label: 'PX4 Tube Amplifier', href: '/ensemble/px4-amplifier', image: '/images/Menu/Ensemble/PX4-Amplifier.avif' },
              { label: 'Lowther Reference Cables', href: '/ensemble/reference-cables', image: '/images/Menu/Ensemble/Reference-Cables.avif' },
              { label: 'Phase Plugs', href: '/ensemble/phase-plugs', image: '/images/Menu/Ensemble/Phase-Plugs.webp' },
              { label: 'Lowther Badges', href: '/ensemble/lowther-badges', image: '/images/Menu/Ensemble/Lowther-badges.avif' },
              { label: 'Residential System Design', href: '/ensemble/residential-system-design', image: '/images/Menu/Ensemble/White-Glove-residential.avif' },
              { label: 'Commercial System Design', href: '/ensemble/commercial-system-design', image: '/images/Menu/Ensemble/Commercial-white-glove.avif' },
            ]
          },
          {
            label: 'The Brand',
            children: [
              { label: 'History', href: '/history', image: '/images/Menu/brand/history.jpg' },
              { label: 'Handcrafted', href: '/brand/handcrafted', image: '/images/Menu/brand/handcrafted.jpg' },
              { label: 'Lasting Legacy', href: '/brand/lasting-legacy', image: '/images/Menu/brand/lasting-legacy.jpg' },
              { label: 'Paul Voigt Era', href: '/brand/paul-voigt-era', image: '/images/Menu/brand/paul-voigt-era.jpg' },
              { label: 'Donald Chave Era', href: '/brand/donald-chave-era', image: '/images/Menu/brand/donald-chave-era.jpg' },
            ]
          },
          {
            label: 'Speaker Making',
            children: [
              { label: 'Our Craft', href: '/brand/our-craft', image: '/images/Menu/speaker-making/our-craft.jpg' },
              { label: 'Build Your Own', href: '/build-a-lowther', image: '/images/Menu/speaker-making/build-your-own.jpg' },
            ]
          },
          {
            label: 'Services',
            children: [
              { label: 'Refurbishments & Upgrades', href: '/services/refurbishments-upgrades', image: '/images/Menu/services/vintage-repairs.jpg' },
              { label: 'Warranty', href: '/warranty', image: '/images/Menu/services/warranty.jpg' },
              { label: 'Authenticity Checker', href: '/verify', image: '/images/Menu/services/authenticity-checker.jpg' },
              { label: 'Listening Rooms', href: '/services/listening-rooms', image: '/images/Menu/services/listening-rooms.jpg' },
              { label: 'Order a Catalogue', href: '/catalogue', image: '/images/Menu/services/order-catalogue.jpg' },
              { label: 'OEM Opportunities', href: '/services/oem-opportunities', image: '/images/Menu/services/oem-opportunities.jpg' },
            ]
          },
          {
            label: 'Our Blog',
            href: '/blog'
          },
          {
            label: 'Contact Us',
            href: '/contact'
          },
        ]}
        currentLanguage={language}
        currentCurrency={currency}
        onLanguageChange={handleLanguageChange}
        onCurrencyChange={handleCurrencyChange}
      />

      {/* Cart Overlay */}
      <CartOverlay isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
