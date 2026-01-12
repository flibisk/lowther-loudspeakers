import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting: max 3 codes per email per 10 minutes
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 3;

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const attempts = rateLimitMap.get(email) || [];
  
  // Filter to only recent attempts
  const recentAttempts = attempts.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentAttempts.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  recentAttempts.push(now);
  rateLimitMap.set(email, recentAttempts);
  return true;
}

function generateCode(): string {
  // Generate a 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check rate limit
    if (!checkRateLimit(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait a few minutes.' },
        { status: 429 }
      );
    }

    // Generate verification code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store the code in database
    await prisma.verificationCode.create({
      data: {
        email: normalizedEmail,
        code,
        expiresAt,
      },
    });

    // Send email with code
    const { error: emailError } = await resend.emails.send({
      from: 'Lowther Loudspeakers <mrbird@lowtherloudspeakers.com>',
      to: normalizedEmail,
      subject: 'Your verification code for Trust Your Ears',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Georgia', serif;
                line-height: 1.6;
                color: #333;
                max-width: 500px;
                margin: 0 auto;
                padding: 40px 20px;
              }
              .code {
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #1a1a1a;
                background: #f5f5f5;
                padding: 20px 30px;
                text-align: center;
                border-radius: 8px;
                margin: 30px 0;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e5e5;
                font-size: 13px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <p>Hello,</p>
            <p>Here's your verification code for Trust Your Ears:</p>
            <div class="code">${code}</div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, you can safely ignore this email.</p>
            <div class="footer">
              <p>Lowther Loudspeakers<br>
              Handcrafted in Norfolk, England</p>
            </div>
          </body>
        </html>
      `,
      text: `Your verification code for Trust Your Ears is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`,
    });

    if (emailError) {
      console.error('Failed to send verification email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    console.log(`[AUTH] Verification code sent to ${normalizedEmail}`);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
    });
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
