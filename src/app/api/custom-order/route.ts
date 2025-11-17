import { NextRequest, NextResponse } from 'next/server';

/**
 * Custom Order API route
 * Handles custom order form submissions by:
 * 1. Adding contacts to Beehiiv for newsletter management
 * 2. Sending email notifications to the team via Resend
 */

interface CustomOrderBody {
  name: string;
  email: string;
  country: string;
  bespokeVeneer: string;
  magnetType: string;
  extraQuestions: string;
  productName: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CustomOrderBody = await request.json();
    const { name, email, country, bespokeVeneer, magnetType, extraQuestions, productName } = body;

    // Validate required fields
    if (!name || !email || !country || !magnetType || !productName) {
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
              utm_source: 'Custom Order',
              send_welcome_email: false,
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
                  name: 'product_interest',
                  value: productName
                },
                {
                  name: 'magnet_type',
                  value: magnetType
                },
                ...(bespokeVeneer ? [{
                  name: 'bespoke_veneer',
                  value: bespokeVeneer
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
            from: 'Lowther Custom Order <noreply@lowtherloudspeakers.com>',
            to: ['hello@lowtherloudspeakers.com', 'peter@lowtherloudspeakers.com'],
            subject: `New Custom Order Enquiry - ${productName}`,
            html: `
              <h2>New Custom Order Enquiry</h2>
              <p><strong>Product:</strong> ${productName}</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Country:</strong> ${country}</p>
              <p><strong>Magnet Type:</strong> ${magnetType}</p>
              ${bespokeVeneer ? `<p><strong>Bespoke Veneer:</strong> ${bespokeVeneer}</p>` : ''}
              ${extraQuestions ? `<hr><p><strong>Extra Questions/Requirements:</strong></p><p>${extraQuestions.replace(/\n/g, '<br>')}</p>` : ''}
              <hr>
              <p><em>Submitted: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</em></p>
              <p><em>This contact has been added to Beehiiv with segment: Custom Order</em></p>
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
      message: 'Thank you for your custom order enquiry. We\'ll get back to you soon!' 
    });

  } catch (error) {
    console.error('Error processing custom order submission:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing form submission. Please try again.' },
      { status: 500 }
    );
  }
}

