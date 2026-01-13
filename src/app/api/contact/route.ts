import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/lib/leads/submitLead';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, location, message, segment, turnstileToken } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Verify Turnstile token (skip if not configured - for development)
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
      phone,
      location,
      message,
      segment: segment || 'Contact',
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us! We\'ll get back to you soon.',
      beehiivOk: result.beehiivOk,
    });
  } catch (error) {
    console.error('[CONTACT FORM] Error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
