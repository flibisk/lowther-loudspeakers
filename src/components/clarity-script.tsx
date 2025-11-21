'use client';

import { useEffect } from 'react';

export function ClarityScript() {
  useEffect(() => {
    const loadClarity = () => {
      // Check if user has accepted cookies
      const consent = localStorage.getItem('cookie-consent');
      
      if (consent === 'accepted') {
        // Only load Clarity if consent is given and not already loaded
        if (typeof window !== 'undefined' && !(window as any).clarity) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.async = true;
          script.innerHTML = `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "odebd47qny");
          `;
          document.head.appendChild(script);
          console.log('Microsoft Clarity loaded');
        }
      }
    };

    // Load on mount
    loadClarity();

    // Also listen for storage changes (in case consent is accepted in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookie-consent' && e.newValue === 'accepted') {
        loadClarity();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null;
}

