'use client';

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      execute: (container: HTMLElement | string, options?: TurnstileOptions) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'invisible';
  execution?: 'render' | 'execute';
}

export interface TurnstileRef {
  execute: () => Promise<string>;
  reset: () => void;
}

interface TurnstileProps {
  onVerify?: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

// Invisible Turnstile - executes on demand (when form submits)
export const TurnstileInvisible = forwardRef<TurnstileRef, TurnstileProps>(
  function TurnstileInvisible({ onVerify, onError, onExpire }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const resolveRef = useRef<((token: string) => void) | null>(null);
    const rejectRef = useRef<((error: Error) => void) | null>(null);

    const handleCallback = useCallback((token: string) => {
      onVerify?.(token);
      resolveRef.current?.(token);
      resolveRef.current = null;
      rejectRef.current = null;
    }, [onVerify]);

    const handleError = useCallback(() => {
      onError?.();
      rejectRef.current?.(new Error('Turnstile verification failed'));
      resolveRef.current = null;
      rejectRef.current = null;
    }, [onError]);

    const handleExpire = useCallback(() => {
      onExpire?.();
    }, [onExpire]);

    useEffect(() => {
      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
      if (!siteKey || !containerRef.current) return;

      const initWidget = () => {
        if (!containerRef.current || !window.turnstile) return;
        
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch (e) {
            // Ignore
          }
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          size: 'invisible',
          execution: 'execute',
          callback: handleCallback,
          'error-callback': handleError,
          'expired-callback': handleExpire,
        });
      };

      if (window.turnstile) {
        initWidget();
      } else {
        // Load script if not present
        const existingScript = document.querySelector('script[src*="turnstile"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
          script.async = true;
          window.onTurnstileLoad = initWidget;
          document.head.appendChild(script);
        } else {
          existingScript.addEventListener('load', initWidget);
        }
      }

      return () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch (e) {
            // Ignore
          }
        }
      };
    }, [handleCallback, handleError, handleExpire]);

    useImperativeHandle(ref, () => ({
      execute: () => {
        return new Promise<string>((resolve, reject) => {
          if (!widgetIdRef.current || !window.turnstile) {
            // If Turnstile not configured, resolve with empty string (will skip verification)
            const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
            if (!siteKey) {
              resolve('');
              return;
            }
            reject(new Error('Turnstile not initialized'));
            return;
          }
          
          resolveRef.current = resolve;
          rejectRef.current = reject;
          
          // Set a timeout in case turnstile doesn't respond
          setTimeout(() => {
            if (resolveRef.current) {
              rejectRef.current?.(new Error('Verification timed out'));
              resolveRef.current = null;
              rejectRef.current = null;
            }
          }, 10000);
          
          window.turnstile.execute(widgetIdRef.current);
        });
      },
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }));

    return <div ref={containerRef} className="hidden" />;
  }
);

// Legacy visible Turnstile (keeping for backwards compatibility)
export function Turnstile({ 
  onVerify, 
  onError, 
  onExpire, 
}: TurnstileProps & { onVerify: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey || !containerRef.current) return;

    const initWidget = () => {
      if (!containerRef.current || !window.turnstile) return;
      
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore
        }
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        'error-callback': onError,
        'expired-callback': onExpire,
        theme: 'light',
        size: 'normal',
      });
    };

    if (window.turnstile) {
      initWidget();
    } else {
      const existingScript = document.querySelector('script[src*="turnstile"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
        script.async = true;
        window.onTurnstileLoad = initWidget;
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', initWidget);
      }
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore
        }
      }
    };
  }, [onVerify, onError, onExpire]);

  return (
    <div 
      ref={containerRef} 
      className="cf-turnstile min-h-[65px] flex items-center justify-center"
    />
  );
}
