import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface Album {
  id: string;
  spotifyAlbumId: string;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string;
  votesCount: number;
}

async function getFeaturedAlbum(): Promise<Album | null> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/trust-your-ears/featured`;
    
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch featured album: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.album;
  } catch (error) {
    console.error('Failed to fetch featured album:', error);
    return null;
  }
}

export async function FeaturedAlbum() {
  const album = await getFeaturedAlbum();

  if (!album) {
    return (
      <Card className="border-neutral-200 bg-neutral-50">
        <CardContent className="py-12 text-center">
          <p className="font-sarabun text-neutral-600">
            No albums have been recommended yet. Be the first to recommend an album!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-neutral-200">
      <CardHeader>
        <CardTitle className="font-hvmuse text-xl font-normal text-neutral-900">
          Current Listen
        </CardTitle>
        <p className="font-sarabun text-sm text-neutral-600">
          The community&apos;s most recommended album
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Album Cover */}
          <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:w-48">
            {album.coverUrl && (
              <Image
                src={album.coverUrl}
                alt={`${album.title} by ${album.artist}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 192px"
              />
            )}
          </div>

          {/* Album Info */}
          <div className="flex flex-1 flex-col justify-center">
            <h3 className="font-hvmuse mb-1 text-2xl font-normal text-neutral-900">
              {album.title}
            </h3>
            <p className="font-sarabun mb-2 text-lg text-neutral-700">
              {album.artist}
            </p>
            {album.year && (
              <p className="font-sarabun mb-4 text-sm text-neutral-500">
                {album.year}
              </p>
            )}
            <div className="mt-auto">
              <p className="font-sarabun text-sm text-neutral-600">
                <span className="font-semibold">{album.votesCount}</span>{' '}
                {album.votesCount === 1 ? 'recommendation' : 'recommendations'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
