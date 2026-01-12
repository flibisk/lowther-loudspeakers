/**
 * MusicBrainz API Client
 * Used for album search and metadata retrieval
 * No authentication required, but User-Agent header is mandatory
 */

interface MusicBrainzArtistCredit {
  name: string;
  artist: {
    name: string;
  };
}

interface MusicBrainzReleaseGroup {
  id: string;
  title: string;
  'first-release-date'?: string;
  'artist-credit'?: MusicBrainzArtistCredit[];
  'primary-type'?: string;
}

interface MusicBrainzSearchResponse {
  'release-groups'?: MusicBrainzReleaseGroup[];
  count?: number;
}

interface AlbumSearchResult {
  musicBrainzReleaseGroupId: string;
  title: string;
  artist: string;
  year: number | null;
}

// Simple in-memory cache for search results (5 minutes TTL)
const searchCache = new Map<string, { data: AlbumSearchResult[]; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const USER_AGENT = 'LowtherTrustYourEars/1.0 (contact@lowtherloudspeakers.com)';

/**
 * Search for albums on MusicBrainz
 */
export async function searchAlbums(query: string, limit: number = 10): Promise<AlbumSearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  // Check cache
  const cacheKey = `search:${query.toLowerCase()}:${limit}`;
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  try {
    // Build search query
    // MusicBrainz Lucene search syntax supports searching by artist or release title
    // We search both fields so "John Mayer" finds albums BY John Mayer
    const searchQuery = query.trim();
    
    // Build a query that searches by artist name primarily, then by release title
    // artist:"query" matches albums BY that artist
    // release:"query" matches albums with that title
    // Fetch more results than needed (3x limit) to ensure we get good matches after filtering to albums only
    const luceneQuery = `artist:"${searchQuery}" OR release:"${searchQuery}"`;
    
    const params = new URLSearchParams({
      query: luceneQuery,
      fmt: 'json',
      limit: Math.min(limit * 3, 50).toString(), // Fetch more, filter later
    });

    const response = await fetch(`https://musicbrainz.org/ws/2/release-group?${params}`, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 503) {
        // Rate limited - return cached data if available, otherwise empty
        console.warn('MusicBrainz rate limited, using cache if available');
        return cached?.data || [];
      }
      throw new Error(`MusicBrainz search failed: ${response.status} ${response.statusText}`);
    }

    const data: MusicBrainzSearchResponse = await response.json();
    
    if (!data['release-groups'] || data['release-groups'].length === 0) {
      return [];
    }

    // Filter to only albums and transform results, then limit to requested amount
    const albums: AlbumSearchResult[] = data['release-groups']
      .filter((rg) => rg['primary-type'] === 'Album')
      .slice(0, limit) // Limit to requested amount after filtering
      .map((rg) => {
        // Extract artist name from artist-credit
        let artist = 'Unknown Artist';
        if (rg['artist-credit'] && rg['artist-credit'].length > 0) {
          artist = rg['artist-credit']
            .map((ac) => ac.name || ac.artist?.name || '')
            .filter(Boolean)
            .join(', ');
        }

        // Extract year from first-release-date
        let year: number | null = null;
        if (rg['first-release-date']) {
          const yearMatch = rg['first-release-date'].match(/^\d{4}/);
          if (yearMatch) {
            year = parseInt(yearMatch[0], 10);
          }
        }

        return {
          musicBrainzReleaseGroupId: rg.id,
          title: rg.title,
          artist,
          year,
        };
      });

    // Cache results
    searchCache.set(cacheKey, {
      data: albums,
      expires: Date.now() + CACHE_TTL,
    });

    // Clean up expired cache entries (simple cleanup)
    if (searchCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of searchCache.entries()) {
        if (value.expires <= now) {
          searchCache.delete(key);
        }
      }
    }

    return albums;
  } catch (error) {
    console.error('MusicBrainz search error:', error);
    // Return cached data if available on error
    return cached?.data || [];
  }
}

/**
 * Get album metadata by MusicBrainz release-group ID
 */
export async function getAlbumById(releaseGroupId: string): Promise<AlbumSearchResult | null> {
  try {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/release-group/${releaseGroupId}?fmt=json&inc=artist-credits`,
      {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`MusicBrainz album fetch failed: ${response.status}`);
    }

    const rg: MusicBrainzReleaseGroup = await response.json();

    if (rg['primary-type'] !== 'Album') {
      return null;
    }

    // Extract artist name
    let artist = 'Unknown Artist';
    if (rg['artist-credit'] && rg['artist-credit'].length > 0) {
      artist = rg['artist-credit']
        .map((ac) => ac.name || ac.artist?.name || '')
        .filter(Boolean)
        .join(', ');
    }

    // Extract year
    let year: number | null = null;
    if (rg['first-release-date']) {
      const yearMatch = rg['first-release-date'].match(/^\d{4}/);
      if (yearMatch) {
        year = parseInt(yearMatch[0], 10);
      }
    }

    return {
      musicBrainzReleaseGroupId: rg.id,
      title: rg.title,
      artist,
      year,
    };
  } catch (error) {
    console.error('MusicBrainz get album error:', error);
    return null;
  }
}
