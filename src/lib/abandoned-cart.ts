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
  
  // Get existing cart data to preserve email if it exists
  const existingData = getAbandonedCartData();
  
  const cartData: AbandonedCartData = {
    items,
    total,
    timestamp: existingData?.timestamp || Date.now(), // Preserve original timestamp
    email: email || existingData?.email || undefined,
    cartId,
    emailSent: existingData?.emailSent || false, // Preserve email sent status
  };

  console.log('Saving abandoned cart data:', {
    itemCount: items.length,
    hasEmail: !!cartData.email,
    email: cartData.email,
    timestamp: new Date(cartData.timestamp).toISOString(),
    timeSinceCart: Date.now() - cartData.timestamp
  });

  localStorage.setItem(ABANDONED_CART_KEY, JSON.stringify(cartData));
}

/**
 * Update email on existing abandoned cart data
 * Called when user submits discount form
 */
export function updateAbandonedCartEmail(email: string): void {
  if (typeof window === 'undefined') return;
  
  const existingData = getAbandonedCartData();
  if (existingData) {
    const updatedData: AbandonedCartData = {
      ...existingData,
      email: email,
    };
    localStorage.setItem(ABANDONED_CART_KEY, JSON.stringify(updatedData));
    console.log('Updated abandoned cart email:', email);
  }
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

  // Check immediately on page load (in case user returns after 1 hour)
  const checkAndSend = () => {
    const cartData = getAbandonedCartData();
    console.log('Checking abandoned cart:', {
      hasCartData: !!cartData,
      hasEmail: !!cartData?.email,
      emailSent: cartData?.emailSent,
      itemCount: cartData?.items?.length || 0,
      timeSinceCart: cartData ? Date.now() - cartData.timestamp : 0,
      shouldSend: shouldSendAbandonedCartEmail()
    });

    if (shouldSendAbandonedCartEmail()) {
      console.log('Sending abandoned cart email...');
      sendAbandonedCartEmail()
        .then(success => {
          console.log('Abandoned cart email result:', success);
        })
        .catch(error => {
          console.error('Error sending abandoned cart email:', error);
        });
    }
  };

  // Check immediately on load
  checkAndSend();

  // Check every 15 minutes while page is open (more frequent checks)
  const checkInterval = setInterval(() => {
    checkAndSend();
  }, 15 * 60 * 1000); // 15 minutes

  // Also check when page becomes visible again (user returns to tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkAndSend();
    }
  });

  // Clean up interval on page unload (though this won't run if browser is closed)
  window.addEventListener('beforeunload', () => {
    clearInterval(checkInterval);
  });
}

