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
    const searchQuery = query.trim();
    const fetchLimit = Math.min(limit * 5, 100);
    
    // Helper function to fetch from MusicBrainz
    const fetchMusicBrainz = async (luceneQuery: string): Promise<MusicBrainzSearchResponse> => {
      const encodedQuery = encodeURIComponent(luceneQuery);
      const url = `https://musicbrainz.org/ws/2/release-group?query=${encodedQuery}&fmt=json&limit=${fetchLimit}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 503) {
          console.warn('MusicBrainz rate limited');
          return { 'release-groups': [] };
        }
        throw new Error(`MusicBrainz search failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    };

    // Strategy: Search by artist name first, then by album title if no results
    // This way "John Mayer" returns his albums, and "Born and Raised" finds that album
    
    // First: Search by artist name
    const artistQuery = `artistname:"${searchQuery}"`;
    let data = await fetchMusicBrainz(artistQuery);
    
    // Filter to albums only
    let releaseGroups = (data['release-groups'] || []).filter(rg => rg['primary-type'] === 'Album');
    
    // If no albums found by artist, search by album title
    if (releaseGroups.length === 0) {
      const titleQuery = `releasegroup:"${searchQuery}"`;
      data = await fetchMusicBrainz(titleQuery);
      releaseGroups = (data['release-groups'] || []).filter(rg => rg['primary-type'] === 'Album');
    }
    
    if (releaseGroups.length === 0) {
      return [];
    }
    
    // Transform results and limit to requested amount
    const albums: AlbumSearchResult[] = releaseGroups
      .slice(0, limit)
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
