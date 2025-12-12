import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { buildNarrativeEmail, CartItem } from '@/lib/abandoned-cart/email-templates';
import { getNarrativesForCartItems } from '@/lib/abandoned-cart/match-narrative';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Test API route for abandoned cart Email 2
 * 
 * Usage:
 * POST /api/test-abandoned-cart-email-2
 * Body: { "email": "your-email@example.com" }
 * 
 * Or GET /api/test-abandoned-cart-email-2?email=your-email@example.com
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const testEmail = body.email;

    if (!testEmail || !testEmail.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Sample cart items for testing (with products that have narratives)
    const testCartItems: CartItem[] = [
      {
        title: 'DX2 Concert',
        quantity: 1,
        price: '£420.00',
      },
      {
        title: 'PM6A Concert',
        quantity: 1,
        price: '£1,200.00',
      },
    ];

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com';
    const cartUrl = `${siteUrl}/products`;

    // Get narratives for cart items
    const narratives = getNarrativesForCartItems(testCartItems);

    // Generate email HTML
    const html = buildNarrativeEmail(narratives, cartUrl, testCartItems);

    // Send test email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@lowtherloudspeakers.com';
    
    const { data, error } = await resend.emails.send({
      from: `Lowther Loudspeakers <${fromEmail}>`,
      to: testEmail,
      replyTo: fromEmail,
      subject: 'Test: A closer look at the instruments in your cart',
      html,
    });

    if (error) {
      console.error('Error sending test email:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send test email',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email 2 sent to ${testEmail}`,
      emailId: data?.id,
      narrativesFound: narratives.length,
    });

  } catch (error) {
    console.error('Error in test email route:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing test email request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email');

    if (!testEmail || !testEmail.includes('@')) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Valid email address is required',
          usage: 'GET /api/test-abandoned-cart-email-2?email=your-email@example.com'
        },
        { status: 400 }
      );
    }

    // Sample cart items for testing
    const testCartItems: CartItem[] = [
      {
        title: 'DX2 Concert',
        quantity: 1,
        price: '£420.00',
      },
      {
        title: 'PM6A Concert',
        quantity: 1,
        price: '£1,200.00',
      },
    ];

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com';
    const cartUrl = `${siteUrl}/products`;

    // Get narratives for cart items
    const narratives = getNarrativesForCartItems(testCartItems);

    // Generate email HTML
    const html = buildNarrativeEmail(narratives, cartUrl, testCartItems);

    // Send test email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@lowtherloudspeakers.com';
    
    const { data, error } = await resend.emails.send({
      from: `Lowther Loudspeakers <${fromEmail}>`,
      to: testEmail,
      replyTo: fromEmail,
      subject: 'Test: A closer look at the instruments in your cart',
      html,
    });

    if (error) {
      console.error('Error sending test email:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send test email',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email 2 sent to ${testEmail}`,
      emailId: data?.id,
      narrativesFound: narratives.length,
    });

  } catch (error) {
    console.error('Error in test email route:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing test email request' },
      { status: 500 }
    );
  }
}

