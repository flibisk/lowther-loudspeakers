import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface WishlistNotificationBody {
  item: {
    id: string;
    handle: string;
    title: string;
    price: string;
    image: string;
    url?: string;
    type?: 'shopify' | 'masterpiece';
  };
  userEmail?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check if notifications are enabled
    const notificationsEnabled = process.env.WISHLIST_NOTIFICATIONS_ENABLED !== 'false';
    
    if (!notificationsEnabled) {
      return NextResponse.json({
        success: true,
        message: 'Notifications are disabled',
      });
    }

    const body: WishlistNotificationBody = await request.json();
    const { item, userEmail } = body;

    // Validate required fields
    if (!item || !item.title) {
      return NextResponse.json(
        { success: false, message: 'Item information is required' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { success: false, message: 'Email service not configured' },
        { status: 500 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'mrbird@lowtherloudspeakers.com';
    const notificationEmail = 'peter@shinystudio.co.uk';

    // Build product URL
    const productUrl = item.url || 
      (item.type === 'masterpiece' 
        ? `https://lowtherloudspeakers.com/loudspeakers/${item.handle}`
        : `https://lowtherloudspeakers.com/products/${item.handle}`);

    // Send email notification
    const { data, error } = await resend.emails.send({
      from: `Lowther Website <${fromEmail}>`,
      to: [notificationEmail],
      replyTo: userEmail || fromEmail,
      subject: `New Wishlist Item: ${item.title}`,
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
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .field {
                margin-bottom: 20px;
                padding: 15px;
                background: white;
                border-left: 4px solid #c59862;
                border-radius: 4px;
              }
              .label {
                font-weight: bold;
                color: #c59862;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 1px;
                margin-bottom: 5px;
              }
              .value {
                color: #333;
                margin-top: 5px;
              }
              .product-image {
                max-width: 200px;
                height: auto;
                border-radius: 8px;
                margin-top: 10px;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background: #c59862;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 10px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e0e0e0;
                color: #666;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0; font-size: 28px; font-weight: normal;">New Wishlist Item Added</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Product Title</div>
                <div class="value">${item.title}</div>
              </div>
              
              <div class="field">
                <div class="label">Price</div>
                <div class="value">${item.price}</div>
              </div>
              
              <div class="field">
                <div class="label">Product Type</div>
                <div class="value">${item.type === 'masterpiece' ? 'Masterpiece (Commission Only)' : 'Shopify Product'}</div>
              </div>
              
              ${item.image ? `
              <div class="field">
                <div class="label">Product Image</div>
                <div class="value">
                  <img src="${item.image.startsWith('http') ? item.image : `https://lowtherloudspeakers.com${item.image}`}" alt="${item.title}" class="product-image" />
                </div>
              </div>
              ` : ''}
              
              ${userEmail ? `
              <div class="field">
                <div class="label">User Email</div>
                <div class="value"><a href="mailto:${userEmail}">${userEmail}</a></div>
              </div>
              ` : `
              <div class="field">
                <div class="label">User Email</div>
                <div class="value" style="color: #999; font-style: italic;">Not provided</div>
              </div>
              `}
              
              <div class="field">
                <div class="label">View Product</div>
                <div class="value">
                  <a href="${productUrl}" class="button">View Product Page</a>
                </div>
              </div>
              
              <div class="footer">
                <p>This email was sent automatically when a user added an item to their wishlist.</p>
                <p>Time: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send notification',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification sent',
      data,
    });
  } catch (error) {
    console.error('Wishlist notification error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while sending notification' },
      { status: 500 }
    );
  }
}

