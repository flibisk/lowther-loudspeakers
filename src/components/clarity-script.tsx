'use client';

import { useEffect } from 'react';

export function ClarityScript() {
  useEffect(() => {
    const loadClarity = () => {
      // Check if user has explicitly rejected cookies
      const consent = localStorage.getItem('cookie-consent');
      
      // Load Clarity by default unless explicitly rejected
      if (consent !== 'rejected') {
        // Only load if not already loaded
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
      } else {
        console.log('Microsoft Clarity blocked - user declined cookies');
      }
    };

    // Load on mount
    loadClarity();

    // Also listen for storage changes (in case consent changes in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookie-consent') {
        // If consent changed to rejected, we can't unload but we can prevent future loads
        // If consent changed from rejected to accepted/null, load Clarity
        if (e.newValue !== 'rejected') {
          loadClarity();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null;
}

