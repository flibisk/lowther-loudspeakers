import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/lib/leads/submitLead';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, address, referrer, questions, speakerName, turnstileToken } = body;

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
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
      name: fullName,
      email,
      phone,
      location: address,
      message: questions || referrer ? `${referrer ? `How did you hear about us: ${referrer}\n\n` : ''}${questions || ''}` : undefined,
      segment: 'Commission Request',
      speakerInterest: speakerName,
      address,
      referrer,
      questions,
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to send commission request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your commission request has been sent. We\'ll be in touch soon.',
      beehiivOk: result.beehiivOk,
    });
  } catch (error) {
    console.error('[COMMISSION FORM] Error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
