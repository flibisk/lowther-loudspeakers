'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { DriveUnitCard } from '@/components/drive-unit-card';

interface CabinetPlan {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  releaseYear: string;
  image: string;
  description: string;
  materialGuidance: string;
  pdfPath: string;
  driveUnitOptions: {
    recommended?: string;
    standard: string;
    sealed?: string;
  };
}

const cabinetPlans: CabinetPlan[] = [
  {
    id: 'acousta-90',
    title: 'Acousta 90',
    difficulty: 'Beginner',
    releaseYear: "1990's",
    image: '/images/build-a-lowther/gallery/Acousta-90-Image.avif',
    description: `The Acousta 90 is a compact speaker designed for novice home builders looking to embark on their journey into the world of Lowther's more intricate cabinet designs. This bookshelf speaker was first introduced in the 1990s. The simplicity makes it an ideal project for learning the art of veneering, and once you've completed the build, you'll have a pair of drive units ready for your next, more complex project. The Acousta 90 is the perfect starting point for anyone interested in building Lowther speakers, and once you begin, you'll find yourself hooked on the process.`,
    materialGuidance: `We recommend building your speaker out of high-grade MDF or for better acoustic properties, baltic birch plywood. Choose MDF if you are not planning on veneering your speaker and painting it instead. To get a nice glossy finish when painting we recommend using a water based pigmented lacquer with an 80% sheen level.`,
    pdfPath: '/images/build-a-lowther/plans/Acousta-90.pdf',
    driveUnitOptions: {
      standard: '2x DX3 Concert',
      sealed: '2x EX3 Concert'
    }
  },
  {
    id: 'acousta-115-116',
    title: 'Acousta 115/116',
    difficulty: 'Intermediate',
    releaseYear: "1960's",
    image: '/images/build-a-lowther/gallery/Acousta-115-xray-Image.avif',
    description: `The Acousta 115 was first released in 1962 and was the speaker of choice of Jimi Hendrix. The 116 is the same core design as the 115 but offers a few small improvements to the build. The Acousta range of cabinets was first introduced for the PM6A in the 1950's. We rate this speaker as an intermediate difficulty build. Like all our designs there are a few complicated angles to cut and sealing the cabinet is very important.`,
    materialGuidance: `We recommend building your speaker out of high-grade MDF or baltic birch plywood. Choose MDF if you are not planning on veneering your speaker and painting it instead. To get a nice glossy finish when painting we recommend using a water based pigmented lacquer with an 80% sheen level.`,
    pdfPath: '/images/build-a-lowther/plans/Acousta-115-116.pdf',
    driveUnitOptions: {
      standard: '2x DX3 Concert',
      recommended: '2x PM6A Sinfonia',
      sealed: '2x EX3 Concert'
    }
  },
  {
    id: 'acousta-124',
    title: 'Acousta 124',
    difficulty: 'Intermediate',
    releaseYear: "1960's",
    image: '/images/build-a-lowther/gallery/Acousta-124-xray-Image.avif',
    description: `The Acousta 124 was first released in the 1960's. The Acousta range of cabinets was first introduced for the PM6A in the 1950's. We rate this speaker as an intermediate difficulty build. Like all our designs there are a few complicated angles to cut and sealing the cabinet is very important.`,
    materialGuidance: `We recommend building your speaker out of high-grade MDF or baltic birch plywood. Choose MDF if you are not planning on veneering your speaker and painting it instead. To get a nice glossy finish when painting we recommend using a water based pigmented lacquer with an 80% sheen level.`,
    pdfPath: '/images/build-a-lowther/plans/Acousta-124.pdf',
    driveUnitOptions: {
      standard: '4x DX2 Concert',
      recommended: '4x PM7A Sinfonia',
      sealed: '4x EX3 Concert'
    }
  },
  {
    id: 'bicor-200',
    title: 'Bicor 200',
    difficulty: 'Intermediate',
    releaseYear: "1990's",
    image: '/images/build-a-lowther/gallery/Bicor-200-xray-Image.avif',
    description: `The Bicor 200 was first released in the 1990's. We rate this speaker as an intermediate difficulty build. Like all our designs there are a few complicated angles to cut and sealing the cabinet is very important.`,
    materialGuidance: `We recommend building your speaker out of high-grade MDF or for the best possible sound use baltic birch plywood. Choose MDF if you are not planning on veneering your speaker and painting it instead. To get a nice glossy finish when painting we recommend using a water based pigmented lacquer with an 80% sheen level.`,
    pdfPath: '/images/build-a-lowther/plans/Bicor-200.pdf',
    driveUnitOptions: {
      standard: '2x DX3 Concert',
      recommended: '2x PM6A Sinfonia',
      sealed: '2x EX3 Concert'
    }
  },
  {
    id: 'accolade-2',
    title: 'Accolade 2',
    difficulty: 'Intermediate',
    releaseYear: "1980's",
    image: '/images/build-a-lowther/gallery/Accolade-2-xray-Image.avif',
    description: `The Accolade 2 was first released in the 1980's. This 2011 version has been modified slightly to fit more drive units. We rate this speaker as an intermediate difficulty build. Like all our designs there are a few complicated angles to cut and sealing the cabinet is very important.`,
    materialGuidance: `We recommend building your speaker out of high-grade MDF or baltic birch plywood. Choose MDF if you are not planning on veneering your speaker and painting it instead. To get a nice glossy finish when painting we recommend using a water based pigmented lacquer with an 80% sheen level.`,
    pdfPath: '/images/build-a-lowther/plans/Accolade-2.pdf',
    driveUnitOptions: {
      standard: '2x DX3 Concert plus 2x DX55'
    }
  },
  {
    id: 'accolade-4',
    title: 'Accolade 4',
    difficulty: 'Intermediate',
    releaseYear: "1980's",
    image: '/images/build-a-lowther/gallery/Accolade-4-xray-Image.avif',
    description: `The Accolade 4 was first released in the 1980's. We rate this speaker as an intermediate difficulty build. Like all our designs there are a few complicated angles to cut and sealing the cabinet is very important.`,
    materialGuidance: `We recommend building your speaker out of high-grade MDF or baltic birch plywood. Choose MDF if you are not planning on veneering your speaker and painting it instead. To get a nice glossy finish when painting we recommend using a water based pigmented lacquer with an 80% sheen level.`,
    pdfPath: '/images/build-a-lowther/plans/Accolade-4.pdf',
    driveUnitOptions: {
      standard: '4x DX3 Concert plus 4x DX55'
    }
  },
  {
    id: 'academy',
    title: 'Academy',
    difficulty: 'Advanced',
    releaseYear: "1990's",
    image: '/images/build-a-lowther/gallery/Academy-xray-Image.avif',
    description: `The Lowther Academy was first released as part of a new generation of Lowther Loudspeakers in the 1990's. This popular loudspeaker provides a smooth, even response and a natural bass.

The clarity and sense of location makes The Academy stand apart from its peers. It uses two drive units, the second of which is mounted in the upper section of the cabinet allowing the sound to radiate upwards and outward, this gives the listener a very unique sense of scale.

Due to the complexity of the labyrinth and size of this cabinet we have rated this an advanced cabinet to build. However, with some time and care taken in construction, The Academy will not disappoint.`,
    materialGuidance: `We recommend building your speaker out of high-grade MDF or for the best sound then use baltic birch plywood. Choose MDF if you are not planning on veneering your speaker and painting it instead. To get a nice glossy finish when painting we recommend using a water based pigmented lacquer with an 80% sheen level.`,
    pdfPath: '/images/build-a-lowther/plans/Academy.pdf',
    driveUnitOptions: {
      standard: '4x DX3 Concert',
      recommended: '4x PM7A Sinfonia',
      sealed: '4x EX3 Concert'
    }
  }
];

const customerQuotes = [
  {
    name: 'Gary',
    quote: 'Jaw dropping realism...',
    fullQuote: "About 2 years ago I purchased a pair of PM7A's and have since mounted these units in a speaker of my own design. Together with a self built power amp I'm extremely happy with the result. In fact I find the realism jaw dropping."
  },
  {
    name: 'Gary',
    quote: 'They are all the speaker I will ever need....',
    fullQuote: "I built my Acousta speakers in 1985 and during that time have used the older PM6A, later PM6C and PM7C. Tried other smaller speakers over the years but always returned to the Acoustas. Singing voice and laid back music sound so so good. Decided when I retired that I would build some fancy horn cabinet utilising the Lowther PM2A chassis speakers. Bought the drivers from Lowther and to 'bed in' them in I decided to fit them to my Acoustas till I got my new horns designed and made. This included moving the front panel forward, increasing the rear chamber for the larger deeper magnet, and altering the volume of the horn chamber and throat area to suit the new drivers. Wired them up switched them on and was immediately amazed at the sound, That was 8 years ago! Never did design the replacement, just kept playing music through my Acoustas with the PM2As - they are all the speaker I will ever need...."
  },
  {
    name: 'Paul Dunstall',
    quote: 'You can now purchase a complete kit and build yourself!!! What are you waiting for???',
    fullQuote: "I built my Mini Acouster speakers in 1982 from plans provided by Lowther. They have been in continuous service ever since and have undergone 2No drive unit upgrades to the current EX3's. Back in the day, Lowther only supplied the plans. I had to source top quality plywood and spend many hours/days/weeks/months cutting all of the angles and gluing up with airtight joints. But I have never regretted it and they still perform as well today as the day they were completed. But what is this??? You can now purchase a complete kit and build yourself!!! What are you waiting for??? Go and get one and not only enjoy the building, but you will get to hear wonderful sound in your home...just like me!"
  },
  {
    name: 'Chieh Schen Teng',
    quote: 'Call me a believer!',
    fullQuote: "Lowther feels friendly and family like... I set 2020, as the year for Lowther, having read accounts from enthusiastic owners... Until I heard it, i did not believe the accounts... Piano music brings tears..i can imagine that those who choose Lowther speakers with a flatter response which I notice are those with less strong magnets, are missing that very last bit of speed that for me is the Lowther magic. Call me a believer!"
  }
];

export default function BuildALowtherPage() {
  const [selectedPlan, setSelectedPlan] = useState<CabinetPlan | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const openPlanDetail = (plan: CabinetPlan) => {
    setSelectedPlan(plan);
    setFormSubmitted(false);
    setTimeout(() => setIsOverlayOpen(true), 50);
  };

  const closePlanDetail = () => {
    setIsOverlayOpen(false);
    setTimeout(() => {
      setSelectedPlan(null);
      setFormData({ name: '', email: '', country: '' });
      setFormSubmitted(false);
    }, 600);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) return;

    try {
      const response = await fetch('/api/submit-plan-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          country: formData.country,
          planTitle: selectedPlan.title,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormSubmitted(true);
      } else {
        alert('There was an error submitting your request. Please try again or contact us directly.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again or contact us directly.');
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPlan) {
        closePlanDetail();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedPlan]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (selectedPlan) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPlan]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white text-gray-900">
      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/build-a-lowther/hero/Build-a-Lowther-inside-a-lowther-hero.webp"
          alt="Build your own Lowther"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-2xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <p className="font-sarabun text-sm tracking-[3px] uppercase">DIY</p>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Build your own Lowther
          </h1>
          <p className="hidden 930:block text-xl leading-relaxed">
            With over 90 years of experience, Lowther Loudspeakers has earned a sterling reputation as the premier supplier of full-range drive units for home builders of high-end horn-loaded speakers, offering unparalleled support and guidance at every stage of the DIY journey.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Build Your Own Lowther' }
        ]}
      />

      {/* Intro Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="font-display text-5xl leading-tight mb-8" style={{ color: '#c59862' }}>
                Build Your Own High-End Speakers
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                Discover the joy of building your own high-quality speakers. We offer a wide range of speaker plans, and full-range speaker drive units to suit every skill level, from beginner to advanced. Explore our collection below and click on an image to choose between individual drive units, or just the official detailed plans.
                    </p>
                  </div>
          </ScrollReveal>

          {/* Steps */}
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#c59862' }}>
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="font-display text-2xl mb-2" style={{ color: '#c59862' }}>
                  Choose your Cabinet
                </h3>
                  </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#c59862' }}>
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="font-display text-2xl mb-2" style={{ color: '#c59862' }}>
                  Choose your Drive Units
                </h3>
                  </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#c59862' }}>
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="font-display text-2xl mb-2" style={{ color: '#c59862' }}>
                  Download your plan
                </h3>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Cabinet Plans Grid */}
      <section data-surface="light" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cabinetPlans.map((plan, index) => (
              <ScrollReveal key={plan.id} animation="fade-up" delay={index * 100}>
                <div 
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => openPlanDetail(plan)}
                >
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={plan.image}
                      alt={plan.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(plan.difficulty)}`}>
                        {plan.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">Released {plan.releaseYear}</span>
                    </div>
                    <h3 className="font-display text-2xl mb-2" style={{ color: '#c59862' }}>
                      {plan.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {plan.description.split('\n\n')[0]}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Quotes */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-4xl text-center mb-16" style={{ color: '#c59862' }}>
              What Owners Say
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {customerQuotes.map((quote, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <div className="bg-gray-50 p-8 rounded-lg">
                  <p className="text-lg text-gray-700 mb-4 italic">
                    "{quote.fullQuote}"
                  </p>
                  <p className="font-semibold" style={{ color: '#c59862' }}>
                    {quote.name}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection />

      {/* Plan Detail Overlay */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-white z-50">
          <div 
            className={`h-screen transition-all duration-500 ease-out ${
              isOverlayOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={closePlanDetail}
              className="fixed top-8 right-8 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Left Side - Image (Fixed) */}
              <div 
                className={`relative hidden lg:block transition-all duration-500 ease-out delay-100 ${
                  isOverlayOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                <Image
                  src={selectedPlan.image}
                  alt={selectedPlan.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right Side - Content (Scrollable) */}
              <div 
                className={`p-8 lg:p-16 overflow-y-auto transition-all duration-500 ease-out delay-200 ${
                  isOverlayOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
              >
                <div className="max-w-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(selectedPlan.difficulty)}`}>
                      {selectedPlan.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">Released {selectedPlan.releaseYear}</span>
                  </div>

                  <h2 className="font-display text-5xl mb-6" style={{ color: '#c59862' }}>
                    Build your own Lowther {selectedPlan.title}
                  </h2>

                  <div className="space-y-4 mb-8 text-gray-700 leading-relaxed">
                    {selectedPlan.description.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Drive Unit Requirements */}
                  <div className="mb-8 p-6 bg-[#c59862]/10 border-2 border-[#c59862] rounded-lg">
                    <h3 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>
                      Required Drive Units
                    </h3>
                    <div className="space-y-3">
                      {selectedPlan.driveUnitOptions.recommended && (
                        <DriveUnitCard
                          driveUnitString={selectedPlan.driveUnitOptions.recommended}
                          label="Recommended"
                        />
                      )}
                      <DriveUnitCard
                        driveUnitString={selectedPlan.driveUnitOptions.standard}
                        label="Standard"
                      />
                      {selectedPlan.driveUnitOptions.sealed && (
                        <DriveUnitCard
                          driveUnitString={selectedPlan.driveUnitOptions.sealed}
                          label="Sealed"
                        />
                      )}
                    </div>
                  </div>

                  <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-display text-xl mb-3" style={{ color: '#c59862' }}>
                      Material and Finishing Guidance
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedPlan.materialGuidance}
                    </p>
                  </div>

                  {!formSubmitted ? (
                    <>
                      <p className="text-gray-700 mb-6">
                        Fill in the form below to get access to the downloadable plan for free and get your personalised quote for everything else.
                      </p>
                      <p className="text-sm text-gray-600 mb-8 italic">
                        We ask for your information so we can support you as much as possible in your Lowther speaker build. We know you might have more questions (e.g. best drive unit for your amplifier) and we can answer these when we are in contact with you.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-900 mb-2">
                            Country *
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                          />
                </div>

                        <Button
                          type="submit"
                          variant="black"
                          size="lowther"
                          className="w-full"
                        >
                          GET FREE PLAN
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="space-y-8">
                      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-display text-2xl mb-3 text-green-800">
                          Thank you!
                        </h3>
                        <p className="text-green-700">
                          Your plan is ready to download. We'll also be in touch shortly to help you choose the perfect drive units for your build.
                </p>
              </div>

                      {/* Drive Units Section - Primary CTA */}
                      <div className="p-8 bg-gray-900 rounded-lg text-white">
                        <h3 className="font-display text-3xl mb-4" style={{ color: '#c59862' }}>
                          You'll need Lowther Drive Units
                        </h3>
                        
                        {/* Show specific requirements */}
                        <div className="mb-6 p-4 bg-white/10 rounded-md">
                          <p className="text-sm font-semibold text-[#c59862] mb-2">For this {selectedPlan.title}:</p>
                          <div className="space-y-2 text-sm">
                            {selectedPlan.driveUnitOptions.recommended && (
                              <p className="text-white">✨ <strong>Recommended:</strong> {selectedPlan.driveUnitOptions.recommended}</p>
                            )}
                            <p className="text-gray-300"><strong>Standard:</strong> {selectedPlan.driveUnitOptions.standard}</p>
                            {selectedPlan.driveUnitOptions.sealed && (
                              <p className="text-gray-300"><strong>If worried about sealing:</strong> {selectedPlan.driveUnitOptions.sealed}</p>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-300 mb-6 leading-relaxed">
                          Browse our collections to find these drive units, or contact us for personalized recommendations based on your amplifier and listening preferences.
                        </p>
                        
                        <div className="space-y-3">
                          <Link href="/collection/concert" className="block" target="_blank" rel="noopener noreferrer">
                            <Button
                              variant="white"
                              size="lowther"
                              className="w-full"
                            >
                              SHOP CONCERT COLLECTION
                            </Button>
                          </Link>
                          
                          <Link href="/collection/sinfonia" className="block" target="_blank" rel="noopener noreferrer">
                            <Button
                              variant="white"
                              size="lowther"
                              className="w-full"
                            >
                              SHOP SINFONIA COLLECTION
                            </Button>
                          </Link>
                          
                          <Link href="/collection/philharmonic" className="block" target="_blank" rel="noopener noreferrer">
                            <Button
                              variant="white"
                              size="lowther"
                              className="w-full"
                            >
                              SHOP PHILHARMONIC COLLECTION
                            </Button>
                          </Link>

                          <Link href="/collection/grand-opera" className="block" target="_blank" rel="noopener noreferrer">
                            <Button
                              variant="white"
                              size="lowther"
                              className="w-full"
                            >
                              SHOP GRAND OPERA COLLECTION
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Badges Section */}
                      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="font-display text-2xl mb-3" style={{ color: '#c59862' }}>
                          Complete Your Build with Official Badges
                        </h3>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          Add the finishing touch to your handmade Lowther with our official metal badges, crafted by the same artisans who produce emblems for Aston Martin.
                        </p>
                        <Link href="/ensemble/lowther-badges" className="block" target="_blank" rel="noopener noreferrer">
                          <Button
                            variant="black"
                            size="lowther"
                            className="w-full"
                          >
                            SHOP OFFICIAL BADGES
                          </Button>
                        </Link>
                      </div>

                      {/* Download Plan - Secondary CTA */}
                      <div className="pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-4 text-center">
                          Already have your drive units?
                        </p>
                        <a href={selectedPlan.pdfPath} download className="block w-full">
                          <Button
                            variant="outline"
                            size="lowther"
                            className="w-full"
                          >
                            DOWNLOAD PLAN
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
