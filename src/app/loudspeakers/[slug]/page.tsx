import { notFound } from 'next/navigation';
import speakersDatabase from '@/lib/data/speakers-database.json';
import { SpeakerPageContent } from '@/components/speaker-page-content';
import { speakerPageConfigs } from '@/lib/speaker-page-config';

interface SpeakerPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Create slug mapping for proper URL generation
  const slugMapping: { [key: string]: string } = {
    'quarterwave': 'acousta-quarter-wave',
    'acousta-117': 'acousta-117',
    'edilia': 'edilia',
    'almira': 'almira',
    'tp2': 'tp2',
    'audiovector': 'audiovector',
    'hegeman': 'hegeman',
    'voigt-horn': 'voigt-horn'
  };

  return Object.keys(speakersDatabase.speakers).map((key) => ({
    slug: slugMapping[key] || key,
  }));
}

export async function generateMetadata({ params }: SpeakerPageProps) {
  const { slug } = await params;
  
  // Reverse mapping from URL slug to database key
  const reverseSlugMapping: { [key: string]: string } = {
    'acousta-quarter-wave': 'quarterwave',
    'acousta-117': 'acousta-117',
    'edilia': 'edilia',
    'almira': 'almira',
    'tp2': 'tp2',
    'audiovector': 'audiovector',
    'hegeman': 'hegeman',
    'voigt-horn': 'voigt-horn'
  };

  const speakerKey = reverseSlugMapping[slug] || slug;
  const speaker = speakersDatabase.speakers[speakerKey as keyof typeof speakersDatabase.speakers];
  
  if (!speaker) {
    return {
      title: 'Speaker Not Found',
    };
  }

  return {
    title: speaker.seo.meta_title,
    description: speaker.seo.meta_description,
    keywords: speaker.seo.keywords.join(', '),
  };
}

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { slug } = await params;
  
  // Reverse mapping from URL slug to database key
  const reverseSlugMapping: { [key: string]: string } = {
    'acousta-quarter-wave': 'quarterwave',
    'acousta-117': 'acousta-117',
    'edilia': 'edilia',
    'almira': 'almira',
    'tp2': 'tp2',
    'audiovector': 'audiovector',
    'hegeman': 'hegeman',
    'voigt-horn': 'voigt-horn'
  };

  const speakerKey = reverseSlugMapping[slug] || slug;
  const speaker = speakersDatabase.speakers[speakerKey as keyof typeof speakersDatabase.speakers];

  if (!speaker) {
    notFound();
  }

  // Safe access to approved_copy with fallbacks
  const approvedCopy = speaker.content?.approved_copy || {
    hero_heading: speaker.title || 'Speaker',
    hero_subheading: speaker.content?.short_description || 'No description available.',
    body: speaker.content?.long_description || 'No description available.',
    technical_highlights: 'Technical details coming soon.',
    lifestyle_copy: 'Lifestyle information coming soon.',
    call_to_action: 'Contact us for more information.',
    features_list: []
  };
  
  const technical = speaker.technical || {
    frequency_response: 'Not specified',
    sensitivity: 'Not specified',
    impedance: 'Not specified',
    power_handling: 'Not specified',
    alternative_drivers: []
  };

  // Get speaker-specific configuration or use defaults
  const pageConfig = speakerPageConfigs[speakerKey] || {
    heroImage: `${speaker.images?.base || '/images/speakers/'}${speaker.images?.hero || 'hero/'}default.jpg`,
    galleryImages: [],
    specsImage: '',
    craftsmanshipContent: [],
    customerQuotes: [],
    lifestyleHeading: 'Craftsmanship and Design',
    lifestyleImages: []
  };

  return (
    <SpeakerPageContent 
      speaker={speaker} 
      technical={technical} 
      approvedCopy={approvedCopy}
      heroImage={pageConfig.heroImage}
      heroVideo={pageConfig.heroVideo}
      mobileHeroImage={pageConfig.mobileHeroImage}
      galleryImages={pageConfig.galleryImages}
      specsImage={pageConfig.specsImage}
      specsImages={pageConfig.specsImages}
      craftsmanshipContent={pageConfig.craftsmanshipContent}
      customerQuotes={pageConfig.customerQuotes}
      lifestyleHeading={pageConfig.lifestyleHeading}
      lifestyleImages={pageConfig.lifestyleImages}
      showGenericCraftsmanship={pageConfig.showGenericCraftsmanship}
      genericCraftsmanshipHeading={pageConfig.genericCraftsmanshipHeading}
      speakerCraftsmanshipHeading={pageConfig.speakerCraftsmanshipHeading}
      speakerVideo={pageConfig.speakerVideo}
      speakerVideos={pageConfig.speakerVideos}
      remakingVideo={pageConfig.remakingVideo}
      pressReviews={pageConfig.pressReviews}
    />
  );
}
