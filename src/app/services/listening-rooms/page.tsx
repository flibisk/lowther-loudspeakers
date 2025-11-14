'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function ListeningRoomsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: `${formData.address}, ${formData.country}`,
          message: `Listening Room / Dealer Finder Request\n\nAddress: ${formData.address}\nCountry: ${formData.country}`,
          segment: 'Listening Room',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.message || 'Failed to submit request. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting listening room form:', err);
      setError('An error occurred. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/listening-rooms/hero/Edilia-in-a-listening-room.webp"
          alt="Where to Listen - Lowther Listening Rooms"
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
            <span className="text-sm tracking-wider uppercase text-white/80">EXPERIENCE LOWTHER</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Where to Listen
          </h1>
          
          <p className="hidden 930:block text-xl leading-relaxed">
            Our handpicked network of authorised dealers consists of passionate audio enthusiasts who deeply understand the rich history of Lowther and the unparalleled performance of our horn loudspeakers.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden 930:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex-col items-center text-white">
          <span className="text-xs tracking-wider uppercase mb-2">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services/listening-rooms' },
          { label: 'Listening Rooms' }
        ]} 
      />

      {/* UK Listening Spaces */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-4xl md:text-5xl mb-4 text-center" style={{ color: '#c59862' }}>
              UK Listening Spaces
            </h2>
            <p className="text-center text-gray-700 mb-16 max-w-3xl mx-auto">
              We have two listening spaces in the UK where you can experience the exceptional sound quality of Lowther loudspeakers.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Lowther Listening Room */}
            <ScrollReveal animation="fade-up" delay={0.1}>
              <div className="bg-[#fafaf8] rounded-sm overflow-hidden shadow-sm flex flex-col h-full">
                <div className="relative h-64 w-full flex-shrink-0">
                  <Image
                    src="/images/listening-rooms/gallery/Lowther-Listening-Room.webp"
                    alt="The Lowther Listening Room"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>
                    The Lowther Listening Room
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Visit Lowther Loudspeakers' exclusive listening room located above the historic Phipps Brewery in Northampton. Drop by to explore our latest projects, experience new drive units, examine reconditioned cabinets, or simply enjoy your favourite tunes with a refreshing pint or a warm cuppa.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <a 
                      href="https://maps.google.com/?q=1+Foundry+Street,+Northampton,+NN1+1PN" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                      <span>1 Foundry Street, Northampton, NN1 1PN</span>
                    </a>
                    <a 
                      href="mailto:hello@lowtherloudspeakers.com"
                      className="flex items-center text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>hello@lowtherloudspeakers.com</span>
                    </a>
                    <a 
                      href="tel:+442083009166"
                      className="flex items-center text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>+44 20 8300 9166</span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* The Lowther Voigt Museum */}
            <ScrollReveal animation="fade-up" delay={0.2}>
              <div className="bg-[#fafaf8] rounded-sm overflow-hidden shadow-sm flex flex-col h-full">
                <div className="relative h-64 w-full flex-shrink-0">
                  <Image
                    src="/images/listening-rooms/gallery/Lowther-voigt-museum-listening-room.webp"
                    alt="The Lowther Voigt Museum"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>
                    The Lowther Voigt Museum
                    <span className="text-sm font-normal text-gray-600 ml-2">(Exclusive)</span>
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Not a retailer but the Lowther Museum is the perfect place for those looking to learn more about the rich history of Hi-Fi and Lowther itself. It is also the only location currently you can experience the new Lowther Hegemans.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    Availability and space at this location is rare, but you can contact us directly to arrange a visit.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <a 
                      href="mailto:hello@lowtherloudspeakers.com"
                      className="flex items-center text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>hello@lowtherloudspeakers.com</span>
                    </a>
                    <a 
                      href="tel:+442083009166"
                      className="flex items-center text-gray-700 hover:text-[#c59862] transition-colors"
                    >
                      <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>+44 20 8300 9166</span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Worldwide Dealers Section */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display text-4xl md:text-5xl mb-4 text-center" style={{ color: '#c59862' }}>
              Worldwide Lowther Dealers
            </h2>
            <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">
              We have authorised dealers and ambassadors around the world. Let's find one close to you.
            </p>
            <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
              Find an authorised Lowther Drive Unit or Speaker Dealer near you.
            </p>
          </ScrollReveal>

          {!isSubmitted ? (
            <ScrollReveal animation="fade-up" delay={0.1}>
              <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-sm shadow-sm">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    placeholder="Street address, city, postal code"
                  />
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                  >
                    Find a Dealer
                  </Button>
                </div>
              </form>
            </ScrollReveal>
          ) : (
            <ScrollReveal animation="fade-up">
              <div className="text-center py-12 bg-white rounded-sm shadow-sm">
                <div className="w-20 h-20 bg-[#c59862]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" style={{ color: '#c59862' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="font-display text-3xl mb-4" style={{ color: '#c59862' }}>
                  Thank You
                </h3>
                
                <p className="text-lg text-gray-700 max-w-xl mx-auto">
                  We'll be in touch shortly with information about authorised Lowther dealers near you.
                </p>
              </div>
            </ScrollReveal>
          )}

          {/* Exotic Speakers Note */}
          <ScrollReveal animation="fade-up" delay={0.2}>
            <div className="mt-12 bg-white p-6 rounded-sm border-l-4 border-[#c59862]">
              <p className="text-gray-700 leading-relaxed">
                <strong>Interested in our exotic speakers?</strong> If you're interested in experiencing the Hegeman or the Voigt Horn, please{' '}
                <Link href="/contact" className="text-[#c59862] hover:underline">contact us directly</Link> for support on hearing them.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection backgroundColor="bg-white" />
    </div>
  );
}

