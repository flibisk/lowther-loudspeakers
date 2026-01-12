/**
 * MusicBrainz API Client
 * Used for album search and metadata retrieval
 * No authentication required, but User-Agent header is mandatory
 */

interface MusicBrainzArtistCredit {
  name: string;
  artist: {
    id: string;
    name: string;
  };
}

interface MusicBrainzReleaseGroup {
  id: string;
  title: string;
  'first-release-date'?: string;
  'artist-credit'?: MusicBrainzArtistCredit[];
  'primary-type'?: string;
  'secondary-types'?: string[];
}

interface MusicBrainzArtist {
  id: string;
  name: string;
  score?: number;
}

interface MusicBrainzArtistSearchResponse {
  artists?: MusicBrainzArtist[];
}

interface MusicBrainzReleaseGroupBrowseResponse {
  'release-groups'?: MusicBrainzReleaseGroup[];
  'release-group-count'?: number;
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
 * Search for an artist by name and return their ID
 */
async function findArtistId(artistName: string): Promise<{ id: string; name: string } | null> {
  try {
    const encodedName = encodeURIComponent(artistName);
    const url = `https://musicbrainz.org/ws/2/artist?query=${encodedName}&fmt=json&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: MusicBrainzArtistSearchResponse = await response.json();
    if (data.artists && data.artists.length > 0 && data.artists[0].score && data.artists[0].score >= 90) {
      return { id: data.artists[0].id, name: data.artists[0].name };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Browse albums by artist ID - this gives us proper studio albums without bootlegs
 */
async function browseAlbumsByArtist(artistId: string, artistName: string, limit: number): Promise<AlbumSearchResult[]> {
  try {
    // Browse release-groups by artist, type=album filters to albums only
    const url = `https://musicbrainz.org/ws/2/release-group?artist=${artistId}&type=album&limit=${limit}&fmt=json`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data: MusicBrainzReleaseGroupBrowseResponse = await response.json();
    
    if (!data['release-groups'] || data['release-groups'].length === 0) {
      return [];
    }

    // Filter to studio albums only (exclude live, compilations, soundtracks, remixes, etc.)
    const studioAlbums = data['release-groups'].filter(rg => 
      rg['primary-type'] === 'Album' && 
      (!rg['secondary-types'] || rg['secondary-types'].length === 0)
    );

    // Sort by release date (oldest first = chronological discography)
    studioAlbums.sort((a, b) => {
      const dateA = a['first-release-date'] || '9999';
      const dateB = b['first-release-date'] || '9999';
      return dateA.localeCompare(dateB);
    });

    return studioAlbums.map(rg => {
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
        artist: artistName,
        year,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Search for albums on MusicBrainz
 * Strategy: 
 * 1. Try to find artist by name and browse their discography (best for "Pink Floyd", "John Mayer")
 * 2. Fall back to album title search (best for "Dark Side of the Moon", "Born and Raised")
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
    let albums: AlbumSearchResult[] = [];

    // Strategy 1: Try to find artist and browse their albums
    // This works great for "Pink Floyd", "The Beatles", "John Mayer", etc.
    const artist = await findArtistId(searchQuery);
    if (artist) {
      albums = await browseAlbumsByArtist(artist.id, artist.name, limit);
    }

    // Strategy 2: If no artist match or no albums, search by album title
    if (albums.length === 0) {
      const encodedQuery = encodeURIComponent(`releasegroup:"${searchQuery}"`);
      const url = `https://musicbrainz.org/ws/2/release-group?query=${encodedQuery}&fmt=json&limit=${limit * 3}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const data: MusicBrainzSearchResponse = await response.json();
        
        // Filter to studio albums only
        const releaseGroups = (data['release-groups'] || []).filter(rg => 
          rg['primary-type'] === 'Album' && 
          (!rg['secondary-types'] || rg['secondary-types'].length === 0)
        );
        
        albums = releaseGroups.slice(0, limit).map(rg => {
          let artistName = 'Unknown Artist';
          if (rg['artist-credit'] && rg['artist-credit'].length > 0) {
            artistName = rg['artist-credit']
              .map((ac) => ac.name || ac.artist?.name || '')
              .filter(Boolean)
              .join(', ');
          }

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
            artist: artistName,
            year,
          };
        });
      }
    }

    // Cache results
    searchCache.set(cacheKey, {
      data: albums,
      expires: Date.now() + CACHE_TTL,
    });

    // Clean up expired cache entries
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
