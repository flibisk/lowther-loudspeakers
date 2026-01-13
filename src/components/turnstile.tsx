'use client';

import { useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileOptions {
  sitekey: string;
  callback: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  className?: string;
}

export function Turnstile({ 
  onVerify, 
  onError, 
  onExpire, 
  theme = 'light',
  size = 'normal',
  className = ''
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const scriptLoadedRef = useRef(false);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile) return;
    
    // Remove existing widget if any
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch (e) {
        // Widget might already be removed
      }
    }

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      console.error('Turnstile site key not configured');
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onVerify,
      'error-callback': onError,
      'expired-callback': onExpire,
      theme,
      size,
    });
  }, [onVerify, onError, onExpire, theme, size]);

  useEffect(() => {
    // Check if script is already loaded
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector('script[src*="turnstile"]');
    if (existingScript && !scriptLoadedRef.current) {
      existingScript.addEventListener('load', renderWidget);
      return;
    }

    // Load the script
    if (!scriptLoadedRef.current) {
      scriptLoadedRef.current = true;
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Widget might already be removed
        }
      }
    };
  }, [renderWidget]);

  return (
    <div 
      ref={containerRef} 
      className={`cf-turnstile min-h-[65px] flex items-center justify-center ${className}`}
    />
  );
}

// Server-side verification helper
export async function verifyTurnstileToken(token: string): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.error('Turnstile secret key not configured');
    return { success: false, error: 'Server configuration error' };
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      return { success: true };
    } else {
      console.error('Turnstile verification failed:', data['error-codes']);
      return { success: false, error: 'Verification failed' };
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return { success: false, error: 'Verification request failed' };
  }
}
