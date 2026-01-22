'use client';

import { createContext, useContext, useEffect, useRef, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Event types
export type EventType = 
  | 'PAGE_VIEW'
  | 'CTA_CLICK'
  | 'VIDEO_PLAY'
  | 'DOWNLOAD_BROCHURE'
  | 'DOWNLOAD_PLAN'
  | 'FORM_SUBMIT'
  | 'PRODUCT_VIEW'
  | 'ADD_TO_CART'
  | 'BEGIN_CHECKOUT'
  | 'TRUST_YOUR_EARS_VOTE'
  | 'ENQUIRY_START'
  | 'ENQUIRY_SUBMIT'
  | 'PRODUCT_REVISIT'
  | 'BLOG_DEEP_READ';

// Event data interface
export interface EventData {
  productHandle?: string;
  collection?: string;
  formType?: string;
  ctaName?: string;
  videoId?: string;
  brochureId?: string;
  albumId?: string;
  value?: number;
  [key: string]: any;
}

interface AnalyticsContextType {
  trackEvent: (eventType: EventType, eventData?: EventData) => void;
  trackPageView: () => void;
  trackProductView: (productHandle: string, collection?: string) => void;
  trackAddToCart: (productHandle: string, value?: number) => void;
  trackBeginCheckout: (value?: number) => void;
  trackFormSubmit: (formType: string) => void;
  trackCtaClick: (ctaName: string) => void;
  trackVideoPlay: (videoId: string) => void;
  trackBrochureDownload: (brochureId: string) => void;
  trackEnquiryStart: (formType?: string) => void;
  trackEnquirySubmit: (formType?: string) => void;
  trackTrustYourEarsVote: (albumId: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// Session ID management
const SESSION_KEY = 'lowther_analytics_session';
const PRODUCT_VIEWS_KEY = 'lowther_product_views';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// Track product revisits
function getProductViews(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(PRODUCT_VIEWS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function setProductViews(views: Record<string, number>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRODUCT_VIEWS_KEY, JSON.stringify(views));
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);
  const sessionId = useRef<string>('');

  // Initialize session ID on mount
  useEffect(() => {
    sessionId.current = getSessionId();
  }, []);

  // Core tracking function
  const trackEvent = useCallback(async (eventType: EventType, eventData?: EventData) => {
    // Skip tracking for admin pages
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return;
    }

    if (!sessionId.current) {
      sessionId.current = getSessionId();
    }

    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          eventData,
          path: window.location.pathname,
          sessionId: sessionId.current,
          referrer: document.referrer || null,
        }),
      });
    } catch (error) {
      // Silently fail - don't impact user experience
      console.debug('[Analytics] Failed to track event:', error);
    }
  }, []);

  // Page view tracking
  const trackPageView = useCallback(() => {
    trackEvent('PAGE_VIEW');
  }, [trackEvent]);

  // Auto-track page views on route change
  useEffect(() => {
    if (pathname && pathname !== lastTrackedPath.current) {
      lastTrackedPath.current = pathname;
      trackPageView();
    }
  }, [pathname, trackPageView]);

  // Product view tracking with revisit detection
  const trackProductView = useCallback((productHandle: string, collection?: string) => {
    const views = getProductViews();
    const isRevisit = views[productHandle] && views[productHandle] > 0;
    
    // Update view count
    views[productHandle] = (views[productHandle] || 0) + 1;
    setProductViews(views);

    if (isRevisit) {
      trackEvent('PRODUCT_REVISIT', { productHandle, collection });
    } else {
      trackEvent('PRODUCT_VIEW', { productHandle, collection });
    }
  }, [trackEvent]);

  // Add to cart
  const trackAddToCart = useCallback((productHandle: string, value?: number) => {
    trackEvent('ADD_TO_CART', { productHandle, value });
  }, [trackEvent]);

  // Begin checkout
  const trackBeginCheckout = useCallback((value?: number) => {
    trackEvent('BEGIN_CHECKOUT', { value });
  }, [trackEvent]);

  // Form submit
  const trackFormSubmit = useCallback((formType: string) => {
    trackEvent('FORM_SUBMIT', { formType });
  }, [trackEvent]);

  // CTA click
  const trackCtaClick = useCallback((ctaName: string) => {
    trackEvent('CTA_CLICK', { ctaName });
  }, [trackEvent]);

  // Video play
  const trackVideoPlay = useCallback((videoId: string) => {
    trackEvent('VIDEO_PLAY', { videoId });
  }, [trackEvent]);

  // Brochure download
  const trackBrochureDownload = useCallback((brochureId: string) => {
    trackEvent('DOWNLOAD_BROCHURE', { brochureId });
  }, [trackEvent]);

  // Enquiry start
  const trackEnquiryStart = useCallback((formType?: string) => {
    trackEvent('ENQUIRY_START', { formType });
  }, [trackEvent]);

  // Enquiry submit
  const trackEnquirySubmit = useCallback((formType?: string) => {
    trackEvent('ENQUIRY_SUBMIT', { formType });
  }, [trackEvent]);

  // Trust Your Ears vote
  const trackTrustYourEarsVote = useCallback((albumId: string) => {
    trackEvent('TRUST_YOUR_EARS_VOTE', { albumId });
  }, [trackEvent]);

  return (
    <AnalyticsContext.Provider
      value={{
        trackEvent,
        trackPageView,
        trackProductView,
        trackAddToCart,
        trackBeginCheckout,
        trackFormSubmit,
        trackCtaClick,
        trackVideoPlay,
        trackBrochureDownload,
        trackEnquiryStart,
        trackEnquirySubmit,
        trackTrustYourEarsVote,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
