// Standalone analytics tracking functions
// These can be used in contexts without circular dependencies

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

export type EventType = 
  | 'PAGE_VIEW'
  | 'CTA_CLICK'
  | 'VIDEO_PLAY'
  | 'DOWNLOAD_BROCHURE'
  | 'FORM_SUBMIT'
  | 'PRODUCT_VIEW'
  | 'ADD_TO_CART'
  | 'BEGIN_CHECKOUT'
  | 'TRUST_YOUR_EARS_VOTE'
  | 'ENQUIRY_START'
  | 'ENQUIRY_SUBMIT'
  | 'PRODUCT_REVISIT'
  | 'BLOG_DEEP_READ';

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

export async function trackEvent(eventType: EventType, eventData?: EventData) {
  if (typeof window === 'undefined') return;

  const sessionId = getSessionId();
  if (!sessionId) return;

  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        eventData,
        path: window.location.pathname,
        sessionId,
        referrer: document.referrer || null,
      }),
    });
  } catch (error) {
    // Silently fail
    console.debug('[Analytics] Failed to track event:', error);
  }
}

export function trackProductView(productHandle: string, collection?: string) {
  const views = getProductViews();
  const isRevisit = views[productHandle] && views[productHandle] > 0;
  
  views[productHandle] = (views[productHandle] || 0) + 1;
  setProductViews(views);

  if (isRevisit) {
    trackEvent('PRODUCT_REVISIT', { productHandle, collection });
  } else {
    trackEvent('PRODUCT_VIEW', { productHandle, collection });
  }
}

export function trackAddToCart(productHandle: string, value?: number) {
  trackEvent('ADD_TO_CART', { productHandle, value });
}

export function trackBeginCheckout(value?: number) {
  trackEvent('BEGIN_CHECKOUT', { value });
}

export function trackFormSubmit(formType: string) {
  trackEvent('FORM_SUBMIT', { formType });
}

export function trackCtaClick(ctaName: string) {
  trackEvent('CTA_CLICK', { ctaName });
}

export function trackVideoPlay(videoId: string) {
  trackEvent('VIDEO_PLAY', { videoId });
}

export function trackBrochureDownload(brochureId: string) {
  trackEvent('DOWNLOAD_BROCHURE', { brochureId });
}

export function trackEnquiryStart(formType?: string) {
  trackEvent('ENQUIRY_START', { formType });
}

export function trackEnquirySubmit(formType?: string) {
  trackEvent('ENQUIRY_SUBMIT', { formType });
}

export function trackTrustYourEarsVote(albumId: string) {
  trackEvent('TRUST_YOUR_EARS_VOTE', { albumId });
}
