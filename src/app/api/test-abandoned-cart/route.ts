import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Test endpoint for abandoned cart email
 * Send a test email to see what it looks like
 * Usage: POST /api/test-abandoned-cart with { email: "your@email.com" }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'RESEND_API_KEY not configured' },
        { status: 500 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@lowtherloudspeakers.com';
    const shopUrl = 'https://shop.lowtherloudspeakers.com/cart';

    // Sample cart items for testing
    const cartItems = [
      {
        title: 'Lowther PM6A Drive Unit',
        quantity: 2,
        price: '£1,200.00 GBP',
        image: 'https://shop.lowtherloudspeakers.com/cdn/shop/files/PM6A_1.jpg'
      },
      {
        title: 'Lowther PM5A Drive Unit',
        quantity: 1,
        price: '£950.00 GBP',
        image: 'https://shop.lowtherloudspeakers.com/cdn/shop/files/PM5A_1.jpg'
      }
    ];

    const cartTotal = '£3,350.00 GBP';

    const cartItemsHtml = cartItems.map(item => `
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

    console.log('Sending test abandoned cart email to:', email);

    const { data, error } = await resend.emails.send({
      from: `Lowther Loudspeakers <${fromEmail}>`,
      to: email,
      replyTo: fromEmail,
      subject: `[TEST] You left items in your cart - Complete your purchase`,
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
              .test-banner {
                background: #ff6b6b;
                color: white;
                padding: 10px;
                text-align: center;
                font-weight: bold;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <div class="test-banner">⚠️ TEST EMAIL - This is a preview of the abandoned cart email</div>
            <div class="header">
              <h1>You left items in your cart</h1>
              <p style="font-size: 18px; margin-top: 10px;">Complete your purchase now</p>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>We noticed you added some items to your cart but didn't complete your purchase. Don't worry - your items are still waiting for you!</p>

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
                <strong style="font-size: 20px;">Total: ${cartTotal}</strong>
              </div>

              <div style="text-align: center;">
                <a href="${shopUrl}" class="button">Complete Your Purchase</a>
              </div>

              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                <strong>Need help?</strong><br>
                If you have any questions about your order, please don't hesitate to contact us at 
                <a href="mailto:hello@lowtherloudspeakers.com" style="color: #c59862;">hello@lowtherloudspeakers.com</a>
              </p>

              <div class="footer">
                <p>Lowther Loudspeakers<br>
                <a href="https://www.lowtherloudspeakers.com" style="color: #c59862;">www.lowtherloudspeakers.com</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send test email',
          error: error.message || JSON.stringify(error)
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Test abandoned cart email sent successfully!',
      emailId: data?.id
    });

  } catch (error: any) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error sending test email',
        error: error.message
      },
      { status: 500 }
    );
  }
}

