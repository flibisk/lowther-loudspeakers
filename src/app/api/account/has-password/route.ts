import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

// GET /api/account/has-password - Check if user has a password set
export async function GET() {
  try {
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      hasPassword: !!user.passwordHash 
    });
  } catch (error) {
    console.error('[HAS-PASSWORD] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check password status' },
      { status: 500 }
    );
  }
}
