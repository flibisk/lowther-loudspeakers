import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Commission form handler - sends email via Resend and adds to Beehiiv
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

function logCommissionEvent(event: string, payload: Record<string, unknown>) {
  console.log(`[commission] ${event}`, JSON.stringify(payload, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, address, referrer, questions, speakerName } = body;

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    const missingEnv: string[] = [];
    if (!resendApiKey) missingEnv.push('RESEND_API_KEY');
    if (!process.env.RESEND_FROM_EMAIL) missingEnv.push('RESEND_FROM_EMAIL');
    if (!process.env.CONTACT_EMAIL) missingEnv.push('CONTACT_EMAIL');
    if (!process.env.BEEHIIV_API_KEY) missingEnv.push('BEEHIIV_API_KEY');
    if (!process.env.BEEHIIV_PUBLICATION_ID) missingEnv.push('BEEHIIV_PUBLICATION_ID');

    if (missingEnv.length > 0 || !resend) {
      console.error('Commission form misconfiguration', missingEnv);
      return NextResponse.json(
        { success: false, message: `Commission form configuration missing: ${missingEnv.join(', ')}` },
        { status: 500 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL!;
    const contactEmail = process.env.CONTACT_EMAIL!;

    logCommissionEvent('submission_received', {
      fullName,
      email,
      phone,
      speakerName,
    });

    // Send email via Resend
    const resendResponse = await resend.emails.send({
      from: `Lowther Website <${fromEmail}>`,
      to: contactEmail,
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

    if (!resendResponse?.id) {
      console.error('Resend error: missing message id', resendResponse);
      throw new Error('Failed to send confirmation email via Resend');
    }

    logCommissionEvent('resend_success', { id: resendResponse.id });

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
        { name: 'speaker_interest', value: speakerName },
        { name: 'lead_type', value: 'Commission Request' },
      ],
    };

    const beehiivResponse = await fetch(
      `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify(beehiivPayload),
      },
    );

    const beehiivData = await beehiivResponse.json().catch(() => ({}));

    if (!beehiivResponse.ok) {
      console.error('Beehiiv API error', beehiivData);
      throw new Error(
        `Beehiiv subscription failed (${beehiivResponse.status}): ${JSON.stringify(beehiivData)}`,
      );
    }

    logCommissionEvent('beehiiv_success', beehiivData);

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your commission request has been sent. We\'ll be in touch soon.',
      resendId: resendResponse.id,
      beehiiv: beehiivData,
    });
  } catch (error) {
    console.error('Commission form error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred while processing your request',
      },
      { status: 500 }
    );
  }
}

