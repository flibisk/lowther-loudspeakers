import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';

// GET: Fetch comments for an album
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const albumId = searchParams.get('albumId');
    const sort = searchParams.get('sort') || 'newest';

    if (!albumId) {
      return NextResponse.json(
        { error: 'Album ID is required' },
        { status: 400 }
      );
    }

    // Get current user ID if logged in
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('tye_session');
    const currentUserId = sessionCookie?.value?.split(':')[0] || null;

    // Determine sort order
    const orderBy = sort === 'popular' 
      ? { likesCount: 'desc' as const }
      : { createdAt: 'desc' as const };

    // Fetch top-level comments (no parentId)
    const comments = await prisma.comment.findMany({
      where: { 
        albumId,
        parentId: null, // Only top-level comments
      },
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
        likes: currentUserId ? {
          where: { userId: currentUserId },
          select: { id: true },
        } : false,
        replies: {
          orderBy: { createdAt: 'asc' }, // Replies in chronological order
          include: {
            user: {
              select: {
                id: true,
                email: true,
                displayName: true,
              },
            },
            likes: currentUserId ? {
              where: { userId: currentUserId },
              select: { id: true },
            } : false,
          },
        },
      },
    });

    // Transform comments to include hasLiked and mask emails
    const transformedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      likesCount: comment.likesCount,
      hasLiked: Array.isArray(comment.likes) ? comment.likes.length > 0 : false,
      user: {
        id: comment.user.id,
        displayName: getDisplayName(comment.user),
      },
      replies: comment.replies?.map(reply => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        likesCount: reply.likesCount,
        hasLiked: Array.isArray(reply.likes) ? reply.likes.length > 0 : false,
        user: {
          id: reply.user.id,
          displayName: getDisplayName(reply.user),
        },
      })) || [],
    }));

    return NextResponse.json({ comments: transformedComments });
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
    const { albumId, content, parentId } = body;

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

    // If replying, verify parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: trimmedContent,
        albumId,
        userId,
        parentId: parentId || null,
        likesCount: 0,
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

    console.log(`[COMMENTS] New ${parentId ? 'reply' : 'comment'} on "${album.title}" by ${user.email}`);

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        likesCount: 0,
        hasLiked: false,
        user: {
          id: comment.user.id,
          displayName: getDisplayName(comment.user),
        },
        replies: [],
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

// Get display name - use username if set, otherwise show "Anonymous"
function getDisplayName(user: { displayName: string | null; email: string }): string {
  if (user.displayName) {
    return user.displayName;
  }
  // Fallback for users who signed up before usernames were required
  return 'Anonymous';
}
