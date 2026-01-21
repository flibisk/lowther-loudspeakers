import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

// Helper to get authenticated user
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('tye_session');

  if (!sessionCookie?.value) {
    return null;
  }

  const [userId] = sessionCookie.value.split(':');
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      fullName: true,
      address: true,
      country: true,
      level: true,
      role: true,
      passwordHash: true,
    },
  });

  return user;
}

// GET /api/account/profile - Get current user's profile
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Don't expose passwordHash
    const { passwordHash, ...profile } = user;

    return NextResponse.json({ user: profile });
  } catch (error) {
    console.error('[PROFILE GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/account/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName, address, country, password } = body;

    // Build update data
    const updateData: {
      fullName?: string | null;
      address?: string | null;
      country?: string | null;
      passwordHash?: string;
    } = {};

    if (fullName !== undefined) {
      updateData.fullName = fullName;
    }

    if (address !== undefined) {
      updateData.address = address;
    }

    if (country !== undefined) {
      updateData.country = country;
    }

    // Hash password if provided
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters' },
          { status: 400 }
        );
      }
      updateData.passwordHash = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        displayName: true,
        fullName: true,
        address: true,
        country: true,
        level: true,
        role: true,
      },
    });

    console.log(`[PROFILE UPDATE] User ${user.email} updated profile`);

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('[PROFILE UPDATE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
