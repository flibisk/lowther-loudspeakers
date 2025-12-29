import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/lib/leads/submitLead';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, preferredDate, preferredTime, location, interest, message } = body;

    // Validate required fields
    if (!name || !email || !preferredDate || !location) {
      return NextResponse.json(
        { success: false, message: 'Name, email, preferred date, and location are required' },
        { status: 400 }
      );
    }

    // Format location for display
    const locationName = 
      location === 'norfolk' ? 'Norfolk Workshop' : 
      location === 'london' ? 'London Listening Room' : 
      'Phone Consultation';
    const timeSlot = preferredTime ? 
      (preferredTime === 'morning' ? 'Morning (9:00 - 12:00)' : 
       preferredTime === 'afternoon' ? 'Afternoon (12:00 - 17:00)' : 
       'Evening (17:00 - 19:00)') : 'Not specified';

    // Use shared submitLead helper
    const result = await submitLead({
      name,
      email,
      phone,
      message: message || undefined,
      segment: 'Book Appointment',
      preferredDate: new Date(preferredDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      preferredTime: timeSlot,
      location: locationName,
      interest,
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to send appointment request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your appointment request has been sent. We\'ll be in touch soon to confirm.',
      beehiivOk: result.beehiivOk,
    });
  } catch (error) {
    console.error('[APPOINTMENT FORM] Error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
