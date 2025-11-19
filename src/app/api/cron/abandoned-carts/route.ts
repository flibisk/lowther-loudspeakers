import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Cron Job: Process Abandoned Carts
 * Runs every hour to check for abandoned carts and send reminder emails
 * 
 * Set up in vercel.json cron jobs
 */

const ABANDONED_CART_DELAY = 60 * 60 * 1000; // 1 hour
const FOLLOW_UP_DELAY = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(request: NextRequest) {
  // Verify this is called by Vercel Cron
  // Vercel automatically adds 'x-vercel-cron' header, but we can also check for cron secret
  const cronSecret = request.headers.get('authorization');
  const vercelCron = request.headers.get('x-vercel-cron');
  
  // Allow if it's from Vercel Cron OR if CRON_SECRET matches (for manual testing)
  if (!vercelCron && cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    // In production, require one of these. For now, allow if no secret is set (development)
    if (process.env.CRON_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  try {
    // For Vercel, we need to fetch from the API since serverless functions are isolated
    // Use internal URL during build/runtime, or fallback to public URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com');
    
    const cartsResponse = await fetch(`${baseUrl}/api/abandoned-carts`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!cartsResponse.ok) {
      throw new Error('Failed to fetch carts');
    }

    const { carts } = await cartsResponse.json();
    const now = Date.now();
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@lowtherloudspeakers.com';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com';

    let emailsSent = 0;
    let errors = 0;

    for (const cart of carts) {
      const timeSinceCart = now - cart.timestamp;
      const shouldSendFirst = timeSinceCart >= ABANDONED_CART_DELAY && timeSinceCart < FOLLOW_UP_DELAY;
      const shouldSendFollowUp = timeSinceCart >= FOLLOW_UP_DELAY;

      // Skip if first email already sent (but allow 24-hour follow-up)
      if (cart.emailSent && !shouldSendFollowUp) continue;
      
      if (!shouldSendFirst && !shouldSendFollowUp) continue;

      try {
        const cartItemsHtml = cart.cartItems.map((item: any) => `
          <tr>
            <td style="padding: 15px; border-bottom: 1px solid #eee;">
              ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">` : ''}
            </td>
            <td style="padding: 15px; border-bottom: 1px solid #eee;">
              <strong>${item.title}</strong>
              <br>
              <span style="color: #666; font-size: 14px;">Quantity: ${item.quantity}</span>
            </td>
            <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right;">
              ${item.price}
            </td>
          </tr>
        `).join('');

        const subject = shouldSendFollowUp 
          ? `Still interested? Complete your Lowther Loudspeakers purchase`
          : `You left items in your cart - Complete your purchase`;

        const { data, error } = await resend.emails.send({
          from: `Lowther Loudspeakers <${fromEmail}>`,
          to: cart.email,
          replyTo: fromEmail,
          subject,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  .header {
                    background: linear-gradient(135deg, #c59862 0%, #b0874f 100%);
                    color: white;
                    padding: 40px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                  }
                  .content {
                    background: #f9f9f9;
                    padding: 40px;
                    border-radius: 0 0 10px 10px;
                  }
                  table {
                    width: 100%;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    margin: 20px 0;
                    border-collapse: collapse;
                  }
                  th {
                    background: #f5f5f5;
                    padding: 15px;
                    text-align: left;
                    font-weight: bold;
                  }
                  td {
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                  }
                  .button {
                    display: inline-block;
                    background: #000;
                    color: white;
                    padding: 15px 40px;
                    text-decoration: none;
                    border-radius: 4px;
                    margin: 20px 0;
                    font-weight: bold;
                  }
                  .total {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: right;
                    margin-top: 20px;
                  }
                  .footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>${shouldSendFollowUp ? 'Still interested?' : 'You left items in your cart'}</h1>
                  <p style="font-size: 18px; margin-top: 10px;">Complete your purchase now</p>
                </div>
                <div class="content">
                  <p>Hi there,</p>
                  ${shouldSendFollowUp 
                    ? '<p>We noticed you were interested in these items. They\'re still waiting for you!</p>'
                    : '<p>We noticed you added some items to your cart but didn\'t complete your purchase. Don\'t worry - your items are still waiting for you!</p>'
                  }

                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product</th>
                        <th style="text-align: right;">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${cartItemsHtml}
                    </tbody>
                  </table>

                  <div class="total">
                    <strong style="font-size: 20px;">Total: ${cart.cartTotal}</strong>
                  </div>

                  <div style="text-align: center;">
                    <a href="${siteUrl}/products" class="button">Complete Your Purchase</a>
                  </div>

                  <p style="margin-top: 30px; font-size: 14px; color: #666;">
                    <strong>Need help?</strong><br>
                    If you have any questions about your order, please don't hesitate to contact us at 
                    <a href="mailto:hello@lowtherloudspeakers.com" style="color: #c59862;">hello@lowtherloudspeakers.com</a>
                  </p>

                  <div class="footer">
                    <p>Lowther Loudspeakers<br>
                    <a href="${siteUrl}" style="color: #c59862;">www.lowtherloudspeakers.com</a></p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        if (error) {
          console.error(`Error sending email to ${cart.email}:`, error);
          errors++;
          continue;
        }

        // Mark as sent
        emailsSent++;
        console.log(`Sent abandoned cart email to ${cart.email}`, data);
        
        // Update cart to mark as sent (for first email only, keep for follow-up)
        if (!shouldSendFollowUp) {
          try {
            await fetch(`${baseUrl}/api/abandoned-carts`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: cart.email,
                cartId: cart.cartId,
                emailSent: true,
              }),
            });
          } catch (updateError) {
            console.error(`Error updating cart status for ${cart.email}:`, updateError);
          }
        }

      } catch (error) {
        console.error(`Error processing cart for ${cart.email}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${carts.length} carts`,
      emailsSent,
      errors,
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing abandoned carts', error: String(error) },
      { status: 500 }
    );
  }
}

