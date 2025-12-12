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
      <h3 style="margin: 0 0 15px 0; font-size: 20px; color: #333;">${narrative.name}</h3>
      <p style="margin: 10px 0; color: #666; line-height: 1.8;">
        <strong style="color: #333;">Where it sits in the range:</strong><br>
        ${narrative.rangePosition}
      </p>
      <p style="margin: 10px 0; color: #666; line-height: 1.8;">
        <strong style="color: #333;">What it brings to the music:</strong><br>
        ${narrative.soundCharacter}
      </p>
      <p style="margin: 10px 0; color: #666; line-height: 1.8;">
        <strong style="color: #333;">Where it performs best:</strong><br>
        ${narrative.cabinetMatches}
      </p>
    </div>
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
      .link-url {
        word-break: break-all;
        font-size: 14px;
        color: #666;
        margin-top: 10px;
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
        <h1>A little more about your chosen Lowther instruments</h1>
      </div>
      <div class="content">
        <div class="cart-link-top">
          <a href="${cartUrl}">Return to your cart here</a>
        </div>

        <div class="body-text">
          <p>Because you placed items in your cart, your place in our build queue is still reserved for seven days from when we first detected your abandoned cart. If you choose to return during this time, your instruments will be among the first in line to be handmade by our team.</p>

          <p>Below is a short guide to the items you selected and why we make them.</p>
        </div>

        ${narrativeSections}

        <div class="body-text">
          <p>If any of these raise questions about matching to your room, cabinet or amplifier, feel free to contact us at <a href="mailto:hello@lowtherloudspeakers.com" style="color: #c59862; text-decoration: none;">hello@lowtherloudspeakers.com</a> and we will be happy to help.</p>
        </div>

        <div class="button-container">
          <a href="${cartUrl}" class="button">Complete your order</a>
        </div>

        <div class="cart-link-text">
          <p>You can return to your cart at any time and complete your order here:</p>
          <p class="link-url">${cartUrl}</p>
          <p style="margin-top: 10px;">Or paste this link into your browser: ${cartUrl}</p>
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

  const cartItemsList = cartItems.map(item => `
    <p style="margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee;">
      <strong>${item.quantity} × ${item.title}</strong>
    </p>
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
      .link-url {
        word-break: break-all;
        font-size: 14px;
        color: #666;
        margin-top: 10px;
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
        <h1>We are holding your slot in our build queue</h1>
      </div>
      <div class="content">
        <div class="cart-link-top">
          <a href="${cartUrl}">Return to your cart here</a>
        </div>

        <div class="body-text">
          <p>We handmake every Lowther instrument to order. Because you placed items in your cart, we have been holding a reserved slot for you in our build queue. This reservation will end tomorrow.</p>

          <p>If you would like your loudspeaker or drive unit to be among the first in line, you can complete your order before the reservation expires. Once the slot is released, your place in the queue will return to a first come first serve basis.</p>

          <p>Your cart will still be saved. You can come back to it at any time.</p>
        </div>

        <div class="cart-items">
          <h3>Items currently in your cart:</h3>
          ${cartItemsList}
        </div>

        <div class="body-text">
          <p>If you need help choosing the right instrument or have questions about pairing your system, you can contact us at <a href="mailto:hello@lowtherloudspeakers.com" style="color: #c59862; text-decoration: none;">hello@lowtherloudspeakers.com</a> and we will be happy to help.</p>
        </div>

        <div class="button-container">
          <a href="${cartUrl}" class="button">Complete your order</a>
        </div>

        <div class="cart-link-text">
          <p>Complete your order here: <a href="${cartUrl}" style="color: #c59862; text-decoration: underline;">${cartUrl}</a></p>
          <p style="margin-top: 10px;">Or paste this link into your browser: ${cartUrl}</p>
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

