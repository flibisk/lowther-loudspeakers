import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Commission form handler - sends email via Resend and adds to Beehiiv
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, country, address, referrer, questions, speakerName } = body;

    // Validate required fields
    if (!fullName || !email || !country) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and country are required' },
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

    // Use verified domain email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@lowtherloudspeakers.com';
    const contactEmail = process.env.CONTACT_EMAIL || 'social@lowtherloudspeakers.com';
    const secondaryEmail = process.env.RESEND_SECONDARY_EMAIL || 'hello@lowtherloudspeakers.com';

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `Lowther Website <${fromEmail}>`,
      to: [contactEmail, secondaryEmail],
      replyTo: email,
      subject: `Commission Request: ${speakerName} from ${fullName}`,
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
              .speaker-badge {
                display: inline-block;
                background: #c59862;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
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
              <h1 style="margin: 0; font-size: 28px; font-weight: normal;">New Commission Request</h1>
              <div class="speaker-badge">${speakerName}</div>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Full Name</div>
                <div class="value">${fullName}</div>
              </div>
              
              <div class="field">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              ${phone ? `
              <div class="field">
                <div class="label">Phone Number</div>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              ` : ''}
              
              ${address ? `
              <div class="field">
                <div class="label">Delivery Address</div>
                <div class="value" style="white-space: pre-wrap;">${address}</div>
              </div>
              ` : ''}

              <div class="field">
                <div class="label">Country</div>
                <div class="value">${country}</div>
              </div>
              
              ${referrer ? `
              <div class="field">
                <div class="label">How Did You Hear About Us?</div>
                <div class="value">${referrer}</div>
              </div>
              ` : ''}
              
              ${questions ? `
              <div class="field">
                <div class="label">Questions / Special Requests</div>
                <div class="value" style="white-space: pre-wrap;">${questions}</div>
              </div>
              ` : ''}
              
              <div class="footer">
                <p>This commission request was submitted through the Lowther Loudspeakers website.</p>
                <p>Speaker Model: ${speakerName}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      // Return more detailed error for debugging
      const errorMessage = error.message || 'Failed to send commission request';
      console.error('Full error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { 
          success: false, 
          message: process.env.NODE_ENV === 'development' 
            ? `Error: ${errorMessage}` 
            : 'Failed to send commission request. Please try again or contact us directly.' 
        },
        { status: 500 }
      );
    }

    // Add to Beehiiv subscriber list (optional, don't fail if it errors)
    if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
      try {
        const beehiivPayload = {
          email,
          reactivate_existing: false,
          send_welcome_email: false,
          utm_source: 'website',
          utm_medium: 'commission_form',
          utm_campaign: speakerName,
          referring_site: 'lowtherloudspeakers.com',
          custom_fields: [
            { name: 'full_name', value: fullName },
            { name: 'phone', value: phone || '' },
            { name: 'country', value: country },
            { name: 'speaker_interest', value: speakerName },
            { name: 'lead_type', value: 'Commission Request' },
          ],
        };

        console.log('Sending to Beehiiv:', JSON.stringify(beehiivPayload, null, 2));

        const beehiivResponse = await fetch(
          `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
            },
            body: JSON.stringify(beehiivPayload),
          }
        );

        const beehiivData = await beehiivResponse.json();

        if (!beehiivResponse.ok) {
          console.error('Beehiiv API error (non-fatal):', beehiivData);
        } else {
          console.log('Successfully added to Beehiiv:', beehiivData);
        }
      } catch (beehiivError) {
        console.error('Beehiiv integration error (non-fatal):', beehiivError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your commission request has been sent. We\'ll be in touch soon.',
      data,
    });
  } catch (error) {
    console.error('Commission form error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

