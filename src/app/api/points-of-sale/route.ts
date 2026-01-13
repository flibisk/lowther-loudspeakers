import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/lib/leads/submitLead';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, preferredLocation, turnstileToken } = body;

    // Validate required fields
    if (!name || !email || !preferredLocation) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and preferred location are required' },
        { status: 400 }
      );
    }

    // Verify Turnstile token
    if (process.env.TURNSTILE_SECRET_KEY) {
      const verification = await verifyTurnstileToken(turnstileToken);
      if (!verification.success) {
        return NextResponse.json(
          { success: false, message: verification.error || 'Security verification failed' },
          { status: 400 }
        );
      }
    }

    // Use shared submitLead helper
    const result = await submitLead({
      name,
      email,
      message: `Preferred Location: ${preferredLocation}`,
      segment: 'Points of Sale Enquiry',
      location: preferredLocation,
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to send enquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! We\'ll contact you about points of sale in your preferred location.',
      beehiivOk: result.beehiivOk,
    });
  } catch (error) {
    console.error('[POINTS OF SALE FORM] Error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
