'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

const META_PIXEL_ID = '647785281372922';

export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // Respect cookie consent
    const consent = typeof window !== 'undefined' ? localStorage.getItem('cookie-consent') : null;
    if (consent !== 'accepted') {
      return;
    }

    // Load Meta Pixel once
    if (typeof window !== 'undefined' && !(window as any).fbq) {
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          // @ts-ignore
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        // @ts-ignore
        n.push = n;
        // @ts-ignore
        n.loaded = true;
        // @ts-ignore
        n.version = '2.0';
        // @ts-ignore
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = 'https://connect.facebook.net/en_US/fbevents.js';
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      (window as any).fbq?.('init', META_PIXEL_ID);
      (window as any).fbq?.('track', 'PageView');
    } else {
      // Already loaded: still track the page view on mount if consent is present
      (window as any).fbq?.('track', 'PageView');
    }
  }, []);

  // Track route changes as additional page views
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}


