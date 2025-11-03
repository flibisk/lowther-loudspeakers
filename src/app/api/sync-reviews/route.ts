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
    // Use Google Visualization API for better JSON parsing (works with public sheets)
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Failed to fetch from Google Sheets:', response.status);
      return [];
    }

    // Google returns JSONP, need to extract the JSON
    const text = await response.text();
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
    
    if (!jsonMatch || !jsonMatch[1]) {
      console.error('Failed to parse Google Sheets response');
      return [];
    }

    const data = JSON.parse(jsonMatch[1]);
    const rows = data.table.rows || [];
    
    const reviews: Review[] = rows
      .map((row: any, index: number) => {
        // Each row has cells array: [content, reviewer, rating]
        const cells = row.c || [];
        
        // Extract values (v property contains the actual value)
        const content = cells[0]?.v?.toString().trim() || '';
        const reviewer = cells[1]?.v?.toString().trim() || '';
        const rating = parseInt(cells[2]?.v?.toString() || '5') || 5;
        
        // Skip if no content or reviewer
        if (!content || !reviewer) return null;
        
        return {
          id: `review-${Date.now()}-${index}`,
          content,
          reviewer,
          rating,
          date: new Date().toISOString().split('T')[0]
        };
      })
      .filter((review: Review | null): review is Review => review !== null);

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
