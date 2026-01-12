import { NextRequest, NextResponse } from 'next/server';
import { searchAlbums } from '@/lib/musicbrainz/client';
import { getCoverArtUrl, getPlaceholderImageUrl } from '@/lib/cover-art-archive/client';

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

    // Search MusicBrainz for albums (show up to 20 results)
    const albums = await searchAlbums(query, 20);

    if (albums.length === 0) {
      return NextResponse.json({ albums: [] });
    }

    // Fetch cover art for each album
    const albumsWithCovers = await Promise.all(
      albums.map(async (album) => {
        const coverUrl = await getCoverArtUrl(album.musicBrainzReleaseGroupId);
        return {
          ...album,
          coverUrl: coverUrl || getPlaceholderImageUrl(),
        };
      })
    );

    return NextResponse.json({ albums: albumsWithCovers });
  } catch (error) {
    console.error('MusicBrainz search error:', error);
    return NextResponse.json(
      { error: 'Failed to search albums' },
      { status: 500 }
    );
  }
}
