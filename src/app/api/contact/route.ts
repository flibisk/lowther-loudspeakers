import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, location, message, segment } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
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

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `Lowther Website <${fromEmail}>`,
      to: contactEmail,
      replyTo: email,
      subject: `${segment || 'Contact'} Form Submission from ${name}`,
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
              <h1 style="margin: 0; font-size: 28px; font-weight: normal;">New ${segment || 'Contact'} Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Full Name</div>
                <div class="value">${name}</div>
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
              
              ${location ? `
              <div class="field">
                <div class="label">Location</div>
                <div class="value">${location}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">Message</div>
                <div class="value" style="white-space: pre-wrap;">${message}</div>
              </div>
              
              <div class="footer">
                <p>This email was sent from the Lowther Loudspeakers website contact form.</p>
                <p>Form Type: ${segment || 'General Contact'}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      // Return more detailed error for debugging
      const errorMessage = error.message || 'Failed to send email';
      console.error('Full error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { 
          success: false, 
          message: process.env.NODE_ENV === 'development' 
            ? `Error: ${errorMessage}` 
            : 'Failed to send email. Please try again or contact us directly.' 
        },
        { status: 500 }
      );
    }

    // Add to Beehiiv subscriber list (optional, don't fail if it errors)
    if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
      try {
        const beehiivResponse = await fetch(
          `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
            },
            body: JSON.stringify({
              email,
              reactivate_existing: false,
              send_welcome_email: false,
              utm_source: 'website',
              utm_medium: 'contact_form',
              utm_campaign: segment || 'general_contact',
              referring_site: 'lowtherloudspeakers.com',
              custom_fields: [
                { name: 'full_name', value: name },
                { name: 'phone', value: phone || '' },
                { name: 'location', value: location || '' },
                { name: 'lead_type', value: segment || 'Contact Form' },
              ],
            }),
          }
        );

        if (!beehiivResponse.ok) {
          const beehiivError = await beehiivResponse.json();
          console.error('Beehiiv API error (non-fatal):', beehiivError);
        } else {
          console.log('Successfully added to Beehiiv');
        }
      } catch (beehiivError) {
        console.error('Beehiiv integration error (non-fatal):', beehiivError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us! We\'ll get back to you soon.',
      data,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

