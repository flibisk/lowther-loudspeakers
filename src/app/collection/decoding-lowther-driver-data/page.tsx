'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X } from 'lucide-react';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';

// All images for the gallery overlay
const technicalImages = [
  { src: '/images/decoding-lowther-driver-data/table-1.jpg', alt: 'REW measurement settings screenshot' },
  { src: '/images/decoding-lowther-driver-data/table-2.jpg', alt: 'REW measurement preferences screenshot' },
  { src: '/images/decoding-lowther-driver-data/table-3.jpg', alt: 'PM6A Concert calibration example' },
  { src: '/images/decoding-lowther-driver-data/table-4.jpg', alt: 'PM6A 8 Ω baseline comparison at 1V and 2.8V' },
  { src: '/images/decoding-lowther-driver-data/table-5.jpg', alt: 'PM6A impulse response measurement' },
  { src: '/images/decoding-lowther-driver-data/table-6.jpg', alt: 'T/S parameters and impedance phase graphs' },
  { src: '/images/decoding-lowther-driver-data/table-7.jpg', alt: 'Whole-system cabinet response graphs' },
  { src: '/images/decoding-lowther-driver-data/table-8.jpg', alt: 'PM6 and PM7 Concert vs Sinfonia comparison graphs' },
  { src: '/images/decoding-lowther-driver-data/table-9.jpg', alt: 'Impedance and frequency response comparison' },
  { src: '/images/decoding-lowther-driver-data/table-10.jpg', alt: 'Concert units comparative responses' },
  { src: '/images/decoding-lowther-driver-data/table-11.jpg', alt: 'Frequency response settling in period comparison' },
];

export default function DecodingLowtherDriverDataPage() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openGallery = (index: number) => {
    setSelectedImage(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setSelectedImage(null);
  };

  const navigateGallery = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    if (direction === 'prev') {
      setSelectedImage(selectedImage === 0 ? technicalImages.length - 1 : selectedImage - 1);
    } else {
      setSelectedImage((selectedImage + 1) % technicalImages.length);
    }
  };

  // Helper function to get image index by src
  const getImageIndex = (src: string): number => {
    return technicalImages.findIndex(img => img.src === src);
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/decoding-lowther-driver-data/driver-data-banner.jpg"
          alt="Decoding Lowther Driver Data"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-2xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">TECHNICAL DATA</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Decoding Lowther Driver Data
          </h1>
          
          <p className="hidden 930:block text-xl leading-relaxed">
            How we measure, compare and listen.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Collections', href: '/products' },
          { label: 'Decoding Lowther Driver Data' }
        ]}
      />

      {/* Content Section */}
      <article data-surface="light" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <div className="prose prose-lg prose-gray max-w-none">
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Measurement overview
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-4">
                Lowther driver data 2024/5
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Our units are tested under the following conditions:
              </p>
              
              <ul className="text-xl leading-relaxed text-gray-800 mb-8 space-y-2 list-disc list-inside">
                <li>Frequency SPL (dB) graphs generated from REW</li>
                <li>Impedance, phase and T/S parameters from Dayton DATS v3</li>
              </ul>
              
              <h3 className="font-display text-3xl leading-tight mb-6" style={{ color: '#c59862' }}>
                REW parameters
              </h3>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                We use a swept tone from 20 Hz to 20 kHz. Each driver is mounted on a free-air baffle, facing into a dead chamber, with a miniDSP UMIK-1 microphone at 1 m on axis.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Amplifier output is set at 1.0 V for best accuracy. (See efficiency rating notes below.) Graphs use 1/12 smoothing.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Preferences and measurement settings are shown in the REW screenshots.
              </p>
              
              <div className="space-y-8 mb-16 -mx-6 sm:-mx-8">
                <div 
                  className="relative w-full aspect-[4/3] cursor-pointer group"
                  onClick={() => openGallery(getImageIndex('/images/decoding-lowther-driver-data/table-1.jpg'))}
                >
                  <Image
                    src="/images/decoding-lowther-driver-data/table-1.jpg"
                    alt="REW measurement settings screenshot"
                    fill
                    className="object-contain group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <div 
                  className="relative w-full aspect-[4/3] cursor-pointer group"
                  onClick={() => openGallery(getImageIndex('/images/decoding-lowther-driver-data/table-2.jpg'))}
                >
                  <Image
                    src="/images/decoding-lowther-driver-data/table-2.jpg"
                    alt="REW measurement preferences screenshot"
                    fill
                    className="object-contain group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
              </div>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Standard calibration
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                We also test with 500 Hz to 2000 Hz pink noise at 1 V to assess nominal efficiency rating. We re-calibrate to allow for the difference in output between a 1 kHz tone and pink noise. This ensures the AC meter reads the correct output at the amplifier terminals.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                In the example below, the application output is set at 1.17 V for pink noise. The actual amplifier reading at the meter is 1 V, so this PM6A Concert driver on test is quoted at 95.7 dBA at 1 V between 500 Hz and 2000 Hz.
              </p>
              
              <div 
                className="relative w-full aspect-[4/3] mb-16 cursor-pointer group -mx-6 sm:-mx-8"
                onClick={() => openGallery(getImageIndex('/images/decoding-lowther-driver-data/table-3.jpg'))}
              >
                <Image
                  src="/images/decoding-lowther-driver-data/table-3.jpg"
                  alt="PM6A Concert calibration example"
                  fill
                  className="object-contain group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                The same PM6A driver measured at 2.8 V reads 104 dBA. This is too loud to collect meaningful comparative data across the full Lowther range with this application, so we use 1 V as the working standard and allow for the offset when required.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                To give a baseline comparison, the PM6A 8 Ω aluminium coil unit is shown tested at both 1 V and 2.8 V, which gives a nominal 8 dB offset.
              </p>
              
              <div 
                className="relative w-full aspect-[4/3] mb-16 cursor-pointer group -mx-6 sm:-mx-8"
                onClick={() => openGallery(getImageIndex('/images/decoding-lowther-driver-data/table-4.jpg'))}
              >
                <Image
                  src="/images/decoding-lowther-driver-data/table-4.jpg"
                  alt="PM6A 8 Ω baseline comparison at 1V and 2.8V"
                  fill
                  className="object-contain group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Impulse response and free-air parameters
              </h2>
              
              <h3 className="font-display text-3xl leading-tight mb-6" style={{ color: '#c59862' }}>
                Impulse response measurement
              </h3>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                The impulse response for the entire Lowther range is extremely consistent. The standard PM6A is representative of the behaviour of the family.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Because the plots are so similar, publishing each variant is unnecessary. Individual impulse response plots can be generated from the database and supplied on request for specific drivers. For most customers the data has limited value. It simply confirms that all Lowther units are very responsive by design.
              </p>
              
              <div 
                className="relative w-full aspect-[4/3] mb-16 cursor-pointer group -mx-6 sm:-mx-8"
                onClick={() => openGallery(getImageIndex('/images/decoding-lowther-driver-data/table-5.jpg'))}
              >
                <Image
                  src="/images/decoding-lowther-driver-data/table-5.jpg"
                  alt="PM6A impulse response measurement"
                  fill
                  className="object-contain group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              
              <h3 className="font-display text-3xl leading-tight mb-6" style={{ color: '#c59862' }}>
                Free-air parameters and impedance sweep
              </h3>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                T/S parameters and impedance / phase graphs are generated from Dayton DATS v3 under the same mounted conditions as the SPL and frequency response measurements.
              </p>
              
              <div 
                className="relative w-full aspect-[4/3] mb-16 cursor-pointer group -mx-6 sm:-mx-8"
                onClick={() => openGallery(getImageIndex('/images/decoding-lowther-driver-data/table-6.jpg'))}
              >
                <Image
                  src="/images/decoding-lowther-driver-data/table-6.jpg"
                  alt="T/S parameters and impedance phase graphs"
                  fill
                  className="object-contain group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              
              <h3 className="font-display text-3xl leading-tight mb-6" style={{ color: '#c59862' }}>
                Whole-system cabinet measurements
              </h3>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Response graphs are also generated for completed handmade to order bespoke cabinets, so that left and right speakers can be matched.
              </p>
              
              <div 
                className="relative w-full aspect-[4/3] mb-16 cursor-pointer group -mx-6 sm:-mx-8"
                onClick={() => openGallery(getImageIndex('/images/decoding-lowther-driver-data/table-7.jpg'))}
              >
                <Image
                  src="/images/decoding-lowther-driver-data/table-7.jpg"
                  alt="Whole-system cabinet response graphs"
                  fill
                  className="object-contain group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                How to interpret the data
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                The following graphs show PM6 and PM7 units in Concert and Sinfonia (standard and premium) variants. It is important to use the information with a clear understanding of what it can and cannot tell the end user.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                For example, the low-frequency resonance (Fs) of the Sinfonia appears higher in the impedance plot. Taken in isolation this could suggest less bass output. In practice this does not correlate with the SPL frequency graph. The narrowness of the resonance peak is far more important to the quality of the bass response when the driver is correctly horn loaded.
              </p>
              
              <div className="space-y-8 mb-16 -mx-6 sm:-mx-8">
                <div 
                  className="relative w-full aspect-[4/3] cursor-pointer group"
                  onClick={() => openGallery(getImageIndex('/images/decoding-lowther-driver-data/table-8.jpg'))}
                >
                  <Image
                    src="/images/decoding-lowther-driver-data/table-8.jpg"
                    alt="PM6 and PM7 Concert vs Sinfonia comparison graphs"
                    fill
                    className="object-contain group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <div 
                  className="relative w-full aspect-[4/3] cursor-pointer group"
                  onClick={() => openGallery(getImageIndex('/images/decoding-lowther-driver-data/table-9.jpg'))}
                >
                  <Image
                    src="/images/decoding-lowther-driver-data/table-9.jpg"
                    alt="Impedance and frequency response comparison"
                    fill
                    className="object-contain group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
              </div>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Comparative illustrations
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Here is a selection of Concert units showing comparative responses, as measured before. We are often asked for "dB sensitivity" or other indicators of efficiency. There are several problems with simple numbers:
              </p>
              
              <ul className="text-xl leading-relaxed text-gray-800 mb-8 space-y-2 list-disc list-inside">
                <li>Mean averages over 20 Hz to 20 kHz can be misleading.</li>
                <li>Industry measurement standards vary.</li>
                <li>Free-air response can have wide peaks that skew the result.</li>
              </ul>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                These are full range units. In most Lowther speakers there is no need to match multiple drivers.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                For the occasional case where a Lowther is used as a midrange in a multi-way loudspeaker, the efficiency should be calculated over the actual operating band. We expect constructors of these systems to be competent in that process.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Because the calculated average from 20 Hz to 20 kHz is not very useful, one common industry standard is to test with pink noise between 500 Hz and 2 kHz. This gives a more meaningful indication. (See the standard calibration section where the PM6A unit is quoted at 95.7 dBA at 1 V between 500 Hz and 2000 Hz.)
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Given that all Lowther units are more than adequate in efficiency, the character of each driver is best shown comparatively, using the well known PM6A as a baseline.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Note that 15 Ω units are generally 3 to 4 dB less efficient than the equivalent 8 Ω versions.
              </p>
              
              <div 
                className="relative w-full aspect-[4/3] mb-16 cursor-pointer group -mx-6 sm:-mx-8"
                onClick={() => openGallery(getImageIndex('/images/decoding-lowther-driver-data/table-10.jpg'))}
              >
                <Image
                  src="/images/decoding-lowther-driver-data/table-10.jpg"
                  alt="Concert units comparative responses"
                  fill
                  className="object-contain group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              
              <h3 className="font-display text-3xl leading-tight mb-6" style={{ color: '#c59862' }}>
                Settling in and diaphragm behaviour
              </h3>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                The next graph shows how the frequency response smooths out after a settling in period.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                This effect is more pronounced over a shorter time with the Sinfonia and Philharmonic range, while the Concert diaphragms typically take a few weeks to stabilise.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                There is no useful data difference between Sinfonia and Philharmonic in the conventional measurements. The impedance and SPL graphs are effectively the same, so a single example can serve both in comparative illustrations against the Concert units.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Further comparative SPL plots for the Philharmonic and Concert ranges demonstrate the close similarity in measured response and the small refinements introduced by the premium constructions.
              </p>
              
              <div 
                className="relative w-full aspect-[4/3] mb-16 cursor-pointer group -mx-6 sm:-mx-8"
                onClick={() => openGallery(getImageIndex('/images/decoding-lowther-driver-data/table-11.jpg'))}
              >
                <Image
                  src="/images/decoding-lowther-driver-data/table-11.jpg"
                  alt="Frequency response settling in period comparison"
                  fill
                  className="object-contain group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Why the Philharmonic exists when the curves look the same?
              </h2>
              
              <h3 className="font-display text-3xl leading-tight mb-6" style={{ color: '#c59862' }}>
                Philharmonic evaluation
              </h3>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                If the measured data for the Sinfonia and Philharmonic looks almost identical, why do we offer these variants at all.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                The answer is that impedance and frequency SPL data can only tell part of the story. They are very limited in predicting how a driver actually sounds.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Beyond the improved appearance that comes from closer attention to engineering and finishing, the Philharmonic range uses aluminium die cast frames that are machined so that axial planes are parallel to very tight tolerances. The diaphragm therefore moves with better planar accuracy. This reduces physical and musical distortion.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Pairs can then be hand picked from the machining tolerances for optimum stereo matching.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                The T/S parameters derived from the impedance test are practically identical to the Sinfonia. The audible result is different. Micro detail and soundstage realism are improved. Only listening will reveal the difference.
              </p>
              
              <h3 className="font-display text-3xl leading-tight mb-6" style={{ color: '#c59862' }}>
                Coil wire and nominal impedance choices
              </h3>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Variants of voice coil construction will produce subtle differences in presentation. As noted above, the usual published data is very limited in predicting how a unit actually sounds.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Because there are many variants, it is impractical and often confusing to publish separate impedance and SPL graphs for each coil type. Most customers who ask for guidance rely on listening and description rather than graphics, so the list below is a useful reference. The 8 Ω aluminium coil is the default and is used as the baseline.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                Most customers who visit our showroom can make a decision based on comparative listening.
              </p>
              
              <h4 className="font-display text-2xl leading-tight mb-4" style={{ color: '#c59862' }}>
                Aluminium 8Ω
              </h4>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                7.4 DCR. Low mass, fast h/f detail; closest to Voigt's original ideal coil/diaphragm ratio.
              </p>
              
              <h4 className="font-display text-2xl leading-tight mb-4" style={{ color: '#c59862' }}>
                Silver 8Ω
              </h4>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                6.1 DCR. 'Softer' high frequencies, generally smoother presentation. Tougher, heavier wire, so not as delicate coil as aluminium for same resistance. Good match with supertweeters.
              </p>
              
              <h4 className="font-display text-2xl leading-tight mb-4" style={{ color: '#c59862' }}>
                15Ω sil/alu
              </h4>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-16">
                13 DCR. More turns = thinner wire to reduce mass, so more delicate coil. Matches 'fussy', usually older valve amps. Twin-driver systems present 8ohm as parallel wired (4Ω for 2x 8Ω).
              </p>
              
              <h2 className="font-display text-4xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Summary
              </h2>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                Recent improvements and developments have made Lowther loudspeakers unparalleled for pure musical experience. Our aim now is to shift the focus from overwhelming technical data to getting people in front of the music.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                We are confident that a personal listening session says far more about Lowther than any graph.
              </p>
              
              <p className="text-xl leading-relaxed text-gray-800 mb-8">
                For that reason:
              </p>
              
              <ul className="text-xl leading-relaxed text-gray-800 mb-8 space-y-2 list-disc list-inside">
                <li>Frequency response, impedance and impulse plots will not be available to download for all variants.</li>
                <li>Full data will be published for the Concert DX3 and PM6A units, with overlayed frequency response plots of other variants for at-a-glance comparison, for example DX2, DX3, DX4 efficiency and Concert vs Sinfonia.</li>
                <li>Test data for Sinfonia and Philharmonic should be regarded as essentially the same.</li>
                <li>Requests for specific information will always be supported where possible. Older test plots are archived but may no longer be fully relevant.</li>
                <li>Field coil, Philharmonic and Grand Opera instruments can only be appreciated by listening. Specification enquiries for these should ideally form part of an audition at one of our listening rooms, where we can give you our full attention.</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </article>

      {/* Gallery Overlay */}
      {isGalleryOpen && selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeGallery}
        >
          <button
            onClick={closeGallery}
            className="absolute top-8 right-8 text-white/80 hover:text-white transition-colors z-10"
            aria-label="Close gallery"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateGallery('prev');
            }}
            className="absolute left-8 text-white/80 hover:text-white transition-colors text-6xl font-light z-10"
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className="relative w-[90vw] h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={technicalImages[selectedImage].src}
              alt={technicalImages[selectedImage].alt}
              fill
              className="object-contain"
              priority
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateGallery('next');
            }}
            className="absolute right-8 text-white/80 hover:text-white transition-colors text-6xl font-light z-10"
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection backgroundColor="bg-[#fafaf8]" />
    </div>
  );
}

