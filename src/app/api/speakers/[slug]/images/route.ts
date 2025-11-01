import { NextRequest, NextResponse } from 'next/server';
import { loadSpeakerImages } from '@/lib/utils/image-loader';
import speakersDatabase from '@/lib/data/speakers-database.json';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Speaker slug is required' },
        { status: 400 }
      );
    }

    // Get speaker data from database
    const speakerData = speakersDatabase.speakers[slug as keyof typeof speakersDatabase.speakers];
    
    if (!speakerData) {
      return NextResponse.json(
        { error: 'Speaker not found' },
        { status: 404 }
      );
    }

    // Load images using speaker data for proper paths
    const images = await loadSpeakerImages(slug, speakerData);
    
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error loading speaker images:', error);
    return NextResponse.json(
      { error: 'Failed to load speaker images' },
      { status: 500 }
    );
  }
}
