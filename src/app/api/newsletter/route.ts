import { NextRequest, NextResponse } from 'next/server';

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

    const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
    const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

    if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
      console.error('Beehiiv API credentials not configured');
      return NextResponse.json(
        { success: false, message: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // Subscribe to Beehiiv
    const beehiivPayload = {
      email,
      reactivate_existing: false,
      send_welcome_email: true,
      utm_source: 'website',
      utm_medium: 'footer',
      referring_site: 'lowtherloudspeakers.com',
    };

    console.log('Newsletter signup - Sending to Beehiiv:', JSON.stringify(beehiivPayload, null, 2));

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify(beehiivPayload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Beehiiv API error:', data);
      console.error('Full error details:', JSON.stringify(data, null, 2));
      
      // Handle specific error cases
      if (response.status === 400 && data.error?.includes('already subscribed')) {
        return NextResponse.json({
          success: true,
          message: 'You\'re already subscribed to our newsletter!',
        });
      }

      return NextResponse.json(
        { 
          success: false, 
          message: process.env.NODE_ENV === 'development' 
            ? `Beehiiv Error: ${data.message || 'Failed to subscribe'}` 
            : 'Failed to subscribe. Please try again.' 
        },
        { status: 500 }
      );
    }

    console.log('Successfully subscribed to newsletter:', data);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email to confirm.',
      data,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

