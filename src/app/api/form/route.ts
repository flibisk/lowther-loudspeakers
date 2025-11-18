import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * Form submission API route
 * Handles form submissions by:
 * 1. Adding contacts to Beehiiv for newsletter management
 * 2. Sending email notifications to the team via Resend
 */

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@lowtherloudspeakers.com';
    const contactEmail = process.env.CONTACT_EMAIL || 'social@lowtherloudspeakers.com';
    const secondaryEmail = process.env.RESEND_SECONDARY_EMAIL || 'hello@lowtherloudspeakers.com';

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
    try {
      const { data, error } = await resend.emails.send({
        from: `Lowther Website <${fromEmail}>`,
        to: [contactEmail, secondaryEmail],
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
                <h1>New ${segment || 'Contact'} Form Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                ${phone ? `
                <div class="field">
                  <div class="label">Phone</div>
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
                  <div class="label">Segment</div>
                  <div class="value">${segment}</div>
                </div>
                <div class="field">
                  <div class="label">Message</div>
                  <div class="value" style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="footer">
                  <p>Submitted: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
                  <p>This contact has been added to Beehiiv with segment: ${segment}</p>
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
            message: process.env.NODE_ENV === 'development' 
              ? `Email error: ${error.message}` 
              : 'Failed to send email notification. Please try again or contact us directly.' 
          },
          { status: 500 }
        );
      }

      console.log('Form submission email sent successfully:', data);
    } catch (emailError: any) {
      console.error('Error sending notification email:', emailError);
      return NextResponse.json(
        { 
          success: false, 
          message: process.env.NODE_ENV === 'development' 
            ? `Error: ${emailError.message}` 
            : 'Failed to send email notification. Please try again or contact us directly.' 
        },
        { status: 500 }
      );
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

