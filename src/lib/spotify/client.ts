/**
 * Spotify Web API Client (Client Credentials Flow)
 * Used for album search and metadata retrieval only
 */

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  release_date: string;
  images: SpotifyImage[];
  album_type: string;
}

interface SpotifySearchResponse {
  albums: {
    items: SpotifyAlbum[];
    total: number;
  };
}

let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get Spotify access token using Client Credentials flow
 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

  // Return cached token if still valid
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify token request failed: ${error}`);
  }

  const data: SpotifyTokenResponse = await response.json();
  
  // Cache token (expire 5 minutes before actual expiry for safety)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };

  return data.access_token;
}

/**
 * Search for albums on Spotify
 */
export async function searchAlbums(query: string, limit: number = 20): Promise<SpotifyAlbum[]> {
  if (!query.trim()) {
    return [];
  }

  const token = await getAccessToken();

  const params = new URLSearchParams({
    q: query.trim(),
    type: 'album',
    limit: limit.toString(),
  });

  const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify search failed: ${error}`);
  }

  const data: SpotifySearchResponse = await response.json();
  
  // Filter to only return full albums (not singles or compilations)
  return data.albums.items.filter(
    (album) => album.album_type === 'album'
  );
}

/**
 * Get album metadata by Spotify ID
 */
export async function getAlbumById(spotifyAlbumId: string): Promise<SpotifyAlbum | null> {
  const token = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/albums/${spotifyAlbumId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const error = await response.text();
    throw new Error(`Spotify album fetch failed: ${error}`);
  }

  return await response.json();
}
