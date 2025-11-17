'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// EU/UK country codes (GDPR/UK GDPR regions)
const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  // Include UK
  'GB',
];

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isEU, setIsEU] = useState(false);

  useEffect(() => {
    // Allow forcing the banner for testing
    const forceBanner = process.env.NEXT_PUBLIC_FORCE_COOKIE_BANNER === 'true';

    // Check if user has already given consent (with 1-year expiry)
    const consent = localStorage.getItem('cookie-consent');
    const consentDate = localStorage.getItem('cookie-consent-date');
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    const consentValid =
      consent &&
      consentDate &&
      new Date().getTime() - new Date(consentDate).getTime() < oneYearMs;

    if (!forceBanner && consentValid) {
      return; // Don't show banner if valid consent present
    }

    // Check if user is in EU
    // First try to get country from browser locale or IP
    const checkEUCountry = async () => {
      try {
        // Try to get country from IP using a free service
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        
        if (countryCode && EU_COUNTRIES.includes(countryCode)) {
          setIsEU(true);
          setShowBanner(true);
        } else {
          // Fallback: check browser timezone (less accurate but works without API)
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          // Check if timezone suggests EU (rough heuristic)
          const euTimezones = ['Europe/', 'Atlantic/Azores', 'Atlantic/Canary'];
          if (euTimezones.some(tz => timezone.includes(tz))) {
            setIsEU(true);
            setShowBanner(true);
          }
        }
      } catch (error) {
        // If API fails, use timezone as fallback
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const euTimezones = ['Europe/', 'Atlantic/Azores', 'Atlantic/Canary'];
        if (euTimezones.some(tz => timezone.includes(tz))) {
          setIsEU(true);
          setShowBanner(true);
        }
      }
    };

    if (forceBanner) {
      setIsEU(true);
      setShowBanner(true);
    } else {
      checkEUCountry();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    
    // Load Clarity script after consent
    if (typeof window !== 'undefined' && !(window as any).clarity) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "odebd47qny");
      `;
      document.head.appendChild(script);
    }
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner || !isEU) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 shadow-lg animate-slide-in-up">
      <div className="max-w-7xl mx-auto px-6 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Cookie Consent
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We use cookies to enhance your browsing experience, analyse site traffic, and personalise content. 
                  By clicking "Accept All", you consent to our use of cookies. You can also choose to reject non-essential cookies. 
                  For more information, please see our{' '}
                  <a href="/privacy" className="text-[#c59862] hover:underline">
                    Privacy Policy
                  </a>.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              onClick={handleReject}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-sarabun text-xs tracking-[2px] uppercase"
            >
              Reject
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[2px] uppercase"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

