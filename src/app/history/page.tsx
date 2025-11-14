'use client';

import Image from 'next/image';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';

// Timeline data with corresponding images
const timelineEvents = [
  {
    year: '1924',
    title: 'The Cinema Horn',
    description: 'Voigt develops what later is named the Cinema Horn',
    image: '/images/history/gallery/Edison Bell Building 1924.jpeg',
  },
  {
    year: '1926',
    title: 'First British Electric Recording System',
    description: 'Paul Voigt develops the first British electric recording system whilst working at Edison Bell, where a mutual agreement gave him ownership of his own patents',
    image: null,
  },
  {
    year: '1928',
    title: 'Voigt Marries Ida',
    description: 'Voigt marries Ida Florence May Munro in St Augustine church, Honor Oak Park, London. Ida is said to be either the first or one of the first women to have qualified and awarded a degree in engineering.',
    image: '/images/history/gallery/Paul Voigt and Ida\'s wedding day. St Augustine Church, Honor Oak Park, 1928..jpeg',
  },
  {
    year: '1933',
    title: 'Voigt Patents Established',
    description: 'Edison Bell ceases trading and Paul Voigt establishes his own company, Voigt Patents.',
    image: '/images/history/gallery/Voigt created a small factory inside a residential house named The Courts, Silverdale, in Sydenham..jpeg',
  },
  {
    year: '1934',
    title: 'The Domestic Corner Horn',
    description: 'Paul Voigt releases the Domestic Corner Horn, a horn-loaded speaker emulating live sound in the most realistic manner to date. The first corner horn sold for £32.50.\n\nVoigt meets O.P. Lowther of the Lowther Manufacturing Company Ltd and the two men become fast friends.',
    image: '/images/history/gallery/The Voigt Domestic Corner Horn 1934.jpeg',
  },
  {
    year: '1936',
    title: 'Lowther-Voigt Collaboration',
    description: 'Voigt and Lowther collaborate on their first project, the Lowther-Voigt Radio, covering a range of radiograms, amplifiers, tuners and loudspeakers. Aimed at the luxury market and the most fastidious of audiophiles, the project offered many different adaptations for home use including building custom cabinets.',
    image: null,
  },
  {
    year: '1939-1945',
    title: 'World War II',
    description: 'World War II takes a hold of the world but cinema offered a much needed escape from reality. Voigt spends much of his time maintaining his horn-loaded speakers in cinemas across the UK.\n\nA German bomb displaced the roof of the small factory at The Courts.',
    image: null,
  },
  {
    year: '1945',
    title: 'Post-War Challenges',
    description: 'After World War II, like many British people with German heritage, Voigt suffered a lot of racial abuse. When the war was over the council, then the Metropolitan Borough of Lewisham, was prejudiced against him because of his German ancestry and refused to fix his roof.\n\nHe got very fed up with England. He also had a spinal condition but the doctors could find nothing wrong. Although he tried everything that doctors in England suggested, nothing improved his condition which must have made it very difficult for him to continue installing heavy speakers.\n\nInstead of continuing to live in the UK, Voigt and Ida decided to move to Canada. He sold his shares with a handshake to his trusted chief engineer at the time, Donald Chave.',
    image: null,
  },
  {
    year: '1951',
    title: 'The Lowther-Hegeman Reproducer',
    description: 'Chave and legendary American audio designer Stewart Hegeman teamed up to take the Lowther/Voigt full range single driver concept to a higher level.\n\nThey release the Lowther-Hegeman Reproducer as a result. This was a big step up from the Domestic Corner Horn at four feet wide, four feet tall and two feet tall. The newly developed PM4A drive unit (later to become part of the A series) was used inside a large horizontal plaster horn, creating an impressively wide dispersion of mid- and treble-frequencies.\n\nThe Reproducer was three times the price of the next most expensive Lowther speaker at the time and had very short production run between 1950 & 1951. It is estimated that only 20-30 reproducer units have ever existed to date.',
    image: '/images/history/gallery/Lowther-Hegeman Reproducer 1951.jpg',
  },
  {
    year: '1970',
    title: 'Innovation with New Materials',
    description: 'Then owner Donald Chave goes into partnership with his close friend Roy Hopps. Their innovation with new magnet materials leads to the creation of the world-famous ceramic-based C series of speakers drivers, and the renowned Neodymium-based EX and DX range.',
    image: null,
  },
  {
    year: '2018',
    title: 'New Era Begins',
    description: 'Martin Thornton takes over Lowther and the company moves to its current home in Northamptonshire.',
    image: null,
  },
  {
    year: '2020',
    title: 'Pandemic Innovation',
    description: 'As a global pandemic takes a hold of the world, the new Lowther team take the opportunity to start research and development of a new range speaker cabinets. They start with a focus on a developing some speakers from Lowther\'s history.\n\nA refurbished Acousta 115 was installed by Lowther in the Handel Hendrix museum in London. Jimi Hendrix was himself a discerning audiophile and owned a set of 115\'s in the 1970\'s. Visitors of the museum can now listen to Hendrix\'s original vinyl collection as Hendrix himself experienced it.',
    image: null,
  },
  {
    year: '2021',
    title: 'The Future of Lowther',
    description: 'After a full year of research and development the new Lowther team are not slowing down. This year will see the release of a brand new flagship range of speakers designed for the modern era of audio reproduction along with the return of a few timeless favourites.',
    image: null,
  },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
                      <Image
          src="/images/history/hero/History-hero.jpeg"
          alt="The History of Lowther Loudspeakers"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-3xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">LOWTHER HERITAGE</span>
                  </div>
                  
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            The History of Lowther Loudspeakers
          </h1>
          
          <p className="hidden 930:block text-xl leading-relaxed">
            Since 1934, Lowther Loudspeakers has stood as a beacon of British craftsmanship and innovation in sound reproduction.
                    </p>
                  </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Brand', href: '/history' },
          { label: 'History' }
        ]}
      />

      {/* Timeline Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Timeline Container */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-[#c59862]/30 -translate-x-1/2"></div>

            {/* Timeline Events */}
            <div className="space-y-24">
              {timelineEvents.map((event, index) => (
                <ScrollReveal key={index} animation="fade-up">
                  <div className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Year Badge */}
                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#c59862] flex items-center justify-center shadow-lg z-10">
                        <span className="font-display text-white text-sm font-bold">{event.year.split('-')[0]}</span>
          </div>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ml-24 md:ml-0 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                      <div className="bg-[#fafaf8] p-8 rounded-lg shadow-sm">
                        <span className="text-sm font-medium text-[#c59862] tracking-wider uppercase">{event.year}</span>
                        <h3 className="font-display text-2xl md:text-3xl mt-2 mb-4 text-gray-900">
                          {event.title}
                        </h3>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {event.description}
                        </div>
                  </div>
                    </div>

                    {/* Image */}
                    <div className={`flex-1 ml-24 md:ml-0 ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16'}`}>
                      {event.image ? (
                        <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                  </div>
                      ) : (
                        <div className="hidden md:block"></div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
                </div>
          </div>

          {/* Thank You Note */}
          <ScrollReveal animation="fade-up">
            <div className="mt-32 text-center">
              <p className="text-lg text-gray-700 leading-relaxed italic">
                Thank you to our friends over at the <span className="font-semibold">Lowther Voigt Museum</span> for documenting the history of Lowther Loudspeakers so meticulously.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection backgroundColor="bg-[#fafaf8]" />
    </div>
  );
}
