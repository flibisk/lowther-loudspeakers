import { NextRequest, NextResponse } from 'next/server';

/**
 * Form submission API route
 * Handles form submissions by:
 * 1. Adding contacts to Beehiiv for newsletter management
 * 2. Sending email notifications to the team via Resend
 */

interface FormSubmissionBody {
  name: string;
  email: string;
  message: string;
  segment: string;
  phone?: string;
  location?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FormSubmissionBody = await request.json();
    const { name, email, message, segment, phone, location } = body;

    // Validate required fields
    if (!name || !email || !message || !segment) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const beehiivApiKey = process.env.BEEHIIV_API_KEY;
    const beehiivPublicationId = process.env.BEEHIIV_PUBLICATION_ID;
    const resendApiKey = process.env.RESEND_API_KEY;

    // 1. Add contact to Beehiiv
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
              utm_source: segment,
              send_welcome_email: false,
              custom_fields: [
                {
                  name: 'full_name',
                  value: name
                },
                ...(phone ? [{
                  name: 'phone',
                  value: phone
                }] : []),
                ...(location ? [{
                  name: 'location',
                  value: location
                }] : []),
              ],
            }),
          }
        );

        if (!beehiivResponse.ok) {
          const errorText = await beehiivResponse.text();
          console.error('Beehiiv API error:', errorText);
          // Continue even if Beehiiv fails - we still want to send the notification
        }
      } catch (beehiivError) {
        console.error('Error adding to Beehiiv:', beehiivError);
        // Continue even if Beehiiv fails
      }
    }

    // 2. Send notification email via Resend
    if (resendApiKey) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
        body: JSON.stringify({
          from: 'Lowther Contact Form <noreply@lowtherloudspeakers.com>',
          to: ['hello@lowtherloudspeakers.com', 'peter@lowtherloudspeakers.com'],
          subject: `New ${segment} Enquiry`,
            html: `
              <h2>New ${segment} Enquiry</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
              <p><strong>Segment:</strong> ${segment}</p>
              <hr>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
              <hr>
              <p><em>Submitted: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</em></p>
              <p><em>This contact has been added to Beehiiv with segment: ${segment}</em></p>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error('Resend API error:', errorText);
        }
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your enquiry. We\'ll get back to you soon!' 
    });

  } catch (error) {
    console.error('Error processing form submission:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing form submission. Please try again.' },
      { status: 500 }
    );
  }
}

