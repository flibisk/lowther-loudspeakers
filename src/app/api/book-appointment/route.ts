import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Book appointment handler - sends email via Resend and adds to Beehiiv
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, preferredDate, preferredTime, location, interest, message } = body;

    // Validate required fields
    if (!name || !email || !preferredDate || !location) {
      return NextResponse.json(
        { success: false, message: 'Name, email, preferred date, and location are required' },
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

    // Use configured email or fallback to sandbox
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const contactEmail = process.env.CONTACT_EMAIL || 'social@lowtherloudspeakers.com';
    const secondaryEmail = process.env.RESEND_SECONDARY_EMAIL || 'hello@lowtherloudspeakers.com';

    // Format location for display
    const locationName = 
      location === 'norfolk' ? 'Norfolk Workshop' : 
      location === 'london' ? 'London Listening Room' : 
      'Phone Consultation';
    const timeSlot = preferredTime ? 
      (preferredTime === 'morning' ? 'Morning (9:00 - 12:00)' : 
       preferredTime === 'afternoon' ? 'Afternoon (12:00 - 17:00)' : 
       'Evening (17:00 - 19:00)') : 'Not specified';

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `Lowther Website <${fromEmail}>`,
      to: [contactEmail, secondaryEmail],
      replyTo: email,
      subject: `Appointment Request: ${locationName} - ${name}`,
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
              .location-badge {
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
              <h1 style="margin: 0; font-size: 28px; font-weight: normal;">New Appointment Request</h1>
              <div class="location-badge">${locationName}</div>
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
              
              <div class="field">
                <div class="label">Preferred Date</div>
                <div class="value">${new Date(preferredDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              
              <div class="field">
                <div class="label">Preferred Time</div>
                <div class="value">${timeSlot}</div>
              </div>
              
              ${interest ? `
              <div class="field">
                <div class="label">Interest</div>
                <div class="value">${interest}</div>
              </div>
              ` : ''}
              
              ${message ? `
              <div class="field">
                <div class="label">Additional Information</div>
                <div class="value" style="white-space: pre-wrap;">${message}</div>
              </div>
              ` : ''}
              
              <div class="footer">
                <p>This appointment request was submitted through the Book Appointment page.</p>
                <p>Location: ${locationName}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      const errorMessage = error.message || 'Failed to send appointment request';
      console.error('Full error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { 
          success: false, 
          message: process.env.NODE_ENV === 'development' 
            ? `Error: ${errorMessage}` 
            : 'Failed to send appointment request. Please try again or contact us directly.' 
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
          utm_medium: 'appointment_booking',
          utm_campaign: locationName,
          referring_site: 'lowtherloudspeakers.com',
          custom_fields: [
            { name: 'full_name', value: name },
            { name: 'phone', value: phone || '' },
            { name: 'preferred_location', value: locationName },
            { name: 'interest', value: interest || '' },
            { name: 'lead_type', value: 'Appointment Request' },
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
      message: 'Thank you! Your appointment request has been sent. We\'ll be in touch soon to confirm.',
      data,
    });

  } catch (error) {
    console.error('Appointment booking error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

