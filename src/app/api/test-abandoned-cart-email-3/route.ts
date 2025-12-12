import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { buildFinalCallEmail, CartItem } from '@/lib/abandoned-cart/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Test API route for abandoned cart Email 3
 * 
 * Usage:
 * POST /api/test-abandoned-cart-email-3
 * Body: { "email": "your-email@example.com" }
 * 
 * Or GET /api/test-abandoned-cart-email-3?email=your-email@example.com
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

    // Use cart items from request body if provided, otherwise use defaults
    const testCartItems: CartItem[] = body.cartItems || [
      {
        title: 'PM6A Concert',
        quantity: 1,
        price: '£1,200.00',
      },
      {
        title: 'Lowther Standard Dome',
        quantity: 1,
        price: '£60.00',
      },
    ];

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com';
    const cartUrl = `${siteUrl}/products`;

    // Generate email HTML
    const html = buildFinalCallEmail(cartUrl, testCartItems);

    // Send test email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@lowtherloudspeakers.com';
    
    const { data, error } = await resend.emails.send({
      from: `Lowther Loudspeakers <${fromEmail}>`,
      to: testEmail,
      replyTo: fromEmail,
      subject: 'Test: Your reserved build queue slot expires tomorrow',
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
      message: `Test email 3 sent to ${testEmail}`,
      emailId: data?.id,
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
          usage: 'GET /api/test-abandoned-cart-email-3?email=your-email@example.com'
        },
        { status: 400 }
      );
    }

    // Use cart items from query params if provided, otherwise use defaults
    const cartItemsParam = searchParams.get('cartItems');
    let testCartItems: CartItem[] = [
      {
        title: 'PM6A Concert',
        quantity: 1,
        price: '£1,200.00',
      },
      {
        title: 'Lowther Standard Dome',
        quantity: 1,
        price: '£60.00',
      },
    ];
    
    if (cartItemsParam) {
      try {
        testCartItems = JSON.parse(cartItemsParam);
      } catch (e) {
        // If parsing fails, use defaults
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lowtherloudspeakers.com';
    const cartUrl = `${siteUrl}/products`;

    // Generate email HTML
    const html = buildFinalCallEmail(cartUrl, testCartItems);

    // Send test email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@lowtherloudspeakers.com';
    
    const { data, error } = await resend.emails.send({
      from: `Lowther Loudspeakers <${fromEmail}>`,
      to: testEmail,
      replyTo: fromEmail,
      subject: 'Test: Your reserved build queue slot expires tomorrow',
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
      message: `Test email 3 sent to ${testEmail}`,
      emailId: data?.id,
    });

  } catch (error) {
    console.error('Error in test email route:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing test email request' },
      { status: 500 }
    );
  }
}

