import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate 6-digit verification code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate session token
function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Discount Signup API route
 * Handles discount popup email submissions with account creation:
 * 1. Send verification code (action: 'send-code')
 * 2. Verify code and create account (action: 'verify-code')
 * 3. Add to Beehiiv and send discount email
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, code } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // STEP 1: Send verification code
    if (action === 'send-code') {
      // Check if Resend API key is configured
      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not configured');
        return NextResponse.json(
          { success: false, message: 'Email service not configured.' },
          { status: 500 }
        );
      }

      // Generate and store verification code
      const verificationCode = generateCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.verificationCode.create({
        data: {
          email: normalizedEmail,
          code: verificationCode,
          expiresAt,
        },
      });

      // Send verification email
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'mrbird@lowtherloudspeakers.com';
      
      const { error } = await resend.emails.send({
        from: `Lowther Loudspeakers <${fromEmail}>`,
        to: normalizedEmail,
        subject: 'Your verification code for Lowther',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: 0 auto; padding: 20px; }
                .code { font-size: 36px; font-weight: bold; color: #c59862; letter-spacing: 8px; text-align: center; padding: 20px; background: #f9f9f9; border-radius: 8px; margin: 20px 0; }
                .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
              </style>
            </head>
            <body>
              <p>Hello,</p>
              <p>Here's your verification code to claim your discount:</p>
              <div class="code">${verificationCode}</div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, you can safely ignore this email.</p>
              <div class="footer">
                <p>Lowther Loudspeakers<br>Handcrafted in Great Britain</p>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error('Failed to send verification code:', error);
        return NextResponse.json(
          { success: false, message: 'Failed to send verification code. Please try again.' },
          { status: 500 }
        );
      }

      console.log(`[DISCOUNT] Verification code sent to ${normalizedEmail}`);
      return NextResponse.json({ success: true, message: 'Verification code sent!' });
    }

    // STEP 2: Verify code and complete signup
    if (action === 'verify-code') {
      if (!code) {
        return NextResponse.json(
          { success: false, message: 'Verification code is required' },
          { status: 400 }
        );
      }

      // Find the verification code
      const verification = await prisma.verificationCode.findFirst({
        where: {
          email: normalizedEmail,
          code: code.trim(),
          used: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!verification) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired code' },
          { status: 400 }
        );
      }

      // Mark code as used
      await prisma.verificationCode.update({
        where: { id: verification.id },
        data: { used: true },
      });

      // Create or get user
      let user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      const isNewUser = !user;

      if (!user) {
        user = await prisma.user.create({
          data: { email: normalizedEmail },
        });
        console.log(`[DISCOUNT] New user created: ${normalizedEmail}`);
      } else {
        // Update last login
        user = await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        console.log(`[DISCOUNT] Existing user logged in: ${normalizedEmail}`);
      }

      // Set session cookie
      const sessionToken = generateSessionToken();
      const cookieStore = await cookies();
      
      cookieStore.set('tye_session', `${user.id}:${sessionToken}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });

      cookieStore.set('tye_user', JSON.stringify({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      }), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });

      // Get discount code
      const discountCode = process.env.DISCOUNT_CODE || 'WELCOME20';
      const discountPercent = parseInt(process.env.DISCOUNT_PERCENT || '20', 10);

      // Add to Beehiiv
      const beehiivApiKey = process.env.BEEHIIV_API_KEY;
      const beehiivPublicationId = process.env.BEEHIIV_PUBLICATION_ID;

      if (beehiivApiKey && beehiivPublicationId) {
        try {
          await fetch(
            `https://api.beehiiv.com/v2/publications/${beehiivPublicationId}/subscriptions`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${beehiivApiKey}`,
              },
              body: JSON.stringify({
                email: normalizedEmail,
                reactivate_existing: true,
                utm_source: 'website',
                utm_medium: 'discount_popup',
                utm_campaign: 'welcome_discount',
                send_welcome_email: false,
                custom_fields: [
                  { name: 'lead_type', value: 'Discount Subscriber' },
                  { name: 'discount_code', value: discountCode },
                ],
              }),
            }
          );
          console.log(`[DISCOUNT] Added ${normalizedEmail} to Beehiiv`);
        } catch (beehiivError) {
          console.error('Beehiiv error:', beehiivError);
        }
      }

      // Send discount code email
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'mrbird@lowtherloudspeakers.com';
      let emailSent = false;

      try {
        const { error } = await resend.emails.send({
          from: `Lowther Loudspeakers <${fromEmail}>`,
          to: normalizedEmail,
          subject: `Your ${discountPercent}% Discount Code - Lowther Loudspeakers`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #c59862 0%, #b0874f 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 40px; border-radius: 0 0 10px 10px; }
                  .discount-code { background: white; border: 3px dashed #c59862; padding: 30px; text-align: center; margin: 30px 0; border-radius: 8px; }
                  .code { font-size: 32px; font-weight: bold; color: #c59862; letter-spacing: 4px; margin: 10px 0; }
                  .button { display: inline-block; background: #000; color: white !important; padding: 15px 40px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: bold; }
                  .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>Welcome to Lowther!</h1>
                  <p style="font-size: 18px; margin-top: 10px;">Your exclusive discount is here</p>
                </div>
                <div class="content">
                  <p>Thank you for creating your account! As a welcome gift, here's your <strong>${discountPercent}% discount code</strong>:</p>
                  
                  <div class="discount-code">
                    <p style="margin: 0; color: #666; font-size: 14px;">USE CODE:</p>
                    <div class="code">${discountCode}</div>
                    <p style="margin: 0; color: #666; font-size: 14px;">Save ${discountPercent}% on your first order</p>
                  </div>

                  <p>Simply enter this code at checkout to receive your discount.</p>

                  <div style="text-align: center;">
                    <a href="https://www.lowtherloudspeakers.com/account" class="button">Complete Your Profile</a>
                  </div>

                  <p style="margin-top: 20px; font-size: 14px;">Complete your profile to unlock more features like tracking your orders, saving your wishlist, and joining our community discussions.</p>

                  <div class="footer">
                    <p>Lowther Loudspeakers<br>
                    <a href="https://www.lowtherloudspeakers.com" style="color: #c59862;">www.lowtherloudspeakers.com</a></p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        if (!error) {
          emailSent = true;
          console.log(`[DISCOUNT] Discount email sent to ${normalizedEmail}`);
        }
      } catch (emailError) {
        console.error('Failed to send discount email:', emailError);
      }

      return NextResponse.json({
        success: true,
        discountCode,
        discountPercent,
        emailSent,
        isNewUser,
        needsUsername: !user.displayName,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error processing discount signup:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing request. Please try again.' },
      { status: 500 }
    );
  }
}

