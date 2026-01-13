import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('tye_session');

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const [userId] = sessionCookie.value.split(':');
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username } = body;

    // Validate username
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (trimmedUsername.length > 20) {
      return NextResponse.json(
        { error: 'Username must be 20 characters or less' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    // Check if username is already taken (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: {
        displayName: {
          equals: trimmedUsername,
          mode: 'insensitive',
        },
        NOT: {
          id: userId,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'This username is already taken' },
        { status: 409 }
      );
    }

    // Update user's displayName
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { displayName: trimmedUsername },
      select: {
        id: true,
        email: true,
        displayName: true,
      },
    });

    console.log(`[AUTH] User ${user.email} set username to "${trimmedUsername}"`);

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Set username error:', error);
    return NextResponse.json(
      { error: 'Failed to set username' },
      { status: 500 }
    );
  }
}
