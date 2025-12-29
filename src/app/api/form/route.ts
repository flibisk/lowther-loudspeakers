import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/lib/leads/submitLead';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, segment, phone, location } = body;

    // Validate required fields
    if (!name || !email || !message || !segment) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use shared submitLead helper
    const result = await submitLead({
      name,
      email,
      phone,
      location,
      message,
      segment,
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to send email notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your enquiry. We\'ll get back to you soon!',
      beehiivOk: result.beehiivOk,
    });
  } catch (error) {
    console.error('[FORM SUBMISSION] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing form submission. Please try again.' },
      { status: 500 }
    );
  }
}
