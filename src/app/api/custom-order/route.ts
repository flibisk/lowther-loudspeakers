import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/lib/leads/submitLead';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, country, bespokeVeneer, magnetType, extraQuestions, productName } = body;

    // Validate required fields
    if (!name || !email || !country || !magnetType || !productName) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use shared submitLead helper
    const result = await submitLead({
      name,
      email,
      location: country,
      message: extraQuestions || undefined,
      segment: 'Custom Order',
      productName,
      magnetType,
      bespokeVeneer,
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to send email notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your custom order enquiry. We\'ll get back to you soon!',
      beehiivOk: result.beehiivOk,
    });
  } catch (error) {
    console.error('[CUSTOM ORDER] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing form submission. Please try again.' },
      { status: 500 }
    );
  }
}
