'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';

// Gallery images
const galleryImages = [
  { src: '/images/ensemble/commercial-system-design/gallery/Acousta-White-Glove-full-system.avif', alt: 'Acousta Full System' },
  { src: '/images/ensemble/commercial-system-design/gallery/Acousta-White-Glove.avif', alt: 'Acousta White Glove Installation' },
  { src: '/images/ensemble/commercial-system-design/gallery/Edilia-White-Glove-Bass-driver.avif', alt: 'Edilia Bass Driver' },
  { src: '/images/ensemble/commercial-system-design/gallery/Edilia-White-Glove-full-system.avif', alt: 'Edilia Full System' },
  { src: '/images/ensemble/commercial-system-design/gallery/Edilia-top-of-speaker.avif', alt: 'Edilia Speaker Detail' },
  { src: '/images/ensemble/commercial-system-design/gallery/Lowther Sound 2.avif', alt: 'Lowther Sound System' },
  { src: '/images/ensemble/commercial-system-design/gallery/Lowther-Power-cable-full-system.avif', alt: 'Complete System with Power Cables' },
  { src: '/images/ensemble/commercial-system-design/gallery/PX4 Amp-full-system.avif', alt: 'PX4 Amplifier System' },
];

export default function CommercialSystemDesignPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    budget: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        budget: '',
        message: '',
      });
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/ensemble/commercial-system-design/hero/Lowther Voigt Horn 3.avif"
          alt="Commercial System Design"
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
            <span className="text-sm tracking-wider uppercase text-white/80">LOWTHER ENSEMBLE</span>
          </div>
          
          <h1 className="font-display text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Commercial System Design
          </h1>
          
          <p className="text-xl leading-relaxed">
            Acoustic architecture for exceptional spaces
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Lowther Ensemble', href: '/products' },
          { label: 'Commercial System Design' }
        ]}
      />

      {/* Intro Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="space-y-6 text-center">
              <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: '#c59862' }}>
                Acoustic Atmosphere for Exceptional Spaces
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  For those who shape experiences, such as hotels, restaurants, private clubs, and design studios, Lowther offers an installation unlike any other. Our White Glove Commercial Service delivers handcrafted acoustic architecture designed to elevate every moment your guests spend in your space.
                </p>
                <p>
                  Each Lowther masterpiece is both a visual and sonic statement. Bespoke veneered cabinetry houses our full range loudspeakers and valve amplification, all free from intrusive electronics or digital processing. The result is organic, natural sound that fills a room without dominating it, inviting rather than demanding attention.
                </p>
                <p>
                  We collaborate directly with interior designers, architects, and creative directors to ensure seamless integration into your environment. Veneers, finishes, and layout are chosen to complement your design language, whether heritage grandeur or contemporary minimalism.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery Section */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 50}>
                <div className="relative w-full overflow-hidden rounded-lg" style={{ height: '400px' }}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section data-surface="light" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="space-y-8">
              <h2 className="font-display text-4xl md:text-5xl text-center leading-tight mb-12" style={{ color: '#c59862' }}>
                Our Commercial Commissions Include
              </h2>
              
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed text-center">
                <p>• On site acoustic and aesthetic consultation</p>
                <p>• Collaborative design with your project team</p>
                <p>• Custom veneer and finish matching</p>
                <p>• Delivery, installation, and fine tuning by Lowther artisans</p>
                <p>• Team training for flawless daily operation</p>
                <p>• Ongoing maintenance and support under our "Lowther for Life" promise</p>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mt-8 text-center italic">
                For venues that aspire to more than background sound, a Lowther system brings a rare and timeless atmosphere, music that feels alive, honest, and human.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Commission Form Section */}
      <section data-surface="light" className="py-24 bg-[#fafaf8]">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: '#c59862' }}>
                Begin Your Commission
              </h2>
              <p className="text-lg text-gray-600">
                Tell us about your space and we'll be in touch to arrange a consultation
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 md:p-12 rounded-lg shadow-sm">
              {/* Name */}
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

              {/* Email */}
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

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                />
              </div>

              {/* Business Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">
                  Business Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                />
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-900 mb-2">
                  Approximate Budget *
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59862] focus:border-transparent bg-white"
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="">Please select</option>
                  <option value="10-30k">£10,000 - £30,000</option>
                  <option value="30-60k">£30,000 - £60,000</option>
                  <option value="60-100k">£60,000 - £100,000</option>
                  <option value="100k+">£100,000+</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                  placeholder="Venue type, room dimensions, design vision, guest experience goals..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase disabled:opacity-50"
                >
                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
                </Button>
              </div>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-center">
                    Thank you for your interest. We'll be in touch shortly to arrange your consultation.
                  </p>
                </div>
              )}
            </form>
          </ScrollReveal>
        </div>
      </section>

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection />
    </div>
  );
}

