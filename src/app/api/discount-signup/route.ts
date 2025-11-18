import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Discount Signup API route
 * Handles discount popup email submissions by:
 * 1. Adding contacts to Beehiiv with "Discount Subscriber" segment
 * 2. Sending discount code email via Resend
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { success: false, message: 'Email service not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const beehiivApiKey = process.env.BEEHIIV_API_KEY;
    const beehiivPublicationId = process.env.BEEHIIV_PUBLICATION_ID;
    // Use configured email or fallback to Resend sandbox
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    // Get discount code from environment or use default
    const discountCode = process.env.DISCOUNT_CODE || 'WELCOME20';
    const discountPercent = parseInt(process.env.DISCOUNT_PERCENT || '20', 10);

    let beehiivSuccess = false;

    // 1. Add contact to Beehiiv with "Discount Subscriber" segment
    if (beehiivApiKey && beehiivPublicationId) {
      try {
        const beehiivResponse = await fetch(
          `https://api.beehiiv.com/v2/publications/${beehiivPublicationId}/subscriptions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${beehiivApiKey}`,
            },
            body: JSON.stringify({
              email: email,
              reactivate_existing: true,
              utm_source: 'Discount Popup',
              send_welcome_email: false,
              custom_fields: [
                {
                  name: 'discount_code',
                  value: discountCode
                },
                {
                  name: 'discount_source',
                  value: 'popup'
                }
              ],
            }),
          }
        );

        if (beehiivResponse.ok) {
          beehiivSuccess = true;
        } else {
          const errorText = await beehiivResponse.text();
          console.error('Beehiiv API error:', errorText);
        }
      } catch (beehiivError) {
        console.error('Error adding to Beehiiv:', beehiivError);
      }
    }

    // 2. Send discount code email via Resend
    try {
      // Use same format as other working routes
      console.log('Attempting to send discount email:', { from: fromEmail, to: email });
      
      const { data, error } = await resend.emails.send({
        from: `Lowther Loudspeakers <${fromEmail}>`,
        to: email,
        subject: `Your ${discountPercent}% Discount Code - Lowther Loudspeakers`,
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
                .discount-code {
                  background: white;
                  border: 3px dashed #c59862;
                  padding: 30px;
                  text-align: center;
                  margin: 30px 0;
                  border-radius: 8px;
                }
                .code {
                  font-size: 32px;
                  font-weight: bold;
                  color: #c59862;
                  letter-spacing: 4px;
                  margin: 10px 0;
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
                <h1>Welcome to Lowther Loudspeakers!</h1>
                <p style="font-size: 18px; margin-top: 10px;">Your exclusive discount is here</p>
              </div>
              <div class="content">
                <p>Thank you for joining us! As a welcome gift, here's your <strong>${discountPercent}% discount code</strong>:</p>
                
                <div class="discount-code">
                  <p style="margin: 0; color: #666; font-size: 14px;">USE CODE:</p>
                  <div class="code">${discountCode}</div>
                  <p style="margin: 0; color: #666; font-size: 14px;">Save ${discountPercent}% on your first order</p>
                </div>

                <p>Simply enter this code at checkout to receive your discount. This code is valid for your first purchase.</p>

                <div style="text-align: center;">
                  <a href="https://shop.lowtherloudspeakers.com" class="button">Shop Now</a>
                </div>

                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                  <strong>Terms & Conditions:</strong><br>
                  This discount code is valid for one-time use on your first purchase. 
                  Cannot be combined with other offers. Valid for a limited time.
                </p>

                <div class="footer">
                  <p>Lowther Loudspeakers<br>
                  <a href="https://www.lowtherloudspeakers.com" style="color: #c59862;">www.lowtherloudspeakers.com</a></p>
                  <p style="margin-top: 10px;">
                    <a href="#" style="color: #666; text-decoration: underline;">Unsubscribe</a>
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error('Resend API error:', JSON.stringify(error, null, 2));
        // On free tier, sending to user emails might fail
        // Return success anyway with the code so user can still get it
        // The code will be shown on screen as fallback
        console.warn('Email sending failed, but returning discount code anyway');
        return NextResponse.json({ 
          success: true,
          message: `Your discount code: ${discountCode}. Email delivery failed, but you can use this code now!`,
          discountCode,
          emailSent: false
        });
      }

      if (!data) {
        console.error('Resend API returned no data');
        // Return success with code anyway
        return NextResponse.json({ 
          success: true,
          message: `Your discount code: ${discountCode}. Email delivery failed, but you can use this code now!`,
          discountCode,
          emailSent: false
        });
      }

      console.log('Discount email sent successfully:', data);
    } catch (emailError: any) {
      console.error('Error sending discount email:', emailError);
      // Even if email fails, return the discount code so user can still use it
      console.warn('Email sending exception, but returning discount code anyway');
      return NextResponse.json({ 
        success: true,
        message: `Your discount code: ${discountCode}. Email delivery failed, but you can use this code now!`,
        discountCode,
        emailSent: false
      });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Discount code sent! Check your email.',
      discountCode,
      emailSent: true
    });

  } catch (error) {
    console.error('Error processing discount signup:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing request. Please try again.' },
      { status: 500 }
    );
  }
}

