import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('tye_session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null });
    }

    // Parse session: userId:token
    const [userId] = sessionCookie.value.split(':');

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
      },
    });

    if (!user) {
      // Clear invalid session
      cookieStore.delete('tye_session');
      cookieStore.delete('tye_user');
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null });
  }
}
