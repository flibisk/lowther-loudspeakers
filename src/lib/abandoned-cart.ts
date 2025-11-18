/**
 * Abandoned Cart Tracking Utility
 * Tracks cart abandonment and sends reminder emails
 */

const ABANDONED_CART_KEY = 'lowther_abandoned_cart';
const ABANDONED_CART_EMAIL_KEY = 'lowther_discount_email';
const ABANDONED_CART_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds
const ABANDONED_CART_DELAY = 60 * 60 * 1000; // 1 hour before sending email

export interface AbandonedCartItem {
  title: string;
  quantity: number;
  price: string;
  image?: string;
  variantId?: string;
}

export interface AbandonedCartData {
  items: AbandonedCartItem[];
  total: string;
  timestamp: number;
  email?: string;
  cartId?: string;
  emailSent?: boolean;
}

/**
 * Save cart data for abandoned cart tracking
 */
export function saveAbandonedCartData(
  items: AbandonedCartItem[],
  total: string,
  cartId?: string
): void {
  if (typeof window === 'undefined') return;

  const email = localStorage.getItem(ABANDONED_CART_EMAIL_KEY);
  
  const cartData: AbandonedCartData = {
    items,
    total,
    timestamp: Date.now(),
    email: email || undefined,
    cartId,
    emailSent: false,
  };

  localStorage.setItem(ABANDONED_CART_KEY, JSON.stringify(cartData));
}

/**
 * Clear abandoned cart data (when cart is completed)
 */
export function clearAbandonedCartData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ABANDONED_CART_KEY);
}

/**
 * Get abandoned cart data
 */
export function getAbandonedCartData(): AbandonedCartData | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(ABANDONED_CART_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Check if abandoned cart email should be sent
 */
export function shouldSendAbandonedCartEmail(): boolean {
  const cartData = getAbandonedCartData();
  if (!cartData) return false;

  // Don't send if already sent
  if (cartData.emailSent) return false;

  // Don't send if no email
  if (!cartData.email) return false;

  // Don't send if cart is empty
  if (!cartData.items || cartData.items.length === 0) return false;

  // Check if enough time has passed (1 hour)
  const timeSinceCart = Date.now() - cartData.timestamp;
  return timeSinceCart >= ABANDONED_CART_DELAY;
}

/**
 * Send abandoned cart email
 */
export async function sendAbandonedCartEmail(): Promise<boolean> {
  const cartData = getAbandonedCartData();
  if (!cartData || !cartData.email) return false;

  try {
    const siteUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com');
    
    const response = await fetch('/api/abandoned-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: cartData.email,
        cartItems: cartData.items,
        cartTotal: cartData.total,
        cartUrl: `${siteUrl}/products`,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Mark as sent
      const updatedCartData: AbandonedCartData = {
        ...cartData,
        emailSent: true,
      };
      localStorage.setItem(ABANDONED_CART_KEY, JSON.stringify(updatedCartData));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error sending abandoned cart email:', error);
    return false;
  }
}

/**
 * Initialize abandoned cart tracking
 * Call this periodically to check and send abandoned cart emails
 */
export function initAbandonedCartTracking(): void {
  if (typeof window === 'undefined') return;

  // Check every hour
  setInterval(() => {
    if (shouldSendAbandonedCartEmail()) {
      sendAbandonedCartEmail().catch(console.error);
    }
  }, ABANDONED_CART_CHECK_INTERVAL);

  // Also check immediately on load
  if (shouldSendAbandonedCartEmail()) {
    sendAbandonedCartEmail().catch(console.error);
  }
}

