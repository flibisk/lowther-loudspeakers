import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/lib/leads/submitLead';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, country, planTitle } = body;

    // Validate required fields
    if (!name || !email || !planTitle) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and plan title are required' },
        { status: 400 }
      );
    }

    // Use shared submitLead helper
    const result = await submitLead({
      name,
      email,
      location: country,
      segment: 'Build-a-Lowther Request',
      planTitle,
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to send plan request' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you! Your plan request has been sent. We\'ll email you the plans shortly.',
      beehiivOk: result.beehiivOk,
    });
  } catch (error) {
    console.error('[PLAN REQUEST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
