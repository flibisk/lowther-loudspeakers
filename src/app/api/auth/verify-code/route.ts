import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';

// Session token generation
function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Add to Beehiiv
async function addToBeehiiv(email: string): Promise<boolean> {
  const beehiivApiKey = process.env.BEEHIIV_API_KEY;
  const beehiivPublicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!beehiivApiKey || !beehiivPublicationId) {
    console.log('[AUTH] Beehiiv not configured, skipping');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${beehiivPublicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${beehiivApiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: false,
          utm_source: 'website',
          utm_medium: 'account_signup',
          utm_campaign: 'listening_circle',
          referring_site: 'lowtherloudspeakers.com',
          custom_fields: [
            { name: 'lead_type', value: 'Listening Circle Member' },
          ],
        }),
      }
    );

    if (response.ok) {
      console.log(`[AUTH] Added ${email} to Beehiiv`);
      return true;
    } else {
      const errorText = await response.text();
      console.error('[AUTH] Beehiiv error:', errorText);
      return false;
    }
  } catch (error) {
    console.error('[AUTH] Beehiiv error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedCode = code.trim();

    // Find the verification code
    const verification = await prisma.verificationCode.findFirst({
      where: {
        email: normalizedEmail,
        code: normalizedCode,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      );
    }

    // Mark the code as used
    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: { used: true },
    });

    // Create or update user
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const isNewUser = !user;

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
        },
      });
      console.log(`[AUTH] New user created: ${normalizedEmail}`);
      
      // Add new users to Beehiiv
      await addToBeehiiv(normalizedEmail);
    } else {
      // Update last login
      user = await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
      console.log(`[AUTH] User logged in: ${normalizedEmail}`);
    }

    // Generate session token
    const sessionToken = generateSessionToken();

    // Set session cookie (30 days)
    const cookieStore = await cookies();
    cookieStore.set('tye_session', `${user.id}:${sessionToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    // Also set a client-readable cookie for UI state
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

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
      isNewUser,
    });
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
