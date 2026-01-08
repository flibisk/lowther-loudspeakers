import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';
import { generateVoterHash, getClientIp } from '@/lib/trust-your-ears/voting';
import { getAlbumById } from '@/lib/spotify/client';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spotifyAlbumId, cookieId } = body;

    if (!spotifyAlbumId || typeof spotifyAlbumId !== 'string') {
      return NextResponse.json(
        { error: 'spotifyAlbumId is required' },
        { status: 400 }
      );
    }

    // Get or create cookie ID
    const cookieStore = await cookies();
    let voterCookieId = cookieStore.get('trust-your-ears-voter-id')?.value;
    
    if (!voterCookieId) {
      // Generate new cookie ID
      voterCookieId = createHash('sha256')
        .update(`${Date.now()}-${Math.random()}-${request.headers.get('user-agent') || ''}`)
        .digest('hex');
    }

    // Get IP address and generate voter hash
    const ipAddress = getClientIp(request.headers);
    const voterHash = generateVoterHash(ipAddress, voterCookieId);

    // Check if album exists in database
    let album = await prisma.album.findUnique({
      where: { spotifyAlbumId },
    });

    if (!album) {
      // Fetch album metadata from Spotify
      const spotifyAlbum = await getAlbumById(spotifyAlbumId);
      
      if (!spotifyAlbum) {
        return NextResponse.json(
          { error: 'Album not found on Spotify' },
          { status: 404 }
        );
      }

      // Create new album
      const year = spotifyAlbum.release_date
        ? parseInt(spotifyAlbum.release_date.split('-')[0])
        : null;

      album = await prisma.album.create({
        data: {
          spotifyAlbumId: spotifyAlbum.id,
          title: spotifyAlbum.name,
          artist: spotifyAlbum.artists.map((a) => a.name).join(', '),
          year,
          coverUrl: spotifyAlbum.images[0]?.url || spotifyAlbum.images[1]?.url || '',
          votesCount: 0,
        },
      });
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
        { error: 'You have already voted for this album', alreadyVoted: true },
        { status: 409 }
      );
    }

    // Create vote and increment vote count
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
    ]);

    // Fetch updated album
    const updatedAlbum = await prisma.album.findUnique({
      where: { id: album.id },
      include: {
        _count: {
          select: { votes: true },
        },
      },
    });

    // Set cookie in response if it wasn't already set
    const response = NextResponse.json({
      success: true,
      album: updatedAlbum,
      message: album.votesCount === 0
        ? 'Album added and voted!'
        : 'Vote recorded!',
    });

    // Set cookie for future requests (expires in 1 year)
    if (!cookieStore.get('trust-your-ears-voter-id')) {
      response.cookies.set('trust-your-ears-voter-id', voterCookieId, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return response;
  } catch (error) {
    console.error('Vote error:', error);
    
    // Handle unique constraint violation (race condition)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'You have already voted for this album', alreadyVoted: true },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}
