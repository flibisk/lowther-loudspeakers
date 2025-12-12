/**
 * Abandoned Cart Cron Handler
 * State machine for three-step abandoned cart email flow
 */

import { Resend } from 'resend';
import { buildQueueEmail, buildNarrativeEmail, buildFinalCallEmail, CartItem } from './email-templates';
import { getNarrativesForCartItems } from './match-narrative';

const resend = new Resend(process.env.RESEND_API_KEY);

// Timeline constants (in milliseconds)
const ONE_DAY = 24 * 60 * 60 * 1000;
const THREE_DAYS = 3 * ONE_DAY;
const SIX_DAYS = 6 * ONE_DAY;
const SEVEN_DAYS = 7 * ONE_DAY; // Build queue reservation period

/**
 * Normalize cart URL to ensure it's on the main site, not Shopify storefront
 * For headless Shopify, cart should be on www.lowtherloudspeakers.com, not shop.lowtherloudspeakers.com
 */
function normalizeCartUrl(cartUrl: string | undefined): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com';
  
  // If no URL provided, default to products page
  if (!cartUrl) {
    return `${siteUrl}/products`;
  }
  
  // If URL contains shop.lowtherloudspeakers.com, replace with main site
  if (cartUrl.includes('shop.lowtherloudspeakers.com')) {
    // Extract path from Shopify URL and use on main site
    const url = new URL(cartUrl);
    return `${siteUrl}${url.pathname}`;
  }
  
  // If URL is already on main site, use as-is
  if (cartUrl.includes('www.lowtherloudspeakers.com') || cartUrl.includes('lowtherloudspeakers.com')) {
    return cartUrl;
  }
  
  // If relative URL, prepend main site
  if (cartUrl.startsWith('/')) {
    return `${siteUrl}${cartUrl}`;
  }
  
  // Default fallback
  return `${siteUrl}/products`;
}

/**
 * Checkout State
 * Tracks the state of an abandoned checkout
 */
export interface CheckoutState {
  checkoutId: string;
  email: string;
  cartItems: CartItem[];
  cartUrl: string;
  detectionTime: number; // Timestamp when checkout was first detected as abandoned
  email1Sent?: boolean;
  email1SentTime?: number;
  email2Sent?: boolean;
  email2SentTime?: number;
  email3Sent?: boolean;
  email3SentTime?: number;
  completed?: boolean; // Set to true when checkout converts to order
}

/**
 * Placeholder: Get checkout state from store
 * TODO: Implement with actual storage (e.g., Upstash Redis, database)
 */
export async function getCheckoutState(checkoutId: string): Promise<CheckoutState | null> {
  // Placeholder implementation
  // In production, fetch from Redis/database
  console.log(`[Placeholder] Getting checkout state for: ${checkoutId}`);
  return null;
}

/**
 * Placeholder: Set checkout state in store
 * TODO: Implement with actual storage (e.g., Upstash Redis, database)
 */
export async function setCheckoutState(checkoutId: string, state: CheckoutState): Promise<void> {
  // Placeholder implementation
  // In production, save to Redis/database
  console.log(`[Placeholder] Setting checkout state for: ${checkoutId}`, {
    detectionTime: new Date(state.detectionTime).toISOString(),
    email1Sent: state.email1Sent,
    email2Sent: state.email2Sent,
    email3Sent: state.email3Sent,
  });
}

/**
 * Placeholder: Mark checkout as complete
 * TODO: Implement with actual storage (e.g., Upstash Redis, database)
 */
export async function markCheckoutComplete(checkoutId: string): Promise<void> {
  // Placeholder implementation
  // In production, mark as complete in Redis/database
  console.log(`[Placeholder] Marking checkout complete: ${checkoutId}`);
}

/**
 * Placeholder: Fetch abandoned checkouts from Shopify
 * TODO: Implement actual Shopify API integration
 * 
 * Note: cartUrl should be on the main site (www.lowtherloudspeakers.com/products or similar)
 * NOT on the Shopify storefront (shop.lowtherloudspeakers.com)
 */
export async function fetchAbandonedCheckoutsFromShopify(): Promise<Array<{
  checkoutId: string;
  email: string;
  cartItems: CartItem[];
  cartUrl: string; // Should be main site URL, e.g., https://www.lowtherloudspeakers.com/products
  abandonedAt: number;
}>> {
  // Placeholder implementation
  // In production, use Shopify Admin API or Storefront API to fetch abandoned checkouts
  // IMPORTANT: cartUrl must be on the main site, not shop.lowtherloudspeakers.com
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com';
  console.log('[Placeholder] Fetching abandoned checkouts from Shopify');
  console.log('[Placeholder] Cart URLs will use main site:', siteUrl);
  return [];
}

/**
 * Send email using Resend
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@lowtherloudspeakers.com';
    
    const { data, error } = await resend.emails.send({
      from: `Lowther Loudspeakers <${fromEmail}>`,
      to,
      replyTo: fromEmail,
      subject,
      html,
    });

    if (error) {
      console.error(`Error sending email to ${to}:`, error);
      return false;
    }

    console.log(`Email sent successfully to ${to}`, { id: data?.id });
    return true;
  } catch (error) {
    console.error(`Exception sending email to ${to}:`, error);
    return false;
  }
}

/**
 * Main cron handler
 * Processes abandoned checkouts and sends emails based on state machine
 */
export async function processAbandonedCheckouts(): Promise<{
  processed: number;
  emailsSent: number;
  errors: number;
}> {
  let processed = 0;
  let emailsSent = 0;
  let errors = 0;

  try {
    // Fetch abandoned checkouts from Shopify
    const checkouts = await fetchAbandonedCheckoutsFromShopify();
    console.log(`Found ${checkouts.length} abandoned checkouts`);

    const now = Date.now();

    for (const checkout of checkouts) {
      processed++;

      try {
        // Load existing state or create new
        let state = await getCheckoutState(checkout.checkoutId);

        // If checkout is marked as complete, skip it
        if (state?.completed) {
          console.log(`Skipping completed checkout: ${checkout.checkoutId}`);
          continue;
        }

        // First detection: create state and store detection time
        if (!state) {
          // Normalize cart URL to ensure it's on main site, not Shopify storefront
          const normalizedCartUrl = normalizeCartUrl(checkout.cartUrl);
          state = {
            checkoutId: checkout.checkoutId,
            email: checkout.email,
            cartItems: checkout.cartItems,
            cartUrl: normalizedCartUrl,
            detectionTime: checkout.abandonedAt || now,
          };
          await setCheckoutState(checkout.checkoutId, state);
          console.log(`New checkout detected: ${checkout.checkoutId}`, {
            detectionTime: new Date(state.detectionTime).toISOString(),
            cartUrl: normalizedCartUrl,
          });
          // Don't send email on first detection
          continue;
        }

        // Update cart items and URL in case they changed
        state.cartItems = checkout.cartItems;
        // Normalize cart URL to ensure it's on main site
        state.cartUrl = normalizeCartUrl(checkout.cartUrl);

        // Calculate time since detection
        const timeSinceDetection = now - state.detectionTime;

        // State Machine Logic:

        // Email 1: Send at +1 day (24 hours)
        if (
          timeSinceDetection >= ONE_DAY &&
          !state.email1Sent
        ) {
          const html = buildQueueEmail(state.cartUrl, state.cartItems);
          const success = await sendEmail(
            state.email,
            'Your place in our build queue is reserved',
            html
          );

          if (success) {
            state.email1Sent = true;
            state.email1SentTime = now;
            await setCheckoutState(checkout.checkoutId, state);
            emailsSent++;
            console.log(`Email 1 sent to ${state.email} for checkout ${checkout.checkoutId}`);
          } else {
            errors++;
          }
        }

        // Email 2: Send at +3 days
        if (
          timeSinceDetection >= THREE_DAYS &&
          state.email1Sent &&
          !state.email2Sent
        ) {
          const narratives = getNarrativesForCartItems(state.cartItems);
          const html = buildNarrativeEmail(narratives, state.cartUrl, state.cartItems);
          const success = await sendEmail(
            state.email,
            'A closer look at the instruments in your cart',
            html
          );

          if (success) {
            state.email2Sent = true;
            state.email2SentTime = now;
            await setCheckoutState(checkout.checkoutId, state);
            emailsSent++;
            console.log(`Email 2 sent to ${state.email} for checkout ${checkout.checkoutId}`);
          } else {
            errors++;
          }
        }

        // Email 3: Send at +6 days
        if (
          timeSinceDetection >= SIX_DAYS &&
          state.email2Sent &&
          !state.email3Sent
        ) {
          const html = buildFinalCallEmail(state.cartUrl, state.cartItems);
          const success = await sendEmail(
            state.email,
            'Your reserved build queue slot expires tomorrow',
            html
          );

          if (success) {
            state.email3Sent = true;
            state.email3SentTime = now;
            await setCheckoutState(checkout.checkoutId, state);
            emailsSent++;
            console.log(`Email 3 sent to ${state.email} for checkout ${checkout.checkoutId}`);
          } else {
            errors++;
          }
        }

        // Clean up: If 7 days have passed and all emails sent, we can optionally mark as stale
        // (But keep state for potential future use)
        if (timeSinceDetection >= SEVEN_DAYS && state.email3Sent) {
          console.log(`Checkout ${checkout.checkoutId} has completed email sequence`);
        }

      } catch (error) {
        console.error(`Error processing checkout ${checkout.checkoutId}:`, error);
        errors++;
      }
    }

    return {
      processed,
      emailsSent,
      errors,
    };
  } catch (error) {
    console.error('Error in processAbandonedCheckouts:', error);
    throw error;
  }
}

