import { NextRequest, NextResponse } from 'next/server';
import { searchAlbums } from '@/lib/spotify/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const albums = await searchAlbums(query, 20);

    // Transform Spotify albums to our format
    const formattedAlbums = albums.map((album) => ({
      spotifyAlbumId: album.id,
      title: album.name,
      artist: album.artists.map((a) => a.name).join(', '),
      year: album.release_date ? parseInt(album.release_date.split('-')[0]) : null,
      coverUrl: album.images[0]?.url || album.images[1]?.url || '',
    }));

    return NextResponse.json({ albums: formattedAlbums });
  } catch (error) {
    console.error('Spotify search error:', error);
    return NextResponse.json(
      { error: 'Failed to search albums' },
      { status: 500 }
    );
  }
}
