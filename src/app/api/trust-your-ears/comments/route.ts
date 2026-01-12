import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';

// GET: Fetch comments for an album
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const albumId = searchParams.get('albumId');

    if (!albumId) {
      return NextResponse.json(
        { error: 'Album ID is required' },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { albumId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
      },
    });

    // Mask emails for privacy (show first letter + domain)
    const maskedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: {
        id: comment.user.id,
        displayName: comment.user.displayName || maskEmail(comment.user.email),
      },
    }));

    return NextResponse.json({ comments: maskedComments });
  } catch (error) {
    console.error('Fetch comments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST: Create a new comment
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('tye_session');

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: 'You must be signed in to comment' },
        { status: 401 }
      );
    }

    // Parse session
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
    const { albumId, content } = body;

    if (!albumId || !content) {
      return NextResponse.json(
        { error: 'Album ID and content are required' },
        { status: 400 }
      );
    }

    // Validate content
    const trimmedContent = content.trim();
    if (trimmedContent.length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (trimmedContent.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be less than 1000 characters' },
        { status: 400 }
      );
    }

    // Verify album exists
    const album = await prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: trimmedContent,
        albumId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
      },
    });

    console.log(`[COMMENTS] New comment on "${album.title}" by ${user.email}`);

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          displayName: comment.user.displayName || maskEmail(comment.user.email),
        },
      },
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// Helper to mask email for privacy
function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return 'Anonymous';
  
  const firstChar = localPart.charAt(0);
  const maskedLocal = firstChar + '***';
  
  return `${maskedLocal}@${domain}`;
}
