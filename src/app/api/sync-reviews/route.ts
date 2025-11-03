import { NextResponse } from 'next/server';

// Google Sheets configuration
const SHEET_ID = '1OgI6BZbCDoVPn43tXp4MPvLznTqF3yr-9prWP417Krs';
const SHEET_NAME = 'Lowther Reviews';
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

interface Review {
  id: string;
  content: string;
  reviewer: string;
  rating: number;
  date: string;
}

/**
 * Fetch reviews from Google Sheets
 */
async function fetchReviewsFromGoogleSheets(): Promise<Review[]> {
  try {
    // If no API key, use public sheet URL
    const range = `${SHEET_NAME}!A2:C100`; // Skip header row
    
    let url: string;
    if (API_KEY) {
      url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    } else {
      // Try public CSV export as fallback
      url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Failed to fetch from Google Sheets:', response.status);
      return [];
    }

    let reviews: Review[] = [];

    if (API_KEY) {
      // Parse JSON response from Sheets API
      const data = await response.json();
      const rows = data.values || [];
      
      reviews = rows
        .filter((row: string[]) => row[0] && row[1]) // Must have content and reviewer
        .map((row: string[], index: number) => ({
          id: `review-${Date.now()}-${index}`,
          content: row[0] || '',
          reviewer: row[1] || 'Anonymous',
          rating: parseInt(row[2]) || 5,
          date: new Date().toISOString().split('T')[0]
        }));
    } else {
      // Parse CSV response
      const csvText = await response.text();
      const rows = csvText.split('\n').slice(1); // Skip header
      
      reviews = rows
        .filter(row => row.trim())
        .map((row, index) => {
          // Simple CSV parsing (handles quoted strings with commas)
          const match = row.match(/(?:^|,)(?:"([^"]*)"|([^,]*))/g);
          if (!match || match.length < 2) return null;
          
          const content = (match[0] || '').replace(/^,?"?|"?$/g, '');
          const reviewer = (match[1] || '').replace(/^,?"?|"?$/g, '');
          const rating = parseInt((match[2] || '5').replace(/^,?"?|"?$/g, '')) || 5;
          
          if (!content || !reviewer) return null;
          
          return {
            id: `review-${Date.now()}-${index}`,
            content,
            reviewer,
            rating,
            date: new Date().toISOString().split('T')[0]
          };
        })
        .filter((review): review is Review => review !== null);
    }

    return reviews;
  } catch (error) {
    console.error('Error fetching reviews from Google Sheets:', error);
    return [];
  }
}

/**
 * GET endpoint - Returns all reviews from Google Sheets
 */
export async function GET() {
  try {
    const reviews = await fetchReviewsFromGoogleSheets();
    
    if (reviews.length === 0) {
      // Fallback to local data if Google Sheets fails
      const fallbackReviews = [
        {
          id: "review-fallback-1",
          content: "A huge thank you to Martin and Malcolm for indulging me in my passion for Lowther Loudspeakers, and their hospitality and knowledge, a great way to spend a Sunday morning.",
          reviewer: "Jeff Carter",
          rating: 5,
          date: "2025-01-15"
        }
      ];
      
      return NextResponse.json({
        success: true,
        reviews: fallbackReviews,
        source: 'fallback',
        message: 'Using fallback reviews (Google Sheets unavailable)'
      });
    }
    
    return NextResponse.json({
      success: true,
      reviews,
      source: 'google-sheets',
      count: reviews.length
    });
    
  } catch (error) {
    console.error('Error in GET /api/sync-reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
