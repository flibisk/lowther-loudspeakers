import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, country, planTitle } = body;

    // 1. Add to Beehiiv
    // You'll need to add your Beehiiv API key to your environment variables
    const beehiivApiKey = process.env.BEEHIIV_API_KEY;
    const beehiivPublicationId = process.env.BEEHIIV_PUBLICATION_ID;

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
              reactivate_existing: false,
              send_welcome_email: true,
              utm_source: 'website',
              utm_medium: 'build-a-lowther',
              utm_campaign: planTitle,
              // Add custom fields if you have them set up in Beehiiv
              custom_fields: [
                {
                  name: 'full_name',
                  value: name
                },
                {
                  name: 'country',
                  value: country
                },
                {
                  name: 'plan_requested',
                  value: planTitle
                }
              ],
              // Tag for audience segmentation
              tags: ['build-your-own']
            }),
          }
        );

        if (!beehiivResponse.ok) {
          console.error('Beehiiv API error:', await beehiivResponse.text());
        }
      } catch (beehiivError) {
        console.error('Error adding to Beehiiv:', beehiivError);
        // Continue even if Beehiiv fails - we still want to send the notification email
      }
    }

    // 2. Send notification email to hello@lowtherloudpeakers.com
    // You can use a service like Resend, SendGrid, or Postmark
    // Example with Resend (you'll need to install: npm install resend)
    
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Build a Lowther <noreply@lowtherloudpeakers.com>',
            to: ['hello@lowtherloudpeakers.com', 'peter@lowtherloudpeakers.com'],
            subject: `New Plan Request: ${planTitle}`,
            html: `
              <h2>New Build a Lowther Plan Request</h2>
              <p><strong>Plan:</strong> ${planTitle}</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Country:</strong> ${country}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              <hr>
              <p><em>This subscriber has been added to Beehiiv with the "build-your-own" tag.</em></p>
            `,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Email API error:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully' 
    });

  } catch (error) {
    console.error('Error processing form submission:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing form submission' },
      { status: 500 }
    );
  }
}



