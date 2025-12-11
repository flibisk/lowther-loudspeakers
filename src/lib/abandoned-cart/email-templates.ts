/**
 * Abandoned Cart Email Templates
 * Three-step email flow for abandoned checkouts
 */

export interface CartItem {
  title: string;
  quantity: number;
  price?: string;
  image?: string;
  productId?: string;
  handle?: string;
}

import { ProductNarrative } from './narratives';

/**
 * Get the site URL for email images
 * Ensures we use the correct absolute URL on Vercel
 */
function getSiteUrl(): string {
  // In production, use NEXT_PUBLIC_SITE_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ''); // Remove trailing slash
  }
  
  // Fallback for Vercel deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Default production URL
  return 'https://www.lowtherloudspeakers.com';
}

/**
 * Get the logo URL for emails
 * Uses absolute URL that works on Vercel
 */
function getLogoUrl(): string {
  const siteUrl = getSiteUrl();
  return `${siteUrl}/images/Lowther-Logo-Black-Box.jpg`;
}

/**
 * Email 1: Build Queue Focus
 * Sent 24 hours after detection
 * Focuses on build queue reservation and lists cart items
 * 
 * @param cartUrl - Cart URL on the main site (not Shopify storefront)
 * @param cartItems - Array of cart items
 */
export function buildQueueEmail(cartUrl: string, cartItems: CartItem[]): string {
  const cartItemsList = cartItems.map(item => `
    <p style="margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee;">
      <strong>${item.quantity} × ${item.title}</strong>
    </p>
  `).join('');

  const logoUrl = getLogoUrl();

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
      }
      .logo-container {
        text-align: center;
        padding: 30px 30px 20px 30px;
        background-color: #ffffff;
      }
      .logo-container img {
        max-width: 200px;
        height: auto;
      }
      .header {
        background: linear-gradient(135deg, #c59862 0%, #b0874f 100%);
        color: white;
        padding: 40px 30px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
        line-height: 1.2;
      }
      .content {
        padding: 40px 30px;
      }
      .cart-link-top {
        text-align: center;
        margin-bottom: 30px;
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 8px;
      }
      .cart-link-top a {
        display: inline-block;
        background: #000;
        color: white;
        padding: 12px 30px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        font-size: 16px;
      }
      .cart-link-text {
        text-align: center;
        margin: 20px 0;
      }
      .cart-link-text a {
        color: #c59862;
        text-decoration: underline;
        font-size: 16px;
      }
      .body-text {
        font-size: 16px;
        line-height: 1.8;
        color: #333;
        margin: 20px 0;
      }
      .cart-items {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        margin: 30px 0;
      }
      .cart-items h3 {
        margin: 0 0 15px 0;
        font-size: 18px;
        color: #333;
      }
      .button-container {
        text-align: center;
        margin: 30px 0;
      }
      .button {
        display: inline-block;
        background: #000;
        color: white;
        padding: 15px 40px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        font-size: 16px;
      }
      .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        font-size: 12px;
        color: #666;
        text-align: center;
      }
      .help-section {
        margin-top: 30px;
        font-size: 14px;
        color: #666;
        line-height: 1.8;
      }
      .help-section a {
        color: #c59862;
        text-decoration: none;
      }
      .link-url {
        word-break: break-all;
        font-size: 14px;
        color: #666;
        margin-top: 10px;
      }
      @media only screen and (max-width: 600px) {
        .content {
          padding: 20px 15px;
        }
        .header {
          padding: 30px 20px;
        }
        .header h1 {
          font-size: 24px;
        }
        .body-text {
          font-size: 15px;
        }
        .button {
          padding: 12px 30px;
          font-size: 14px;
        }
        .logo-container {
          padding: 20px 20px 15px 20px;
        }
        .logo-container img {
          max-width: 150px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="logo-container">
        <img src="${logoUrl}" alt="Lowther Loudspeakers" />
      </div>
      <div class="header">
        <h1>Your place in our build queue</h1>
      </div>
      <div class="content">
        <div class="cart-link-top">
          <a href="${cartUrl}">Return to your cart here</a>
        </div>

        <div class="body-text">
          <p>We handmake every Lowther instrument to order in our British workshop. Because you placed items in your cart, we have reserved a place for you in our build queue for the next seven days.</p>

          <p>If you return and complete your order within this time, your loudspeaker or drive unit will be among the first in line to be built by our team.</p>
        </div>

        <div class="cart-items">
          <h3>Items currently in your cart:</h3>
          ${cartItemsList}
        </div>

        <div class="body-text">
          <p>When you are ready, you can complete your purchase in a few clicks. Your reserved place in the build queue will last for seven days from when we first detected your abandoned cart.</p>

          <p>If you have any questions about matching your chosen instrument to your cabinet, amplifier or room, contact us at <a href="mailto:hello@lowtherloudspeakers.com" style="color: #c59862; text-decoration: none;">hello@lowtherloudspeakers.com</a> and we will be happy to help.</p>
        </div>

        <div class="button-container">
          <a href="${cartUrl}" class="button">Complete your order</a>
        </div>

        <div class="cart-link-text">
          <p>Your cart link will remain available to you. You can also paste this link into your browser:</p>
          <p class="link-url">${cartUrl}</p>
        </div>

        <div class="footer">
          <p>Lowther Loudspeakers<br>
          <a href="https://www.lowtherloudspeakers.com" style="color: #c59862;">www.lowtherloudspeakers.com</a></p>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
}

/**
 * Email 2: Product Narratives
 * Sent 3 days after detection
 * Uses product stories to explain why we make them and what they sound like
 */
export function buildNarrativeEmail(
  narratives: ProductNarrative[],
  cartUrl: string,
  cartItems: CartItem[]
): string {
  const logoUrl = getLogoUrl();

  const narrativeSections = narratives.map(narrative => `
    <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border-left: 4px solid #c59862;">
      <h3 style="margin: 0 0 15px 0; font-size: 20px; color: #333;">${cartItems.find(item => 
        item.title.toLowerCase().includes(narrative.rangePosition?.toLowerCase() || '') ||
        item.handle === narrative.handle
      )?.title || 'Your Selection'}</h3>
      <p style="margin: 10px 0; color: #666; line-height: 1.8;">
        <strong style="color: #333;">In our range:</strong> ${narrative.rangePosition}
      </p>
      <p style="margin: 10px 0; color: #666; line-height: 1.8;">
        <strong style="color: #333;">Sound character:</strong> ${narrative.soundCharacter}
      </p>
      <p style="margin: 10px 0; color: #666; line-height: 1.8;">
        <strong style="color: #333;">Cabinet matches:</strong> ${narrative.cabinetMatches}
      </p>
    </div>
  `).join('');

  const cartItemsHtml = cartItems.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #eee;">
        <strong style="font-size: 16px; color: #333;">${item.title}</strong>
        <br>
        <span style="color: #666; font-size: 14px;">Quantity: ${item.quantity}</span>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
      }
      .logo-container {
        text-align: center;
        padding: 30px 30px 20px 30px;
        background-color: #ffffff;
      }
      .logo-container img {
        max-width: 200px;
        height: auto;
      }
      .header {
        background: linear-gradient(135deg, #c59862 0%, #b0874f 100%);
        color: white;
        padding: 40px 30px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
        line-height: 1.2;
      }
      .header p {
        margin: 10px 0 0 0;
        font-size: 18px;
        opacity: 0.95;
      }
      .content {
        padding: 40px 30px;
      }
      .cart-link-top {
        text-align: center;
        margin-bottom: 30px;
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 8px;
      }
      .cart-link-top a {
        display: inline-block;
        background: #000;
        color: white;
        padding: 12px 30px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        font-size: 16px;
      }
      .build-queue-reminder {
        background-color: #fff8e1;
        border-left: 4px solid #c59862;
        padding: 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .build-queue-reminder p {
        margin: 0;
        color: #666;
        font-size: 15px;
        line-height: 1.6;
      }
      table {
        width: 100%;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        margin: 30px 0;
        border-collapse: collapse;
        border: 1px solid #eee;
      }
      th {
        background: #f5f5f5;
        padding: 15px;
        text-align: left;
        font-weight: bold;
        font-size: 14px;
        color: #333;
        border-bottom: 2px solid #eee;
      }
      td {
        padding: 15px;
        border-bottom: 1px solid #eee;
      }
      .button-container {
        text-align: center;
        margin: 30px 0;
      }
      .button {
        display: inline-block;
        background: #000;
        color: white;
        padding: 15px 40px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        font-size: 16px;
      }
      .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        font-size: 12px;
        color: #666;
        text-align: center;
      }
      .help-section {
        margin-top: 30px;
        font-size: 14px;
        color: #666;
        line-height: 1.6;
      }
      .help-section a {
        color: #c59862;
        text-decoration: none;
      }
      @media only screen and (max-width: 600px) {
        .content {
          padding: 20px 15px;
        }
        .header {
          padding: 30px 20px;
        }
        .header h1 {
          font-size: 24px;
        }
        .header p {
          font-size: 16px;
        }
        .button {
          padding: 12px 30px;
          font-size: 14px;
        }
        .logo-container {
          padding: 20px 20px 15px 20px;
        }
        .logo-container img {
          max-width: 150px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="logo-container">
        <img src="${logoUrl}" alt="Lowther Loudspeakers" />
      </div>
      <div class="header">
        <h1>The Story Behind Your Selection</h1>
        <p>Why we make what we make</p>
      </div>
      <div class="content">
        <div class="cart-link-top">
          <a href="${cartUrl}">View Your Cart →</a>
        </div>

        <p>Hi there,</p>
        
        <p>We wanted to share a bit more about the instruments you've selected and why we make them the way we do.</p>

        ${narrativeSections}

        <div class="build-queue-reminder">
          <p><strong>Remember:</strong> Your place in our build queue is reserved for 7 days from when you first added items to your cart. Every Lowther instrument is handmade to order, so securing your slot ensures we can begin crafting yours.</p>
        </div>

        <p>Your current selection:</p>

        <table>
          <thead>
            <tr>
              <th>Items in Your Cart</th>
            </tr>
          </thead>
          <tbody>
            ${cartItemsHtml}
          </tbody>
        </table>

        <div class="button-container">
          <a href="${cartUrl}" class="button">Complete Your Purchase</a>
        </div>

        <div class="help-section">
          <p>
            <strong>Questions?</strong><br>
            We're here to help. Contact us at 
            <a href="mailto:hello@lowtherloudspeakers.com">hello@lowtherloudspeakers.com</a>
          </p>
        </div>

        <div class="cart-link-top" style="margin-top: 30px;">
          <a href="${cartUrl}">View Your Cart →</a>
        </div>

        <div class="footer">
          <p>Lowther Loudspeakers<br>
          <a href="https://www.lowtherloudspeakers.com" style="color: #c59862;">www.lowtherloudspeakers.com</a></p>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
}

/**
 * Email 3: Final Call
 * Sent 6 days after detection
 * Warns that build queue slot will be lost but cart remains
 */
export function buildFinalCallEmail(cartUrl: string, cartItems: CartItem[]): string {
  const logoUrl = getLogoUrl();

  const cartItemsHtml = cartItems.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #eee; vertical-align: top;">
        ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; display: block;">` : ''}
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #eee;">
        <strong style="font-size: 16px; color: #333;">${item.title}</strong>
        <br>
        <span style="color: #666; font-size: 14px;">Quantity: ${item.quantity}</span>
        ${item.price ? `<br><span style="color: #333; font-size: 14px; font-weight: 500;">${item.price}</span>` : ''}
      </td>
    </tr>
  `).join('');

  const total = cartItems.reduce((sum, item) => {
    if (item.price) {
      const priceValue = parseFloat(item.price.replace(/[£,]/g, '')) || 0;
      return sum + (priceValue * item.quantity);
    }
    return sum;
  }, 0);
  const totalFormatted = `£${total.toFixed(2)}`;

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
      }
      .logo-container {
        text-align: center;
        padding: 30px 30px 20px 30px;
        background-color: #ffffff;
      }
      .logo-container img {
        max-width: 200px;
        height: auto;
      }
      .header {
        background: linear-gradient(135deg, #c59862 0%, #b0874f 100%);
        color: white;
        padding: 40px 30px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
        line-height: 1.2;
      }
      .header p {
        margin: 10px 0 0 0;
        font-size: 18px;
        opacity: 0.95;
      }
      .content {
        padding: 40px 30px;
      }
      .cart-link-top {
        text-align: center;
        margin-bottom: 30px;
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 8px;
      }
      .cart-link-top a {
        display: inline-block;
        background: #000;
        color: white;
        padding: 12px 30px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        font-size: 16px;
      }
      .warning-notice {
        background-color: #fff3cd;
        border-left: 4px solid #c59862;
        padding: 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .warning-notice h2 {
        margin: 0 0 10px 0;
        font-size: 20px;
        color: #333;
      }
      .warning-notice p {
        margin: 10px 0;
        color: #666;
        font-size: 15px;
        line-height: 1.6;
      }
      .reassurance {
        background-color: #e8f5e9;
        border-left: 4px solid #4caf50;
        padding: 20px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .reassurance p {
        margin: 0;
        color: #666;
        font-size: 15px;
        line-height: 1.6;
      }
      table {
        width: 100%;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        margin: 30px 0;
        border-collapse: collapse;
        border: 1px solid #eee;
      }
      th {
        background: #f5f5f5;
        padding: 15px;
        text-align: left;
        font-weight: bold;
        font-size: 14px;
        color: #333;
        border-bottom: 2px solid #eee;
      }
      td {
        padding: 15px;
        border-bottom: 1px solid #eee;
      }
      .total {
        background: white;
        padding: 20px;
        border-radius: 8px;
        text-align: right;
        margin-top: 20px;
        border: 1px solid #eee;
      }
      .total strong {
        font-size: 24px;
        color: #333;
      }
      .button-container {
        text-align: center;
        margin: 30px 0;
      }
      .button {
        display: inline-block;
        background: #000;
        color: white;
        padding: 15px 40px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        font-size: 16px;
      }
      .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        font-size: 12px;
        color: #666;
        text-align: center;
      }
      .help-section {
        margin-top: 30px;
        font-size: 14px;
        color: #666;
        line-height: 1.6;
      }
      .help-section a {
        color: #c59862;
        text-decoration: none;
      }
      @media only screen and (max-width: 600px) {
        .content {
          padding: 20px 15px;
        }
        .header {
          padding: 30px 20px;
        }
        .header h1 {
          font-size: 24px;
        }
        .header p {
          font-size: 16px;
        }
        table {
          font-size: 14px;
        }
        th, td {
          padding: 10px;
        }
        .button {
          padding: 12px 30px;
          font-size: 14px;
        }
        .logo-container {
          padding: 20px 20px 15px 20px;
        }
        .logo-container img {
          max-width: 150px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="logo-container">
        <img src="${logoUrl}" alt="Lowther Loudspeakers" />
      </div>
      <div class="header">
        <h1>Your Build Queue Slot Expires Tomorrow</h1>
        <p>One last chance to secure your place</p>
      </div>
      <div class="content">
        <div class="cart-link-top">
          <a href="${cartUrl}">View Your Cart →</a>
        </div>

        <p>Hi there,</p>
        
        <div class="warning-notice">
          <h2>We're Holding Your Slot</h2>
          <p><strong>We handmake everything to order.</strong> Your reserved slot in our build queue will be released tomorrow if you don't complete your purchase.</p>
        </div>

        <div class="reassurance">
          <p><strong>Don't worry:</strong> Your cart will still be waiting for you when you come back. We just won't be able to hold your place in the build queue any longer.</p>
        </div>

        <p>Your items are still here:</p>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${cartItemsHtml}
          </tbody>
        </table>

        <div class="total">
          <strong>Total: ${totalFormatted}</strong>
        </div>

        <div class="button-container">
          <a href="${cartUrl}" class="button">Complete Your Purchase Now</a>
        </div>

        <div class="help-section">
          <p>
            <strong>Need help?</strong><br>
            If you have any questions or need assistance completing your purchase, please contact us at 
            <a href="mailto:hello@lowtherloudspeakers.com">hello@lowtherloudspeakers.com</a>
          </p>
        </div>

        <div class="cart-link-top" style="margin-top: 30px;">
          <a href="${cartUrl}">View Your Cart →</a>
        </div>

        <div class="footer">
          <p>Lowther Loudspeakers<br>
          <a href="https://www.lowtherloudspeakers.com" style="color: #c59862;">www.lowtherloudspeakers.com</a></p>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
}

