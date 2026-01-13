import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';
import { getAlbumById } from '@/lib/musicbrainz/client';
import { getCoverArtUrl, getPlaceholderImageUrl } from '@/lib/cover-art-archive/client';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('tye_session');

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: 'You must be signed in to recommend albums' },
        { status: 401 }
      );
    }

    // Parse session: userId:token
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
    const { musicBrainzReleaseGroupId, comment } = body;

    if (!musicBrainzReleaseGroupId || typeof musicBrainzReleaseGroupId !== 'string') {
      return NextResponse.json(
        { error: 'musicBrainzReleaseGroupId is required' },
        { status: 400 }
      );
    }

    // Require a comment explaining why they're recommending
    if (!comment || typeof comment !== 'string' || comment.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please explain why you\'re recommending this album (at least 20 characters)' },
        { status: 400 }
      );
    }

    const trimmedComment = comment.trim();
    if (trimmedComment.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be less than 1000 characters' },
        { status: 400 }
      );
    }

    // Use user ID as the voter hash for authenticated users
    const voterHash = `user:${userId}`;

    // Check if album exists in database
    let album = await prisma.album.findUnique({
      where: { musicBrainzReleaseGroupId },
    });

    // If album was featured more than 30 days ago, reset it for re-discussion
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    if (album && album.featuredAt) {
      const featuredAge = Date.now() - new Date(album.featuredAt).getTime();
      if (featuredAge > THIRTY_DAYS_MS) {
        // Reset the album so it can be featured again - keep all existing comments
        album = await prisma.album.update({
          where: { id: album.id },
          data: { 
            featuredAt: null,
            votesCount: 1, // Start fresh with this vote
          },
        });
        
        // Also clear old votes so people can vote again
        await prisma.vote.deleteMany({
          where: { albumId: album.id },
        });
        
        console.log(`[VOTE] Album "${album.title}" reset for re-discussion after 30 days`);
      }
    }

    if (!album) {
      // Fetch album metadata from MusicBrainz
      const musicBrainzAlbum = await getAlbumById(musicBrainzReleaseGroupId);
      
      if (!musicBrainzAlbum) {
        return NextResponse.json(
          { error: 'Album not found on MusicBrainz' },
          { status: 404 }
        );
      }

      // Fetch cover art
      const coverUrl = await getCoverArtUrl(musicBrainzReleaseGroupId);

      // Create new album
      album = await prisma.album.create({
        data: {
          musicBrainzReleaseGroupId: musicBrainzAlbum.musicBrainzReleaseGroupId,
          title: musicBrainzAlbum.title,
          artist: musicBrainzAlbum.artist,
          year: musicBrainzAlbum.year,
          coverUrl: coverUrl || getPlaceholderImageUrl(),
          votesCount: 0,
        },
      });

      console.log(`[VOTE] New album added: "${album.title}" by ${album.artist}`);
    }

    // Check if user has already voted for this album
    const existingVote = await prisma.vote.findUnique({
      where: {
        albumId_voterHash: {
          albumId: album.id,
          voterHash,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already recommended this album', alreadyVoted: true },
        { status: 409 }
      );
    }

    // Create vote, increment vote count, and add the initial comment
    await prisma.$transaction([
      prisma.vote.create({
        data: {
          albumId: album.id,
          voterHash,
        },
      }),
      prisma.album.update({
        where: { id: album.id },
        data: {
          votesCount: {
            increment: 1,
          },
        },
      }),
      prisma.comment.create({
        data: {
          albumId: album.id,
          userId,
          content: trimmedComment,
          likesCount: 0,
        },
      }),
    ]);

    // Fetch updated album
    const updatedAlbum = await prisma.album.findUnique({
      where: { id: album.id },
    });

    console.log(`[VOTE] ${user.email} recommended "${album.title}" with comment`);

    return NextResponse.json({
      success: true,
      album: updatedAlbum,
      message: 'Album recommended!',
    });
  } catch (error) {
    console.error('Vote error:', error);
    
    // Handle unique constraint violation (race condition)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'You have already recommended this album', alreadyVoted: true },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to record recommendation' },
      { status: 500 }
    );
  }
}
