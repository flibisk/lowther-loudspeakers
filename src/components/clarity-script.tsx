'use client';

import { useEffect } from 'react';

export function ClarityScript() {
  useEffect(() => {
    // Check if user has accepted cookies
    const consent = localStorage.getItem('cookie-consent');
    
    if (consent === 'accepted') {
      // Only load Clarity if consent is given
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
    }
  }, []);

  return null;
}

